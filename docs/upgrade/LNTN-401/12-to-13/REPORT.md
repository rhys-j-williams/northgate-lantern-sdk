<!-- Generated with AI assistance (AIT-014) on 2026-09-08; reviewed by <handle>. -->
# LNTN-401 hop report: northgate-lantern-sdk Angular 12 -> 13

| | |
|---|---|
| Repository | `rhys-j-williams/northgate-lantern-sdk` |
| Branch | `feature/LNTN-401-angular-12-to-13` -> `develop` |
| Hop | Angular 12.2.17 -> **13.4.0** (CLI 12.2.18 -> 13.3.11), one major, no chaining |
| Package | `@northgate/lantern-sdk` 2.4.1 -> **3.0.0** (semver major: peer range and output format) |
| Wave position | Catch-up hop 1 of 2 for the estate's shared-library tier. Lantern is the only estate repository below Angular 14; 13 -> 14 (4.0.0) follows in its own session and PR, then the estate 14 -> 15 wave starts with `lantern-sdk` -> `canopy-ui` -> `iris-widget` -> apps. |
| Jira | epic LNTN-401; AI register AIT-014; demo mirror KAN-1 (epic), KAN-2 (hop story), KAN-3 (retail-web consumer), KAN-4 (ADR), KAN-5 (baseline), KAN-6 (matrix + ADR), KAN-7 (specs), KAN-8 (framework hop), KAN-9 (lint), KAN-10 (gates + publish), KAN-11 (CAB), KAN-12 (PR), KAN-13 (GIS risk acceptance) |
| ADR | [`docs/adr/0001-angular-12-to-13.md`](../../../adr/0001-angular-12-to-13.md) |
| Matrix | [`docs/upgrade/LNTN-401/COMPATIBILITY_MATRIX.md`](../../../upgrade/LNTN-401/COMPATIBILITY_MATRIX.md) |
| CAB | [`CAB_RECORD.md`](CAB_RECORD.md) (draft; train 2026.10.2) |
| Consumers | [`CONSUMERS.md`](CONSUMERS.md) |
| Deprecations | [`deprecations.log`](deprecations.log) |

Every log cited below is in this directory unless prefixed with `00-baseline/`
(`docs/upgrade/LNTN-401/00-baseline/`).

## 1. Toolchain

| item | 12.2.17 baseline ([`00-baseline/ng-version.log`](../00-baseline/ng-version.log)) | 13.4.0 ([`ng-version.log`](ng-version.log)) | Angular 13 range |
|---|---|---|---|
| `@angular/*` (8 runtime packages) | 12.2.17 | 13.4.0 | |
| `@angular/cli`, `@angular-devkit/build-angular` | 12.2.18 | 13.3.11 | |
| `@angular/compiler-cli` | 12.2.17 | 13.4.0 | |
| `ng-packagr` | 12.2.7 | 13.3.1 | ^13 |
| TypeScript | 4.3.5 | 4.6.4 | >=4.4.3 <4.7.0 |
| RxJS | 6.6.7 | 6.6.7 | ^6.5.3 or ^7.4.0 |
| zone.js | 0.11.4 | 0.11.4 | ~0.11.4 |
| Node (`.nvmrc`, `engines`) | 14.21.3 / npm 6.14.18 | 14.21.3 / npm 6.14.18 | ^12.20.0, ^14.15.0, ^16.10.0 |
| Lint | tslint 6.1.3 + codelyzer 6.0.2 | angular-eslint 13.5.0, @typescript-eslint 5.27.1, eslint 8.57.1 | |
| Output | View Engine (`enableIvy: false`), UMD + fesm2015 + metadata.json | Ivy partial (`compilationMode: partial`), APF 13 (fesm2015, fesm2020, esm2020) | |
| `npm ls @angular/core` | one version | one version, 13.4.0 ([`npm-ls-angular-core.log`](npm-ls-angular-core.log)) | |

No `Jenkinsfile` in this repository; the `lantern-sdk-release` job uses the `northgateNodePipeline`
defaults (Node from `.nvmrc`, library coverage threshold 30% lines).

## 2. Commits

| commit | scope | trailers |
|---|---|---|
| `e66cc90` LNTN-401 Upgrade Angular 12 to 13 | framework hop: `package.json`, `package-lock.json`, `angular.json`, `tsconfig*.json`, `projects/lantern-sdk/package.json` (3.0.0, peers), `scripts/verify-partial-ivy.js` (replaces `verify-view-engine.js`), `scripts/publish.sh`, `SDK_VERSION` | `AI-Assisted: AIT-014`, `AI-Assisted-Scope` |
| `e0e4a97` LNTN-401 Replace TSLint/codelyzer with angular-eslint 13 | `.eslintrc.json`, `projects/lantern-sdk/.eslintrc.json`, `tslint.json` removed, lint deps | same |
| `01a8eed` LNTN-401 Add LanternService session resume and debug specs | `projects/lantern-sdk/src/lib/lantern.service.spec.ts` | same |
| docs commit (this report, ADR, matrix, CAB, consumers, deprecations, README, CHANGELOG) | `docs/**`, `README.md`, `CHANGELOG.md` | same |

