# Changelog

DAE keeps this by hand. Ticket keys are LNTN unless stated.

## 4.0.0 - unreleased (2026.10.2 train)

Semver major: Angular 13 -> 14. Second and last of the two LNTN-401 catch-up hops; Lantern is now
level with the estate (Angular 14) and 4.0.0 is the first release retail-web can pin. ADR
`docs/adr/0002-angular-13-to-14.md`, evidence `docs/upgrade/LNTN-401/13-to-14/`. Public API, config
keys, header name and the GIS-1471 masking rules are unchanged; no migration steps in application
code.

- BREAKING 401: peer range is `@angular/{common,core,router} >=14.0.0 <15.0.0`. Applications on
  Angular 13 stay on 3.0.0. retail-web (Angular 14.3.0) verified PASS against 4.0.0
  (`docs/upgrade/LNTN-401/13-to-14/CONSUMERS.md`); its pin bump is a retail-web PR (MOL-4471).
- 401: Angular 14.3.0, CLI 14.2.13, ng-packagr 14.2.2, TypeScript 4.7.4, angular-eslint 14.4.0.
  Node 14.21.3, RxJS 6.6.7 and zone.js 0.11.4 unchanged. Output still Ivy partial compilation
  (APF 14: entry typings now `index.d.ts`, resolved through `package.json` `typings`).
- 401: TypeScript compilation target es2020 (CLI 14 migration); `angular.json` `defaultProject`
  removed (CLI 14 migration; the npm scripts already name the project).
- 401: `verify:partial-ivy` also checks the rxjs peer range, that the built package version matches
  the workspace version, and that a fesm bundle stamps `SDK_VERSION`.
- 401: `SDK_VERSION` reported as `@northgate/lantern-sdk@4.0.0` in the vendor context.

## 3.0.0 - unreleased (2026.10.2 train)

Semver major: Angular 12 -> 13 and View Engine -> Ivy partial compilation. First of the two
LNTN-401 catch-up hops (13 -> 14 follows as 4.0.0); ADR `docs/adr/0001-angular-12-to-13.md`,
evidence `docs/upgrade/LNTN-401/12-to-13/`. Public API, config keys, header name and the GIS-1471
masking rules are unchanged; no migration steps in application code.

- BREAKING 401: peer range is `@angular/{common,core,router} >=13.0.0 <14.0.0`. Applications on
  Angular 12 stay on 2.4.1; applications on Angular 14 (retail-web) stay on 2.4.1 until 4.0.0.
- BREAKING 401: output is Angular Package Format 13 with `compilationMode: partial`. No UMD bundle,
  no `.metadata.json`, nothing for `ngcc` to process; the consumer's Angular linker handles it.
- 401: Angular 13.4.0, CLI 13.3.11, ng-packagr 13.3.1, TypeScript 4.6.4. Node 14.21.3, RxJS 6.6.7
  and zone.js 0.11.4 unchanged.
- 401: `verify:view-engine` replaced by `verify:partial-ivy` (`scripts/verify-partial-ivy.js`);
  `publish:local` now verifies both `dist/lantern-sdk` and the packed tarball before publishing.
- 401: TSLint and codelyzer removed; lint is angular-eslint 13 with the same rule intent
  (`lantern` selector prefix, lifecycle interfaces, no input/output rename, template checks).
- 401: specs for session resume inside / outside the 30 minute idle window and for the `debug`
  flag; `SDK_VERSION` reported as `@northgate/lantern-sdk@3.0.0` in the vendor context.

## 2.4.1 - 2024-05-21

- 437: `sessionId()` no longer throws when sessionStorage is disabled by group policy (branch PCs)
- 439: directive falls back to `data-lantern-event` when Canopy wraps the host element (CNPY-1032)
- deps: tslib 2.3.1 declared as a dependency instead of a peer

## 2.4.0 - 2024-03-12

- 402: `reset()` rotates the local analytics session as well as calling the vendor's reset
- 411: `debug` config flag
- 412: `verify:view-engine` release gate
- 419: `appName` / `appVersion` context on every event

## 2.3.2 - 2023-11-02

- 388: refuse to start when writeKey is empty rather than sending anonymous events

## 2.3.1 - 2023-09-14

- revert of 2.3.0's `sessionHeaderUrlPrefixes` default change; it broke business-web's mock server
  (MBZ-1877). Default is back to `[]`, applications must set it.

## 2.3.0 - 2023-09-07

- 351: `sessionHeaderUrlPrefixes` (GIS-1471 finding 6)
- 355: header name configurable
- 361: Ivy output assessed, deferred to the vendor relationship team

## 2.2.0 - 2022-11-15

- 302, 310, 314: route masking for ids and query strings, `lanternPage` route data, element text
  masking in the directive. All GIS-1471.
- 319: `identify` takes the opaque customer id only

## 2.1.0 - 2022-04-05

- 219: throw on a second `forRoot()`
- 224: queue stub installed before the vendor script loads
- 231: `@types/node` pinned to 16.18.11 (TS 4.3 cannot parse newer declarations)

## 2.0.0 - 2021-11-09

- renamed from `lantern-angular` to `@northgate/lantern-sdk`, moved to Angular 12.2.x, Node 14
- vendor script served from the Northgate hosted copy (GIS-1188)

## 1.x

Un-scoped `lantern-angular`, Angular 9 then 10. See the old repo, archived.
