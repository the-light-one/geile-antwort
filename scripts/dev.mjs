import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import worker from '../worker/index.js';

const port = Number(process.env.PORT || 8787);
const origin = 'http://localhost:' + port;

createServer(async (incoming, outgoing) => {
  try {
    const method = incoming.method;
    const hasBody = method !== 'GET' && method !== 'HEAD';
    const request = new Request(new URL(incoming.url, origin), {
      method,
      headers: incoming.headers,
      ...(hasBody ? { body: Readable.toWeb(incoming), duplex: 'half' } : {}),
    });
    const response = await worker.fetch(request, process.env);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body) Readable.fromWeb(response.body).pipe(outgoing);
    else outgoing.end();
  } catch {
    outgoing.writeHead(500).end('Lokaler Serverfehler');
  }
}).listen(port, 'localhost', () => console.log(origin));

