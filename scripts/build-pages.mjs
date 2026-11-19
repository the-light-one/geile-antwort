import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { page } from '../worker/page.js';
import { demoAnswer, pack } from '../worker/knowledge.js';

// GitHub Pages serves a static demo. User input is handled in the browser.
const strategies = await readFile(new URL('../worker/strategies.js', import.meta.url), 'utf8');
const browserDemo = [
  strategies.replace('export function strategyAnswer', 'function strategyAnswer'),
  'const demoAnswer = ' + demoAnswer.toString() + ';',
  'const pack = ' + pack.toString() + ';',
  'async function demoFetch(path, options) {',
  "  if (path === '/api/status') return Response.json({ aiReady: false });",
  '  const input = JSON.parse(options.body);',
  "  return Response.json({ ...demoAnswer(input.statement, input.variation), mode: 'demo' });",
  '}',
].join('\n');
const html = page.replace('Zum Finden einer Antwort wird der Text an den App Server übertragen. In der Demo wird daraus eine vorbereitete Antwort ausgewählt.', 'In dieser Demo wird die vorbereitete Antwort direkt in deinem Browser ausgewählt.').replace('<script>', () => '<script>' + browserDemo + '\n')
  .replaceAll("fetch('/api/", "demoFetch('/api/");
const script = html.split('<script>')[1].split('</script>')[0];
new Function(script);
const destination = new URL('../docs/', import.meta.url);
await mkdir(destination, { recursive: true });
await writeFile(new URL('index.html', destination), html);
