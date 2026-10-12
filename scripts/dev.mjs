// 게임 하나의 개발 서버. 사용법: npm run dev [-- <game>]  (기본: stack-up)
import { createServer } from 'vite';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2] ?? 'stack-up';
const gameRoot = resolve(root, 'games', name);

if (!existsSync(resolve(gameRoot, 'index.html'))) {
  console.error(`Unknown game "${name}" (games/${name}/index.html not found)`);
  process.exit(1);
}

const server = await createServer({
  root: gameRoot,
  configFile: false,
  // shared/ 가 게임 루트 밖에 있으므로 저장소 전체를 허용
  server: { fs: { allow: [root] } },
});
await server.listen();
server.printUrls();
