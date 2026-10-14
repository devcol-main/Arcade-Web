# Task 010: Bug Squash를 Arcade-Web에서 제거 (독립 리포로 이전 완료)

상태: 확정 (사용자 요청: 정리 PR)
작성일: 2026-10-15
선행: Task 009(PR #6) main 머지 완료. main에서 브랜치 `task/010-remove-bug-squash`
범위: Arcade-Web. `games/stack-up/`의 코드와 동작은 바꾸지 않는다.

## 배경
Bug Squash를 새 공개 리포 [devcol-main/Bug-Squash](https://github.com/devcol-main/Bug-Squash)로 분리했다. `games/bug-squash` 히스토리는 `git subtree split`으로 보존해 옮겼고, 머지된 main의 `games/bug-squash` 트리와 새 리포의 분리 기준 트리가 같음을 확인했다(트리 해시 `62ae79a`). 코드가 두 곳에 있어 어긋나지 않도록 Arcade-Web에서는 제거하고 링크만 남긴다.

## 할 일
1. `games/bug-squash/` 전체 삭제
2. Bug Squash 전용 설정 정리
   - `.claude/launch.json`의 `bug-squash` 미리보기 설정 삭제
   - `scripts/verify-build.sh`: 남은 게임만 검사하도록 동작은 그대로 두되, 개발 훅 목록에서 `__bugSquash`를 빼도 되는지 판단 (번들이 없으므로 영향 없음. 남겨도 무해하면 남기고 이유를 주석으로)
3. 문서
   - `README.md`: 게임 목록에서 Bug Squash를 "독립 리포로 이전" 링크로 바꾸고, 빌드/복사 예시에서 bug-squash 명령 제거
   - `CLAUDE.md`: 프로젝트 개요의 게임 목록을 갱신하고 Bug Squash는 독립 리포에 있다고 한 줄
   - `docs/assets.md`: Bug Squash 행은 "독립 리포로 이전 (2026-10-15)" 표시로 바꾸거나 제거하고 새 리포의 `docs/assets.md`를 가리킨다
   - `docs/tasks/004·005·006·009`: 기록으로 남기고, 각 파일 맨 위에 "이 게임은 devcol-main/Bug-Squash로 이전됨" 한 줄 메모 (본문 수정 없음)
   - `docs/pipeline-log.md`: Task 010 행 추가
4. 유지하는 것 (변경하지 않음)
   - `shared/` (Stack Up이 사용, 통합 랭킹 기반). 테스트 안의 `'bug-squash'` 문자열은 게임 id 예시 데이터이므로 유지
   - `shared/player`의 레거시 닉네임 키 목록(`bugSquash.nickname`): 같은 도메인에서 Bug Squash와 프로필을 공유하므로 유지
   - `games/stack-up/tests/uiOptions.test.ts`의 bug-squash 키 언급: "다른 게임 기록을 지우지 않는다" 검증 데이터이므로 유지
   - `docs/mockups/`, `docs/tasks/008-ci.md`의 언급: 기록
   - 로컬 브랜치 `split/bug-squash`, `task/004~009` 브랜치: 삭제하지 않음 (CLAUDE.md 규칙)

## 완료 조건
- [ ] `npm run check` 통과 (Stack Up과 shared 테스트만 남음)
- [ ] `npm run build`가 stack-up만 빌드, `bash scripts/verify-build.sh` 통과, CI 통과
- [ ] `git grep` 결과 Bug Squash 언급이 위 "유지하는 것"과 문서 메모·링크뿐
- [ ] README의 새 리포 링크 동작
