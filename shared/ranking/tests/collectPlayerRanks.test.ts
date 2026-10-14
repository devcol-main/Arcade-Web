import { describe, expect, it } from 'vitest';
import { LocalLeaderboardService } from '../../leaderboard';
import { collectPlayerRanks, type RankingRow, type RankingSource } from '../collectPlayerRanks';

const row = (playerId: string, nickname: string, score: number, ts = 0): RankingRow => ({ playerId, nickname, score, ts });
const source = (gameId: string, rows: RankingRow[]): RankingSource => ({ gameId, getTop: async (n) => rows.slice(0, n) });

describe('collectPlayerRanks', () => {
  it('player who is first in both games gets rank 1 for each game', async () => {
    const m = await collectPlayerRanks(
      [source('stack-up', [row('A', 'Ann', 100), row('B', 'Bob', 50)]), source('bug-squash', [row('A', 'Ann', 300), row('B', 'Bob', 10)])],
      10,
    );
    expect(m.get('id:A')).toEqual({ nickname: 'Ann', ranks: { 'stack-up': 1, 'bug-squash': 1 } });
    expect(m.get('id:B')).toEqual({ nickname: 'Bob', ranks: { 'stack-up': 2, 'bug-squash': 2 } });
  });

  it('player present in only one game has only that game in ranks', async () => {
    const m = await collectPlayerRanks([source('stack-up', [row('A', 'Ann', 5)]), source('bug-squash', [row('B', 'Bob', 5)])], 10);
    expect(m.get('id:A')?.ranks).toEqual({ 'stack-up': 1 });
    expect(m.get('id:B')?.ranks).toEqual({ 'bug-squash': 1 });
  });

  it('several records of one player in a game keep only the best rank', async () => {
    const m = await collectPlayerRanks([source('stack-up', [row('B', 'Bob', 90), row('A', 'Ann', 80), row('A', 'Ann', 70)])], 10);
    expect(m.get('id:A')?.ranks).toEqual({ 'stack-up': 2 });
    expect(m.get('id:B')?.ranks).toEqual({ 'stack-up': 1 });
  });

  it('tied scores follow the leaderboard order, giving distinct sequential ranks', async () => {
    const m = await collectPlayerRanks([source('stack-up', [row('A', 'Ann', 10, 1), row('B', 'Bob', 10, 2), row('C', 'Cy', 10, 3)])], 10);
    expect([m.get('id:A')?.ranks['stack-up'], m.get('id:B')?.ranks['stack-up'], m.get('id:C')?.ranks['stack-up']]).toEqual([1, 2, 3]);
  });

  it('only the top n rows of each game are ranked', async () => {
    const m = await collectPlayerRanks([source('stack-up', [row('A', 'Ann', 3), row('B', 'Bob', 2), row('C', 'Cy', 1)])], 2);
    expect(m.has('id:C')).toBe(false);
    expect(m.size).toBe(2);
  });

  it('old records without playerId are grouped by nickname under a separate key and never merged with id players', async () => {
    const m = await collectPlayerRanks(
      [source('stack-up', [row('', 'Ann', 9), row('A', 'Ann', 8)]), source('bug-squash', [row('', 'Ann', 7)])],
      10,
    );
    expect(m.get('nick:Ann')?.ranks).toEqual({ 'stack-up': 1, 'bug-squash': 1 });
    expect(m.get('id:A')?.ranks).toEqual({ 'stack-up': 2 });
    expect(m.size).toBe(2);
  });

  it('no sources or empty boards give an empty map', async () => {
    expect((await collectPlayerRanks([], 10)).size).toBe(0);
    expect((await collectPlayerRanks([source('stack-up', [])], 10)).size).toBe(0);
  });

  it('LocalLeaderboardService satisfies RankingSource as-is', async () => {
    const lb = new LocalLeaderboardService<{ x: number }>({ gameId: 'g', key: 'k', storage: null, sanitizeStats: () => ({ x: 0 }) });
    await lb.submit({ playerId: 'A', nickname: 'Ann', score: 5, stats: { x: 1 }, ts: 1 });
    const m = await collectPlayerRanks([lb], 10);
    expect(m.get('id:A')?.ranks).toEqual({ g: 1 });
  });
});