Companion (separate repository and PR): `northgate-cswt-workspace` branch
`feature/LNTN-401-lantern-partial-ivy-verify`, commit `1016c7d` "LNTN-401 Expect partial Ivy output
from Lantern 3.x in verify-estate" so `verify-estate.sh lantern-sdk` asserts partial Ivy for Lantern
>= 3 and View Engine for Lantern 2.x.

## 3. Gate results

| gate | baseline 12.2.17 | after hop 13.4.0 | log |
|---|---|---|---|
| Clean `npm ci` (npm 6, lockfile v1) | pass | pass, 1147 packages | [`npm-ci.log`](npm-ci.log) |
| `npm ls @angular/core` single version | 12.2.17 | 13.4.0 | [`npm-ls-angular-core.log`](npm-ls-angular-core.log) |
| Lint | tslint pass | `ng lint` (angular-eslint) "All files pass linting" | [`lint.log`](lint.log) |
| Unit tests (Karma, ChromeHeadlessCI) | 18/18 | **21/21**, 0 skipped, no `xit`/`fit`/`.skip`/`.only` added | [`test.log`](test.log) |
| Coverage lines / statements / branches / functions | 93.42 / 93.86 / 79.57 / 97.56 | **97.33 / 97.51 / 86.55 / 100** (threshold 30 lines) | [`coverage-summary.txt`](coverage-summary.txt), [`lcov.info`](lcov.info) |
| Production build (`ng build lantern-sdk --configuration production`) | pass | pass, **0 warnings**, 3.1 s | [`build.log`](build.log) |
| Output verifier | `verify:view-engine` OK | `verify:partial-ivy` OK on `dist/` and on the packed tarball | [`verify-partial-ivy.log`](verify-partial-ivy.log), [`publish-dry-run.log`](publish-dry-run.log) |
| `angular.json` schema (CLI 13.3.11 `lib/config/schema.json`) | n/a | VALID (custom-format notices only) | [`angular-json-schema.log`](angular-json-schema.log) |
| Forbidden strings (GIS-1180) | pass | PASS working tree | [`forbidden-strings.log`](forbidden-strings.log) |
| Checkmarx (mock) | Critical 0 High 0 | Critical 0 High 0 Medium 0, gate PASSED | [`scanner-cx.log`](scanner-cx.log) |
| Sonar (mock) | gate PASSED | gate PASSED, 0 bugs / 0 vulns / 0 smells | [`scanner-sonar.log`](scanner-sonar.log) |
| Xray (mock) | Critical 3 High 17, gate FAILED (20) | Critical 0 High 6, gate FAILED (6); **no new finding id** | [`scanner-xray.log`](scanner-xray.log) |
| `npm audit --audit-level=high` (full tree) | 395 (9 critical, 203 high) | 193 (5 critical, 126 high) | [`npm-audit.log`](npm-audit.log) |
| `npm audit --production` | 17 (13 high, 4 moderate) | 17 (13 high, 4 moderate), identical set | [`npm-audit-production.log`](npm-audit-production.log) |
| `verify-estate.sh lantern-sdk` | pass 16 fail 0 | pass 16 fail 0 (with companion workspace change) | [`verify-estate.log`](verify-estate.log) |
| Publish to Verdaccio (`npm run publish:local`) | 2.4.1 already present | `@northgate/lantern-sdk@3.0.0` published; `npm view` shows peers `>=13.0.0 <14.0.0` | [`publish-verdaccio.log`](publish-verdaccio.log) |
| Smoke / app boot | not applicable | not applicable: library, no deployable; consumer boot evidence in [`CONSUMERS.md`](CONSUMERS.md) | |

## 4. Scanner and audit findings carried (governance)

All six remaining Xray Highs and all 17 production-tree npm advisories exist in the 12.2.17
baseline under the same finding ids; the hop removes all three Criticals and 14 Highs
(`loader-utils`, `webpack@5.50.0`, `braces`, `http-proxy-middleware`, `ip`, `json5`, `node-forge`,
`set-value`, `@angular/core@9.0.0`). What remains cannot be moved inside the Angular 13 matrix (npm 6
has no `overrides`; the fixes live in later CLI majors) and none of the dev-only packages ship in
the published tarball (`dist/lantern-sdk` depends on `tslib` only):

