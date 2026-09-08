<!-- Generated with AI assistance (AIT-014) on 2026-09-08; reviewed by <handle>. -->
# LNTN-401 hop report: northgate-lantern-sdk Angular 13 -> 14

| | |
|---|---|
| Repository | `rhys-j-williams/northgate-lantern-sdk` |
| Branch | `feature/LNTN-401-angular-13-to-14` -> `develop` |
| Hop | Angular 13.4.0 -> **14.3.0** (CLI 13.3.11 -> 14.2.13), one major, no chaining |
| Package | `@northgate/lantern-sdk` 3.0.0 -> **4.0.0** (semver major: peer range `>=14.0.0 <15.0.0`) |
| Wave position | Catch-up hop 2 of 2 for the estate's shared-library tier. After this, Lantern is level with Canopy, Iris and retail-web (Angular 14) and the estate 14 -> 15 wave can start in playbook order: `canopy-ui` (Canopy 4 / MDC) -> `lantern-sdk` -> `iris-widget` -> apps. Lantern 14 -> 15 is **not** started here. |
| Jira | epic LNTN-401; AI register AIT-014; demo mirror KAN-1 (epic), KAN-14 (hop story), KAN-15 (architecture review, ADR 0002), KAN-16 (retail-web consumer verification), KAN-17 (PR), KAN-18 (baseline), KAN-19 (matrix + ADR), KAN-20 (gates + publish), KAN-21 (framework commit), KAN-22 (CAB draft), KAN-13 (GIS risk acceptance, carried) |
| ADR | [`docs/adr/0002-angular-13-to-14.md`](../../../adr/0002-angular-13-to-14.md) |
| Matrix | [`docs/upgrade/LNTN-401/COMPATIBILITY_MATRIX.md`](../COMPATIBILITY_MATRIX.md) (14 column added) |
| CAB | [`CAB_RECORD.md`](CAB_RECORD.md) (draft; train 2026.10.2) |
| Consumers | [`CONSUMERS.md`](CONSUMERS.md) |
| Deprecations | [`deprecations.log`](deprecations.log) |

