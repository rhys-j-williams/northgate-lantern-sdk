<!-- Generated with AI assistance (AIT-014) on 2026-09-09; reviewed by <handle>. -->
# ADR 0003: Upgrade Lantern SDK from Angular 14 to 15 on Node 16 and publish 5.0.0 as Stage 2 of the estate 14 -> 15 wave

Status: Proposed
Date: 2026-09-09
Deciders: Digital Analytics Enablement (owning team), CSWT architecture (`@northgate/cswt-architecture`), GIS AppSec for the dependency findings
Tickets: LNTN-401 (epic), KAN-23 (demo mirror of the 14 -> 15 wave epic; the 13 -> 14 hop was KAN-14), KAN-24 (= LNTN-140 vendor Ivy build, HIGHEST, blocker for the *next* hop), KAN-13 (GIS risk acceptance for the Xray / npm audit carry-over), MOL-4471 (retail-web Stage 3: pins Lantern 5.0.0 and Canopy 4.0.0 together), CNPY-2140 (Stage 1, Canopy 4.0.0)
Supersedes: nothing. Extends ADR 0002 (13 -> 14) by one major. Revisits ADR 0002 decisions 2 (Node) and 3 (RxJS).

## Context

`@northgate/lantern-sdk` 4.0.0 (ADR 0002) is Angular 14.3.0, Ivy partial compilation, peers
`>=14.0.0 <15.0.0`, built on Node 14.21.3 / npm 6. It is level with the estate. The estate now runs its
Angular 14 -> 15 wave in playbook order, libraries first: Stage 1 Canopy 4.0.0 (Angular 15 / Material
MDC, `northgate-canopy-ui` PR #3, open into `develop`, Stage 2 proceeds under a gate waiver on KAN-23);
Stage 2 Lantern (this ADR); Stage 3 retail-web, which pins Canopy 4.0.0 and Lantern 5.0.0 together
(MOL-4471). Lantern has no Canopy dependency, so it does not wait for PR #3 to merge.

The only live consumer, retail-web, is on Angular 14.3.0, Node 16.20.2, RxJS **7.5.7** (ADR 0002 said
RxJS 6; the scratch `npm ls` in `docs/upgrade/LNTN-401/14-to-15/consumers/` shows 7.5.7) and still pins
2.4.1 (View Engine, `ngcc` in `postinstall`). Angular 15 (15.2.x row of https://angular.dev/reference/versions)
supports Node `^14.20.0 || ^16.13.0 || ^18.10.0`, TypeScript `>=4.8.2 <5.0.0`, RxJS `^6.5.3 || ^7.4.0`,
zone.js `~0.11.4 || ~0.12.0 || ~0.13.0`. Angular 14 is out of support; Xray flags `@angular/core@14.3.0`
and `node@14.21.3` as High (NORTHGATE-EOL-ANGULAR / NODE14).

## Decision

1. Upgrade the workspace to Angular **15.2.10** (all `@angular/*` and `@angular/compiler-cli` at that one
   exact version, the last 15.x runtime), CLI / `@angular-devkit/build-angular` **15.2.11** (last 15.x
   CLI), ng-packagr **15.2.2**, TypeScript **4.9.5**, zone.js **0.12.0**, angular-eslint **15.2.1** with
   `@typescript-eslint/*` **5.43.0** and eslint 8.57.1 (unchanged, re-pinned exact after the schematic
   wrote `^`). Exact pins throughout (`docs/upgrade/LNTN-401/COMPATIBILITY_MATRIX.md`, column "15 target").
   One major only; 16/17/18 are not touched.
2. **Node moves to 16.20.2, npm 8.19.4** (`.nvmrc`, `engines`). Revisits ADR 0002 decision 2: the
   condition there ("moving Node has to change `.nvmrc`, `engines` and the pipeline agent together") is
   now met cheaply because the `lantern-sdk-release` job already runs on the supported estate agent
   `nodejs16-rhel8` (Node 16.20.2 / npm 8.19.4) with an `nvm use 14` override that only has to be removed
   (platform-tooling `jenkins-shared-library/README.md`; job parameter `NODE_VERSION` must match
   `.nvmrc`). No new agent label is needed. Node 18 is *not* taken: it is a platform decision for the
   whole estate and nothing in the 15 tree needs it. `package-lock.json` is regenerated with npm 8
   (lockfileVersion 2) and proven with a clean `npm ci`.
3. **RxJS moves to 7.8.1 in the workspace and the published peer becomes `rxjs ^7.5.0`.** Revisits ADR
   0002 decision 3: the reason to stay on 6 (retail-web on RxJS 6) no longer holds, retail-web is on
   7.5.7, and every Angular 15 consumer the estate will have is on RxJS 7. `^7.5.0` rather than `^7.4.0`
   so that the floor is retail-web's actual version and the range never admits a consumer we have not
   tested against. No source change was needed; the library uses `Subject`, `filter` and `Observable`
   only.
4. Publish as **5.0.0** with peers `@angular/common|core|router ^15.0.0`. The Angular peer range drops
   Angular 14 consumers and the rxjs peer drops RxJS 6, both breaking by semver, hence a major. Caret form
   (`^15.0.0`) instead of `>=15.0.0 <16.0.0`: same semantics, and it is the form the 15-wave playbook
   uses for Canopy 4.0.0; `scripts/verify-partial-ivy.js` now expects `^<major>.0.0` and `^7.5.0`.
   `SDK_VERSION` in `lantern.service.ts` (the `data-lantern-sdk` attribute and the `sdk` field of the
   events) moves to 5.0.0 with it.
5. Output format is unchanged: `compilationMode: "partial"`, APF `esm2020/`, `fesm2015/`, `fesm2020/`,
   `index.d.ts`, no UMD, no `metadata.json`. The CLI 15 migration sets the TypeScript `target` to
   ES2022 with `useDefineForClassFields: false` (the migration text calls it IDE-facing; ng-packagr sets
   the emit target for the APF bundles itself, and `bundle-sizes.log` shows the same `fesm2015` /
   `fesm2020` / `esm2020` file set within 20 bytes of 4.0.0). `test.ts` loses the `require.context` spec discovery (Karma builder 15 finds the
   specs itself; the same 21 run).
6. Public API (`LanternModule.forRoot`, `LanternService`, `LanternRouterTracker`, `maskPath`,
   `LanternTrackDirective`, `LanternSessionInterceptor`, `LANTERN_CONFIG`, `LanternConfig`,
   `installQueueStub`), the `X-Analytics-Session` header, the GIS-1471 masking rules and the vendor
   queue contract are unchanged; the existing 21 specs pass with no behavioural edit (only the two
   literals that assert the release version move from 4.0.0 to 5.0.0) and the verifier asserts the
   API surface. No public API break; nothing for a human to decide there.
7. Consumer proof before release: retail-web (Angular 14) is *below* the new peer range, so its
   result is recorded as **FAIL (expected)**: the strict-peer install of the 5.0.0 tarball in a scratch
   worktree stops with `ERESOLVE` on `@angular/common ^15.0.0`, and retail-web's committed
   `legacy-peer-deps=true` only turns that into `npm ls` `invalid` entries. It is not forced past the
   range. The candidate is verified functionally in a scratch **Angular 15.2 host** (`ng new` 15.2.11,
   pinned to 15.2.10 / RxJS 7.5.7 / TS 4.9.5 / zone.js 0.12.0): production build and 4 integration
   specs covering `forRoot`, router page tracking with masking, `lanternTrack` and the interceptor
   (`docs/upgrade/LNTN-401/14-to-15/CONSUMERS.md`, result **PASS**). retail-web pins 5.0.0 in Stage 3.
8. **4.0.0 stays in security support** until retail-web has moved to 5.0.0 or for 90 days after the
   5.0.0 publish, whichever is first (GIS-STD-022 s3); stated in `CHANGELOG.md`, `README.md` and the
   hop report. Patches for the Angular 14 line, if any, are cut as 4.0.x from the 4.0.0 release tag.
9. Stop at 15. Lantern 15 -> 16 is **blocked** on the vendor Ivy build LNTN-140 (KAN-24, HIGHEST):
   Angular 16 drops the View Engine / `ngcc` compatibility path that the 2.4.1 line and retail-web's
   `postinstall` `ngcc` depend on. That blocker applies to the next hop, not to this one. The
   constraints for 15 -> 16 are listed in the hop report s10 ("Next-hop constraints").

## Consequences

- retail-web cannot pin 5.0.0 until it is on Angular 15 (Stage 3, MOL-4471); that is intended. In the
  meantime 4.0.0 is the supported Lantern for Angular 14 consumers (verified PASS in the 13 -> 14
  evidence) and stays in security support as above.
- The build platform for this repository is Node 16 from here on: `nvm use` picks 16.20.2, the release
  job's `NODE_VERSION` must be set to 16.20.2 (job configuration, recorded as a decision for the DAE
  release engineer), and `northgate-mock-external/scripts/publish-internal.sh` should stop selecting
  14.21.3 for `lantern-sdk` (other repository, follow-up).
- Xray goes from Critical 0 / High 3 (gate FAILED on the 14 baseline) to Critical 0 / High 0 / Medium 7
  / Low 3 (gate PASSED): the EOL Angular and Node findings drop to Medium and `webpack-dev-middleware`
  5.3.3 is gone. The production `npm audit` id set is identical to the baseline (Angular runtime
  advisories fixed only in Angular >= 19.2.x). The full-tree `npm audit` has **three new dev-only ids**
  (`sigstore` GHSA-52v5-jr5w-gjxr via `@angular/cli`'s `pacote`; `browserslist` GHSA-73wf-gq98-2v4g and
  GHSA-c83g-rgw3-j3cx via build-angular / Babel). They are not accepted here and `npm audit fix --force`
  was not run (it would install CLI 22.x); GIS + DAE decide between the KAN-13 acceptance pattern and an
  npm 8 `overrides` exception (hop report s5, `new_jira_items_needed`).
- Angular 15 is out of long term support too; the estate keeps moving (Stage 3 next, then 15 -> 16 once
  LNTN-140 lands). Node 16 is EOL but is the supported estate agent; Node 18 is a separate decision.
- `angular.json` gains the angular-eslint schematics defaults and validates against the CLI 15.2.11
  schema; no builder or budget change.

## Alternatives considered

- Keep Node 14.21.3: allowed by Angular 15 (`^14.20.0`) but Node 14 is two years EOL, the Angular 15
  CLI tree pulls packages that warn on it, and the release agent is already Node 16. Rejected; the
  playbook mandates 16.20.2 for this hop.
- Node 18.x: inside the Angular 15 range, but no supported estate agent label exists for it and it
  would couple the hop with a platform decision. Deferred to the 15 -> 16 planning.
- Keep RxJS 6.6.7 and peer `>=6.5.0 <7.0.0`: allowed, but it would leave the library one RxJS major
  behind every consumer and force a second breaking release later. Rejected.
- Dual rxjs peer `^6.5.3 || ^7.4.0`: this wrapper cannot test both lines in one workspace and no
  consumer needs 6. Rejected.
- Peer `>=15.0.0 <16.0.0` (the 3.0.0 / 4.0.0 form): equivalent range; caret chosen to match Canopy
  4.0.0 and the wave playbook. The verifier was updated so that the gate stays exact about the form.
- `ng update`-ing the retail-web scratch checkout to Angular 15 as the consumer host: rejected in
  favour of a minimal `ng new` 15.2 host, because retail-web's own 15 hop (Material MDC, Canopy 4,
  ngrx 15) is Stage 3's work and a throwaway half-migration would not isolate Lantern.
- Continue to 16 in this branch: forbidden by the playbook (majors never chained) and blocked by
  LNTN-140 / KAN-24.
