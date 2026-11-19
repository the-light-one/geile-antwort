import { page } from './page.js';
import { demoAnswer, principles, systemPrompt } from './knowledge.js';
const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Permissions-Policy': 'microphone=(self), accelerometer=(self), gyroscope=(self)', 'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; object-src 'none'; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com" };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } });
const limits = new Map();
const model = 'meta-llama/Llama-3.2-1B-Instruct:featherless-ai';
function rateLimited(id) {
  const now = Date.now();
  if (limits.size > 1000) for (const [key, value] of limits) if (value.until <= now) limits.delete(key);
  const e = limits.get(id); if (!e || e.until <= now) { limits.set(id, { count: 1, until: now + 60000 }); return false; }
  return ++e.count > 12;
}
export function validateResult(data) {
  if (!data || typeof data !== 'object') throw new Error('invalid_result');
  for (const tone of ['green', 'yellow', 'red']) { const a = data[tone];
    if (!a || typeof a.answer !== 'string' || !a.answer.trim() || a.answer.length > 420 || a.answer.trim().split(/\s+/u).length > 45 || typeof a.bridge !== 'string' || a.bridge.length > 320 || typeof a.why !== 'string' || a.why.length > 360) throw new Error('invalid_result');
  }
  if (typeof data.care !== 'string' || data.care.length > 320 || typeof data.safety !== 'string' || data.safety.length > 500) throw new Error('invalid_result');
  return data;
}
export default { async fetch(request, env = {}) {
  const url = new URL(request.url);
  if (request.method === 'GET' && url.pathname === '/') return new Response(page, { headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
  if (request.method === 'GET' && url.pathname === '/api/status') return json({ aiReady: Boolean(env.HF_TOKEN), storage: 'session-only', providerName: 'Hugging Face / Featherless AI' });
  if (request.method !== 'POST' || url.pathname !== '/api/answer') return json({ error: 'Nicht gefunden.' }, 404);
  const origin = request.headers.get('Origin'); if (origin && origin !== url.origin) return json({ error: 'Diese Anfrage ist nicht erlaubt.' }, 403);
  if (!request.headers.get('Content-Type')?.includes('application/json')) return json({ error: 'Bitte JSON senden.' }, 415);
  if (Number(request.headers.get('Content-Length') || 0) > 65000) return json({ error: 'Die Eingabe ist zu lang.' }, 413);
  let body;
  try {
    const reader = request.body?.getReader(); if (!reader) return json({ error: 'Eine Aussage fehlt.' }, 400);
    const parts = []; let size = 0;
    while (true) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > 65000) { await reader.cancel(); return json({ error: 'Die Eingabe ist zu lang.' }, 413); } parts.push(value); }
    const bytes = new Uint8Array(size); let offset = 0; for (const p of parts) { bytes.set(p, offset); offset += p.length; } body = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return json({ error: 'Die Eingabe konnte nicht gelesen werden.' }, 400); }
  if (!body || typeof body.statement !== 'string' || !body.statement.trim() || body.statement.length > 1200 || !['demo', 'ai'].includes(body.mode) || (body.material !== undefined && (typeof body.material !== 'string' || body.material.length > 12000))) return json({ error: 'Bitte eine Aussage mit höchstens 1.200 Zeichen eingeben.' }, 400);
  const variation = Number.isSafeInteger(body.variation) ? body.variation : 0;
  const reference = demoAnswer(body.statement, variation);
  if (body.mode === 'demo') return json({ ...reference, mode: 'demo' });
  if (!env.HF_TOKEN) return json({ error: 'Die KI ist noch nicht verbunden. Du kannst die Demo mit vorbereiteten Antworten ausprobieren.', code: 'AI_NOT_CONFIGURED' }, 503);
  if (body.consent !== true) return json({ error: 'Bitte bestätige zuerst die Verarbeitung durch Hugging Face und Featherless AI.' }, 400);
  const id = request.headers.get('oai-authenticated-user-id') || request.headers.get('CF-Connecting-IP') || 'private-site';
  if (rateLimited(id)) return json({ error: 'Kurz durchatmen: Bitte warte eine Minute vor der nächsten KI Anfrage.' }, 429);
  try {
    const upstream = await fetch('https://router.huggingface.co/v1/chat/completions', { method: 'POST', signal: AbortSignal.timeout(22000), headers: { Authorization: 'Bearer ' + env.HF_TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify({ model, max_tokens: 850, temperature: 0.55, messages: [{ role: 'system', content: systemPrompt + ' JSON keys: green, yellow, red (each has answer, bridge, why), care, safety.' }, { role: 'user', content: JSON.stringify({ statement: body.statement.trim(), editorialPrinciples: principles, userMaterial: body.material || '', variation, referenceStyle: reference.matched && !reference.safety ? { green: reference.green.answer, yellow: reference.yellow.answer, red: reference.red.answer } : undefined }) }] }) });
    if (!upstream.ok) return json({ error: 'Die KI ist gerade nicht erreichbar. Bitte versuche es später noch einmal oder wechsle bewusst zur Demo.' }, 502);
    const result = await upstream.json();
    const choice = result.choices?.[0];
    if (choice?.finish_reason !== 'stop' || typeof choice.message?.content !== 'string') throw new Error('incomplete');
    const raw = choice.message.content.trim().replace(/^\x60\x60\x60(?:json)?\s*|\s*\x60\x60\x60$/gi, '');
    return json({ ...validateResult(JSON.parse(raw)), mode: 'ai', topic: 'Für deine Aussage formuliert' });
  } catch { return json({ error: 'Es kam keine vollständige Antwort an. Bitte versuche es erneut oder nutze die Demo.', code: 'AI_UNAVAILABLE' }, 502); }
} };

