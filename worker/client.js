export const clientScript = String.raw`(() => {
'use strict';
const $ = id => document.getElementById(id);
const state = { tone: 'green', mode: 'demo', aiReady: false, providerName: '', busy: false, result: null, statement: '', material: '', nextVariation: { green: 0, yellow: 0, red: 0 }, consent: false, micConsent: false, recognition: null, recording: false, shake: false, motionSeen: false, lastMotion: null, lastShake: 0, peaks: [], details: false, requestId: 0 };
function resetVariants() { state.nextVariation = { green: 0, yellow: 0, red: 0 }; }
const toneLabels = { green: 'Gespräch öffnen', yellow: 'Freches Statement', red: 'Klare Grenze · Gespräch beenden' };
let toastTimer, sensorTimer;
function toast(text) { $('toast').textContent = text; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').textContent = ''; }, 4200); }
function message(text = '') { $('form-message').textContent = text; }
function hasDialog() { return Boolean(document.querySelector('dialog[open]')); }
function openDialog(id) { const d = $(id); if (d && !d.open) { if (state.recording) state.recognition?.stop(); d.showModal(); } }
document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => { if (b.dataset.open === 'studio-dialog') { $('material').value = state.material; $('material-message').textContent = ''; } openDialog(b.dataset.open); }));
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) { const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close(); } }));
function setBusy(value) { state.busy = value; document.querySelectorAll('[data-tone]').forEach(button => { button.disabled = value || state.recording; }); $('another-button').disabled = value; $('mic-button').disabled = value;  $('result-card').classList.toggle('loading', value); $('result-card').setAttribute('aria-busy', String(value)); }
function renderMode() {
  $('mode-badge').textContent = state.mode === 'ai' ? 'KI · individuelle Antwort' : 'Demo · vorbereitete Antworten';
  $('choose-demo').setAttribute('aria-pressed', String(state.mode === 'demo')); $('choose-ai').setAttribute('aria-pressed', String(state.mode === 'ai'));
  $('mode-description').textContent = state.mode === 'demo' ? 'Die Demo wählt aus vorbereiteten Antworten und allgemeinen Gesprächshilfen. Sie erzeugt keine individuelle KI Antwort.' : 'Die KI formuliert zu deiner Aussage drei Antwortstile. Prüfe selbst, welche Antwort zur Situation passt.';
  $('ai-status').textContent = state.aiReady ? 'KI Zugang verbunden' + (state.providerName ? ' · ' + state.providerName : '') + '. Du kannst individuelle Antworten ausprobieren.' : 'Der KI Zugang ist noch nicht eingerichtet. Die Demo ist bereits nutzbar.';
}
function invalidate() {
  if (!state.result) return;
  state.result = null; $('result-card').hidden = true; state.details = false; $('result-extra').hidden = true; $('result-tools').hidden = true; $('detail-button').setAttribute('aria-expanded', 'false');
  $('result-card').classList.remove('has-result'); $('result-card').classList.add('stale'); $('result-tip').textContent = 'Eingabe geändert. Finde eine neue Antwort.'; $('result-topic').hidden = true;
}
function inputChanged() { $('char-count').textContent = $('statement').value.length.toLocaleString('de-DE') + ' / 1.200'; invalidate(); message(); }
$('statement').addEventListener('input', inputChanged);
$('statement').addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); requestAnswer(); } });
document.querySelectorAll('[data-example]').forEach(b => b.addEventListener('click', () => { $('statement').value = b.dataset.example; inputChanged(); $('statement').focus(); }));
function setTone(tone) {
  state.tone = tone;
  document.querySelectorAll('[data-tone]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.tone === tone));
  });
}
document.querySelectorAll('[data-tone]').forEach(button => button.addEventListener('click', () => {
  setTone(button.dataset.tone);
  requestAnswer();
}));
function renderResult() {
  const r = state.result; if (!r) return; const selected = r[state.tone];
  $('result-card').hidden = false; $('result-card').dataset.tone = state.tone;
  $('bridge-section').hidden = state.tone !== 'green' || !selected.bridge || Boolean(r.safety);
  $('result-card').classList.remove('stale'); $('result-card').classList.add('has-result'); $('answer-text').classList.remove('empty'); $('answer-text').textContent = selected.answer;
  $('empty-detail').hidden = true; $('result-topic').hidden = false; $('result-topic').textContent = toneLabels[state.tone];
  $('mode-badge').textContent = r.mode === 'ai' ? 'KI · individuelle Antwort' : 'Demo · vorbereitete Antwort';
  $('result-tip').textContent = r.mode === 'demo' ? (r.matched ? r.topic : 'Allgemeiner Antwortvorschlag') : r.care;
  $('result-tools').hidden = false; $('bridge-text').textContent = selected.bridge; $('why-text').textContent = selected.why; $('safety-text').textContent = r.safety || ''; $('safety-text').hidden = !r.safety;
  if (r.safety) state.details = true; $('result-extra').hidden = !state.details; $('detail-button').setAttribute('aria-expanded', String(state.details));
}
async function requestAnswer() {
  if (state.busy || state.recording) return; const statement = $('statement').value.trim();
  if (!statement) { message('Schreib oder sprich zuerst die Aussage ein.'); $('statement').focus(); return; }
  if (statement.length > 1200) { message('Bitte kürze die Aussage auf höchstens 1.200 Zeichen.'); return; }
  if (state.mode === 'ai' && !state.aiReady) { message('Die KI ist noch nicht verbunden. Du kannst in der Zwischenzeit die Demo nutzen.'); return; }
  if (state.mode === 'ai' && !state.consent) { $('ai-consent-text').textContent = 'Für die Antwort werden deine Aussage und ' + (state.material ? 'deine Werkstatthinweise' : 'gegebenenfalls ergänzte Werkstatthinweise') + ' an ' + (state.providerName || 'den verbundenen KI Dienst') + ' gesendet. Bitte verzichte auf Namen und persönliche Daten.'; openDialog('ai-dialog'); return; }
  if (state.statement !== statement) resetVariants();
  const tone = state.tone;
  const variation = state.nextVariation[tone];
  state.statement = statement; const id = ++state.requestId; const mode = state.mode; const material = state.material;
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 30000);
  message(); setBusy(true); if (state.mode === 'ai') message('Worte werden gesucht …');
  try {
    const response = await fetch('/api/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ statement, mode, consent: state.consent, material, variation }), signal: controller.signal });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Die Antwort konnte gerade nicht gefunden werden.');
    if (!data.green?.answer || !data.yellow?.answer || !data.red?.answer) throw new Error('Es kam keine vollständige Antwort an. Bitte versuche es erneut.');
    if (id !== state.requestId || $('statement').value.trim() !== statement || state.mode !== mode || state.material !== material) { message('Deine Eingabe wurde geändert. Finde dazu bitte eine neue Antwort.'); return; }
    state.nextVariation[tone] = variation + 1;
    message(); state.result = data; renderResult();
    if (window.matchMedia('(max-width: 720px)').matches) $('result-card').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  } catch (error) { if (id === state.requestId) message(error.name === 'AbortError' ? 'Die Antwort dauert gerade zu lange. Bitte versuche es noch einmal.' : error.message); }
  finally { clearTimeout(timeout); if (id === state.requestId) setBusy(false); }
}
$('answer-form').addEventListener('submit', e => { e.preventDefault(); requestAnswer(); }); $('another-button').addEventListener('click', () => requestAnswer());
$('detail-button').addEventListener('click', () => { state.details = !state.details; $('result-extra').hidden = !state.details; $('detail-button').setAttribute('aria-expanded', String(state.details)); });
$('copy-button').addEventListener('click', async () => { if (!state.result) return; try { await navigator.clipboard.writeText(state.result[state.tone].answer); toast('Antwort kopiert.'); } catch { toast('Kopieren ist hier nicht verfügbar. Markiere den Antworttext zum Kopieren.'); } });
function chooseMode(mode) { if (state.busy) { toast('Bitte warte kurz auf die laufende Antwort.'); return; } if (mode === 'ai' && !state.aiReady) { toast('Die KI ist noch nicht eingerichtet. Die Demo ist nutzbar.'); return; } if (mode !== state.mode) { state.mode = mode; resetVariants(); invalidate(); renderMode(); message(); } $('mode-dialog').close(); }
$('choose-demo').addEventListener('click', () => chooseMode('demo')); $('choose-ai').addEventListener('click', () => chooseMode('ai'));
$('ai-confirm').addEventListener('click', () => { state.consent = true; $('ai-dialog').close(); requestAnswer(); }); $('ai-use-demo').addEventListener('click', () => { $('ai-dialog').close(); chooseMode('demo'); requestAnswer(); });
const storageKey = 'geile-antwort-material-v1';
try { const saved = localStorage.getItem(storageKey); if (saved) { const parsed = JSON.parse(saved); if (typeof parsed.material === 'string' && parsed.material.length <= 12000) { state.material = parsed.material; $('remember-material').checked = true; } } } catch {}
$('material-apply').addEventListener('click', () => { const text = $('material').value.trim(); if (text !== state.material) { state.material = text; state.consent = false; invalidate(); } try { if ($('remember-material').checked) localStorage.setItem(storageKey, JSON.stringify({ material: text })); else localStorage.removeItem(storageKey); } catch { $('material-message').textContent = 'Das Speichern auf diesem Gerät ist nicht möglich. Deine Hinweise bleiben für diese Sitzung übernommen.'; return; } $('studio-dialog').close(); toast(text ? 'Hinweise übernommen. Sie werden im KI Modus berücksichtigt.' : 'Die Werkstatt ist jetzt leer.'); });
$('material-clear').addEventListener('click', () => { state.material = ''; $('material').value = ''; $('remember-material').checked = false; state.consent = false; try { localStorage.removeItem(storageKey); } catch {} invalidate(); $('material-message').textContent = 'Hinweise aus der Sitzung und dem Gerätespeicher gelöscht.'; });
$('material-file').addEventListener('change', async e => { const file = e.target.files?.[0]; if (!file) return; try { if (!/\.(txt|md)$/i.test(file.name) || file.size > 100000) throw new Error('Bitte wähle eine .txt oder .md Datei mit höchstens 100 KB.'); const text = await file.text(); if (text.length > 12000) throw new Error('Die Datei enthält mehr als 12.000 Zeichen. Bitte kürze sie vor dem Einlesen.'); $('material').value = text; $('material-message').textContent = 'Datei eingelesen. Mit „Hinweise übernehmen“ bestätigen.'; } catch (error) { $('material-message').textContent = error.message; } e.target.value = ''; });
function listening(active) { state.recording = active; $('mic-button').setAttribute('aria-pressed', String(active)); $('mic-label').textContent = active ? 'Stoppen' : 'Einsprechen'; document.querySelectorAll('[data-tone]').forEach(button => { button.disabled = active || state.busy; }); }
function startMic() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) { message('Dieser Browser unterstützt die Spracheingabe nicht. Du kannst die Aussage eintippen oder die Diktierfunktion deiner Handytastatur nutzen.'); return; }
  if (state.busy || state.recording) return;
  const recognition = new Recognition(); state.recognition = recognition; recognition.lang = 'de-DE'; recognition.continuous = false; recognition.interimResults = false; recognition.maxAlternatives = 1;
  const before = $('statement').value.trim(); message();
  recognition.onstart = () => listening(true);
  recognition.onresult = event => { const text = Array.from(event.results).filter(r => r.isFinal).map(r => r[0].transcript).join(' '); if (text) { const combined = (before ? before + ' ' : '') + text; $('statement').value = combined.slice(0, 1200); inputChanged(); if (combined.length > 1200) message('Die Spracheingabe wurde auf 1.200 Zeichen gekürzt. Bitte prüfe den Text.'); else toast('Text erkannt. Prüfe ihn und wähle „Antwort finden“.'); } };
  recognition.onerror = event => { const errors = { 'not-allowed': 'Der Mikrofonzugriff wurde nicht erlaubt. Du kannst die Aussage weiterhin eintippen.', 'service-not-allowed': 'Die Spracherkennung ist in diesem Browser nicht erlaubt.', 'audio-capture': 'Es wurde kein Mikrofon gefunden.', 'no-speech': 'Es wurde keine Sprache erkannt. Versuche es noch einmal.', 'network': 'Die Spracherkennung konnte ihren Dienst nicht erreichen.' }; if (event.error !== 'aborted') message(errors[event.error] || 'Die Spracherkennung wurde unterbrochen. Bitte versuche es erneut.'); };
  recognition.onend = () => { listening(false); state.recognition = null; };
  try { listening(true); recognition.start(); } catch { listening(false); message('Die Spracherkennung konnte nicht gestartet werden. Du kannst den Satz eintippen.'); }
}
$('mic-button').addEventListener('click', () => { if (state.recording) { state.recognition?.stop(); return; } if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) { startMic(); return; } if (state.micConsent) startMic(); else openDialog('mic-dialog'); });
$('mic-confirm').addEventListener('click', () => { state.micConsent = true; $('mic-dialog').close(); startMic(); });
function disableShake() { state.shake = false; window.removeEventListener('devicemotion', motion); state.lastMotion = null; state.peaks = []; clearTimeout(sensorTimer); $('shake-button').setAttribute('aria-pressed', 'false'); $('shake-button').setAttribute('aria-label', 'Schütteln zum Antworten aktivieren'); $('shake-note').textContent = 'Schütteln: Antwort in der zuletzt gewählten Farbe.'; }
function motion(event) {
  if (!state.shake) return; const a = event.accelerationIncludingGravity; if (!a || [a.x,a.y,a.z].some(v => typeof v !== 'number')) return;
  state.motionSeen = true; const now = Date.now(); const current = { x: a.x, y: a.y, z: a.z, time: now }; const old = state.lastMotion; state.lastMotion = current;
  if (!old || now - old.time > 500 || state.busy || state.recording || hasDialog() || document.hidden || now - state.lastShake < 3500) return;
  const delta = Math.hypot(current.x - old.x, current.y - old.y, current.z - old.z);
  if (delta < 17) return; state.peaks = state.peaks.filter(t => now - t < 800); if (!state.peaks.length || now - state.peaks[state.peaks.length - 1] > 80) state.peaks.push(now);
  if (state.peaks.length < 3) return; state.peaks = []; state.lastShake = now;
  if (!$('statement').value.trim()) { message('Schreib oder sprich zuerst die Aussage ein.'); return; }
  requestAnswer();
}
$('shake-button').addEventListener('click', async () => {
  if (state.shake) { disableShake(); toast('Schütteln ausgeschaltet.'); return; }
  if (typeof DeviceMotionEvent === 'undefined' || !window.isSecureContext) { toast('Schütteln ist hier nicht verfügbar. Tippe stattdessen auf eine Ampelfarbe.'); return; }
  try { if (typeof DeviceMotionEvent.requestPermission === 'function') { const permission = await DeviceMotionEvent.requestPermission(); if (permission !== 'granted') { toast('Der Bewegungssensor wurde nicht freigegeben. Nutze den Knopf.'); return; } } }
  catch { toast('Der Bewegungssensor ist hier nicht verfügbar. Nutze den Knopf.'); return; }
  state.shake = true; state.motionSeen = false; window.addEventListener('devicemotion', motion, { passive: true }); $('shake-button').setAttribute('aria-pressed', 'true'); $('shake-button').setAttribute('aria-label', 'Schütteln zum Antworten ausschalten'); $('shake-note').textContent = 'Schütteln ist aktiv. Zum Antworten das Handy kurz schütteln.'; toast('Schütteln aktiviert. Du kannst es mit demselben Knopf ausschalten.');
  sensorTimer = setTimeout(() => { if (state.shake && !state.motionSeen) $('shake-note').textContent = 'Noch keine Sensordaten. Öffne die App direkt auf deinem Handy oder tippe auf eine Ampelfarbe.'; }, 4000);
});
document.addEventListener('visibilitychange', () => { state.peaks = []; state.lastMotion = null; if (document.hidden && state.recording) state.recognition?.stop(); });
fetch('/api/status', { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(data => { state.aiReady = data.aiReady === true; state.providerName = typeof data.providerName === 'string' ? data.providerName : ''; state.mode = state.aiReady ? 'ai' : 'demo'; renderMode(); }).catch(() => { renderMode(); $('ai-status').textContent = 'Der Verbindungsstatus konnte nicht geprüft werden. Versuche es nach dem Neuladen erneut.'; });
})();`;
