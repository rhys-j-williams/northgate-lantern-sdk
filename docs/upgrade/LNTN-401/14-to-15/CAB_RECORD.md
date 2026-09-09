<!-- Generated with AI assistance (AIT-014) on 2026-09-09; reviewed by <handle>. -->
<!-- Draft from northgate-platform-tooling/governance/CAB_TEMPLATE.md (template 4.2, RM-STD-003). Not yet submitted. -->
# Change Advisory Board submission — CSWT

## 1. Record

| field | value |
|---|---|
| CHG number | CHG_______ (assigned by ITSM on save; not an emergency change) |
| Change type | Normal |
| Release train | 2026.10.4 proposed (code freeze Fri 2026-10-16, CAB Tue 2026-10-20, deploy Thu 2026-10-22), the first train after the 3.0.0 / 4.0.0 pair on 2026.10.2 so that the Artifactory version history stays linear. 2026.09.2 froze on 2026-09-04 and cannot take this change; 2026.09.4 is skipped for the Q3 quarter-end freeze. Riding 2026.10.2 as a third CHG on the same `release/2026.10` cut is possible if Stage 3 (retail-web, MOL-4471) needs 5.0.0 on Artifactory earlier: **release manager to decide**. |
| Requested implementation window | Thu 2026-10-22 20:00 to 23:00 ET |
| Requesting team | Digital Analytics Enablement (DAE), Charlotte |
| Change owner (accountable) | TBC (DAE, M2 or above) |
| Implementer | TBC (DAE release engineer running `lantern-sdk-release`) |
| Business sponsor | TBC (Digital Analytics product owner) |
| Application(s) and CMDB app-id(s) | `@northgate/lantern-sdk` (shared library; CMDB app-id TBC from the DAE service record). No deployable application changes in this CHG. |
| Environment(s) | Artifactory `npm-northgate` (package publish only; no prod-east / prod-west deployment) |
| Jira release version | LNTN-401 / 5.0.0 (demo mirror: KAN-23 epic for the 14 -> 15 wave; the 13 -> 14 hop was KAN-14; blocker for the *next* hop KAN-24 = LNTN-140) |
| Evidence bundle | `docs/upgrade/LNTN-401/14-to-15/` on branch `feature/LNTN-401-angular-14-to-15` (Artifactory `generic-cswt-release-evidence` URL to be added by `Jenkinsfile.release`) |

## 2. Summary of change

Framework (Angular major) upgrade of a shared library, Stage 2 of the estate's Angular 14 -> 15 wave
(Stage 1: Canopy 4.0.0, `northgate-canopy-ui` PR #3, open; Stage 3: retail-web pins Canopy 4.0.0 and
Lantern 5.0.0 together under MOL-4471). `@northgate/lantern-sdk`, the Angular wrapper for the
Lumenview Lantern analytics script, moves from Angular 14.3.0 to Angular 15.2.10 and is published as
5.0.0 (semver major because the peer range becomes `@angular/* ^15.0.0` and `rxjs ^7.5.0`, and the
build platform moves from Node 14.21.3 to Node 16.20.2). Lantern has no Canopy dependency; it moves
now because libraries move before applications in the wave. retail-web (Angular 14.3.0) is *outside*
5.0.0's peer range by design: the scratch verification records the expected `ERESOLVE` and an
Angular 15.2 scratch host confirms the module, router tracking, directive and interceptor
(`CONSUMERS.md`). retail-web does **not** change its pin in this CHG. Output stays Ivy partial
compilation (no `ngcc` processing), the public API, the `X-Analytics-Session` header and the
GIS-1471 masking behaviour are unchanged. **4.0.0 (Angular 14 line) stays in security support until
retail-web has moved to 5.0.0 or for 90 days after this publish, whichever is first (GIS-STD-022 s3).**

## 3. Scope

### In scope

