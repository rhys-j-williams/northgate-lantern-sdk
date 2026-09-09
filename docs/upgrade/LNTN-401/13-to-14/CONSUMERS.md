<!-- Generated with AI assistance (AIT-014) on 2026-09-08; reviewed by <handle>. -->

# LNTN-401 Angular 13 -> 14: consumer verification for `@northgate/lantern-sdk` 4.0.0

Candidate: `@northgate/lantern-sdk@4.0.0`, peers `@angular/{common,core,router} >=14.0.0 <15.0.0`,
`rxjs >=6.5.0 <7.0.0`, partial-Ivy output. Published to Verdaccio only via
`northgate-mock-external/scripts/publish-internal.sh --only lantern-sdk`
([`publish-verdaccio.log`](publish-verdaccio.log); pack preview in [`publish-dry-run.log`](publish-dry-run.log);
registry state `['3.0.0', '4.0.0']` in [`verdaccio-lantern-versions.log`](verdaccio-lantern-versions.log)).
Nothing was published to Artifactory.

Playbook rule: a partial-Ivy library is only supported on consumers at or above its Angular major.
retail-web is on Angular 14.3.0, inside 4.0.0's peer range, so it is verified **formally** here
(pin, `npm ci`, lint, `test:ci`, `build:prod`, `verify-estate.sh retail-web`, `estate-up.sh` +
`smoke.sh`). The verification ran in scratch checkouts only; the retail-web pin bump
`2.4.1 -> 4.0.0` is a separate retail-web PR under MOL-4471 (mirror KAN-16), not this one.

## Result table

| Consumer | Angular | Node | Lantern pin today | Result | Notes |
|---|---|---|---|---|---|
| `northgate-retail-web` | 14.3.0 | 16.20.2 | 2.4.1 | **PASS** | All seven checks green with 4.0.0 pinned in a scratch checkout of `origin/develop` (`8b456b7`). Pre-existing on retail develop and unchanged: initial-bundle budget warning (2.05 MB vs 2.00 MB), 2 skipped specs, 2 `no-explicit-any` lint warnings in `src/zone-flags.ts`. Evidence under [`consumers/retail-web/lantern-4.0.0/`](consumers/retail-web/lantern-4.0.0/). |
| `northgate-business-web` | 14.2.12 | 14.21.3 | none | NOT_APPLICABLE | Its `package.json` has no `@northgate/lantern-sdk` dependency (estate overview, CNPY-2140 pin table). |
| Beacon ops console | n/a | n/a | unknown | NOT_APPLICABLE | Outside the `northgate-*` estate; not verifiable here. Listed for completeness. |

No FAIL, so release is not blocked. `/home/ubuntu/repos/northgate-retail-web` was not modified
(`git status` clean, `git worktree list` back to the single main checkout) and no retail PR was
opened; retail-web `develop` still reads `"@northgate/lantern-sdk": "2.4.1"`.

## retail-web: method

