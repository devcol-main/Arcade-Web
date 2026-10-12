import { describe, expect, it, vi, afterEach } from 'vitest';
import { LocalLeaderboardService, MAX_STORED, type StorageLike } from '../LocalLeaderboardService';

function memStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? (data[k] as string) : null),
    setItem: (k, v) => {
      data[k] = v;
    },
  };
}

const e = (nickname: string, score: number, ts?: number) => ({ nickname, score, floors: 1, maxCombo: 2, ts });

describe('LocalLeaderboardService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('submitted entry is returned by getTop with all fields', async () => {
    const s = new LocalLeaderboardService('k', memStorage(), () => 777);
    await s.submit({ nickname: 'Ann', score: 10, floors: 5, maxCombo: 3 });
    expect(await s.getTop(10)).toEqual([{ nickname: 'Ann', score: 10, floors: 5, maxCombo: 3, ts: 777 }]);
  });

  it('entries persist across service instances sharing the same storage key', async () => {
    const st = memStorage();
    await new LocalLeaderboardService('k', st).submit(e('A', 5, 1));
    expect(await new LocalLeaderboardService('k', st).getTop(5)).toHaveLength(1);
    expect(await new LocalLeaderboardService('other', st).getTop(5)).toHaveLength(0);
  });

  it('getTop sorts by score descending', async () => {
    const s = new LocalLeaderboardService('k', memStorage());
    await s.submit(e('a', 5, 1));
    await s.submit(e('b', 50, 2));
    await s.submit(e('c', 20, 3));
    expect((await s.getTop(10)).map((x) => x.nickname)).toEqual(['b', 'c', 'a']);
  });

  it('tied scores rank the earlier submission first', async () => {
    const s = new LocalLeaderboardService('k', memStorage());
    await s.submit(e('late', 10, 200));
    await s.submit(e('early', 10, 100));
    expect((await s.getTop(10)).map((x) => x.nickname)).toEqual(['early', 'late']);
  });

  it('tied scores with identical ts keep submission order', async () => {
    const s = new LocalLeaderboardService('k', memStorage());
    await s.submit(e('first', 10, 100));
    await s.submit(e('second', 10, 100));
    expect((await s.getTop(10)).map((x) => x.nickname)).toEqual(['first', 'second']);
  });

  it('getTop(n) returns at most n entries', async () => {
    const s = new LocalLeaderboardService('k', memStorage());
    for (let i = 0; i < 5; i++) await s.submit(e('a', i, i));
    expect(await s.getTop(3)).toHaveLength(3);
    expect(await s.getTop(0)).toHaveLength(0);
  });

  it('stored list is capped and keeps only the best entries', async () => {
    const st = memStorage();
    const s = new LocalLeaderboardService('k', st);
    for (let i = 0; i < MAX_STORED + 10; i++) await s.submit(e('a', i, i));
    const stored = JSON.parse(st.data.k as string) as { score: number }[];
    expect(stored).toHaveLength(MAX_STORED);
    expect(Math.min(...stored.map((x) => x.score))).toBe(10);
    expect(Math.max(...stored.map((x) => x.score))).toBe(MAX_STORED + 9);
    expect((await s.getTop(1))[0]?.score).toBe(MAX_STORED + 9);
  });

  it('nickname is trimmed and truncated to 12 characters', async () => {
    const s = new LocalLeaderboardService('k', memStorage());
    await s.submit(e('   Bob   ', 1, 1));
    await s.submit(e('ABCDEFGHIJKLMNOP', 0, 2));
    const top = await s.getTop(5);
    expect(top[0]?.nickname).toBe('Bob');
    expect(top[1]?.nickname).toBe('ABCDEFGHIJKL');
  });

  it('empty or whitespace nickname becomes Anonymous', async () => {
    const s = new LocalLeaderboardService('k', memStorage());
    await s.submit(e('', 2, 1));
    await s.submit(e('   ', 1, 2));
    expect((await s.getTop(5)).map((x) => x.nickname)).toEqual(['Anonymous', 'Anonymous']);
  });

  it('storage that throws on every access falls back to memory without errors', async () => {
    const bad: StorageLike = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    };
    const s = new LocalLeaderboardService('k', bad);
    await s.submit(e('a', 1, 1));
    await s.submit(e('b', 2, 2));
    expect((await s.getTop(5)).map((x) => x.nickname)).toEqual(['b', 'a']);
  });

  it('explicit null storage works with memory fallback', async () => {
    const s = new LocalLeaderboardService('k', null);
    await s.submit(e('a', 1, 1));
    expect(await s.getTop(5)).toHaveLength(1);
  });

  it('global localStorage being undefined works with memory fallback', async () => {
    vi.stubGlobal('localStorage', undefined);
    const s = new LocalLeaderboardService('k');
    await s.submit(e('a', 1, 1));
    await s.submit(e('b', 2, 2));
    expect((await s.getTop(5)).map((x) => x.nickname)).toEqual(['b', 'a']);
  });

  it('storage that reads fine but throws on write keeps submitted entries in memory', async () => {
    const st: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
    };
    const s = new LocalLeaderboardService('k', st);
    await s.submit(e('a', 1, 1));
    await s.submit(e('b', 2, 2));
    expect((await s.getTop(5)).map((x) => x.nickname)).toEqual(['b', 'a']);
  });

  it('non-finite ts falls back to the injected clock', async () => {
    const s = new LocalLeaderboardService('k', memStorage(), () => 555);
    await s.submit(e('a', 1, NaN));
    await s.submit(e('b', 1, Infinity));
    expect((await s.getTop(5)).map((x) => x.ts)).toEqual([555, 555]);
  });

  it('corrupted JSON is treated as empty and next submit recovers storage', async () => {
    const st = memStorage({ k: '{not json' });
    const s = new LocalLeaderboardService('k', st);
    expect(await s.getTop(5)).toEqual([]);
    await s.submit(e('a', 1, 1));
    expect(await new LocalLeaderboardService('k', st).getTop(5)).toHaveLength(1);
  });

  it('stored value of wrong shape or with invalid items is ignored', async () => {
    const st = memStorage({ k: JSON.stringify([{ score: 'x' }, null, { nickname: 'ok', score: 3 }]) });
    const s = new LocalLeaderboardService('k', st);
    const top = await s.getTop(5);
    expect(top).toHaveLength(1);
    expect(top[0]?.nickname).toBe('ok');
    st.data.k = '{"a":1}';
    expect(await s.getTop(5)).toEqual([]);
  });
});