| component | from | to | change |
|---|---|---|---|
| `northgate-lantern-sdk` / `@northgate/lantern-sdk` | 4.0.0 (tag `lantern-sdk-v4.0.0`, Angular 14.3.0, Node 14.21.3, partial Ivy) | 5.0.0 (tag `lantern-sdk-v5.0.0`, Angular 15.2.10, Node 16.20.2, partial Ivy) | framework hop 14 -> 15, peer range `^15.0.0` / `rxjs ^7.5.0`, CLI 15.2.11 / ng-packagr 15.2.2 / TypeScript 4.9.5 / angular-eslint 15.2.1 / RxJS 7.8.1 / zone.js 0.12.0, TS target ES2022 (`useDefineForClassFields: false`), Karma `test.ts` without `require.context`, Node 16.20.2 / npm 8.19.4 with a lockfileVersion 2 `package-lock.json`, release gate `verify:partial-ivy` now expects caret peer ranges |

### Out of scope / explicitly not changing

- retail-web's Lantern pin (2.4.1), its Angular version and its `ngcc` `postinstall`; all of that is retail-web's Stage 3 change under MOL-4471.
- business-web (no Lantern dependency), keystone-web, ledgerline-web, iris-widget, canopy-ui: no change.
- Lantern 15 -> 16 (next wave). **Blocked** on the vendor Ivy build LNTN-140 (mirror KAN-24, HIGHEST): Angular 16 drops the View Engine / `ngcc` compatibility path that the consumers of the 2.4.1 line still rely on. Not a blocker for this hop.
- Angular 16 / 17 / 18, Node 18, RxJS 8, eslint 9, Karma replacement: none of it; one major at a time.
- The hosted vendor script `lantern.min.js` (Web SDK 4.11) and its `scriptUrl`; the collector URL; the `X-Analytics-Session` header name (PLAT-1660).
- GIS-1471 masking rules (`maskPath`, directive text masking, `identify` opaque id, session header URL prefixes): unchanged, covered by the existing 21 specs (unchanged apart from the two version-stamp assertions).
- `compilationMode: partial`, `@types/node` 16.18.11, `tslib` 2.3.1: unchanged.
- Jenkins: no `Jenkinsfile` in this repository (the `lantern-sdk-release` job is parameterised from `Jenkinsfile.release` in platform-tooling). The job already runs on `nodejs16-rhel8`; its `NODE_VERSION` parameter / the `nvm use 14` in its Install stage must be set to 16.20.2 to match `.nvmrc` (see section 7 step 3). That is a job configuration change, not a repository change, and is recorded in `REPORT.md` as a decision for the DAE release engineer.
- Artifactory configuration, WAF, IdP, database: not applicable, no such components in this library.

## 4. Risk assessment

