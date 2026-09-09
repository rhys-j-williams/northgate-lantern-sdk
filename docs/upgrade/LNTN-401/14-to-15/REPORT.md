<!-- Generated with AI assistance (AIT-014) on 2026-09-09; reviewed by <handle>. -->
# LNTN-401 hop report: northgate-lantern-sdk Angular 14 -> 15

| | |
|---|---|
| Repository | `rhys-j-williams/northgate-lantern-sdk` |
| Branch | `feature/LNTN-401-angular-14-to-15` -> `develop` |
| Hop | Angular 14.3.0 -> **15.2.10** (CLI 14.2.13 -> 15.2.11), one major, no chaining to 16/17/18 |
| Package | `@northgate/lantern-sdk` 4.0.0 -> **5.0.0** (semver major: peer range `@angular/* ^15.0.0`, `rxjs ^7.5.0`; build platform Node 14.21.3 -> 16.20.2) |
| Wave position | Estate Angular 14 -> 15 wave, **Stage 2** (libraries first). Stage 1 Canopy 4.0.0 (`northgate-canopy-ui` PR #3, `feature/CNPY-2140-angular-14-to-15`, open into `develop`; Stage 2 proceeds under the gate waiver on KAN-23). Lantern has no Canopy dependency. Stage 3 retail-web pins Lantern 5.0.0 and Canopy 4.0.0 together (MOL-4471). Lantern 15 -> 16 is **not** started here and is blocked (see s10). |
| Jira | epic LNTN-401; AI register AIT-014; demo mirror KAN-23 (14 -> 15 wave epic; the 13 -> 14 hop was KAN-14), KAN-24 (= LNTN-140 vendor Ivy build, HIGHEST, blocker for 15 -> 16), KAN-13 (GIS risk acceptance pattern, carried findings) |
| ADR | [`docs/adr/0003-angular-14-to-15.md`](../../../adr/0003-angular-14-to-15.md) |
| Matrix | [`docs/upgrade/LNTN-401/COMPATIBILITY_MATRIX.md`](../COMPATIBILITY_MATRIX.md) (15 column added) |
| CAB | [`CAB_RECORD.md`](CAB_RECORD.md) (draft; train 2026.10.4 proposed, release manager to confirm) |
| Consumers | [`CONSUMERS.md`](CONSUMERS.md) |
| Deprecations | [`deprecations.log`](deprecations.log) |
| Security support | **4.0.0 (Angular 14 line) stays in security support until retail-web has moved to 5.0.0 or for 90 days after the 5.0.0 publish, whichever comes first (GIS-STD-022 s3).** Stated in `CHANGELOG.md` and `README.md`. |

Every log cited below is in this directory unless prefixed with `00-baseline-14/`
(`docs/upgrade/LNTN-401/14-to-15/00-baseline-14/`, the Angular 14.3.0 / Node 14.21.3 state of
`develop` at `a7f0808`, captured before any change).

## 1. Toolchain

| item | 14.3.0 baseline ([`00-baseline-14/ng-version.log`](00-baseline-14/ng-version.log)) | 15.2.10 ([`ng-version.log`](ng-version.log)) | Angular 15 range (angular.dev/reference/versions) |
|---|---|---|---|
| `@angular/*` (8 runtime packages) | 14.3.0 | **15.2.10** (last 15.x runtime release; `ng update` preview offered 15.2.9) | |
| `@angular/cli`, `@angular-devkit/build-angular` | 14.2.13 | **15.2.11** (last 15.x CLI) | |
| `@angular/compiler-cli` | 14.3.0 | 15.2.10 | |
| `ng-packagr` | 14.2.2 | **15.2.2** (peer `@angular/compiler-cli ^15.0.0`, `typescript >=4.8.2 <5.0`) | ^15 |
| TypeScript | 4.7.4 | **4.9.5** | >=4.8.2 <5.0.0 |
| RxJS | 6.6.7 | **7.8.1** (workspace); published peer `^7.5.0` | ^6.5.3 or ^7.4.0 |
| zone.js | 0.11.4 | **0.12.0** (dev/test only) | ~0.11.4, ~0.12.0, ~0.13.0 |
| Node (`.nvmrc`, `engines`) | 14.21.3 / npm 6.14.18 | **16.20.2 / npm 8.19.4**; `package-lock.json` lockfileVersion 1 -> **2** (regenerated with npm 8, [`npm-install-lockfile.log`](npm-install-lockfile.log)) | ^14.20.0, ^16.13.0, ^18.10.0 |
| Lint | angular-eslint 14.4.0, @typescript-eslint 5.43.0, eslint 8.57.1 | angular-eslint **15.2.1**, @typescript-eslint 5.43.0, eslint 8.57.1 (both re-pinned exact after the schematic wrote `^`) | |
| TS target | es2020 (workspace and lib) | **ES2022** with `useDefineForClassFields: false` (CLI 15 migration; lib `tsconfig.lib.json` inherits) | |
| Output | Ivy partial, APF 14 | Ivy partial (`compilationMode: partial` unchanged), APF 15: `esm2020/`, `fesm2015/`, `fesm2020/`, `index.d.ts`, no UMD, no `.metadata.json` | |
| `npm ls @angular/core` | one version | one version, 15.2.10 ([`npm-ls-angular-core.log`](npm-ls-angular-core.log)) | |

**Node / Jenkins.** No `Jenkinsfile` or Dockerfile in this repository; the `lantern-sdk-release`
job is parameterised from platform-tooling `Jenkinsfile.release` (`AGENT_LABEL`, `NODE_VERSION`,
"must match `.nvmrc`"). The Node 16 agent label **exists**: `nodejs16-rhel8` (Node 16.20.2, npm
8.19.4, Chrome 120, RHEL 8.10, Supported) per `jenkins-shared-library/README.md`, and the README
notes that `lantern-sdk` already builds on that label with an `nvm use 14` override in its Install
stage. After this hop the override must go: the job's `NODE_VERSION` parameter becomes `16.20.2`
so that it matches `.nvmrc`. That is a Jenkins job configuration change outside this repository
and is **recorded as a decision for the DAE release engineer** (CAB s7 step 3). Related, also
outside this repository: `northgate-mock-external/scripts/publish-internal.sh` still selects Node
14.21.3 for `lantern-sdk` (`use_node 14.21.3`); it should follow `.nvmrc` (16.20.2) before the
estate publish flow is next used for Lantern. Neither blocks this hop: the publish evidence below
was produced with this repo's own `npm run publish:local` on Node 16.20.2.

## 2. Commits

| commit | scope | trailers |
|---|---|---|
| `d4f3c3a` LNTN-401 Capture Angular 14.3.0 baseline before the 14 to 15 hop | `00-baseline-14/**` | `AI-Assisted: AIT-014`, `AI-Assisted-Scope` |
| `c892c8f` LNTN-401 Upgrade Angular 14 to 15 and Node 14 to 16 | framework hop: `.nvmrc`, `package.json`, `package-lock.json`, `angular.json` (angular-eslint schematics defaults), `tsconfig.json` (ES2022), `projects/lantern-sdk/package.json` (5.0.0, peers), `projects/lantern-sdk/tsconfig.lib.json`, `projects/lantern-sdk/src/test.ts` (CLI 15 Karma migration), `SDK_VERSION` in `lantern.service.ts`, the two version literals in the existing specs, `scripts/publish.sh` comment | same |
| `b7072ea` LNTN-401 Expect caret peer ranges in verify-partial-ivy | `scripts/verify-partial-ivy.js`: Angular peer expected as `^<major>.0.0` (derived from the workspace `@angular/core` major), rxjs peer `^7.5.0`; every other check unchanged | same |
| `4e1ce7d` LNTN-401 Add Angular 15 candidate gate logs and baseline coverage | gate logs in this directory, `00-baseline-14/coverage-summary.txt` + `lcov.info` | same |
| `b4b309c` LNTN-401 Add Verdaccio publish evidence for 5.0.0 | `publish-dry-run.log`, `publish-verdaccio.log`, `verdaccio-lantern-versions.log` | same |
| `7f1ef52` LNTN-401 Add consumer scratch verification evidence for 5.0.0 | `consumers/**` | same |
| docs commit (this report, ADR 0003, matrix, CAB, consumers, deprecations, README, CHANGELOG, `verify-estate.log`) | `docs/**`, `README.md`, `CHANGELOG.md` | same |

No companion change in other repositories. `verify-estate.sh lantern-sdk` was run from
`northgate-cswt-workspace` `main` (`1ff192d`), which already accepts partial Ivy for Lantern >= 13.
The retail-web pin is Stage 3's own PR (MOL-4471).

## 3. Migrations applied (`ng update @angular/core@15.2.10 @angular/cli@15.2.11 @angular-eslint/schematics@15.2.1`)

Preview: [`ng-update-preview.log`](ng-update-preview.log); run: [`ng-update-core-cli.log`](ng-update-core-cli.log);
per-migration outcome in [`deprecations.log`](deprecations.log). The first run was refused with
"Repository is not clean" because the untracked preview log sat in the tree; it was moved out and
the update re-run (no code effect). Migrations that changed files: angular-eslint v15
(`angular.json` schematics defaults; `package.json`), CLI "Remove no longer needed require calls in
Karma builder main file" (`test.ts`), CLI "Update TypeScript compiler target and set
useDefineForClassFields" (`tsconfig.json`, `tsconfig.lib.json`). No-ops for this library:
Browserslist file removal, `renderModule` export, unsupported `angular.json` options,
`relativeLinkResolution`, `RouterLinkWithHref`. Then by hand, all exact pins: ng-packagr 15.2.2,
TypeScript 4.9.5, zone.js 0.12.0, RxJS 7.8.1, `@typescript-eslint/*` 5.43.0 and eslint 8.57.1
restored from the `^` the schematic wrote; `.nvmrc` / `engines` to 16.20.2 / 8.19.4; lockfile
regenerated under Node 16.20.2 with `npm install --package-lock-only` (npm 8, lockfileVersion 2)
and proven with a clean `npm ci` (1080 packages, [`npm-ci.log`](npm-ci.log)). No source change was
needed for RxJS 7 (the library uses `Subject`, `filter`, `Observable` only).

## 4. Gate results

| gate | baseline 14.3.0 | after hop 15.2.10 | log |
|---|---|---|---|
| Clean `npm ci` | pass, npm 6.14.18, 1083 packages | pass, **npm 8.19.4 / Node 16.20.2**, 1080 packages, lockfile v2 | [`npm-install-lockfile.log`](npm-install-lockfile.log), [`npm-ci.log`](npm-ci.log) |
| `ng version` | Angular 14.3.0, CLI 14.2.13, Node 14.21.3 | Angular 15.2.10, CLI 15.2.11, Node 16.20.2, npm 8.19.4, TS 4.9.5, rxjs 7.8.1 | [`ng-version.log`](ng-version.log) |
| `npm ls --depth=0` / `npm ls @angular/core` single version | 14.3.0 | 15.2.10, one version; direct deps all exact | [`npm-ls-angular-core.log`](npm-ls-angular-core.log) |
| Lint (`ng lint`, angular-eslint 15, no rule disabled) | pass | "All files pass linting" | [`lint.log`](lint.log) |
| Unit tests (Karma, ChromeHeadless) | 21/21 | **21/21**, 0 skipped, no `xit`/`fit`/`.skip`/`.only` in the tree | [`test.log`](test.log) |
| Coverage lines / statements / branches / functions | 97.33 / 97.43 / 87.85 / 100 | **97.33 / 97.43 / 87.85 / 100** (identical; threshold 30 lines, not lowered) | [`coverage-summary.txt`](coverage-summary.txt), [`lcov.info`](lcov.info) |
| Production build (`ng build lantern-sdk --configuration production`) | pass, 0 warnings | pass, **0 warnings** | [`build.log`](build.log) |
| Output verifier | `verify:partial-ivy` OK | `verify:partial-ivy` OK on `dist/` and on the packed tarball (0 metadata files, 11 js/mjs, 2 fesm, 9 d.ts, peers `^15.0.0` / `^7.5.0`, version 5.0.0 == workspace, `SDK_VERSION = '5.0.0'` stamped) | [`verify-partial-ivy.log`](verify-partial-ivy.log), [`publish-dry-run.log`](publish-dry-run.log) |
| `angular.json` schema (CLI 15.2.11 `lib/config/schema.json`) | VALID (14.2.13) | VALID | [`angular-json-schema.log`](angular-json-schema.log) |
| Forbidden strings (GIS-1180) | PASS | PASS working tree (and history, via `verify-estate.sh`) | [`forbidden-strings.log`](forbidden-strings.log) |
| Checkmarx (mock) | Critical 0 High 0 Medium 0, PASSED | Critical 0 High 0 Medium 0, gate PASSED | [`scanner-cx.log`](scanner-cx.log) |
| Sonar (mock) | gate PASSED | gate PASSED | [`scanner-sonar.log`](scanner-sonar.log) |
| Xray (mock) | Critical 0 **High 3**, gate FAILED | Critical 0 **High 0**, Medium 7, Low 3, **gate PASSED**; no new finding id, all three baseline Highs gone | [`scanner-xray.log`](scanner-xray.log) |
| `npm audit` (full tree) | 139 (5 critical, 84 high, 43 moderate, 7 low), 59 distinct advisory ids | **50** (1 critical, 31 high, 15 moderate, 3 low), 51 distinct ids: 48 carried, 11 closed, **3 NEW** (see s5) | [`npm-audit.log`](npm-audit.log) |
| `npm audit --production` | 17 (13 high, 4 moderate), 14 distinct ids | 8 High groups, **14 distinct ids, identical id set to baseline, no new id** | [`npm-audit-production.log`](npm-audit-production.log) |
| `verify-estate.sh lantern-sdk` (workspace `main` `1ff192d`) | pass 16 fail 0 | **pass 16 fail 0 skip 0** (forbidden strings worktree + history, no build output, exact versions, `.nvmrc`, lockfile, `npm ci`, lint, unit tests, coverage 97.3% lines, production build, partial Ivy output) | [`verify-estate.log`](verify-estate.log) |
| Publish to Verdaccio (`npm run publish:local` = `scripts/publish.sh`) | 4.0.0 on Artifactory; local registry empty | `@northgate/lantern-sdk@5.0.0` published (53.2 kB tarball, shasum `9e836b000bcdc2775ed534ee24e776cbb3823605`); `npm view @northgate/lantern-sdk@5.0.0 --registry http://localhost:4873` shows peers `^15.0.0` / `rxjs ^7.5.0`, `latest` -> 5.0.0 | [`publish-dry-run.log`](publish-dry-run.log), [`publish-verdaccio.log`](publish-verdaccio.log), [`verdaccio-lantern-versions.log`](verdaccio-lantern-versions.log) |
| Consumer scratch verification | retail-web PASS on 4.0.0 (13 -> 14 evidence) | retail-web@14 **FAIL (expected)** `ERESOLVE`; Angular 15.2 scratch host **PASS** build + 4/4 specs | [`CONSUMERS.md`](CONSUMERS.md) |
| Smoke / app boot | not applicable (library) | Angular 15.2 scratch host production build + Karma run in [`CONSUMERS.md`](CONSUMERS.md); `estate-up.sh` / `smoke.sh` not re-run because no consumer in the estate can pin 5.0.0 until Stage 3 | |

Red gates, honestly: `npm audit` (full and `--production`) exits 1 as it did on the baseline and on
every previous hop, because the fixed versions of the `@angular/*` advisories are Angular >= 19.2.x
and the dev-tree fixes need `@angular/cli` / `build-angular` 22.x. The production id set is
unchanged; the full tree has three new ids that a human must decide on (s5). Everything else is
green, including Xray, which was red on the baseline.

## 5. Scanner and audit findings (governance)

The hop clears all three baseline Xray Highs (`@angular/core@14.3.0` EOL XRAY-127400,
`node@14.21.3` EOL XRAY-127300, `webpack-dev-middleware@5.3.3` CVE-2024-4068 XRAY-124800) and 89
full-tree npm advisory instances. Rules applied: finding **ids** compared against the baseline; no
new finding silently accepted; `npm audit fix --force` **not run** (it would install
`@angular/cli@22.1.7` / `@angular-devkit/build-angular@22.1.7`, i.e. chain majors); no allowlist,
suppression, `.npmrc`, `overrides` or threshold change. Nothing dev-only ships in the published
tarball (`dist/lantern-sdk` depends on `tslib` only).

Carried (same id as the 4.0.0 record / 14.3.0 baseline, treatment unchanged, KAN-13 pattern):

| finding | package(s) | scope | treatment |
|---|---|---|---|
| XRAY-127401 NORTHGATE-EOL-ANGULAR (Medium; was XRAY-127400 High on 14) | `@angular/core@15.2.10` | runtime peer | intermediate wave position; 15 -> 16 blocked on LNTN-140 / KAN-24 (GIS-2618) |
| XRAY-127310 NORTHGATE-EOL-NODE16, XRAY-127200 CVE-2023-39333 (Medium; replace the NODE14 High) | `node@16.20.2` | build agent | supported estate agent `nodejs16-rhel8`; Node 18 is a platform decision; GIS-RA via KAN-13 |
| XRAY-132800, XRAY-133200 CVE-2024-4068; XRAY-124910 CVE-2024-43788; XRAY-125300 CVE-2023-8265 (Medium) | `@babel/runtime@7.20.13`, `esbuild@0.17.8`, `webpack@5.76.1`, `karma@6.3.20` | dev only | pinned by build-angular 15.2.11 / unchanged Karma; GIS-RA via KAN-13 |
| XRAY-133800, XRAY-134600, XRAY-127500 (Low) | `http-proxy@1.18.1`, `karma@6.3.20`, `rxjs@6.6.7` (nested under `@angular-devkit/*`) | dev only | carried; KAN-13 |
| npm audit production tree (14 ids) | `@angular/common`, `@angular/compiler`, `@angular/core` 15.2.10 | runtime peer | identical id set to baseline; fixed in Angular >= 19.2.x; wave plan |

**NEW in the full-tree `npm audit` versus the 14.3.0 baseline (dev only; decision NOT made here):**

| id | package | path | npm severity | note |
|---|---|---|---|---|
| GHSA-52v5-jr5w-gjxr | `sigstore@1.9.0` | `@angular/cli@15.2.11` -> `pacote@15.1.0` -> `sigstore` | high | attestation verification in `ng add` / `ng update` package fetches; not on the build, test or publish path |
| GHSA-73wf-gq98-2v4g | `browserslist@<=4.28.6` | `@angular-devkit/build-angular@15.2.11` / `@babel/*` | high | crash via untrusted `browserslist-stats.json` custom stats; the repo has no custom stats file |
| GHSA-c83g-rgw3-j3cx | `browserslist@<=4.28.6` | same | high | unbounded query cache growth (OOM) with many distinct queries; build uses the CLI default query set |

Closed versus baseline (11): GHSA-23c5-xmqv-rm74, GHSA-3ppc-4f35-3m26, GHSA-4v9v-hfq4-rm2v,
GHSA-79cf-xcqc-c78w, GHSA-7r86-cg39-jmmj, GHSA-9jgg-88mc-972h, GHSA-f5vj-f2hx-8m93,
GHSA-m28w-2pqf-7qgj, GHSA-mx8g-39q3-5c79, GHSA-vcc3-ghjq-m6fr, GHSA-wr3j-pwj9-hqq6. Both `npm audit` variants report "fix available via
`npm audit fix --force`" only, which is outside the hop. Options for a human (GIS + DAE): accept
under the KAN-13 risk-acceptance pattern (dev-only, unreachable from the artefact), or add npm 8
`overrides` for `browserslist` (and `sigstore`) inside the 15 matrix as a follow-up, which is a
dependency-policy exception and needs its own review. **Returned in `new_jira_items_needed`.**

## 6. Bundle and package delta

[`00-baseline-14/bundle-sizes.log`](00-baseline-14/bundle-sizes.log) vs [`bundle-sizes.log`](bundle-sizes.log) (bytes):

| artefact | 4.0.0 (Angular 14) | 5.0.0 (Angular 15) |
|---|---|---|
| `fesm2015/northgate-lantern-sdk.mjs` | 21,837 | 21,853 |
| `fesm2020/northgate-lantern-sdk.mjs` | 21,491 | 21,507 |
| `esm2020/lib/lantern.service.mjs` | 26,044 | 26,047 |
| `esm2020/lib/lantern.module.mjs` | 8,121 | 8,125 |
| `lib/lantern-track.directive.d.ts` | 1,501 | 1,508 (Angular 15 `ɵɵDirectiveDeclaration` gains the host-directives type parameter, `never`) |
| `package.json` | 1,601 | 1,566 |
| `.d.ts` files | 9 | 9 |

Same shape, same file set; the deltas are the version literal and Angular 15's `ɵɵngDeclare*`
metadata (`version: "15.2.10"`; `minVersion` stays 12.0.0 / 14.0.0, so the linker floor is unchanged). Consumer-side effect measured in
[`CONSUMERS.md`](CONSUMERS.md): the Angular 15.2 scratch host builds to 232.67 kB initial with
Lantern linked; retail-web's figure will come with Stage 3.

## 7. Breaking changes and public API

- Peer range `^15.0.0` for `@angular/common|core|router` (was `>=14.0.0 <15.0.0`); rxjs peer
  `^7.5.0` (was `>=6.5.0 <7.0.0`). Applications on Angular 14 stay on **4.0.0**, which remains in
  security support per GIS-STD-022 s3 (until retail-web moves or 90 days); applications on RxJS 6
  cannot take 5.0.0 (nobody in the estate: retail-web is on RxJS 7.5.7).
- Build platform: Node 16.20.2 / npm 8.19.4 required to build and publish the library (consumers
  are unaffected; the tarball is plain JavaScript).
- Output stays partial Ivy, APF layout unchanged, no linker change for consumers on Angular 15.
- **Unchanged**: `LanternModule.forRoot`, `LanternService` (`track`, `page`, `identify`, `reset`,
  `sessionId`, `config`), `LanternRouterTracker`, `maskPath`, `LanternTrackDirective`,
  `LanternSessionInterceptor`, `LANTERN_CONFIG`, `LanternConfig`, `installQueueStub`; the
  `X-Analytics-Session` header name; every GIS-1471 masking rule; the vendor queue stub and
  `lantern.min.js` 4.11 contract. The 21 existing specs pass; the only spec edits are the two
  literals that assert the release version (`@northgate/lantern-sdk@5.0.0`,
  `data-lantern-sdk="5.0.0"`), which follow the intentional version bump. No spec added, removed,
  skipped or focused. **No public API break** to decide on.

## 8. Consumers

See [`CONSUMERS.md`](CONSUMERS.md). Summary: **retail-web FAIL (expected)** on Angular 14.3.0:
strict-peer install of the 5.0.0 tarball in a scratch worktree of `origin/develop` (`8b456b7`)
stops with `ERESOLVE ... peer @angular/common@"^15.0.0" from @northgate/lantern-sdk@5.0.0` /
`Found: @angular/common@14.3.0`; with retail-web's committed `legacy-peer-deps=true` npm writes the
lockfile but `npm ls` marks the three Angular 14 packages `invalid`. That is the peer range
working as designed; retail-web pins 5.0.0 in Stage 3 (MOL-4471) after its own Angular 15 hop.
**Angular 15.2 scratch host PASS**: `ng new` 15.2.11 app pinned to 15.2.10 / RxJS 7.5.7 / TS 4.9.5 /
zone.js 0.12.0 / `@types/node` 16.18.11, 5.0.0 installed from Verdaccio with strict peers,
production build exit 0, 4/4 specs covering `LanternModule.forRoot`, router page tracking with
GIS-1471 masking, `lanternTrack`, `LanternSessionInterceptor`. business-web NOT_APPLICABLE. No
consumer repository was modified and no consumer PR opened.

## 9. Rollback

Revert the framework commit `c892c8f` (and the tooling and doc commits that depend on it:
`b7072ea`, `4e1ce7d`, `b4b309c`, `7f1ef52`, the docs commit) on `develop`; set the release job's
`NODE_VERSION` back to 14.21.3. 4.0.0 and 2.4.1 stay published and pinned by every consumer
(retail-web still pins 2.4.1); if 5.0.0 has been published to Artifactory, `npm deprecate` it rather
than unpublish. No consumer action.

## 10. Next-hop constraints (carried forward from the 13 -> 14 report and extended)

Carried from `13-to-14/REPORT.md` s10, status after this hop:

- "Do not start Lantern 14 -> 15 from this branch" -> done now, on its own branch, as Stage 2 of
  the wave, after Canopy 4.0.0 (Stage 1) exists on `feature/CNPY-2140-angular-14-to-15` (PR #3).
- "retail-web MOL-4471: bump `2.4.1 -> 4.0.0`, then drop `ngcc` from `postinstall` when no View
  Engine package remains" -> **still open**. retail-web still pins 2.4.1 and still runs `ngcc`.
  Stage 3 now pins 5.0.0 directly (with Canopy 4.0.0) once retail-web is on Angular 15; 4.0.0
  remains its supported target while it is on Angular 14 (security support window above).
- "Lantern 14 -> 15 (5.0.0, Node 16.20.2) follows Canopy 4 in the 15 wave" -> this hop.

Constraints for the next hop (Lantern 15 -> 16, 6.0.0), to be carried into `15-to-16/REPORT.md`:

- **BLOCKER: LNTN-140 vendor Ivy build (Jira mirror KAN-24, priority HIGHEST).** Angular 16 drops
  the View Engine / `ngcc` compatibility path. The 2.4.1 line is View Engine and retail-web's
  `postinstall` `ngcc` exists for it (and any other View Engine `@northgate/*` package). Until the
  vendor-side Ivy build is delivered and every consumer is off `ngcc`, Lantern must not move to
  Angular 16. This blocks **15 -> 16, not this hop**: 5.0.0 is partial Ivy on Angular 15 and needs
  nothing from LNTN-140.
- Angular 16 requires Node ^16.14.0 || ^18.10.0 and TypeScript >= 4.9.3 < 5.2; Node 16.20.2 is
  still inside that range but is EOL (XRAY-127310), so the Node 18 platform decision (agent label
  `nodejs18-rhel8`, if and when platform-tooling adds it) should be taken with or before 15 -> 16.
- zone.js 0.13.x, RxJS stays 7.x, ng-packagr 16, angular-eslint 16; `@types/node` 16.18.11 pin
  must be revisited when TypeScript moves to 5.x.
- Keep `compilationMode: partial` and the `verify:partial-ivy` gate; the caret-peer expectation
  in the gate follows the workspace major automatically.
- Do not start 15 -> 16 from this branch. Next repository in the 15 wave after Lantern: per the
  playbook order, `iris-widget`, then the applications (retail-web Stage 3 with Canopy 4.0.0 +
  Lantern 5.0.0).

## 11. Decisions not made here (human)

1. Sign-off on the three NEW dev-tree `npm audit` ids (s5): accept via KAN-13 pattern or approve
   npm `overrides` as a dependency-policy exception. Neither applied.
2. `lantern-sdk-release` Jenkins job: set `NODE_VERSION` to 16.20.2 and remove the `nvm use 14`
   Install-stage override (agent label `nodejs16-rhel8` already exists, no new label needed).
3. `northgate-mock-external/scripts/publish-internal.sh`: `use_node 14.21.3` for `lantern-sdk`
   should become 16.20.2 (follow `.nvmrc`); other repository, not changed here.
4. Release train for 5.0.0: 2026.10.4 proposed; 2026.10.2 (with 3.0.0 / 4.0.0) if Stage 3 needs it
   earlier. Release manager.
5. No public API break, no new agent label and no threshold change were needed, so nothing else
   is pending on a human for this hop.
