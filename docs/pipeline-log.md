# Pipeline Log

웹 파이프라인(`web-implementer` / `web-test-runner` / `web-reviewer`) 실행 기록. 중단한 하위 작업도 기록한다.
Unity 파이프라인(`devcol-arcade`)과 검사 속도, 환경 문제 유무, 재시도 횟수, 비용을 비교하는 데 쓴다.

| 날짜 | Task | 하위 작업 | 구현 모델 | 시도 횟수 | 검사 | 리뷰 | 결과(완료/중단) | 비고 |
|---|---|---|---|---|---|---|---|---|
| 2026-10-13 | 001 Stack Up | 1. 골격 + shared/leaderboard (인터페이스, LocalLeaderboardService, 테스트) | sonnet | 2 | PASS (16/16) | PASS (1차 CHANGES_REQUESTED: 쓰기 실패 시 점수 소실, undefined 테스트 비결정성) | 완료 | 시작 시 환경 ERROR 1회(ts 네이티브 바이너리 누락) → 사용자가 npm ci로 해결. docs/mockups/stack-up-neon.html 없음 |
| 2026-10-13 | 001 Stack Up | 2. core 로직 (config, rng, StackUpLogic) + 테스트 | sonnet | 1 | PASS (40/40) | PASS | 완료 | 정정: 시안 docs/mockups/stack-up-neon.html은 이후 저장소에 추가되어 참고함. non-blocking 이월: dt NaN/음수 방어(7번에서 main이 clamp), regrow amount 0 이벤트는 view에서 amount>0일 때만 연출, 스폰 위치 체감 확인 |
