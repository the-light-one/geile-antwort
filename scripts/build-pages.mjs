import { mkdir, writeFile } from 'node:fs/promises';
import { page } from '../worker/page.js';
import { demoAnswer } from '../worker/knowledge.js';

// GitHub Pages serves a static demo. User input is handled in the browser.
const browserDemo = [
  'const demoAnswer = ' + demoAnswer.toString() + ';',
  'const pack = ' + ((green, yellow, red, bridge) => ({
    green: { answer: green, bridge, why: 'Eine offene Frage lädt zum Nachdenken ein.' },
    yellow: { answer: yellow, bridge, why: 'Ein Perspektivwechsel bringt die Aussage ins Gespräch.' },
    red: { answer: red, bridge, why: 'Eine klare Grenze macht deine Haltung hörbar.' },
    care: 'Du musst nicht perfekt antworten.',
    safety: '',
  })).toString() + ';',
  'async function demoFetch(path, options) {',
  "  if (path === '/api/status') return Response.json({ aiReady: false });",
  '  const input = JSON.parse(options.body);',
  "  return Response.json({ ...demoAnswer(input.statement, input.variation), mode: 'demo' });",
  '}',
].join('\n');
const html = page.replace('<script>', () => '<script>' + browserDemo + '\n')
  .replaceAll("fetch('/api/", "demoFetch('/api/");
const script = html.split('<script>')[1].split('</script>')[0];
new Function(script);
const destination = new URL('../docs/', import.meta.url);
await mkdir(destination, { recursive: true });
await writeFile(new URL('index.html', destination), html);
