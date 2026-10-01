import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backendPort = process.env.BACKEND_PORT ?? '8082';
const frontendPort = process.env.FRONTEND_PORT ?? '5173';
const frontendHost = '127.0.0.1';
const frontendOrigin = `http://${frontendHost}:${frontendPort}`;
const viteEntry = [
  resolve(rootDirectory, 'frontend/node_modules/vite/bin/vite.js'),
  resolve(rootDirectory, 'node_modules/vite/bin/vite.js'),
].find(existsSync);
const children = [];
let shuttingDown = false;

if (!viteEntry) {
  console.error('Vite is not installed. Run npm --prefix frontend install first.');
  process.exit(1);
}

function stopChildren(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  process.exitCode = exitCode;
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
}

function start(name, args, cwd, env) {
  const child = spawn(process.execPath, args, { cwd, env, stdio: 'inherit' });
  children.push(child);
  child.on('error', error => {
    console.error(`${name} failed to start: ${error.message}`);
    stopChildren(1);
  });
  child.on('exit', (code, signal) => {
    if (!shuttingDown) {
      console.error(`${name} stopped${signal ? ` (${signal})` : ` with exit code ${code}`}.`);
      stopChildren(code ?? 1);
    }
  });
}

process.on('SIGINT', () => stopChildren());
process.on('SIGTERM', () => stopChildren());

console.log(`Frontend: ${frontendOrigin}/`);
console.log(`Backend:  http://127.0.0.1:${backendPort}/health`);

start('Backend', ['--watch', 'src/server.js'], resolve(rootDirectory, 'backend'), {
  ...process.env,
  PORT: backendPort,
  CORS_ORIGIN: frontendOrigin,
});
start('Frontend', [viteEntry, '--host', frontendHost, '--port', frontendPort, '--strictPort'], resolve(rootDirectory, 'frontend'), {
  ...process.env,
  VITE_API_BASE_URL: `http://127.0.0.1:${backendPort}/api`,
});