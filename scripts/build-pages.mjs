import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { page } from '../worker/page.js';
import { demoAnswer, pack } from '../worker/knowledge.js';
import { browserModels, createBrowserAI } from '../worker/browser-ai.js';

// Both the prepared answers and model inference run in the browser.
const strategies = await readFile(new URL('../worker/strategies.js', import.meta.url), 'utf8');
const browserDemo = [
  strategies.replace('export function strategyAnswer', 'function strategyAnswer'),
  'const demoAnswer = ' + demoAnswer.toString() + ';',
  'const pack = ' + pack.toString() + ';',
  'const browserModels = ' + JSON.stringify(browserModels) + ';',
  'const localAI = (' + createBrowserAI.toString() + ')();',
  'async function browserFetch(path, options, progress) {',
  "  if (path === '/api/status') return Response.json(await localAI.status());",
  "  if (path === '/api/release') { localAI.release(); return new Response(null, { status: 204 }); }",
  "  if (path === '/api/preload') return Response.json(await localAI.preload(options.signal, progress, options.startWithModel));",
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
  .replace('Deine Aussage und optionale Werkstatthinweise werden nach deiner Zustimmung an den verbundenen KI Anbieter gesendet. Die App kann dessen Verarbeitung nicht vollständig kontrollieren. Die Antworten sind Vorschläge und keine Faktenprüfung.', 'Beim Öffnen der App lädt dein Browser die verfügbaren Modelle über WebLLM und Hugging Face. Das gewählte Modell wählt aus vorbereiteten Sätzen. Eingaben und Werkstatthinweise bleiben auf deinem Gerät.')
  .replace('Die App legt keine Gesprächshistorie an. Beim KI Anbieter können eigene Regeln zur Verarbeitung und Aufbewahrung gelten. Eine KI Antwort kann unpassend oder falsch sein. Entscheide selbst, was du davon sagen möchtest.', 'Der Browser kann die Modelldateien zwischenspeichern. Falls du den Cache löschst, lädt er sie erneut. Eine KI Antwort kann unpassend oder falsch sein.')
  .replace('<p id="form-message" class="form-message" role="alert"></p>', '<p id="form-message" class="form-message" role="status"></p><button id="cancel-local-ai" class="text-button" type="button" hidden>Abbrechen</button>')
  .replace('<script>', () => '<script>' + browserDemo + '\n')
  .replaceAll("fetch('/api/", "browserFetch('/api/");
const script = html.split('<script>')[1].split('</script>')[0];
new Function(script);
const destination = new URL('../docs/', import.meta.url);
await mkdir(destination, { recursive: true });
await writeFile(new URL('index.html', destination), html);
