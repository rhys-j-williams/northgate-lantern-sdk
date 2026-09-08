<!-- Generated with AI assistance (AIT-014) on 2026-09-08; reviewed by <handle>. -->
# LNTN-401 compatibility matrix: Angular 12 -> 13

Repository: `northgate-lantern-sdk` (`@northgate/lantern-sdk`). Hop 12.2.17 -> 13.4.0, wave
position: shared library, first repository of the estate catch-up (Lantern 12 -> 13 -> 14 before
the estate 14 -> 15 wave). Source for the framework ranges:
https://angular.dev/reference/versions (row "13.3.x || 13.4.x"). Everything else is taken from
each package's own `peerDependencies` at the pinned version in `package-lock.json`.

## Framework and toolchain

| item | 12 baseline | 13 target | official 13.3/13.4 range | in range |
|---|---|---|---|---|
| `@angular/*` (animations, common, compiler, core, forms, platform-browser, platform-browser-dynamic, router) | 12.2.17 | **13.4.0** | 13.x, all at one exact version | yes |
| `@angular/compiler-cli` | 12.2.17 | 13.4.0 | same as `@angular/core` | yes |
| `@angular/cli`, `@angular-devkit/build-angular` | 12.2.18 | **13.3.11** | 13.x (last 13.x CLI release) | yes |
| `ng-packagr` | 12.2.7 | **13.3.1** | 13.x, peer `@angular/compiler-cli ^13.0.0`, `typescript >=4.4.3 <4.7` | yes |
| TypeScript | 4.3.5 | **4.6.4** | `>=4.4.3 <4.7.0` | yes |
| RxJS | 6.6.7 | 6.6.7 (unchanged) | `^6.5.3 \|\| ^7.4.0` | yes |
| zone.js | 0.11.4 | 0.11.4 (unchanged) | `~0.11.4` (`@angular/core@13.4.0` peer) | yes |
| tslib | 2.3.1 | 2.3.1 (unchanged) | `^2.3.0` | yes |
| Node | 14.21.3 (`.nvmrc`, `engines`) | 14.21.3 (unchanged) | `^12.20.0 \|\| ^14.15.0 \|\| ^16.10.0` | yes |
| npm | 6.14.18 | 6.14.18 (unchanged; lockfile v1) | any | yes |
| Angular Material / CDK | not used | not used | - | n/a |
| `@angular/flex-layout` | not used | not used | - | n/a |

## Library output format

| item | 12 baseline | 13 target |
|---|---|---|
| `angularCompilerOptions` | `enableIvy: false`, `skipTemplateCodegen`, `strictMetadataEmit`, `enableResourceInlining` (View Engine) | `compilationMode: "partial"` (Ivy partial, linked by the consumer's `@angular/compiler-cli` linker) |
| Distribution bundles | `bundles/*.umd.js`, `esm2015/`, `fesm2015/`, `*.metadata.json` | `esm2020/`, `fesm2015/`, `fesm2020/` (`.mjs`); no UMD, no `metadata.json` (ng-packagr 13 / APF 13) |
| Release gate | `scripts/verify-view-engine.js` | `scripts/verify-partial-ivy.js` (same publish flow) |
| Consumer install | `ngcc` in the consumer `postinstall` compiles the package | no `ngcc` step needed for this package; linker runs inside the consumer's build |

## Published package (`projects/lantern-sdk/package.json`)

| field | 2.4.1 | 3.0.0 |
|---|---|---|
| `version` | 2.4.1 | **3.0.0** (semver major: peer range and output format change) |
| `peerDependencies.@angular/common`, `core`, `router` | `>=12.0.0 <13.0.0` | `>=13.0.0 <14.0.0` |
| `peerDependencies.rxjs` | `>=6.5.0 <7.0.0` | `>=6.5.0 <7.0.0` (unchanged) |
| `dependencies.tslib` | 2.3.1 | 2.3.1 |

## Third-party dev dependencies

| package | 12 baseline | 13 target | peer / compatibility note |
|---|---|---|---|
| `@angular-eslint/builder`, `eslint-plugin`, `eslint-plugin-template`, `schematics`, `template-parser` | - | **13.5.0** | angular-eslint 13.x line, peers `@angular/compiler ^13.0.0`, `eslint ^7.20.0 \|\| ^8.0.0`, `typescript >=4.4.3 <4.7.0` |
| `@typescript-eslint/eslint-plugin`, `parser` | - | **5.27.1** | the versions `@angular-eslint/schematics@13.5.0` installs; peer `typescript >=3.3.1 <4.8.0` |
| `eslint` | - | **8.57.1** | last eslint 8; `@angular-eslint/builder@13` peer `^7.20.0 \|\| ^8.0.0` |
| `tslint` | 6.1.3 | removed | CLI 13 dropped the `tslint` builder; TSLint is deprecated |
| `codelyzer` | 6.0.2 | removed | peer `@angular/core >=2 <13`; blocks a clean Angular 13 tree |
| `@types/jasmine` | 3.8.2 | 3.8.2 | matches `jasmine-core` 3.8 |
| `@types/node` | 16.18.11 | 16.18.11 | fine on TS 4.6 (the TS 4.3 `Disposable` pin reason no longer applies; left as is, no reason to move in this hop) |
| `jasmine-core` | 3.8.0 | 3.8.0 | `karma-jasmine@4` peer `jasmine-core ^3.6` |
| `karma` | 6.3.20 | 6.3.20 | `@angular-devkit/build-angular@13` supports karma ^6.3 |
| `karma-chrome-launcher` | 3.1.1 | 3.1.1 | |
| `karma-coverage` | 2.0.3 | 2.0.3 | |
| `karma-jasmine` | 4.0.2 | 4.0.2 | |
| `karma-jasmine-html-reporter` | 1.7.0 | 1.7.0 | |

## Consumers and the peer range

| consumer | Angular | Lantern pin today | can take 3.0.0 (peer `>=13 <14`)? |
|---|---|---|---|
| `northgate-retail-web` | 14.3.0 | 2.4.1 | not by peer range: retail-web is above 13. It pins Lantern again after the Lantern 13 -> 14 hop. Partial-Ivy 3.0.0 does link on Angular 14 (see `12-to-13/CONSUMERS.md`), recorded as evidence for the next hop only. |
| `northgate-business-web` | 14.2.12 | none in `package.json` (README lists it as a historical consumer) | not applicable |
| Beacon ops console | not in the estate | - | not applicable |

## Known audit exposure that cannot be fixed inside the 13 matrix

See `12-to-13/REPORT.md` section "Audit" and the Jira prerequisite draft `jira/LNTN-401-xray-carry-over.md`.
Fixing `@angular/*` runtime advisories needs Angular >= 17/19; fixing the `@angular-devkit/build-angular@13.3.11`
transitive advisories (`semver`, `minimatch`, `webpack-dev-middleware`) needs a CLI major outside this hop.
