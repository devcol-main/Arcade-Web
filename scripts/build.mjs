// 게임별 빌드: games/<game>/ → dist/<game>/ (base './' 상대 경로)
// 사용법: npm run build            (모든 게임)
//         npm run build -- stack-up (특정 게임)
import { build } from 'vite';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const gamesDir = resolve(root, 'games');

const games = readdirSync(gamesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(resolve(gamesDir, d.name, 'index.html')))
  .map((d) => d.name);

const requested = process.argv.slice(2);
const targets = requested.length > 0 ? requested : games;

for (const name of targets) {
  if (!games.includes(name)) {
    console.error(`Unknown game "${name}". Available: ${games.join(', ') || '(none)'}`);
    process.exit(1);
  }
}

for (const name of targets) {
  console.log(`\n== build ${name} ==`);
  await build({
    root: resolve(gamesDir, name),
    base: './',
    configFile: false,
    build: {
      outDir: resolve(root, 'dist', name),
      emptyOutDir: true,
      target: 'es2020',
    },
  });
}
