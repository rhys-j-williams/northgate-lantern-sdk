<!-- Generated with AI assistance (AIT-014) on 2026-09-08; reviewed by <handle>. -->
# LNTN-401 compatibility matrix: Angular 12 -> 13 -> 14

Repository: `northgate-lantern-sdk` (`@northgate/lantern-sdk`). Hops 12.2.17 -> 13.4.0 (PR #3, merged)
and 13.4.0 -> 14.3.0 (this hop), wave position: shared library, first repository of the estate
catch-up (Lantern 12 -> 13 -> 14 before the estate 14 -> 15 wave). Source for the framework ranges:
https://angular.dev/reference/versions (rows "13.3.x || 13.4.x" and "14.2.x || 14.3.x"). Everything
else is taken from each package's own `peerDependencies` at the pinned version in `package-lock.json`.
One column per hop; a hop only reads its own column and the one to its left.

## Framework and toolchain

| item | 12 baseline | 13 (PR #3) | official 13.3/13.4 range | 14 target | official 14.2/14.3 range | in range |
|---|---|---|---|---|---|---|
| `@angular/*` (animations, common, compiler, core, forms, platform-browser, platform-browser-dynamic, router) | 12.2.17 | 13.4.0 | 13.x, all at one exact version | **14.3.0** | 14.x, all at one exact version (14.3.0 is the last 14.x runtime release) | yes |
| `@angular/compiler-cli` | 12.2.17 | 13.4.0 | same as `@angular/core` | **14.3.0** | same as `@angular/core`; peer `typescript >=4.6.2 <4.9` | yes |
| `@angular/cli`, `@angular-devkit/build-angular` | 12.2.18 | 13.3.11 | 13.x | **14.2.13** | 14.x (last 14.x CLI release; `ng update` preview offered 14.2.9, see `13-to-14/ng-update-preview.log`) | yes |
| `ng-packagr` | 12.2.7 | 13.3.1 | 13.x | **14.2.2** | 14.x with peer `@angular/compiler-cli ^14.0.0`, `typescript >=4.6.2 <4.9`, `tslib ^2.3.0`. Not 14.3.0: its published peer is `@angular/compiler-cli ^15.0.0-next`, which would not resolve against 14.3.0 | yes |
| TypeScript | 4.3.5 | 4.6.4 | `>=4.4.3 <4.7.0` | **4.7.4** | `>=4.6.2 <4.8.0` (last 4.7.x) | yes |
| RxJS | 6.6.7 | 6.6.7 | `^6.5.3 \|\| ^7.4.0` | 6.6.7 (unchanged) | `^6.5.3 \|\| ^7.4.0`; kept on 6 because retail-web is on RxJS 6 and the published peer stays `>=6.5.0 <7.0.0` | yes |
| zone.js | 0.11.4 | 0.11.4 | `~0.11.4` | 0.11.4 (unchanged) | `~0.11.4 \|\| ~0.12.0` (`@angular/core@14.3.0` peer); zone.js is a dev/test dependency only, the library does not ship it | yes |
| tslib | 2.3.1 | 2.3.1 | `^2.3.0` | 2.3.1 (unchanged) | `^2.3.0` | yes |
| Node | 14.21.3 (`.nvmrc`, `engines`) | 14.21.3 | `^12.20.0 \|\| ^14.15.0 \|\| ^16.10.0` | 14.21.3 (unchanged) | `^14.15.0 \|\| ^16.10.0`; nothing in the 14 tree needs Node 16, so `.nvmrc` and `engines` stay as they are (ADR 0002) | yes |
| npm | 6.14.18 | 6.14.18 | any | 6.14.18 (unchanged; lockfile v1, regenerated with this npm) | `@angular/cli@14` engines `^6.11.0 \|\| ^7.5.6 \|\| >=8.0.0` | yes |
| Angular Material / CDK | not used | not used | - | not used | - | n/a |
| `@angular/flex-layout` | not used | not used | - | not used | - | n/a |

## Library output format

| item | 12 baseline | 13 (PR #3) | 14 target |
|---|---|---|---|
| `angularCompilerOptions` | `enableIvy: false`, `skipTemplateCodegen`, `strictMetadataEmit`, `enableResourceInlining` (View Engine) | `compilationMode: "partial"` (Ivy partial, linked by the consumer's `@angular/compiler-cli` linker) | `compilationMode: "partial"` (unchanged) |
| Distribution bundles | `bundles/*.umd.js`, `esm2015/`, `fesm2015/`, `*.metadata.json` | `esm2020/`, `fesm2015/`, `fesm2020/` (`.mjs`); no UMD, no `metadata.json` (ng-packagr 13 / APF 13) | same layout (ng-packagr 14 / APF 14): `esm2020/`, `fesm2015/`, `fesm2020/`, no UMD, no `metadata.json` |
| Release gate | `scripts/verify-view-engine.js` | `scripts/verify-partial-ivy.js` (same publish flow) | `scripts/verify-partial-ivy.js` (peer-range check follows `@angular/core` major, now 14) |
| Consumer install | `ngcc` in the consumer `postinstall` compiles the package | no `ngcc` step needed for this package; linker runs inside the consumer's build | unchanged; retail-web's `postinstall` `ngcc` finds nothing to process for this package |

## Published package (`projects/lantern-sdk/package.json`)

| field | 2.4.1 | 3.0.0 | 4.0.0 |
|---|---|---|---|
| `version` | 2.4.1 | 3.0.0 (semver major: peer range and output format change) | **4.0.0** (semver major: Angular peer range moves to 14) |
| `peerDependencies.@angular/common`, `core`, `router` | `>=12.0.0 <13.0.0` | `>=13.0.0 <14.0.0` | **`>=14.0.0 <15.0.0`** |
| `peerDependencies.rxjs` | `>=6.5.0 <7.0.0` | `>=6.5.0 <7.0.0` | `>=6.5.0 <7.0.0` (unchanged) |
| `dependencies.tslib` | 2.3.1 | 2.3.1 | 2.3.1 |
| `SDK_VERSION` (`lantern.service.ts`, `data-lantern-sdk` attribute and `sdk` field of the page event) | 2.4.1 | 3.0.0 | **4.0.0** |

## Third-party dev dependencies

| package | 12 baseline | 13 (PR #3) | 14 target | peer / compatibility note for 14 |
|---|---|---|---|---|
| `@angular-eslint/builder`, `eslint-plugin`, `eslint-plugin-template`, `schematics`, `template-parser` | - | 13.5.0 | **14.4.0** | angular-eslint 14.x line (last 14.x); `schematics` peer `@angular/cli >= 14.0.0 < 15.0.0`, others peer `eslint ^7.0.0 \|\| ^8.0.0`, `typescript *`. The `ng update` preview offers 22.5.0 for `@angular-eslint/schematics` because it has no `ng update` migration path per Angular major; that is out of matrix and is ignored |
| `@typescript-eslint/eslint-plugin`, `parser` | - | 5.27.1 | **5.43.0** | the `@typescript-eslint/utils` version `@angular-eslint/*@14.4.0` depends on; peer `eslint ^6.0.0 \|\| ^7.0.0 \|\| ^8.0.0`, plugin peer `@typescript-eslint/parser ^5.0.0`; supports TS 4.7 |
| `eslint` | - | 8.57.1 | 8.57.1 | last eslint 8; in `@angular-eslint@14` peer range |
| `tslint` | 6.1.3 | removed | - | |
| `codelyzer` | 6.0.2 | removed | - | |
| `@types/jasmine` | 3.8.2 | 3.8.2 | 3.8.2 | matches `jasmine-core` 3.8 |
| `@types/node` | 16.18.11 | 16.18.11 | 16.18.11 | fine on TS 4.7; no reason to move in this hop |
| `jasmine-core` | 3.8.0 | 3.8.0 | 3.8.0 | `karma-jasmine@4` peer `jasmine-core ^3.6` |
| `karma` | 6.3.20 | 6.3.20 | 6.3.20 | `@angular-devkit/build-angular@14` peer `karma ^6.3.0` |
| `karma-chrome-launcher` | 3.1.1 | 3.1.1 | 3.1.1 | |
| `karma-coverage` | 2.0.3 | 2.0.3 | 2.0.3 | |
| `karma-jasmine` | 4.0.2 | 4.0.2 | 4.0.2 | |
| `karma-jasmine-html-reporter` | 1.7.0 | 1.7.0 | 1.7.0 | |

## Consumers and the peer range

| consumer | Angular | Lantern pin today | 3.0.0 (peer `>=13 <14`) | 4.0.0 (peer `>=14 <15`) |
|---|---|---|---|---|
| `northgate-retail-web` | 14.3.0, Node 16.20.2, RxJS 6 | 2.4.1 | not by peer range (retail-web is above 13); partial-Ivy 3.0.0 does link on Angular 14, see `12-to-13/CONSUMERS.md` | **in range**: verified **PASS** in scratch checkouts (`npm ci`, lint, `test:ci`, `build:prod`, `verify-estate.sh`, `estate-up.sh` + `smoke.sh`), see `13-to-14/CONSUMERS.md`; the pin bump to 4.0.0 is a retail-web PR under MOL-4471 |
| `northgate-business-web` | 14.2.12 | none in `package.json` (README lists it as a historical consumer) | not applicable | not applicable |
| Beacon ops console | not in the estate | - | not applicable | not applicable |

## Known audit exposure that cannot be fixed inside the 13 or 14 matrix

See `12-to-13/REPORT.md` and `13-to-14/REPORT.md` section "Audit", the Jira prerequisite draft
`jira/LNTN-401-xray-carry-over.md` and the GIS risk acceptance KAN-13. Fixing `@angular/*` runtime
advisories needs Angular >= 17/19; fixing the `@angular-devkit/build-angular@14.2.13` transitive
advisories (`semver`, `minimatch`, `webpack-dev-middleware`) needs a CLI major outside this hop.
