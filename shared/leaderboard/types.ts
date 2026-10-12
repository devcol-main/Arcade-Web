/** 리더보드 엔트리. */
export interface LeaderboardEntry {
  nickname: string;
  score: number;
  /** 보조 값: 층수 */
  floors: number;
  maxCombo: number;
  /** 제출 시각 (epoch ms) */
  ts: number;
}

/** 제출용 입력. ts는 생략하면 서비스가 채운다. */
export type LeaderboardSubmission = Omit<LeaderboardEntry, 'ts'> & { ts?: number };

/** 게임은 이 인터페이스로만 리더보드에 접근한다. 나중에 서버 구현으로 교체 가능. */
export interface LeaderboardService {
  submit(entry: LeaderboardSubmission): Promise<void>;
  getTop(n: number): Promise<LeaderboardEntry[]>;
}