Every log cited below is in this directory unless prefixed with `00-baseline-13/`
(`docs/upgrade/LNTN-401/13-to-14/00-baseline-13/`, the Angular 13.4.0 state of `develop` after PR #3).

## 1. Toolchain

| item | 13.4.0 baseline ([`00-baseline-13/ng-version.log`](00-baseline-13/ng-version.log)) | 14.3.0 ([`ng-version.log`](ng-version.log)) | Angular 14 range (angular.dev/reference/versions) |
|---|---|---|---|
| `@angular/*` (8 runtime packages) | 13.4.0 | 14.3.0 | |
| `@angular/cli`, `@angular-devkit/build-angular` | 13.3.11 | 14.2.13 | |
| `@angular/compiler-cli` | 13.4.0 | 14.3.0 | |
| `ng-packagr` | 13.3.1 | 14.2.2 (14.3.x declares an Angular 15-next compiler peer, see ADR) | ^14 |
| TypeScript | 4.6.4 | 4.7.4 | >=4.6.2 <4.8.0 |
| RxJS | 6.6.7 | 6.6.7 | ^6.5.3 or ^7.4.0 |
| zone.js | 0.11.4 | 0.11.4 | ~0.11.4 |
| Node (`.nvmrc`, `engines`) | 14.21.3 / npm 6.14.18 | 14.21.3 / npm 6.14.18 (unchanged; `.nvmrc` and `engines` untouched) | ^14.15.0, ^16.10.0 |
| Lint | angular-eslint 13.5.0, @typescript-eslint 5.27.1, eslint 8.57.1 | angular-eslint 14.4.0, @typescript-eslint 5.43.0, eslint 8.57.1 | |
| TS target | es2017 (workspace), es2015 (lib) | es2020 (both; CLI 14 migration) | |
| Output | Ivy partial, APF 13 | Ivy partial (`compilationMode: partial` unchanged), APF 14 (`index.d.ts` entry typings, no `.map` in the package) | |
| `npm ls @angular/core` | one version | one version, 14.3.0 ([`npm-ls-angular-core.log`](npm-ls-angular-core.log)) | |

No `Jenkinsfile` in this repository; the `lantern-sdk-release` job uses the `northgateNodePipeline`
defaults (Node from `.nvmrc`, library coverage threshold 30% lines). Node stays 14.21.3 because
nothing in the Angular 14 toolchain forces 16 and business-web's agents are still Node 14; the bump
to 16.20.2 is planned with the 14 -> 15 hop (Angular 15 drops Node 14), recorded in ADR 0002.

## 2. Commits

| commit | scope | trailers |
|---|---|---|
| `e9bdf60` LNTN-401 Upgrade Angular 13 to 14 | framework hop: `package.json`, `package-lock.json`, `angular.json` (`defaultProject` removed), `tsconfig.json`, `projects/lantern-sdk/package.json` (4.0.0, peers), `projects/lantern-sdk/tsconfig.lib.json`, `SDK_VERSION` in `lantern.service.ts`, the two version literals in the existing specs | `AI-Assisted: AIT-014`, `AI-Assisted-Scope` |
| `0b4c2ad` LNTN-401 Check package version and SDK_VERSION stamp in verify-partial-ivy | `scripts/verify-partial-ivy.js`: also asserts the rxjs peer range, `dist` version == workspace version, and that a fesm bundle stamps `SDK_VERSION = '<version>'` | same |
| docs commit (this report, ADR, matrix, CAB, consumers, deprecations, README, CHANGELOG) | `docs/**`, `README.md`, `CHANGELOG.md` | same |

No new companion change in other repositories this time. `verify-estate.sh lantern-sdk` was run
with the workspace branch `feature/LNTN-401-lantern-partial-ivy-verify` checked out locally
(`northgate-cswt-workspace` PR #16, the 12 -> 13 companion that accepts partial Ivy for Lantern
>= 3; still open at the time of writing and a merge prerequisite for the CI estate check). The
retail-web pin bump is its own PR.

## 3. Migrations applied (`ng update @angular/core@14.3.0 @angular/cli@14.2.13 @angular-eslint/schematics@14.4.0`)

Preview: [`ng-update-preview.log`](ng-update-preview.log); run: [`ng-update-core-cli.log`](ng-update-core-cli.log);
per-migration outcome in [`deprecations.log`](deprecations.log). Net source change: `angular.json`
`defaultProject` removed, TS target es2020, angular-eslint 14 with `@typescript-eslint` re-pinned
exact (the schematic wrote `^5.36.2` / `^8.23.0`, forbidden by `save-exact`). No `entryComponents`,
`pathMatch`, typed-forms or router changes applied (nothing to migrate in this library). The first
`ng update` attempt without the angular-eslint schematic was refused (`@angular-eslint/schematics@13.5.0`
peers CLI `<14`), hence the three-package command.

## 4. Gate results

| gate | baseline 13.4.0 | after hop 14.3.0 | log |
|---|---|---|---|
| Clean `npm ci` (npm 6.14.18, lockfile v1 regenerated with `npm install --package-lock-only`) | pass, 1147 packages | pass | [`npm-install-lockfile.log`](npm-install-lockfile.log), [`npm-ci.log`](npm-ci.log) |
| `npm ls @angular/core` single version | 13.4.0 | 14.3.0 | [`npm-ls-angular-core.log`](npm-ls-angular-core.log) |
| Lint (`ng lint`, angular-eslint 14) | pass | "All files pass linting" | [`lint.log`](lint.log) |
| Unit tests (Karma, ChromeHeadlessCI) | 21/21 | **21/21**, 0 skipped, no `xit`/`fit`/`.skip`/`.only` in the tree | [`test.log`](test.log) |
| Coverage lines / statements / branches / functions | 97.33 / 97.51 / 86.55 / 100 | **97.33 / 97.43 / 87.85 / 100** (threshold 30 lines; not below baseline lines). Denominators moved 161 -> 156 statements, 119 -> 107 branches because es2020 output no longer downlevels async/spread | [`coverage-summary.txt`](coverage-summary.txt), [`lcov.info`](lcov.info) |
| Production build (`ng build lantern-sdk --configuration production`) | pass, 0 warnings | pass, **0 warnings**, 3.3 s | [`build.log`](build.log) |
| Output verifier | `verify:partial-ivy` OK | `verify:partial-ivy` OK on `dist/` and on the packed tarball (0 metadata files, 11 js/mjs, 2 fesm, 9 d.ts, peers and `SDK_VERSION = '4.0.0'` checked) | [`verify-partial-ivy.log`](verify-partial-ivy.log), [`publish-dry-run.log`](publish-dry-run.log) |
| `angular.json` schema (CLI 14.2.13 `lib/config/schema.json`) | VALID (13.3.11) | VALID (custom-format notices only) | [`angular-json-schema.log`](angular-json-schema.log) |
| Forbidden strings (GIS-1180) | PASS | PASS working tree | [`forbidden-strings.log`](forbidden-strings.log) |
| Checkmarx (mock) | Critical 0 High 0, PASSED | Critical 0 High 0 Medium 0, gate PASSED | [`scanner-cx.log`](scanner-cx.log) |
| Sonar (mock) | gate PASSED | gate PASSED | [`scanner-sonar.log`](scanner-sonar.log) |
| Xray (mock) | Critical 0 High 6, gate FAILED (6) | Critical 0 **High 3**, gate FAILED (3); **no new finding id**, three baseline Highs gone | [`scanner-xray.log`](scanner-xray.log) |
| `npm audit --audit-level=high` (full tree) | 193 (5 critical, 126 high) | 139 (5 critical, 84 high) | [`npm-audit.log`](npm-audit.log) |
| `npm audit --production` | 17 (13 high, 4 moderate) | 17 (13 high, 4 moderate), identical package/severity set | [`npm-audit-production.log`](npm-audit-production.log) |
| `verify-estate.sh lantern-sdk` | pass 16 fail 0 | pass 16 fail 0 skip 0 | [`verify-estate.log`](verify-estate.log) |
| Publish to Verdaccio (`publish-internal.sh --only lantern-sdk`, which runs this repo's `publish:local` flow) | 3.0.0 present | `@northgate/lantern-sdk@4.0.0` published; `npm view` shows versions `['3.0.0', '4.0.0']`, peers `>=14.0.0 <15.0.0` | [`publish-verdaccio.log`](publish-verdaccio.log), [`verdaccio-lantern-versions.log`](verdaccio-lantern-versions.log) |
| Smoke / app boot | not applicable (library) | consumer boot + `estate-up.sh` + `smoke.sh` evidence in [`CONSUMERS.md`](CONSUMERS.md) (18 pass, 0 fail, 2 unrelated skips) | |

## 5. Scanner and audit findings carried (governance)

The hop removes three of the six baseline Xray Highs (`minimatch@3.0.4`, `semver@7.3.4`,
`semver@7.3.5`, all lifted by `@angular-devkit/build-angular` 14.2.13 / angular-eslint 14) and 54
full-tree npm advisories. What remains is unchanged in id from the baseline, cannot be moved inside
the Angular 14 matrix (npm 6 has no `overrides`), and none of the dev-only packages ship in the
published tarball (`dist/lantern-sdk` depends on `tslib` only):

| finding | package(s) | scope | treatment |
|---|---|---|---|
| XRAY-127400 NORTHGATE-EOL-ANGULAR | `@angular/core@14.3.0` | runtime peer | intermediate wave position; 14 -> 15 follows in the estate wave (GIS-2618) |
| XRAY-127300 NORTHGATE-EOL-NODE14 | `node@14.21.3` | build agent | unchanged; Node 16.20.2 with the 14 -> 15 hop; GIS-RA via KAN-13 |
| XRAY-124800 CVE-2024-4068 | `webpack-dev-middleware@5.3.3` (build-angular 14.2.13; fix 5.3.4) | dev only | carried (was 5.3.0); GIS-RA via KAN-13 |
| npm audit production tree | `@angular/common`, `@angular/compiler`, `@angular/core` 14.3.0 | runtime peer | identical set to baseline; fixed in Angular >= 17/19; LNTN-401 catch-up plan |

No `npm audit fix --force`, no allowlist change, no Checkmarx suppression, no `.npmrc` change, no
threshold change. A human on GIS decides acceptance; this report only summarises.

## 6. Bundle and package delta

[`00-baseline-13/bundle-sizes.log`](00-baseline-13/bundle-sizes.log) vs [`bundle-sizes.log`](bundle-sizes.log) (bytes):

| artefact | 3.0.0 (Angular 13) | 4.0.0 (Angular 14) |
|---|---|---|
| `fesm2015/northgate-lantern-sdk.mjs` | 21,843 | 21,837 |
| `fesm2020/northgate-lantern-sdk.mjs` | 21,497 | 21,491 |
| `esm2020/lib/lantern.service.mjs` | 26,086 | 26,044 |
| `esm2020/lib/lantern.module.mjs` | 8,193 | 8,121 |
| entry typings | `northgate-lantern-sdk.d.ts` | `index.d.ts` (APF 14 layout; `typings` field updated by ng-packagr) |
| `.d.ts` files | 9 | 9 |

The package is byte-for-byte the same shape; the few-byte deltas are the version literal and
Angular 14's `ɵɵngDeclare*` metadata. Consumer-side effect is measured in
[`CONSUMERS.md`](CONSUMERS.md): retail-web's initial bundle is 2.05 MB with 4.0.0, the same as with
2.4.1 and 3.0.0 (its pre-existing 53.79 kB budget overrun is unchanged).

## 7. Breaking changes and public API

- Peer range `>=14.0.0 <15.0.0` for `@angular/common|core|router` (was `>=13.0.0 <14.0.0`); rxjs
  peer `>=6.5.0 <7.0.0` unchanged. Applications on Angular 13 stay on 3.0.0; retail-web (Angular
  14) can now pin 4.0.0 (its own PR).
- Output stays partial Ivy; the only layout change is the entry typings file name inside the
  package (resolved through `package.json` `typings`, transparent to consumers).
- **Unchanged**: `LanternModule.forRoot`, `LanternService` (`track`, `page`, `identify`, `reset`,
  `sessionId`, `config`), `LanternRouterTracker`, `maskPath`, `LanternTrackDirective`,
  `LanternSessionInterceptor`, `LANTERN_CONFIG`, `LanternConfig`, `installQueueStub`; the
  `X-Analytics-Session` header name; every GIS-1471 masking rule; the vendor queue stub and
  `lantern.min.js` 4.11 contract. The 21 existing specs pass; the only spec edits are the two
  literals that assert the release version (`@northgate/lantern-sdk@4.0.0`,
  `data-lantern-sdk="4.0.0"`), which follow the intentional version bump. No spec added, removed,
  skipped or focused.

## 8. Consumers

See [`CONSUMERS.md`](CONSUMERS.md). Summary: **retail-web PASS** (Angular 14.3.0, Node 16.20.2; pin
4.0.0 in scratch checkouts of `origin/develop`; `npm ci` with `ngcc` having nothing to process for
Lantern, lint 0 errors, `test:ci` 196/196 executed, `build:prod` with the pre-existing 2.05 MB
budget warning only, `verify-estate.sh retail-web` 16/16, `estate-up.sh` + `smoke.sh` 18 pass / 0
fail, app boots on 4200 with `SDK_VERSION = '4.0.0'`). business-web NOT_APPLICABLE (no Lantern
dependency). No consumer repository was modified and no consumer PR opened; the retail-web pin
bump is MOL-4471 / KAN-16.

## 9. Rollback

Revert the framework commit `e9bdf60` (and the tooling and doc commits that depend on it) on
`develop`. 3.0.0 and 2.4.1 stay published and pinned by every consumer (retail-web still pins
2.4.1); if 4.0.0 has been published to Artifactory, `npm deprecate` it rather than unpublish. No
consumer action.

## 10. Next

- Do **not** start Lantern 14 -> 15 from this branch. Lantern is now level with the estate.
- Next repository in the wave: **`northgate-canopy-ui`, Angular 14 -> 15, Canopy 4 / Material MDC**
  (CNPY-2140), once Lantern 4.0.0 is on `develop` and retail-web has pinned it (MOL-4471 PR: bump
  `2.4.1 -> 4.0.0`, then drop `ngcc` from `postinstall` when no View Engine package remains).
- Lantern 14 -> 15 (5.0.0, Node 16.20.2) follows Canopy 4 in the 15 wave.
