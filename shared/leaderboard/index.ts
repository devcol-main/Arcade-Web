export type { LeaderboardEntry, LeaderboardService, LeaderboardSubmission } from './types';
export {
  LocalLeaderboardService,
  normalizeNickname,
  MAX_STORED,
  MAX_NICKNAME_LENGTH,
  DEFAULT_NICKNAME,
} from './LocalLeaderboardService';
export type { StorageLike } from './LocalLeaderboardService';