| finding | package(s) | scope | treatment |
|---|---|---|---|
| XRAY-127400 NORTHGATE-EOL-ANGULAR | `@angular/core@13.4.0` | runtime peer | intermediate hop; expires on the 13 -> 14 release (GIS-2618) |
| XRAY-127300 NORTHGATE-EOL-NODE14 | `node@14.21.3` | build agent | unchanged; Node bump with the 13 -> 14 / 14 -> 15 hop; GIS-RA via KAN-13 |
| XRAY-121600 CVE-2022-3517 | `minimatch@3.0.4` (build-angular -> babel-plugin-istanbul -> test-exclude) | dev only | carried; GIS-RA via KAN-13 |
| XRAY-122310 CVE-2022-25883 | `semver@7.3.5` (build-angular, cli); `semver@7.3.4` (`@angular-eslint/builder` -> nx) | dev only | carried, one extra affected version via angular-eslint; GIS-RA via KAN-13 |
| XRAY-124800 CVE-2024-4068 | `webpack-dev-middleware@5.3.0` (build-angular) | dev only | carried (was 5.0.0); GIS-RA via KAN-13 |
| npm audit production tree | `@angular/common`, `@angular/compiler`, `@angular/core` 13.4.0 | runtime peer | identical to baseline; fixed in Angular >= 17/19; catch-up plan under LNTN-401 |

No `npm audit fix --force`, no allowlist change, no Checkmarx suppression, no `.npmrc` change.
A human on GIS decides acceptance; this report only summarises.

## 5. Bundle and package delta

[`00-baseline/bundle-sizes.log`](../00-baseline/bundle-sizes.log) vs [`bundle-sizes.log`](bundle-sizes.log) (bytes):

| artefact | 2.4.1 (View Engine) | 3.0.0 (partial Ivy) |
|---|---|---|
| `bundles/northgate-lantern-sdk.umd.js` | 38,222 | removed (APF 13 has no UMD) |
| `fesm2015/northgate-lantern-sdk.(js|mjs)` | 18,167 | 21,843 (partial declarations carry template metadata for the linker) |
| `fesm2020/northgate-lantern-sdk.mjs` | none | 21,497 |
| `northgate-lantern-sdk.metadata.json` | 8,581 | removed |
| `.d.ts` files | 9 | 9 (typed `ɵɵ*Declaration` statics added) |

The consumer's bundle is what matters for partial Ivy: the retail-web production build against
3.0.0 in [`CONSUMERS.md`](CONSUMERS.md) shows the linked service in `main.*.js`.

## 6. Breaking changes and public API

- Peer range `>=13.0.0 <14.0.0` for `@angular/common|core|router` (was `>=12.0.0 <13.0.0`).
- Output format: partial Ivy, no UMD, no `.metadata.json`, nothing for `ngcc`.
- Removed dev tooling: `verify:view-engine`, `tslint.json`, codelyzer.
- **Unchanged**: `LanternModule.forRoot`, `LanternService` (`track`, `page`, `identify`, `reset`,
  `sessionId`, `config`), `LanternRouterTracker`, `maskPath`, `LanternTrackDirective`,
  `LanternSessionInterceptor`, `LANTERN_CONFIG`, `LanternConfig`, `installQueueStub`; the
  `X-Analytics-Session` header name; every GIS-1471 masking rule (covered by the existing specs, all
  passing). `SDK_VERSION` reported in the vendor context becomes `@northgate/lantern-sdk@3.0.0`.

## 7. Consumers

See [`CONSUMERS.md`](CONSUMERS.md). Summary: retail-web (Angular 14.3.0, pin 2.4.1) is outside 3.0.0's peer range,
so the result is **NOT_SUPPORTED_UNTIL_CONSUMER_HOP**; the scratch install/lint/test/build evidence
against 3.0.0 is recorded for the 13 -> 14 CAB. business-web lists Lantern in its README but does not
depend on it in `package.json` (NOT_APPLICABLE). No consumer pin changes in this PR.

## 8. Rollback

Revert the framework commit `e66cc90` (and the tooling/spec/doc commits that depend on it) on
`develop`. 2.4.1 stays published and pinned by every consumer; if 3.0.0 has been published to
Artifactory, `npm deprecate` it rather than unpublish. No consumer action.

## 9. Next

- Lantern 13 -> 14 (`@northgate/lantern-sdk` 4.0.0, peers `>=14 <15`) in a new session on a new
  branch from `develop` once this PR merges; that release is the first one retail-web can pin
  (retail-web PR under MOL, bump 2.4.1 -> 4.0.0, drop `ngcc` from `postinstall` when no View Engine
  package remains).
- Then the estate 14 -> 15 wave in playbook order.