| | |
|---|---|
| Risk rating | Low (RM-STD-003 appendix A). Library publish only; no customer-facing deployment in this CHG; no consumer pins change. Analytics is not a P1 service (RISK-2019-118). |
| Customer impact during implementation | None expected. Publishing a new package version has no runtime effect until a consumer pins it. |
| Customer impact if it goes wrong | None for this CHG. When retail-web pins 5.0.0 (its own CHG, after its own Angular 15 hop), a linker failure would fail retail-web's build before deployment; no runtime path. The Angular 15.2 scratch host (`CONSUMERS.md`) already shows production build and the four integration specs green against 5.0.0 with retail-web's RxJS 7.5.7. |
| Regulatory or data classification considerations | `DATA_CLASSIFICATION.md`: Synthetic, Non Restricted. No PII flow changes; masking behaviour unchanged (GIS-1471). |
| Dependencies on other changes | Lantern 4.0.0 CHG (2026.10.2) should publish first so the version history on Artifactory is linear; not a hard dependency (5.0.0 is built from its own tag). Canopy 4.0.0 (Stage 1, `northgate-canopy-ui` PR #3) is *not* a dependency of this package; Stage 2 proceeds under the gate waiver recorded on KAN-23. |
| Blast radius | Consumers of `@northgate/lantern-sdk`: retail-web (live, stays on 2.4.1 until MOL-4471; cannot resolve 5.0.0 on Angular 14, which is the intended guard), business-web (README lists it; not in its `package.json`), Beacon ops console (outside the estate). |

## 5. Dependency and platform changes

| dependency | from | to | reason | DEPENDENCY_POLICY.md exception ref (if any) |
|---|---|---|---|---|
| `@angular/*` (8 packages) | 14.3.0 | 15.2.10 | framework hop N -> N+1 (last 15.x runtime release) | none |
| `@angular/cli`, `@angular-devkit/build-angular` | 14.2.13 | 15.2.11 | CLI for Angular 15 (last 15.x CLI) | none |
| `@angular/compiler-cli` | 14.3.0 | 15.2.10 | matches core | none |
| `ng-packagr` | 14.2.2 | 15.2.2 | library builder for Angular 15 / APF 15 | none |
| `typescript` | 4.7.4 | 4.9.5 | Angular 15 range `>=4.8.2 <5.0.0` | none |
| `rxjs` (workspace) | 6.6.7 | 7.8.1 | move to RxJS 7 with the estate (retail-web is on 7.5.7); published peer `>=6.5.0 <7.0.0` -> `^7.5.0` | none |
| `zone.js` | 0.11.4 | 0.12.0 | Angular 15 peer `~0.11.4 \|\| ~0.12.0 \|\| ~0.13.0`; dev/test only | none |
| `@angular-eslint/*` (5 packages) | 14.4.0 | 15.2.1 | lint builder for CLI 15 | none |
| `@typescript-eslint/eslint-plugin`, `parser` | 5.43.0 | 5.43.0 (no change) | angular-eslint 15 peer (exact pin restored after the schematic wrote `^5.43.0`) | none |
| `eslint` | 8.57.1 | 8.57.1 (no change) | angular-eslint 15 peer (exact pin restored after the schematic wrote `^8.28.0`) | none |
| Node / npm | 14.21.3 / 6.14.18 | 16.20.2 / 8.19.4 | Angular 15 range `^14.20.0 \|\| ^16.13.0 \|\| ^18.10.0`; 16.20.2 is the supported estate agent (`nodejs16-rhel8`); `package-lock.json` lockfileVersion 1 -> 2 | NORTHGATE-EOL-NODE16 (Medium) carried, see section 6 |
| `tslib`, `@types/node` | 2.3.1, 16.18.11 | no change | inside matrix | none |

- Xray report for the new versions: `docs/upgrade/LNTN-401/14-to-15/scanner-xray.log` (baseline `14-to-15/00-baseline-14/scanner-xray.log`)
- Lifecycle status of everything in the "to" column: Angular 15.2.10 end of life (vendor LTS ended 2024-05-18; intermediate wave position, 15 -> 16 is blocked on LNTN-140 / KAN-24); TypeScript 4.9 unsupported by vendor (bounded by the Angular 15 range); Node 16.20.2 end of life (2023-09-11, NORTHGATE-EOL-NODE16, Medium; the supported estate agent nonetheless); eslint 8.57.1 end of life (2024-10-05); angular-eslint 15.2.1 unsupported (tied to Angular 15); RxJS 7.8.1 current; zone.js 0.12.0 superseded (0.13 also in range).
- Confirm no version moves outside the estate version map without an ADR: ADR 0003 (`docs/adr/0003-angular-14-to-15.md`) records the hop and the decisions to move Node to 16.20.2, RxJS to 7 with a `^7.5.0` peer and caret Angular peers; `docs/upgrade/LNTN-401/COMPATIBILITY_MATRIX.md` has the 15 column.

## 6. Testing and evidence

| evidence | location | result |
|---|---|---|
| Unit tests and coverage (library default threshold 30% lines) | `14-to-15/test.log`, `14-to-15/coverage-summary.txt` | 21/21 specs pass (0 skipped); 97.33% lines (baseline 97.33%), 97.43% statements, 87.85% branches, 100% functions; identical to the 14.3.0 baseline |
| Sonar quality gate | `14-to-15/scanner-sonar.log` | PASSED |
| Checkmarx scan (no High or Critical open) | `14-to-15/scanner-cx.log` | PASSED, Critical 0 High 0 Medium 0 |
| Xray dependency scan (no High or Critical open) | `14-to-15/scanner-xray.log` | **Policy gate PASSED**: Critical 0, High 0 (baseline High 3: `@angular/core@14.3.0` EOL, `node@14.21.3` EOL, `webpack-dev-middleware@5.3.3` CVE-2024-4068, all cleared by the hop), Medium 7, Low 3. No new finding id; see table below |
| npm audit `--audit-level=high` | `14-to-15/npm-audit.log`, `14-to-15/npm-audit-production.log` | production tree: 14 advisory ids on `@angular/{common,compiler,core}@15.2.10`, **same id set as the 14.3.0 baseline, no new id**; fixed versions are Angular >= 19.2.x / 20, outside the 15 matrix. Full tree: 50 (baseline 139); **3 new ids, dev only, human decision required** (see below and `REPORT.md` s5). `npm audit fix --force` was not run (it would have moved `@angular/cli` to 22.x). |
| Production build, zero warnings | `14-to-15/build.log`, `14-to-15/verify-partial-ivy.log`, `14-to-15/publish-dry-run.log`, `14-to-15/angular-json-schema.log` | exit 0, 0 warnings, partial-Ivy verifier PASS on `dist/` and the packed tarball, `angular.json` valid against the CLI 15.2.11 schema |
| Estate verification | `14-to-15/verify-estate.log`, `14-to-15/forbidden-strings.log` | `verify-estate.sh lantern-sdk` pass 16 fail 0 skip 0; GIS-1180 clean |
| Consumer verification | `14-to-15/CONSUMERS.md`, `14-to-15/consumers/` | retail-web (Angular 14.3.0): **FAIL (expected)**, strict-peer `ERESOLVE` on `@angular/common ^15.0.0`; pins 5.0.0 in MOL-4471 after its own Angular 15 hop. Angular 15.2 scratch host: **PASS**, production build exit 0, 4/4 specs (`forRoot`, router page tracking with masking, `lanternTrack`, interceptor). business-web NOT_APPLICABLE. No consumer repository changed. |
| Publish rehearsal | `14-to-15/publish-verdaccio.log`, `14-to-15/verdaccio-lantern-versions.log` | 5.0.0 published to the local Verdaccio (Artifactory stand-in) via `npm run publish:local`, the same `scripts/publish.sh` flow the release job uses; `npm view` shows peers `^15.0.0` / `rxjs ^7.5.0`, 53.2 kB tarball, shasum `9e836b00...` |
| uat regression suite | not applicable | library publish only; no deployable |
| Manual UAT sign off | not applicable | no UI |
| Performance test | not applicable | Low risk; published bundles within 20 bytes of 4.0.0 (`bundle-sizes.log`) |
| Accessibility check | not applicable | no UI |
| Security review | not applicable | GIS-STD-014/021/030 material unchanged; no `.npmrc`, `checkmarx.yml`, `SECURITY.md` change; masking specs unchanged and passing |

Open scanner findings carried into prod, with the GIS risk acceptance reference for each (all
carried from the 4.0.0 record or the 14.3.0 baseline unless marked NEW):

| finding id | severity | GIS acceptance | expiry |
|---|---|---|---|
| XRAY-127401 NORTHGATE-EOL-ANGULAR (`@angular/core@15.2.10`) | Medium (was High XRAY-127400 on 14.3.0) | GIS-2618 (open item for the Lantern line); 15 -> 16 blocked on LNTN-140 / KAN-24 | on Lantern 15 -> 16 release |
| XRAY-127310 NORTHGATE-EOL-NODE16 (`node@16.20.2`), XRAY-127200 CVE-2023-39333 (`node@16.20.2`) | Medium | supported estate agent `nodejs16-rhel8` (platform-tooling README); Node 18 is a platform decision outside this hop; GIS-RA request via KAN-13 (replaces the NODE14 High) | TBC by GIS |
| XRAY-132800 CVE-2024-4068 (`@babel/runtime@7.20.13`), XRAY-133200 CVE-2024-4068 (`esbuild@0.17.8`), XRAY-124910 CVE-2024-43788 (`webpack@5.76.1`), XRAY-125300 CVE-2023-8265 (`karma@6.3.20`) | Medium, dev only | pinned by `@angular-devkit/build-angular` 15.2.11 / the unchanged Karma runner; GIS-RA request KAN-13 (same pattern as the 4.0.0 record) | TBC by GIS |
| XRAY-133800 CVE-2023-26159 (`http-proxy@1.18.1`), XRAY-134600 NORTHGATE-EOL-KARMA (`karma@6.3.20`), XRAY-127500 NORTHGATE-EOL-RXJS (`rxjs@6.6.7` nested under `@angular-devkit/*`) | Low, dev only | carried; KAN-13 | TBC by GIS |
| npm audit: `@angular/common\|compiler\|core@15.2.10` advisories (14 ids, 8 High-severity groups, production tree) | High | identical id set to the 14.3.0 baseline; fixed versions are Angular >= 19.2.x; covered by GIS-2618 and the wave plan | on each subsequent hop |
| **NEW** npm audit GHSA-52v5-jr5w-gjxr (`sigstore@1.9.0`, dev only, via `pacote@15.1.0` from `@angular/cli` 15.2.11; used only by `ng add`/`ng update` package fetches) | High (npm rating) | **none yet: human decision / sign-off required** (`REPORT.md` s5, `new_jira_items_needed`). Not reachable from the published package. | TBC |
| **NEW** npm audit GHSA-73wf-gq98-2v4g, GHSA-c83g-rgw3-j3cx (`browserslist <=4.28.6`, dev only, via `@angular-devkit/build-angular` 15.2.11 / `@babel/*`) | High (npm rating) | **none yet: human decision / sign-off required**. `npm audit fix` cannot reach a fixed version inside the 15 matrix without an `overrides` entry; not applied autonomously. Not reachable from the published package. | TBC |

Resolved since the 4.0.0 record: XRAY-127400 (`@angular/core@14.3.0` High), XRAY-127300
(`node@14.21.3` High), XRAY-124800 (`webpack-dev-middleware@5.3.3` High) and 11 npm audit ids
(GHSA-23c5-xmqv-rm74, GHSA-3ppc-4f35-3m26, GHSA-4v9v-hfq4-rm2v, GHSA-79cf-xcqc-c78w,
GHSA-7r86-cg39-jmmj, GHSA-9jgg-88mc-972h, GHSA-f5vj-f2hx-8m93, GHSA-m28w-2pqf-7qgj,
GHSA-mx8g-39q3-5c79, GHSA-vcc3-ghjq-m6fr, GHSA-wr3j-pwj9-hqq6) are no longer present in the
15.2.11 dev tree (59 -> 51 distinct ids, 48 carried). None of the dev-only findings
ship in the published package (`dist/lantern-sdk` depends only on `tslib`).

## 7. Implementation plan

1. DAE release engineer: merge PR `feature/LNTN-401-angular-14-to-15` -> `develop` after two approvals (one DAE, `@northgate/cswt-architecture` for `docs/adr/`, `@northgate/gis-appsec` for section 6 including the three NEW audit ids). 5 min.
2. Release manager: `develop` -> `release/2026.10` (or the train decided in section 1) at code freeze.
3. DAE release engineer: set the `lantern-sdk-release` job's `NODE_VERSION` to `16.20.2` (agent label stays `nodejs16-rhel8`; remove the `nvm use 14` Install-stage override noted in the platform-tooling README). Verify `node --version` prints `v16.20.2` in the Install stage. 5 min.
4. Jenkins `lantern-sdk-release`: `npm ci`, `npm run lint`, `npm test`, `npm run build`, `npm run verify:partial-ivy`, pack, publish 5.0.0 to Artifactory `npm-northgate`. 15 min. Verify: `npm view @northgate/lantern-sdk@5.0.0 peerDependencies` shows `^15.0.0` and `rxjs ^7.5.0`.
5. Tag `lantern-sdk-v5.0.0` on the release commit; update Jira release version; open the 4.0.0 security-support window entry (GIS-STD-022 s3: until retail-web moves or 90 days). 5 min.
6. No application deployment. DAE posts in `#dae-lantern`; the retail-web pin to 5.0.0 is raised by Stage 3 (MOL-4471) with its Angular 15 hop.

Estimated duration: 35 minutes. Bridge: not required (no customer-facing change); DAE on `#dae-lantern`.
Communications: DAE posts the release note in `#dae-lantern`; service desk not involved.

## 8. Rollback plan

| | |
|---|---|
| Rollback trigger | `verify:partial-ivy` or the publish step fails in `lantern-sdk-release`; or retail-web's Stage 3 PR cannot link 5.0.0 on Angular 15 (contradicting the scratch host in `CONSUMERS.md`). |
| Rollback steps | 1. Revert the framework commit (`LNTN-401 Upgrade Angular 14 to 15 and Node 14 to 16`, `c892c8f`) and its companion tooling/doc commits on `develop` via a revert PR; reset the job's `NODE_VERSION` to 14.21.3. 2. If 5.0.0 was published: `npm deprecate @northgate/lantern-sdk@5.0.0 "withdrawn, use 4.0.0"` on Artifactory (never unpublish). 3. Consumers are unaffected: 2.4.1 stays published and pinned by retail-web; 4.0.0 stays published and in security support. |
| Rollback duration | 15 minutes (revert PR + deprecate). |
| Point of no return | None for this CHG. Publishing 5.0.0 does not change any consumer; the version can be deprecated. |
| Rollback tested in uat on | not applicable (library publish; revert is a git operation, deprecate is reversible with `npm deprecate ... ""`). |

## 9. AI-assisted changes

| | |
|---|---|
| AI-assisted content present | Yes |
| Tool(s) and approved-tool register entry | Devin (Cognition), register entry AIT-014 (TECH-POL-031) |
| Commits or PRs carrying the `AI-Assisted:` trailer | All commits on `feature/LNTN-401-angular-14-to-15`; PR link in `REPORT.md` |
| Human reviewer(s) of the AI-assisted content (not the prompter) | TBC (DAE reviewer + `@northgate/cswt-architecture` + `@northgate/gis-appsec`) |
| Review evidence | PR review with `northgate-platform-tooling/docs/templates/PR_REVIEW_AI.md` checklist completed (to be linked) |
| Scanner results for AI-assisted files specifically | same as section 6, no delta (whole repository scanned; Checkmarx and Sonar clean) |

## 10. Post implementation

- Hypercare owner and duration: DAE on-call (business hours), 48 hours after publish.
- Success criteria: `@northgate/lantern-sdk@5.0.0` resolvable from Artifactory with the expected peer range; `lantern-sdk-release` green on Node 16.20.2; no consumer build breakage (none expected, no pin changes in this CHG).
- Monitoring dashboards to watch: not applicable (no runtime change); Artifactory publish log.
- PIR required: No (Low risk) unless rollback is triggered.

## 11. Approvals

| role | name | date |
|---|---|---|
| Change owner | TBC | |
| Technical approver (not on the requesting team) | TBC (`@northgate/cswt-architecture`) | |
| GIS approver (section 6 carries accepted findings and three NEW dev-tree audit ids) | TBC (`@northgate/gis-appsec`) | |
| Business approver | not required (Low) | |
| CAB chair | | |
