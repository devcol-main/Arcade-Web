# Arcade-Web

[![CI](https://github.com/devcol-main/Arcade-Web/actions/workflows/ci.yml/badge.svg)](https://github.com/devcol-main/Arcade-Web/actions/workflows/ci.yml)

Entry point for the small browser games of [devcol.net](https://devcol.net), and the reference repository for the formats they share. The games themselves now live in their own repositories. Unity games live in a separate repository (`devcol-arcade`).

## Games

| Game | About | Repository |
|---|---|---|
| **Stack Up** | A one-tap neon stacking game. A block slides back and forth; tap to drop it, and whatever overhangs the tower is sliced off. | [devcol-main/Stack-Up](https://github.com/devcol-main/Stack-Up) |
| **Bug Squash** | A whack-a-mole game for people who write code. Bugs pop up in the cells of a retro terminal; squash them before they escape and leave the working features alone. | [devcol-main/Bug-Squash](https://github.com/devcol-main/Bug-Squash) |

Screenshots, controls and build instructions are in each game's README.

## Shared formats (`shared/`)

| Folder | Contents |
|---|---|
| [`shared/leaderboard`](shared/leaderboard) | `LeaderboardService` interface and a localStorage-backed `LocalLeaderboardService` |
| [`shared/player`](shared/player) | Player profile format |
| [`shared/ranking`](shared/ranking) | Overall ranking aggregation across games (lives only here) |

Each game copies `shared/leaderboard` and `shared/player` into its own `src/shared` and uses them at runtime on the same domain. When a format changes, update this repository and both game repositories together.

## Development

Requires Node.js 24 (see [`.nvmrc`](.nvmrc)).

```bash
npm ci
npm run check    # tsc --noEmit + Vitest
```

Work is organized as numbered task specs in [`docs/tasks`](docs/tasks) and logged in [`docs/pipeline-log.md`](docs/pipeline-log.md). [`CLAUDE.md`](CLAUDE.md) holds the project rules. CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs `npm ci` and `npm run check` on every pull request to `main` and every push to `main`.

## License

Code: [Apache License 2.0](LICENSE). See [`NOTICE`](NOTICE). This repository bundles no fonts, logos or other assets; see each game's repository for its own assets.
