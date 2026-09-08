<!-- Generated with AI assistance (AIT-014) on 2026-09-08; reviewed by <handle>. -->
# ADR 0001: Upgrade Lantern SDK from Angular 12 to 13 and publish as Ivy partial compilation

Status: Proposed
Date: 2026-09-08
Deciders: Digital Analytics Enablement (owning team), CSWT architecture (`@northgate/cswt-architecture`), GIS AppSec for the dependency findings
Tickets: LNTN-401 (epic), LNTN-361 (Ivy output deferred, superseded here), GIS-2618, TR-1102, LNTN-140

## Context

`@northgate/lantern-sdk` 2.4.1 is the only component in the Northgate CSWT estate below Angular 14
(Angular 12.2.17, Node 14, View Engine, `enableIvy: false`). The estate rule (Northgate Angular upgrade
playbook) is that shared libraries move first and one major at a time, a library is never newer than
its oldest consumer, and an application never newer than the libraries it pins. Lantern therefore has
to catch up 12 -> 13 -> 14 before the estate's 14 -> 15 wave can start, and the estate prerequisite
"Lantern Ivy build before anyone reaches 16" (ngcc is removed in Angular 16; retail-web and business-web
run `ngcc` in `postinstall` today) has to be met on the way.

Angular 12's View Engine library format is compiled by the consumer's `ngcc`. Angular 13 removed View
Engine library support from the CLI and ng-packagr; libraries are published as Ivy partial compilation
and linked by the consumer's compiler. The Angular 12 line is out of vendor support (GIS-2618, TR-1102).

ADR-equivalent decision on record: LNTN-361 (2023) assessed Ivy output and deferred it pending the vendor
script type contract and a Third Party Risk assessment. Neither concerns the compilation format of this
wrapper; the vendor script is loaded at runtime exactly as before.

## Decision

1. Upgrade the workspace to Angular 13.4.0 / CLI 13.3.11 / ng-packagr 13.3.1 / TypeScript 4.6.4, all
   `@angular/*` at one exact version, Node 14.21.3 and RxJS 6.6.7 unchanged (all inside the official
   13.3/13.4 range, see `docs/upgrade/LNTN-401/COMPATIBILITY_MATRIX.md`).
2. Build the library with `compilationMode: "partial"`. Replace the View Engine release gate
   (`scripts/verify-view-engine.js`) with `scripts/verify-partial-ivy.js`, which fails the release if the
   output contains View Engine metadata, ngcc output or full-Ivy `ɵɵdefine*` code, or if the public API
   or peer range drifts. `scripts/publish.sh` calls it on the `dist/` tree and again on the packed tarball.
3. Publish as **3.0.0** with peers `@angular/common|core|router >=13.0.0 <14.0.0`. The peer range and the
   output format change are breaking for consumers, so this is a semver major.
4. Replace TSLint/codelyzer (codelyzer peers Angular < 13) with angular-eslint 13.5.0, mapping the
   existing `tslint.json` rules one to one. No lint rule is dropped.
5. Public API (`LanternModule.forRoot`, `LanternService`, `LanternRouterTracker`, `maskPath`,
   `LanternTrackDirective`, `LanternSessionInterceptor`, `LANTERN_CONFIG`, `LanternConfig`,
   `installQueueStub`) and the GIS-1471 masking rules are unchanged; the verifier asserts the API surface.
6. Stop at 13. The 13 -> 14 hop (which is the version retail-web will actually pin) is a separate branch,
   PR and CAB record under the same epic.

## Consequences

- Consumers on Angular 13 take 3.0.0 with no `ngcc` step for this package. The only live consumer,
  retail-web, is on Angular 14 and stays on 2.4.1 until Lantern's 13 -> 14 hop publishes a release whose
  peer range includes 14; nothing in the estate changes its pin in this PR.
- ng-packagr 13 no longer emits a UMD bundle or `metadata.json`. Anything loading the package through UMD
  (none known in the estate) would break; recorded in `CHANGELOG.md` as a breaking change.
- The workspace estate check (`northgate-cswt-workspace/scripts/verify-estate.sh`) previously asserted View
  Engine output for Lantern; it is updated in a companion workspace PR to expect partial Ivy when the Lantern
  checkout is on Angular >= 13.
- Angular 13 is itself end of life. This hop is an intermediate compatibility step required by the
  one-major-at-a-time rule; it is not a supported resting point and the 13 -> 14 hop follows immediately.
- Xray/npm audit findings that are fixable only by a CLI or framework major outside the 13 matrix are
  carried over with a GIS risk-acceptance request (see `docs/upgrade/LNTN-401/12-to-13/REPORT.md`).

## Alternatives considered

- Jump 12 -> 14 in one PR: forbidden by the playbook (majors are never chained), and it would hide which
  major introduced any regression.
- Stay on View Engine at 13: not possible, Angular 13 tooling does not build View Engine libraries.
- Full Ivy (`compilationMode: "full"`): would tie the package to one exact Angular runtime; partial
  compilation is the Angular Package Format requirement for published libraries.
