# Pipeline Log

웹 파이프라인(`web-implementer` / `web-test-runner` / `web-reviewer`) 실행 기록. 중단한 하위 작업도 기록한다.
Unity 파이프라인(`devcol-arcade`)과 검사 속도, 환경 문제 유무, 재시도 횟수, 비용을 비교하는 데 쓴다.

| 날짜 | Task | 하위 작업 | 구현 모델 | 시도 횟수 | 검사 | 리뷰 | 결과(완료/중단) | 비고 |
|---|---|---|---|---|---|---|---|---|
| 2026-10-13 | 001 Stack Up | 1. 골격 + shared/leaderboard (인터페이스, LocalLeaderboardService, 테스트) | sonnet | 2 | PASS (16/16) | PASS (1차 CHANGES_REQUESTED: 쓰기 실패 시 점수 소실, undefined 테스트 비결정성) | 완료 | 시작 시 환경 ERROR 1회(ts 네이티브 바이너리 누락) → 사용자가 npm ci로 해결. docs/mockups/stack-up-neon.html 없음 |
| 2026-10-13 | 001 Stack Up | 2. core 로직 (config, rng, StackUpLogic) + 테스트 | sonnet | 1 | PASS (40/40) | PASS | 완료 | 정정: 시안 docs/mockups/stack-up-neon.html은 이후 저장소에 추가되어 참고함. non-blocking 이월: dt NaN/음수 방어(7번에서 main이 clamp), regrow amount 0 이벤트는 view에서 amount>0일 때만 연출, 스폰 위치 체감 확인 |
| 2026-10-13 | 001 Stack Up | 3. view (블록, 조각 풀, 카메라, 그리드, 글로우 스프라이트, 레이어 확장 지점) + 임시 main | sonnet | 1 | PASS (57/57) | PASS | 완료 | 빌드 16K. non-blocking 이월: viewPieces.test toContain 무의미 단언 교체, PiecePool(0) 방어, 0.3/0.05 상수 config 이동(6번), 화면 흔들림 오프셋 render()에 추가(4번), iframe ResizeObserver(7번) |
| 2026-10-13 | 001 Stack Up | 4. 움직이는 배경(별 3레이어, 그리드 깜박임) + VFX(플래시, 링/입자, 폭 회복, 흔들림) + reduced motion | sonnet | 1 | PASS (75/75) | PASS | 완료 | 빌드 24K. non-blocking 이월: 흔들림이 Overlay(HUD)까지 흔드는지 6번에서 결정, VFX 매직 넘버 VIEW_CONFIG 이동, landX/landW 연결 로직 테스트 없음, "smaller scale flows slower" 테스트명 불일치 |
| 2026-10-13 | 001 Stack Up | 5. 오디오 (WebAudio 합성 효과음, 콤보 음높이, 음소거 + localStorage) | sonnet | 2 | PASS (91/91) | PASS (1차 CHANGES_REQUESTED: main 프레임 루프 클로저 할당) | 완료 | 빌드 32K. 이월: 첫 입력 시 ctx가 suspended라 첫 소리 누락 가능성(6번에서 재확인), visibilitychange에 audio.suspend/resume 연결(7번), minGain 상수화(선택) |
| 2026-10-13 | 001 Stack Up | 6. UI 화면 흐름 (타이틀/플레이/게임 오버, HUD, 닉네임, Top 10, 최고 기록, Geist 폰트) + 정식 main.ts | sonnet | 2 | PASS (109/109) | PASS (1차 CHANGES_REQUESTED: leaderboard 구체 클래스 타입 사용) | 완료 | 빌드 84K (폰트 29K 포함). Geist는 로컬 devcol-site node_modules에서 복사. 이월: 포커스된 retry 버튼에서 Space 시 click 중복 가능성(브라우저별 확인), 게임 오버 화면 작은 높이 넘침(7번), 폰트 로드 중 UI 최대 1.5초 숨김, 닉네임 제출 없이 retry 시 미저장 정책 확인, iOS 첫 소리 확인 |
| 2026-10-13 | 001 Stack Up | 7. 반응형/iframe/일시정지/reduced motion 마무리 (FrameClock, ResizeObserver, visibility 일시정지, 버튼 키 처리, 작은 높이 CSS) | sonnet | 2 | PASS (117/117) | PASS (1차 CHANGES_REQUESTED: 포커스된 Submit/Sound 버튼 Space 이중 처리, safe center 폴백 없음) | 완료 | 빌드 88K. CSS 레이아웃은 브라우저에서 직접 확인 못 함(사람 확인 필요). 이월(non-blocking): 시작 시 ResizeObserver로 글로우 스프라이트 1회 추가 재생성, 리스너 정리 없음 |
