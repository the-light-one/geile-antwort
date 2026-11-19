import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { page } from '../worker/page.js';
import { demoAnswer, pack } from '../worker/knowledge.js';
import { createBrowserAI } from '../worker/browser-ai.js';

// Both the prepared answers and model inference run in the browser.
const strategies = await readFile(new URL('../worker/strategies.js', import.meta.url), 'utf8');
const browserDemo = [
  strategies.replace('export function strategyAnswer', 'function strategyAnswer'),
  'const demoAnswer = ' + demoAnswer.toString() + ';',
  'const pack = ' + pack.toString() + ';',
  'const localAI = (' + createBrowserAI.toString() + ')();',
  'async function browserFetch(path, options, progress) {',
  "  if (path === '/api/status') return Response.json({ localAI: true, aiReady: typeof navigator !== 'undefined' && Boolean(navigator.gpu) });",
  '  const input = JSON.parse(options.body);',
  '  const reference = demoAnswer(input.statement, input.variation);',
  "  if (input.mode === 'demo') return Response.json({ ...reference, mode: 'demo' });",
  "  if (!input.consent) return Response.json({ error: 'Bitte bestätige zuerst den Download.' }, { status: 400 });",
  '  const candidates = Array.from({ length: 6 }, (_, step) => demoAnswer(input.statement, input.variation + step));',
  '  return Response.json(await localAI.answer({ ...input, reference, candidates, signal: options.signal, progress }));',
  '}',
].join('\n');
const html = page
  .replace('Zum Finden einer Antwort wird der Text an den App Server übertragen. In der Demo wird daraus eine vorbereitete Antwort ausgewählt.', 'Die Eingabe wird auf deinem Gerät verarbeitet. Die Demo wählt dort vorbereitete Antworten aus.')
  .replace('Deine Aussage und optionale Werkstatthinweise werden nach deiner Zustimmung an den verbundenen KI Anbieter gesendet. Die App kann dessen Verarbeitung nicht vollständig kontrollieren. Die Antworten sind Vorschläge und keine Faktenprüfung.', 'Nach deiner Zustimmung lädt dein Browser Llama 3.2 über WebLLM und Hugging Face. Das Modell wählt aus vorbereiteten Sätzen. Eingaben und Werkstatthinweise bleiben auf deinem Gerät.')
  .replace('Die App legt keine Gesprächshistorie an. Beim KI Anbieter können eigene Regeln zur Verarbeitung und Aufbewahrung gelten. Eine KI Antwort kann unpassend oder falsch sein. Entscheide selbst, was du davon sagen möchtest.', 'Der Browser kann die Modelldateien zwischenspeichern. Falls du den Cache löschst, lädt er sie erneut. Eine KI Antwort kann unpassend oder falsch sein.')
  .replace('<p class="muted-box" id="ai-status">Der KI Zugang wird geprüft.</p>', '<p class="muted-box" id="ai-status">Der KI Zugang wird geprüft.</p><p>Built with Llama</p>')
  .replace('<p id="form-message" class="form-message" role="alert"></p>', '<p id="form-message" class="form-message" role="status"></p><button id="cancel-local-ai" class="text-button" type="button" hidden>Abbrechen</button>')
  .replace('<script>', () => '<script>' + browserDemo + '\n')
  .replaceAll("fetch('/api/", "browserFetch('/api/");
const script = html.split('<script>')[1].split('</script>')[0];
new Function(script);
const destination = new URL('../docs/', import.meta.url);
await mkdir(destination, { recursive: true });
await writeFile(new URL('index.html', destination), html);
