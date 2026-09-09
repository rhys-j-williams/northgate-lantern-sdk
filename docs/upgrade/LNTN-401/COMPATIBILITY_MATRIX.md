<!-- Generated with AI assistance (AIT-014) on 2026-09-08, 15 column added 2026-09-09; reviewed by <handle>. -->
# LNTN-401 compatibility matrix: Angular 12 -> 13 -> 14 -> 15

Repository: `northgate-lantern-sdk` (`@northgate/lantern-sdk`). Hops 12.2.17 -> 13.4.0 (PR #3, merged),
13.4.0 -> 14.3.0 (KAN-14, merged) and 14.3.0 -> 15.2.10 (this hop, Stage 2 of the estate 14 -> 15 wave,
KAN-23; Lantern 15 -> 16 is blocked on LNTN-140 / KAN-24). Source for the framework ranges:
https://angular.dev/reference/versions (rows "13.3.x || 13.4.x", "14.2.x || 14.3.x" and "15.2.x"). Everything
else is taken from each package's own `peerDependencies` at the pinned version in `package-lock.json`.
One column per hop; a hop only reads its own column and the one to its left.

## Framework and toolchain

| item | 12 baseline | 13 (PR #3) | official 13.3/13.4 range | 14 (KAN-14) | official 14.2/14.3 range | 15 target | official 15.2 range | in range |
|---|---|---|---|---|---|---|---|---|
| `@angular/*` (animations, common, compiler, core, forms, platform-browser, platform-browser-dynamic, router) | 12.2.17 | 13.4.0 | 13.x, all at one exact version | 14.3.0 | 14.x, all at one exact version (14.3.0 is the last 14.x runtime release) | **15.2.10** | 15.x, all at one exact version (15.2.10 is the last 15.x runtime release; `ng update` preview offered 15.2.9, see `14-to-15/ng-update-preview.log`) | yes |
| `@angular/compiler-cli` | 12.2.17 | 13.4.0 | same as `@angular/core` | 14.3.0 | same as `@angular/core`; peer `typescript >=4.6.2 <4.9` | **15.2.10** | same as `@angular/core`; peer `typescript >=4.8.2 <5.0` | yes |
| `@angular/cli`, `@angular-devkit/build-angular` | 12.2.18 | 13.3.11 | 13.x | 14.2.13 | 14.x (last 14.x CLI release; `ng update` preview offered 14.2.9, see `13-to-14/ng-update-preview.log`) | **15.2.11** | 15.x (last 15.x CLI release); engines `node ^14.20.0 \|\| ^16.13.0 \|\| >=18.10.0`, `npm ^6.11.0 \|\| ^7.5.6 \|\| >=8.0.0` | yes |
| `ng-packagr` | 12.2.7 | 13.3.1 | 13.x | 14.2.2 | 14.x with peer `@angular/compiler-cli ^14.0.0`, `typescript >=4.6.2 <4.9`, `tslib ^2.3.0`. Not 14.3.0: its published peer is `@angular/compiler-cli ^15.0.0-next`, which would not resolve against 14.3.0 | **15.2.2** | 15.x (last 15.x) with peer `@angular/compiler-cli ^15.0.0`, `typescript >=4.8.2 <5.0`, `tslib ^2.3.0` | yes |
| TypeScript | 4.3.5 | 4.6.4 | `>=4.4.3 <4.7.0` | 4.7.4 | `>=4.6.2 <4.8.0` (last 4.7.x) | **4.9.5** | `>=4.8.2 <5.0.0` (last 4.9.x; what `ng update @angular/core@15` migrates to) | yes |
| RxJS | 6.6.7 | 6.6.7 | `^6.5.3 \|\| ^7.4.0` | 6.6.7 (unchanged) | `^6.5.3 \|\| ^7.4.0`; kept on 6 because retail-web is on RxJS 6 and the published peer stays `>=6.5.0 <7.0.0` | **7.8.1** | `^6.5.3 \|\| ^7.4.0`; moved to 7 (ADR 0003): retail-web is on RxJS 7.5.7, published peer becomes `^7.5.0` | yes |
| zone.js | 0.11.4 | 0.11.4 | `~0.11.4` | 0.11.4 (unchanged) | `~0.11.4 \|\| ~0.12.0` (`@angular/core@14.3.0` peer); zone.js is a dev/test dependency only, the library does not ship it | **0.12.0** | `~0.11.4 \|\| ~0.12.0 \|\| ~0.13.0` (`@angular/core@15.2.10` peer); dev/test only | yes |
| tslib | 2.3.1 | 2.3.1 | `^2.3.0` | 2.3.1 (unchanged) | `^2.3.0` | 2.3.1 (unchanged) | `^2.3.0` | yes |
| Node | 14.21.3 (`.nvmrc`, `engines`) | 14.21.3 | `^12.20.0 \|\| ^14.15.0 \|\| ^16.10.0` | 14.21.3 (unchanged) | `^14.15.0 \|\| ^16.10.0`; nothing in the 14 tree needs Node 16, so `.nvmrc` and `engines` stay as they are (ADR 0002) | **16.20.2** (`.nvmrc`, `engines`) | `^14.20.0 \|\| ^16.13.0 \|\| ^18.10.0`; estate agent `nodejs16-rhel8` (platform-tooling README); Node 18 deferred (ADR 0003) | yes |
| npm | 6.14.18 | 6.14.18 | any | 6.14.18 (unchanged; lockfile v1, regenerated with this npm) | `@angular/cli@14` engines `^6.11.0 \|\| ^7.5.6 \|\| >=8.0.0` | **8.19.4** (bundled with Node 16.20.2; `engines.npm`; lockfile v2 regenerated) | `@angular/cli@15` engines `^6.11.0 \|\| ^7.5.6 \|\| >=8.0.0` | yes |
| Angular Material / CDK | not used | not used | - | not used | - | not used | - | n/a |
| `@angular/flex-layout` | not used | not used | - | not used | - | not used | - | n/a |

## Library output format

| item | 12 baseline | 13 (PR #3) | 14 (KAN-14) | 15 target |
|---|---|---|---|---|
| `angularCompilerOptions` | `enableIvy: false`, `skipTemplateCodegen`, `strictMetadataEmit`, `enableResourceInlining` (View Engine) | `compilationMode: "partial"` (Ivy partial, linked by the consumer's `@angular/compiler-cli` linker) | `compilationMode: "partial"` (unchanged) | `compilationMode: "partial"` (unchanged) |
| Distribution bundles | `bundles/*.umd.js`, `esm2015/`, `fesm2015/`, `*.metadata.json` | `esm2020/`, `fesm2015/`, `fesm2020/` (`.mjs`); no UMD, no `metadata.json` (ng-packagr 13 / APF 13) | same layout (ng-packagr 14 / APF 14): `esm2020/`, `fesm2015/`, `fesm2020/`, no UMD, no `metadata.json` | same layout (ng-packagr 15 / APF 15): `esm2020/`, `fesm2015/`, `fesm2020/`, `index.d.ts`, no UMD, no `metadata.json`; `ɵɵngDeclare*` `version: "15.2.10"`, `minVersion` unchanged (12.0.0 / 14.0.0) |
| Release gate | `scripts/verify-view-engine.js` | `scripts/verify-partial-ivy.js` (same publish flow) | `scripts/verify-partial-ivy.js` (peer-range check follows `@angular/core` major, now 14) | `scripts/verify-partial-ivy.js` (expects caret form `^<major>.0.0`, now `^15.0.0`, and `rxjs ^7.5.0`) |
| Consumer install | `ngcc` in the consumer `postinstall` compiles the package | no `ngcc` step needed for this package; linker runs inside the consumer's build | unchanged; retail-web's `postinstall` `ngcc` finds nothing to process for this package | unchanged; linker in the consumer's `@angular/compiler-cli` 15 (verified in the Angular 15.2 scratch host, `14-to-15/CONSUMERS.md`) |

## Published package (`projects/lantern-sdk/package.json`)

| field | 2.4.1 | 3.0.0 | 4.0.0 | 5.0.0 |
|---|---|---|---|---|
| `version` | 2.4.1 | 3.0.0 (semver major: peer range and output format change) | 4.0.0 (semver major: Angular peer range moves to 14) | **5.0.0** (semver major: Angular peer range moves to 15, rxjs peer to 7, build platform Node 16) |
| `peerDependencies.@angular/common`, `core`, `router` | `>=12.0.0 <13.0.0` | `>=13.0.0 <14.0.0` | `>=14.0.0 <15.0.0` | **`^15.0.0`** |
| `peerDependencies.rxjs` | `>=6.5.0 <7.0.0` | `>=6.5.0 <7.0.0` | `>=6.5.0 <7.0.0` (unchanged) | **`^7.5.0`** |
| `dependencies.tslib` | 2.3.1 | 2.3.1 | 2.3.1 | 2.3.1 |
| `SDK_VERSION` (`lantern.service.ts`, `data-lantern-sdk` attribute and `sdk` field of the page event) | 2.4.1 | 3.0.0 | 4.0.0 | **5.0.0** |

## Third-party dev dependencies

| package | 12 baseline | 13 (PR #3) | 14 (KAN-14) | 15 target | peer / compatibility note for 15 |
|---|---|---|---|---|---|
| `@angular-eslint/builder`, `eslint-plugin`, `eslint-plugin-template`, `schematics`, `template-parser` | - | 13.5.0 | 14.4.0 | **15.2.1** | angular-eslint 15.x line (last 15.x); `schematics` peer `@angular/cli >= 15.0.0 < 16.0.0`, others peer `eslint ^7.20.0 \|\| ^8.0.0`, `typescript *`. Its v15 migration wrote `@angular-eslint/schematics` defaults into `angular.json` and caret ranges for `@typescript-eslint/*` / `eslint`, which were re-pinned exact |
| `@typescript-eslint/eslint-plugin`, `parser` | - | 5.27.1 | 5.43.0 | 5.43.0 (unchanged) | kept at the 14-hop pin: the angular-eslint v15 schematic wrote `^5.43.0` (re-pinned exact); `@angular-eslint/*@15.2.1` bundles its own `@typescript-eslint/utils` 5.48.2 and resolves cleanly next to it (`npm ls` clean). Peer `eslint ^6.0.0 \|\| ^7.0.0 \|\| ^8.0.0`, plugin peer `@typescript-eslint/parser ^5.0.0`; supports TS 4.9 |
| `eslint` | - | 8.57.1 | 8.57.1 | 8.57.1 | last eslint 8; in `@angular-eslint@15` peer range; eslint 9 is out of matrix |
| `tslint` | 6.1.3 | removed | - | - | |
| `codelyzer` | 6.0.2 | removed | - | - | |
| `@types/jasmine` | 3.8.2 | 3.8.2 | 3.8.2 | 3.8.2 | matches `jasmine-core` 3.8 |
| `@types/node` | 16.18.11 | 16.18.11 | 16.18.11 | 16.18.11 | matches the Node 16 runtime now in use; newer `@types/node` (>= 22) breaks TS 4.9 (`TS2502 CompressionStream`, seen in the scratch host, `14-to-15/CONSUMERS.md`), so it stays pinned until TS 5 |
| `jasmine-core` | 3.8.0 | 3.8.0 | 3.8.0 | 3.8.0 | `karma-jasmine@4` peer `jasmine-core ^3.6` |
| `karma` | 6.3.20 | 6.3.20 | 6.3.20 | 6.3.20 | `@angular-devkit/build-angular@15` peer `karma ^6.3.0`; Karma replacement is out of matrix |
| `karma-chrome-launcher` | 3.1.1 | 3.1.1 | 3.1.1 | 3.1.1 | |
| `karma-coverage` | 2.0.3 | 2.0.3 | 2.0.3 | 2.0.3 | |
| `karma-jasmine` | 4.0.2 | 4.0.2 | 4.0.2 | 4.0.2 | |
| `karma-jasmine-html-reporter` | 1.7.0 | 1.7.0 | 1.7.0 | 1.7.0 | |

## Consumers and the peer range

| consumer | Angular | Lantern pin today | 3.0.0 (peer `>=13 <14`) | 4.0.0 (peer `>=14 <15`) | 5.0.0 (peer `^15`, rxjs `^7.5`) |
|---|---|---|---|---|---|
| `northgate-retail-web` | 14.3.0, Node 16.20.2, RxJS 7.5.7 | 2.4.1 (`ngcc` in `postinstall`) | not by peer range (retail-web is above 13); partial-Ivy 3.0.0 does link on Angular 14, see `12-to-13/CONSUMERS.md` | **in range**: verified **PASS** in scratch checkouts (`npm ci`, lint, `test:ci`, `build:prod`, `verify-estate.sh`, `estate-up.sh` + `smoke.sh`), see `13-to-14/CONSUMERS.md`; the pin bump to 4.0.0 is a retail-web PR under MOL-4471 | **out of range on Angular 14: FAIL (expected)**, strict-peer install `ERESOLVE` on `@angular/common ^15.0.0`; `legacy-peer-deps=true` only yields `npm ls` `invalid`. 4.0.0 stays in security support (GIS-STD-022 s3). retail-web pins 5.0.0 with Canopy 4.0.0 in Stage 3 (MOL-4471). Candidate verified **PASS** in an Angular 15.2 scratch host (build + 4 specs), see `14-to-15/CONSUMERS.md` |
| `northgate-business-web` | 14.2.12 | none in `package.json` (README lists it as a historical consumer) | not applicable | not applicable | not applicable |
| Beacon ops console | not in the estate | - | not applicable | not applicable | not applicable |

## Known audit exposure that cannot be fixed inside the 13, 14 or 15 matrix

See `12-to-13/REPORT.md`, `13-to-14/REPORT.md` and `14-to-15/REPORT.md` s5, the Jira prerequisite draft
`jira/LNTN-401-xray-carry-over.md` and the GIS risk acceptance KAN-13. Fixing `@angular/*` runtime
advisories needs Angular >= 19.2.x (production `npm audit` id set identical across the 14 and 15 columns).
The 15 hop clears the `semver`, `minimatch` and `webpack-dev-middleware` Highs and takes Xray to High 0,
but the `@angular-devkit/build-angular@15.2.11` / `@angular/cli@15.2.11` tree introduces three dev-only
npm audit ids (`browserslist` GHSA-73wf-gq98-2v4g, GHSA-c83g-rgw3-j3cx; `sigstore` GHSA-52v5-jr5w-gjxr)
whose fix is CLI 22.x; they await a human decision (KAN-13 pattern or npm `overrides` exception).

## Next hop (15 -> 16): blocked

Lantern 15 -> 16 (6.0.0) is blocked on the vendor Ivy build LNTN-140 (Jira KAN-24, HIGHEST): Angular 16
drops the View Engine / `ngcc` compatibility path that the 2.4.1 line and retail-web's `postinstall`
`ngcc` rely on. Constraints are carried in `14-to-15/REPORT.md` s10.
