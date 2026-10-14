# Assets

라이선스가 확인된 에셋만 사용한다. 외부 CDN 의존 금지(폰트, 사운드 모두 저장소에 포함).

| 에셋 | 파일 | 출처 URL | 라이선스 | 사용처 | 추가일 |
|---|---|---|---|---|---|
| Geist (variable, latin subset, wght 100–900) | games/stack-up/src/assets/fonts/geist-latin-wght-normal.woff2 (라이선스: games/stack-up/public/licenses/Geist-OFL-LICENSE.txt, 빌드 시 dist/stack-up/licenses/로 함께 배포) | https://github.com/vercel/geist-font (npm: @fontsource-variable/geist 5.3.0, 로컬 devcol-site node_modules에서 복사) | SIL OFL 1.1 | Stack Up 점수/로고/화면 텍스트 (800 굵기) | 2026-10-13 |
| DevCol logo (256x256 PNG, 투명 배경) | games/stack-up/src/assets/devcol-logo.png | DevCol 소유 (원본: devcol-site/devcol-build/docs/public/logo.png) | DevCol 소유 — 이 저장소의 Apache-2.0 코드 라이선스와 별개로 상표/로고 사용 권리는 DevCol에 있음 | Stack Up 파비콘(좌상단 화면 로고는 아래 dark 변형 사용) | 2026-10-13 |
| DevCol logo, dark-background variant | games/stack-up/src/assets/devcol-logo-dark.png | 위 DevCol logo에서 `node scripts/make-dark-logo.mjs`로 파생(검정 → 흰색, 훅 빨강 207,23,23 유지, 알파 유지). 원본은 DevCol 소유 | DevCol 소유 — 이 저장소의 Apache-2.0 코드 라이선스와 별개로 상표/로고 사용 권리는 DevCol에 있음 | Stack Up 좌상단 로고(모든 화면). 파비콘은 원본 사용 | 2026-10-13 |
| JetBrains Mono (variable, latin subset, wght 100–800) | games/bug-squash/src/assets/fonts/jetbrains-mono-latin-wght-normal.woff2 (라이선스: games/bug-squash/public/licenses/JetBrainsMono-OFL-LICENSE.txt, 빌드 시 dist/bug-squash/licenses/로 함께 배포) | https://github.com/JetBrains/JetBrainsMono (npm: @fontsource-variable/jetbrains-mono 5.3.0, 로컬 devcol-site node_modules에서 복사). 이전에 쓰던 Geist는 Task 005에서 Bug Squash에서 제거됨 (Stack Up은 계속 사용) | SIL OFL 1.1 | Bug Squash 화면 텍스트 | 2026-10-14 |
| DevCol logo, dark-background variant | games/bug-squash/src/assets/devcol-logo-dark.png | Stack Up과 동일 (games/stack-up/src/assets/devcol-logo-dark.png 복사). 원본은 DevCol 소유 | DevCol 소유 — 이 저장소의 Apache-2.0 코드 라이선스와 별개로 상표/로고 사용 권리는 DevCol에 있음 | Bug Squash 좌상단 로고(모든 화면). 파비콘은 원본 사용 | 2026-10-14 |
| DevCol logo (256x256 PNG, 투명 배경) | games/bug-squash/src/assets/devcol-logo.png | Stack Up과 동일 (games/stack-up/src/assets/devcol-logo.png 복사). 원본은 DevCol 소유 | DevCol 소유 — 이 저장소의 Apache-2.0 코드 라이선스와 별개로 상표/로고 사용 권리는 DevCol에 있음 | Bug Squash 파비콘 | 2026-10-15 |
