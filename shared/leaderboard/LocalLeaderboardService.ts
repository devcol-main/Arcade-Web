import type { LeaderboardEntry, LeaderboardService, LeaderboardSubmission } from './types';

/** localStorage 유사 객체 (테스트 주입용). */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const MAX_STORED = 50;
export const MAX_NICKNAME_LENGTH = 12;
export const DEFAULT_NICKNAME = 'Anonymous';

export function normalizeNickname(raw: unknown): string {
  const s = typeof raw === 'string' ? raw.trim().slice(0, MAX_NICKNAME_LENGTH).trim() : '';
  return s || DEFAULT_NICKNAME;
}

function num(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

function sanitize(raw: unknown): LeaderboardEntry | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.score !== 'number' || !Number.isFinite(r.score)) return null;
  return {
    nickname: normalizeNickname(r.nickname),
    score: r.score,
    floors: num(r.floors),
    maxCombo: num(r.maxCombo),
    ts: num(r.ts),
  };
}

/** 점수 내림차순, 동점이면 먼저 제출한 쪽(ts, 이후 저장 순서)이 위. */
function compare(a: LeaderboardEntry, b: LeaderboardEntry): number {
  return b.score - a.score || a.ts - b.ts;
}

function defaultStorage(): StorageLike | undefined {
  try {
    return (globalThis as { localStorage?: StorageLike }).localStorage;
  } catch {
    return undefined;
  }
}

export class LocalLeaderboardService implements LeaderboardService {
  private memory: LeaderboardEntry[] = [];
  /** 쓰기에 실패한 적이 있으면 memory가 진실의 원천이다. */
  private writeFailed = false;
  private readonly storage: StorageLike | undefined;

  /**
   * @param storage 생략하면 globalThis.localStorage, null이면 스토리지 없음(메모리만).
   */
  constructor(
    private readonly key: string,
    storage?: StorageLike | null,
    private readonly now: () => number = Date.now,
  ) {
    this.storage = storage === null ? undefined : (storage ?? defaultStorage());
  }

  async submit(entry: LeaderboardSubmission): Promise<void> {
    const ts = typeof entry.ts === 'number' && Number.isFinite(entry.ts) ? entry.ts : this.now();
    const clean: LeaderboardEntry = {
      nickname: normalizeNickname(entry.nickname),
      score: num(entry.score),
      floors: num(entry.floors),
      maxCombo: num(entry.maxCombo),
      ts,
    };
    // Array.prototype.sort는 안정 정렬이라 같은 ts여도 저장 순서가 유지된다.
    const list = [...this.load(), clean].sort(compare).slice(0, MAX_STORED);
    this.save(list);
  }

  async getTop(n: number): Promise<LeaderboardEntry[]> {
    const count = Math.max(0, Math.floor(n));
    return this.load().sort(compare).slice(0, count);
  }

  /** 부작용 없이 현재 목록의 복사본을 돌려준다. */
  private load(): LeaderboardEntry[] {
    if (this.writeFailed) return [...this.memory];
    const stored = this.readStorage();
    return stored ?? [...this.memory];
  }

  /** 스토리지에서 읽는다. 사용 불가(없음/throw)면 null, 손상/없는 값이면 []. */
  private readStorage(): LeaderboardEntry[] | null {
    if (!this.storage) return null;
    try {
      const raw = this.storage.getItem(this.key);
      if (typeof raw !== 'string') return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const list: LeaderboardEntry[] = [];
      for (const item of parsed) {
        const e = sanitize(item);
        if (e) list.push(e);
      }
      return list;
    } catch {
      // 접근 불가 또는 손상된 JSON
      return null;
    }
  }

  private save(list: LeaderboardEntry[]): void {
    this.memory = list;
    if (!this.storage) return;
    try {
      this.storage.setItem(this.key, JSON.stringify(list));
    } catch {
      // 쓰기 실패: 이후에는 memory를 기준으로 동작한다.
      this.writeFailed = true;
    }
  }
}
