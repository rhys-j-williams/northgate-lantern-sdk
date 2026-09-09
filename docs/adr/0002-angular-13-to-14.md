<!-- Generated with AI assistance (AIT-014) on 2026-09-08; reviewed by <handle>. -->
# ADR 0002: Upgrade Lantern SDK from Angular 13 to 14 and publish 4.0.0 for the Angular 14 consumers

Status: Proposed
Date: 2026-09-08
Deciders: Digital Analytics Enablement (owning team), CSWT architecture (`@northgate/cswt-architecture`), GIS AppSec for the dependency findings
Tickets: LNTN-401 (epic), KAN-1 (demo mirror of the epic), KAN-13 (GIS risk acceptance for the Xray / npm audit carry-over), MOL-4471 (retail-web pin bump, separate PR)
Supersedes: nothing. Extends ADR 0001 (12 -> 13, PR #3) by one major.

## Context

`@northgate/lantern-sdk` 3.0.0 (ADR 0001) is Angular 13.4.0, Ivy partial compilation, peers
`>=13.0.0 <14.0.0`. Nobody in the estate can pin it: the only live consumer, retail-web, is on Angular
14.3.0 (Node 16.20.2, RxJS 6) and still pins 2.4.1 (View Engine, processed by its `postinstall` `ngcc`).
The estate rule (Northgate Angular upgrade playbook) is that shared libraries move first and one major
at a time, a library is never newer than its oldest consumer, and an application never newer than the
libraries it pins. The 13 -> 14 hop is therefore the release that lets retail-web drop 2.4.1, and it is
the last Lantern catch-up hop before the estate 14 -> 15 wave (Canopy 4 / MDC first).

Angular 13 is end of life; Angular 14 (14.2.x || 14.3.x row of https://angular.dev/reference/versions)
supports Node `^14.15.0 || ^16.10.0`, TypeScript `>=4.6.2 <4.8.0` and RxJS `^6.5.3 || ^7.4.0`.

## Decision

1. Upgrade the workspace to Angular **14.3.0** (all `@angular/*` and `@angular/compiler-cli` at that one
   exact version), CLI / `@angular-devkit/build-angular` **14.2.13**, ng-packagr **14.2.2**, TypeScript
   **4.7.4**, angular-eslint **14.4.0** with `@typescript-eslint/*` **5.43.0**. Exact pins, lockfile
   regenerated with npm 6.14.18 and verified with a clean `npm ci`
   (`docs/upgrade/LNTN-401/COMPATIBILITY_MATRIX.md`, column "14 target").
   - ng-packagr 14.2.2 rather than 14.3.0: the 14.3.0 release on the registry declares a peer of
     `@angular/compiler-cli ^15.0.0-next`, which does not resolve against 14.3.0.
2. **Node stays 14.21.3** (`.nvmrc`, `engines`). Angular 14 supports `^14.15.0`; nothing in the resolved
   14 tree needs Node 16, and the Digital Analytics Enablement pipeline agents are Node 14 (there is no
   `Jenkinsfile`; `NorthgateDefaults.groovy` in platform-tooling applies). Moving Node is a separate
   decision that would have to change `.nvmrc`, `engines` and the pipeline agent together; it is not
   forced by this hop and is not taken here. The Xray finding `node@14.21.3 NORTHGATE-EOL-NODE14` is
   therefore carried over unchanged (KAN-13).
3. **RxJS stays 6.6.7** and the published peer stays `rxjs >=6.5.0 <7.0.0`. retail-web is on RxJS 6; a
   move to RxJS 7 in the library would either force the consumer or require a dual range that this
   wrapper cannot test. business-web's RxJS 7 move is its own prerequisite in the estate plan.
4. Publish as **4.0.0** with peers `@angular/common|core|router >=14.0.0 <15.0.0`. The peer range change
   drops Angular 13 consumers (there are none in the estate), which is breaking by semver, hence a major.
   `SDK_VERSION` in `lantern.service.ts` (the `data-lantern-sdk` script attribute and the `sdk` field of
   the page event) moves to 4.0.0 with it.
5. Output format is unchanged: `compilationMode: "partial"`, APF `esm2020/`, `fesm2015/`, `fesm2020/`,
   no UMD, no `metadata.json`. `scripts/verify-partial-ivy.js` keeps deriving the expected peer range from
   the workspace `@angular/core` major, so the release gate now requires `>=14.0.0 <15.0.0`.
6. Public API (`LanternModule.forRoot`, `LanternService`, `LanternRouterTracker`, `maskPath`,
   `LanternTrackDirective`, `LanternSessionInterceptor`, `LANTERN_CONFIG`, `LanternConfig`,
   `installQueueStub`), the `X-Analytics-Session` header, the GIS-1471 masking rules and the vendor
   queue contract are unchanged; the existing 21 specs pass with no behavioural edit (only the two
   literals that assert the release version move from 3.0.0 to 4.0.0) and the verifier asserts the
   API surface.
7. Consumer proof before release: retail-web is now inside the peer range, so it is verified as PASS /
   FAIL (not `NOT_SUPPORTED_UNTIL_CONSUMER_HOP`) in scratch checkouts against 4.0.0 from Verdaccio
   (`docs/upgrade/LNTN-401/13-to-14/CONSUMERS.md`; result **PASS**: install, lint, 196 specs,
   production build, `verify-estate.sh retail-web`, `estate-up.sh` + `smoke.sh`, app boot). The
   retail-web pin bump itself is a retail-web PR
   under MOL-4471. business-web has no Lantern dependency (`NOT_APPLICABLE`).
8. Stop at 14. Lantern is then level with the estate (Canopy, Iris, retail-web at 14.3.0). The next
   repository in the wave is `northgate-canopy-ui` (14 -> 15, Canopy 4 / MDC); Lantern's own 14 -> 15
   hop waits until every consumer is on 15.

## Consequences

- retail-web can replace 2.4.1 with 4.0.0 and stop relying on `ngcc` for this package (its `postinstall`
  `ngcc` still runs for other View Engine packages until they are gone; it has nothing to do for
  Lantern 4.0.0). That is one of the "Lantern Ivy build before anyone reaches 16" prerequisites met.
- 3.0.0 stays published on the registry; it has no consumer and is not withdrawn. Rollback of this hop is
  reverting the hop commit on `develop`; 4.0.0 would then be left on Verdaccio only (never Artifactory),
  and no consumer pins it until the retail-web PR under MOL-4471.
- The Angular 14 CLI line still resolves `semver`, `minimatch` and `webpack-dev-middleware` versions with
  known advisories; the `@angular/*@14.3.0` runtime advisories need Angular >= 17/19. Xray stays at
  Critical 0 / High 6 with the same finding ids as the 12 -> 13 baseline; no new High/Critical, no
  threshold or allowlist change, carry-over under the GIS risk acceptance KAN-13.
- Angular 14 is end of life as well. This hop brings Lantern level with the estate; it is not a resting
  point for the estate, which continues with the 14 -> 15 wave (Canopy first).
- `angular.json` migrations for 14 are applied by `ng update` (no builder or schema changes were required
  beyond what the CLI wrote); the file validates against the CLI 14.2.13 schema.

## Alternatives considered

- Move Node to 16.20.2 now (retail-web's Node): not required by any dependency in the 14 tree, and it would
  couple an Angular hop with a pipeline agent change. Deferred; the Xray EOL finding is risk-accepted.
- Move to RxJS 7.x: allowed by Angular 14 but retail-web is on RxJS 6 and would receive two RxJS copies
  or a forced upgrade. Rejected for this hop.
- TypeScript 4.6.4 unchanged: allowed (`>=4.6.2`), but 4.7.4 is the last release inside the 14 range and
  what `ng update @angular/core@14` migrates to; taking it here avoids a second TS bump in the 15 hop.
- Jump 13 -> 15 or continue to 15 in this session: forbidden by the playbook (majors never chained) and
  premature, Lantern 15 would be ahead of every consumer.
