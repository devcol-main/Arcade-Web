// 통합 랭킹용 공통 계약과 플레이어별 게임 순위 수집. 여러 순위를 하나의 전체 순위로 합치는 계산은 하지 않는다(이 Task 범위 밖).
export interface RankingRow {
  playerId: string;
  nickname: string;
  score: number;
  ts: number;
}

/** LeaderboardService<T>가 구조적으로 그대로 만족하는 계약. */
export interface RankingSource {
  readonly gameId: string;
  getTop(n: number): Promise<readonly RankingRow[]>;
}

export interface PlayerRanks {
  nickname: string;
  ranks: Record<string, number>;
}

/**
 * 플레이어를 가리키는 키.
 * playerId가 없는 옛 기록(playerId === '')은 누구인지 알 수 없으므로 닉네임 기반 별도 키(`nick:<nickname>`)로 모은다.
 * playerId 기반 키(`id:<playerId>`)와는 절대 합쳐지지 않는다.
 */
// TODO(대시보드 작업): 아래 두 가지는 아직 정하지 않았다.
// 1) `nick:` 키로 묶인 옛 기록(playerId 없음)을 대시보드에 그대로 표시할지, id 플레이어와 합칠지.
// 2) 플레이어 이름은 지금 소스 배열에서 처음 만난 기록의 닉네임을 쓴다. 최신 닉네임 등 다른 규칙이 필요한지.
export function playerKey(row: { playerId: string; nickname: string }): string {
  return row.playerId ? `id:${row.playerId}` : `nick:${row.nickname}`;
}

/**
 * 각 게임의 getTop(n) 결과에서 플레이어별 순위를 모은다.
 * - 순위는 게임별 결과 안에서 1부터 매긴다.
 * - 한 게임에 같은 플레이어 기록이 여럿이면 가장 높은 순위(가장 작은 숫자)만 쓴다.
 * - 동점은 경쟁 순위(1,1,3)가 아니라 리더보드 정렬 순서(점수 내림차순, 먼저 제출한 쪽이 위)를 그대로 따른
 *   순서 순위(1,2,3)다. 리더보드 화면에 보이는 줄 번호와 항상 일치하고, 동점자 중 먼저 달성한 사람이 앞선다는
 *   기존 규칙을 유지하기 위해서다.
 */
export async function collectPlayerRanks(sources: readonly RankingSource[], n: number): Promise<Map<string, PlayerRanks>> {
  const result = new Map<string, PlayerRanks>();
  for (const src of sources) {
    const rows = await src.getTop(n);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]!;
      const key = playerKey(row);
      let p = result.get(key);
      if (!p) {
        p = { nickname: row.nickname, ranks: {} };
        result.set(key, p);
      }
      const rank = i + 1;
      const prev = p.ranks[src.gameId];
      if (prev === undefined || rank < prev) p.ranks[src.gameId] = rank;
    }
  }
  return result;
}