- Node 16.20.2 (`nvm use 16.20.2`, retail's `.nvmrc`), `CHROME_BIN` set for Karma. Retail's own
  `.npmrc` was used as committed (`legacy-peer-deps=true` from MOL-3611); `--legacy-peer-deps` was
  never passed on the command line.
- Two scratch checkouts of `northgate-retail-web` at `origin/develop`, both outside the repo and
  removed afterwards: a detached `git worktree` at `/home/ubuntu/scratch-retail-web-lantern-4.0.0`
  for install/lint/test/build, and a local `git clone` (detached at the same commit) that a
  temporary sibling workspace pointed `verify-estate.sh` at via `NORTHGATE_WORKSPACE`, because the
  script skips a worktree (`.git` is a file, not a directory) as "no checkout" (the 12 -> 13 run hit
  that SKIP).
- Only `package.json` (`"@northgate/lantern-sdk": "2.4.1" -> "4.0.0"`) and the regenerated
  `package-lock.json` changed in the scratch trees.
- Lockfile: `npm install --package-lock-only --no-audit --no-fund` runs retail's `postinstall`
  (`ngcc ...`) even in lock-only mode and fails with `ngcc: not found` because nothing is installed
  yet, so the lock-only step was run with `--ignore-scripts` (lockfile generation only; the real
  `npm ci` below ran with scripts, including `ngcc`). As in the 12 -> 13 evidence, the committed
  retail lockfile carries Artifactory integrity hashes for the `@northgate/*` tarballs which
  Verdaccio's rebuilt tarballs do not match (`EINTEGRITY`), so the four `@northgate/*` `integrity`
  fields were dropped from the **scratch** lockfile only
  ([`lockfile-update.log`](consumers/retail-web/lantern-4.0.0/lockfile-update.log)).

## retail-web: results (Lantern 4.0.0)

| Check | Result | Log |
|---|---|---|
| `npm ci` | exit 0, 1227 packages; `postinstall` `ngcc --properties es2015 browser module main --first-only --create-ivy-entry-points` ran and had nothing to process for Lantern (no `__ivy_ngcc__/`, no `__processed_by_ivy_ngcc__`) | [`install.log`](consumers/retail-web/lantern-4.0.0/install.log) |
| installed package | 4.0.0, peers `@angular/* >=14.0.0 <15.0.0`, `rxjs >=6.5.0 <7.0.0`; `esm2020/ fesm2015/ fesm2020/` + typings; `metadata` null (no View Engine); `SDK_VERSION = '4.0.0'` stamped in the fesm bundles and in both localised `main.*.js` | [`installed-lantern.log`](consumers/retail-web/lantern-4.0.0/installed-lantern.log) |
| `npm run lint` | exit 0; 0 errors, 2 warnings (`src/zone-flags.ts` `no-explicit-any`, pre-existing, identical to the 2.4.1 baseline in the 12 -> 13 evidence) | [`lint.log`](consumers/retail-web/lantern-4.0.0/lint.log) |
| `npm run test:ci` | exit 0; 196 of 198 SUCCESS (2 skipped, pre-existing); coverage 35.41 / 22.19 / 28.63 / 36.19 (statements / branches / functions / lines), identical to the 2.4.1 baseline | [`test.log`](consumers/retail-web/lantern-4.0.0/test.log) |
| `npm run build:prod` | exit 0; `en-US` + `es`; `main` 1.77 MB, initial total 2.05 MB; **pre-existing** `Warning: bundle initial exceeded maximum budget. Budget 2.00 MB was not met by 53.79 kB` (same figure as the 3.0.0 scratch build, 54.00 kB on the 2.4.1 baseline) | [`build.log`](consumers/retail-web/lantern-4.0.0/build.log) |
| `verify-estate.sh retail-web` | `pass 16, fail 0, skip 0`, exit 0: forbidden strings (worktree + history), no build output committed, exact versions, package.json/.nvmrc/lockfile, history depth 344, 17 authors, tag `v2024.09.2`, `npm ci`, lint, unit tests, coverage 36.2% lines (target 34 +/-3), production build, localised builds `en-US` and `es` | [`verify-estate.log`](consumers/retail-web/lantern-4.0.0/verify-estate.log) |
| `estate-up.sh` | in-process mode (`ESTATE_NO_DOCKER=1`, `ESTATE_SKIP_PUBLISH=1` because 4.0.0 was already on Verdaccio), all 11 mocks + Verdaccio up; `ESTATE_SERVICES="bedrock-adapter bff-retail"` after building those two from `northgate-platform-services` (`common-starter` + `bedrock-adapter` with Maven/Java 11, `bff-retail` with Node 18). The other platform services have no build artefact on this machine and stay NOT STARTED; they are not on retail-web's Lantern path. | [`estate-up.log`](consumers/retail-web/lantern-4.0.0/estate-up.log) |
| `smoke.sh` | `18 passed, 0 failed, 2 skipped`, exit 0: mock health sweep, Keystone PKCE login, bff-retail accounts with Bedrock-backed balances, lantern track event stored in `lantern-collector-mock` + `lantern.min.js` served, Splunk correlation across bedrock-adapter / bedrock-core-mock / bff-retail. Skips: beacon ordered dispatch and documents statement PDF, because `beacon-notifications` and `documents-service` were not started (no artefact); neither involves Lantern. | [`smoke.log`](consumers/retail-web/lantern-4.0.0/smoke.log) |
| app boot | scratch retail-web `ng serve --proxy-config proxy.conf.json` on 4200 against the estate: `Compiled successfully`, `GET /` 200, `/api/v1/accounts` proxied to bff-retail (401 without a token, as expected), `vendor.js` stamped `SDK_VERSION = '4.0.0'`, zero `__ivy_ngcc__` references | [`serve-boot.log`](consumers/retail-web/lantern-4.0.0/serve-boot.log) |

Reading: retail-web on Angular 14.3.0 builds, lints and tests identically with Lantern 4.0.0 as
with 2.4.1; the Angular 14 linker consumes the partial-Ivy output and `ngcc` has nothing left to
do for Lantern (the last View Engine package on retail's `postinstall` path is gone once retail
pins 4.0.0, which is the estate prerequisite for Angular 16). The three warnings in the table are
retail-web `develop` state, not Lantern regressions, and retail-web's own budgets, tests and lint
rules were not touched. `smoke.sh`'s Lantern check posts a fixed `curl` event to the collector and
fetches `lantern.min.js`; it proves the collector path, not the SDK's runtime, so the SDK behaviour
evidence is the unchanged retail spec suite (196/196 executed) plus Lantern's own 21 specs.

## What the retail-web pin PR must do (MOL-4471 / KAN-16, not this PR)

- Pin `@northgate/lantern-sdk` `2.4.1 -> 4.0.0` in retail-web, regenerate the lockfile against
  Artifactory (the integrity hashes above are a Verdaccio-only artefact), `npm ci`, lint, `test:ci`,
  `build:prod`, `verify-estate.sh retail-web`, `smoke.sh`.
- Once no View Engine `@northgate/*` package remains in retail-web, drop `ngcc` from
  `postinstall` (prerequisite for the Angular 16 hop).
- Verdaccio `latest` dist-tag: consumers pin exact versions, so nothing resolves through `latest`.
