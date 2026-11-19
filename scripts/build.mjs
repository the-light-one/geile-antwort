import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';

const server = new URL('../dist/server/', import.meta.url);
const worker = new URL('../worker/', import.meta.url);
await mkdir(server, { recursive: true });

for (const file of await readdir(worker)) {
  if (file.endsWith('.js')) {
    await copyFile(new URL(file, worker), new URL(file, server));
  }
}
await writeFile(new URL('package.json', server), '{"type":"module"}\n');

const manifest = new URL('../.openai/hosting.json', import.meta.url);
const destination = new URL('../dist/.openai/', import.meta.url);
await mkdir(destination, { recursive: true });
try {
  await copyFile(manifest, new URL('hosting.json', destination));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
