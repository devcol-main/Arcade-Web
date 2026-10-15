# Task 013: Stack Up을 Arcade-Web에서 제거 (독립 리포로 이전 완료)

상태: 확정 (사용자 요청 2026-10-15: "Stack Up도 Bug Squash처럼 개별로 분리")
작성일: 2026-10-15
선행: Task 012 완료 — 새 공개 리포 [devcol-main/Stack-Up](https://github.com/devcol-main/Stack-Up) 생성·CI 통과. main에서 브랜치 `task/013-remove-stack-up`
범위: Arcade-Web. 선행 사례: Task 010(Bug Squash 제거, PR #7)

## 배경
`games/stack-up` 히스토리를 `git subtree split`으로 보존해 새 리포로 옮겼다(18커밋, 분리 기준 트리 해시 `dcb1bf0`가 Arcade-Web `main`의 `games/stack-up`과 같음). 이로써 Arcade-Web에는 게임이 남지 않는다.

## 분리 후 Arcade-Web의 역할 (결정)
게임 코드는 두지 않고, **두 게임 리포로 가는 안내 + 공유 형식(`shared/`)의 기준 리포**로 유지한다. `shared/leaderboard`, `shared/player`는 각 게임 리포의 `src/shared`에 복사되어 같은 도메인에서 런타임에 공유되므로, 형식을 바꿀 때 기준이 필요하다. `shared/ranking`(통합 랭킹 집계)은 여기에만 있다. 통합 랭킹 대시보드와 리더보드 서버는 별도 세션에서 진행한다(이 Task 범위 밖).

## 할 일
1. `games/stack-up/` 전체 삭제.
2. 게임 전용 도구 정리(게임이 없으므로): `scripts/build.mjs`, `scripts/dev.mjs`, `scripts/capture-media.mjs`, `scripts/lib/`, `scripts/make-dark-logo.mjs`, `scripts/copy-to-site.sh`, `scripts/verify-build.sh` 삭제(모두 Stack-Up 리포에 있음). `package.json` scripts는 `typecheck`/`test`/`check`만 남긴다(devDependencies는 vitest가 vite를 필요로 하므로 유지; 새 의존성 금지). `.claude/launch.json`의 stack-up 설정 삭제(남는 설정이 없으면 파일 삭제). `tsconfig.json`/`vitest.config.ts`의 include를 `shared`만 남게 정리.
3. CI(`.github/workflows/ci.yml`): `npm ci` → `npm run check`만 남긴다(build·verify-build 단계 제거). 안전 설정(permissions, concurrency, timeout, actions/* v4)은 유지.
4. 문서
   - `README.md`: Arcade-Web의 새 역할 소개, 게임 리포 링크(Stack-Up, Bug-Squash) — 각 게임 이름/한 줄 소개/링크, `shared/` 설명(leaderboard·player·ranking, 각 게임이 `src/shared`로 복사해 쓰고 형식을 바꿀 땐 이 리포와 게임 리포를 함께 맞춘다), 개발 명령(npm ci, npm run check), CI 배지, 라이선스. Stack Up GIF/스크린샷은 제거하고 Stack-Up 리포 README로 링크.
   - `CLAUDE.md`: 프로젝트 개요를 새 역할 기준으로 갱신(게임 없음, 두 게임 리포 링크, shared 형식 변경 시 양쪽 맞추기). 폴더 구조에서 `games/`와 게임 전용 스크립트 제거. 반복 한도/워크플로/코드 규칙/커밋 규칙은 유지.
   - `NOTICE`: 이 리포에 더 이상 Geist 폰트와 DevCol 로고 파일이 없으면 해당 항목 정리(코드 저작권 표기는 유지).
   - `docs/assets.md`: Stack Up 에셋 행은 "devcol-main/Stack-Up으로 이전 (2026-10-15)"으로 바꾸고 새 리포의 `docs/assets.md`를 가리킨다.
   - `docs/tasks/001·002·003·007·008`: 기록으로 남기고 각 파일 맨 위에 "이 게임은 devcol-main/Stack-Up으로 이전됨" 한 줄 메모(본문 수정 없음). 008(CI)은 "Arcade-Web CI는 Task 013에서 check만 남김" 메모.
   - `docs/media/`, `docs/mockups/`: Stack-Up 리포로 옮겼으므로 삭제.
   - `docs/pipeline-log.md`: Task 013 행 추가.
5. 유지: `shared/`와 그 테스트(형식 변경 금지), `LICENSE`, `.claude/agents`, `.claude/settings.json`, `.nvmrc`, 로컬 브랜치(삭제 금지).

## 완료 조건
- [x] `npm ci && npm run check` 통과(shared 테스트만 남음)
- [x] `git grep`으로 `games/stack-up`·삭제한 스크립트 참조가 기록(docs/tasks, pipeline-log)과 이전 안내 문구 외에 없음
- [x] README의 게임 리포 링크가 동작
- [ ] PR의 CI 통과
