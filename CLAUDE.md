# devcol-arcade-web — Claude Code 프로젝트 규칙

> 메인 세션(Opus)은 계획과 조율만 하고, 구현은 서브에이전트에게 맡긴다.

## 프로젝트 개요
- devcol.net에 올릴 **웹 미니게임** 모음 (Stack Up, Bug Squash). Unity 게임은 별도 저장소 `devcol-arcade`.
- 스택: TypeScript, Canvas 2D, WebAudio, Vite, Vitest. 외부 게임 엔진/프레임워크 없이 시작한다.
- 빌드 결과는 사이트 저장소의 `docs/public/games/<game>/`로 복사해서 VitePress 페이지에 임베드한다. (GitHub Pages 호스팅)
- 비주얼: Neon 스타일. 세부는 각 Task 명세.
- 게임 안의 모든 텍스트는 영어. 주석과 문서는 한국어 가능.

## 폴더 구조
```
games/<game>/
  index.html
  src/core/     # 순수 로직. DOM, Canvas, Audio, window, localStorage 참조 금지
  src/view/     # Canvas 렌더링, 카메라, 배경, VFX
  src/audio/    # WebAudio
  src/ui/       # 화면 흐름, HTML 오버레이
  src/main.ts
  tests/        # Vitest
shared/
  leaderboard/  # LeaderboardService 인터페이스, LocalLeaderboardService
  (공통 유틸: rng, 입력, 오디오 언락 등은 두 게임 이상에서 쓰일 때만 여기로)
docs/
  tasks/NNN-*.md
  pipeline-log.md
scripts/
  copy-to-site.sh   # dist/<game> → ../devcol-site/devcol-build/docs/public/games/<game>
```

## 반복 한도 (Loop Limits)
| 항목 | 한도 | 한도 도달 시 |
|---|---|---|
| 하위 작업 하나당 구현 시도 (검사 실패 + 리뷰 반려 합산) | **3회** | 중단, 사용자 보고 |
| 같은 원인으로 연속 실패 | **2회** | 즉시 중단, 보고 |
| Task 전체의 `web-implementer` 호출 | **20회** | 남은 하위 작업과 함께 중단, 보고 |
| 검사 실행 ERROR (의존성 설치 실패 등 환경 문제) | **1회** | 재시도 없이 사용자에게 조치 요청 |

- 첫 시도도 1회로 센다. 보고에는 마지막 실패, 시도한 접근, 의심 원인, 사람이 결정할 것을 적는다.

## 워크플로 (메인 세션)
1. `docs/tasks/`의 명세를 읽는다. 명세에 없는 기능은 추가하지 않는다. 모호하면 먼저 묻는다.
2. 브랜치 `task/NNN-<짧은-이름>` 생성.
3. 하위 작업으로 나누고 목록을 사용자에게 보여준다. 순서는 **core + 테스트 → view → 연출/오디오 → UI → 마무리**.
4. 하위 작업마다 `web-implementer`에게 넘긴다: 목표, 수정 가능 범위, 완료 조건, 이전 실패 피드백과 시도 번호.
5. `web-test-runner`로 `npm run check` 실행.
6. 실패하면 피드백을 붙여 재시도 (반복 한도 준수).
7. 통과하면 `web-reviewer`에게 diff 리뷰. `CHANGES_REQUESTED`면 재시도 (시도 횟수에 포함).
8. `PASS`면 하위 작업 단위로 커밋. 푸시하지 않는다.
9. 하위 작업마다 `docs/pipeline-log.md`에 기록 (중단 포함).
10. 완료 시 명세 체크리스트를 채워 보고하고, 사람이 확인할 항목(조작감, 사운드, 실기기)을 따로 나열한다. 로컬 확인 방법(`npm run dev`, 해당 URL)도 알려준다.

## 코드 규칙
- `src/core`는 순수 TypeScript. 난수는 시드 기반 rng를 주입받는다. 시간은 dt를 인자로 받는다.
- 튜닝 수치는 `config.ts`에 모은다.
- 게임 루프(`requestAnimationFrame`) 안에서 매 프레임 객체/배열/문자열 생성 최소화. 입자는 풀링.
- 글로우를 매 프레임 `shadowBlur`로 그리지 않는다. 오프스크린 캔버스에 미리 그린 스프라이트를 쓴다.
- devicePixelRatio 대응 (상한 2).
- 오디오는 첫 사용자 입력에서 AudioContext를 resume. 음소거 상태는 localStorage.
- localStorage 접근은 항상 try/catch (사용 불가 환경에서도 게임이 돌아가야 함).
- 외부 CDN 의존 금지 (폰트, 사운드 모두 저장소에 포함). 라이선스가 확인된 에셋만 사용하고 출처를 `docs/assets.md`에 기록.
- 리더보드는 `LeaderboardService` 인터페이스로만 접근.
- 테스트 이름은 "상황 → 기대 결과"가 드러나게 (예: `partial overlap keeps only the overlapping width`).

## 커밋 규칙
- 하위 작업 하나 = 커밋 하나, 영어 명령형 메시지.
- `git push`, 브랜치 삭제, 히스토리 수정 금지.

## 검사
- `npm run check` = `tsc --noEmit` + `vitest run`
- `npm run build` 후 용량 확인: `du -sh dist/<game>`

## pipeline-log.md 형식
```
| 날짜 | Task | 하위 작업 | 구현 모델 | 시도 횟수 | 검사 | 리뷰 | 결과(완료/중단) | 비고 |
```
