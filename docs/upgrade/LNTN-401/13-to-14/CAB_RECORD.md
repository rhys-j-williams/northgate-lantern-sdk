<!-- Generated with AI assistance (AIT-014) on 2026-09-08; reviewed by <handle>. -->
<!-- Draft from northgate-platform-tooling/governance/CAB_TEMPLATE.md (template 4.2, RM-STD-003). Not yet submitted. -->
# Change Advisory Board submission — CSWT

## 1. Record

| field | value |
|---|---|
| CHG number | CHG_______ (assigned by ITSM on save; not an emergency change) |
| Change type | Normal |
| Release train | 2026.10.2 (code freeze Fri 2026-10-02, CAB Tue 2026-10-06, deploy Thu 2026-10-08). 2026.09.2 froze on 2026-09-04 (CAB today, 2026-09-08) and cannot take this change; 2026.09.4 is skipped for the Q3 quarter-end freeze. Same train as the Lantern 12 -> 13 change (3.0.0): both releases are published from the one `release/2026.10` cut, 3.0.0 then 4.0.0, as two CHG records. |
| Requested implementation window | Thu 2026-10-08 20:00 to 23:00 ET (after the 3.0.0 publish in the same window) |
| Requesting team | Digital Analytics Enablement (DAE), Charlotte |
| Change owner (accountable) | TBC (DAE, M2 or above) |
| Implementer | TBC (DAE release engineer running `lantern-sdk-release`) |
| Business sponsor | TBC (Digital Analytics product owner) |
| Application(s) and CMDB app-id(s) | `@northgate/lantern-sdk` (shared library; CMDB app-id TBC from the DAE service record). No deployable application changes in this CHG. |
| Environment(s) | Artifactory `npm-northgate` (package publish only; no prod-east / prod-west deployment) |
| Jira release version | LNTN-401 / 4.0.0 (demo mirror: KAN-1 epic, KAN-14 story, KAN-22 this record) |
| Evidence bundle | `docs/upgrade/LNTN-401/13-to-14/` on branch `feature/LNTN-401-angular-13-to-14` (Artifactory `generic-cswt-release-evidence` URL to be added by `Jenkinsfile.release`) |

## 2. Summary of change

Framework (Angular major) upgrade of a shared library. `@northgate/lantern-sdk`, the Angular wrapper for
the Lumenview Lantern analytics script, moves from Angular 13.4.0 to Angular 14.3.0 and is published as
4.0.0 (semver major because the peer range becomes `>=14.0.0 <15.0.0`). This is the second and last of
the two LNTN-401 catch-up hops; it brings Lantern level with the estate (Canopy, Iris and retail-web are
on Angular 14) so the estate's Angular 14 -> 15 wave can begin, and it is the first Lantern release
whose peer range includes retail-web's Angular version. retail-web has been verified against 4.0.0
(PASS, `CONSUMERS.md`) but does **not** change its pin in this CHG; the pin bump `2.4.1 -> 4.0.0` is a
retail-web change under MOL-4471. Output stays Ivy partial compilation (no `ngcc` processing), the
public API, the `X-Analytics-Session` header and the GIS-1471 masking behaviour are unchanged, and
Node (14.21.3), RxJS (6.6.7) and zone.js (0.11.4) do not move.

## 3. Scope

### In scope

| component | from | to | change |
|---|---|---|---|
| `northgate-lantern-sdk` / `@northgate/lantern-sdk` | 3.0.0 (tag `lantern-sdk-v3.0.0`, Angular 13.4.0, partial Ivy) | 4.0.0 (tag `lantern-sdk-v4.0.0`, Angular 14.3.0, partial Ivy) | framework hop 13 -> 14, peer range `>=14 <15`, CLI 14.2.13 / ng-packagr 14.2.2 / TypeScript 4.7.4 / angular-eslint 14.4.0, TS target es2020, `angular.json` `defaultProject` removed, release gate `verify:partial-ivy` extended (rxjs peer, version stamp) |

### Out of scope / explicitly not changing

- retail-web's Lantern pin (2.4.1) and its `ngcc` `postinstall`; the pin bump is a retail-web PR under MOL-4471 (mirror KAN-16).
- business-web (no Lantern dependency), keystone-web, ledgerline-web, iris-widget, canopy-ui: no change.
- Lantern 14 -> 15 (next wave; separate branch, PR and CHG, after canopy-ui 4 / MDC).
- `northgate-cswt-workspace/scripts/verify-estate.sh`: no new change; the 12 -> 13 companion PR #16 (partial Ivy for Lantern >= 3) is still open and must merge before CI re-runs the estate check.
- The hosted vendor script `lantern.min.js` (Web SDK 4.11) and its `scriptUrl`; the collector URL; the `X-Analytics-Session` header name (PLAT-1660).
- GIS-1471 masking rules (`maskPath`, directive text masking, `identify` opaque id, session header URL prefixes): unchanged, covered by the existing 21 specs.
- Node version (14.21.3, `.nvmrc` and `engines` untouched), RxJS (6.6.7), zone.js (0.11.4), `compilationMode: partial`: unchanged.
- Artifactory configuration, WAF, IdP, database: not applicable, no such components in this library.

## 4. Risk assessment

| | |
|---|---|
| Risk rating | Low (RM-STD-003 appendix A). Library publish only; no customer-facing deployment in this CHG; no consumer pins change. Analytics is not a P1 service (RISK-2019-118). |
| Customer impact during implementation | None expected. Publishing a new package version has no runtime effect until a consumer pins it. |
| Customer impact if it goes wrong | None for this CHG. When retail-web pins 4.0.0 (its own CHG), a linker failure would fail retail-web's build before deployment; no runtime path. The retail-web scratch verification (`CONSUMERS.md`) already shows lint, 196 specs, production build, `verify-estate.sh` and `smoke.sh` green against 4.0.0. |
| Regulatory or data classification considerations | `DATA_CLASSIFICATION.md`: Synthetic, Non Restricted. No PII flow changes; masking behaviour unchanged (GIS-1471). |
| Dependencies on other changes | Lantern 3.0.0 CHG (same train) should publish first so the version history on Artifactory is linear; not a hard dependency (4.0.0 is built from its own tag). Workspace PR #16 for the CI estate check. |
| Blast radius | Consumers of `@northgate/lantern-sdk`: retail-web (live, stays on 2.4.1 until MOL-4471), business-web (README lists it; not in its `package.json`), Beacon ops console (outside the estate). |

## 5. Dependency and platform changes

| dependency | from | to | reason | DEPENDENCY_POLICY.md exception ref (if any) |
|---|---|---|---|---|
| `@angular/*` (8 packages) | 13.4.0 | 14.3.0 | framework hop N -> N+1 | none |
| `@angular/cli`, `@angular-devkit/build-angular` | 13.3.11 | 14.2.13 | CLI for Angular 14 | none |
| `@angular/compiler-cli` | 13.4.0 | 14.3.0 | matches core | none |
| `ng-packagr` | 13.3.1 | 14.2.2 | library builder for Angular 14 / APF 14 (14.3.x peers an Angular 15-next compiler) | none |
| `typescript` | 4.6.4 | 4.7.4 | Angular 14 range `>=4.6.2 <4.8.0` | none |
| `@angular-eslint/*` (5 packages) | 13.5.0 | 14.4.0 | lint builder for CLI 14 | none |
| `@typescript-eslint/eslint-plugin`, `parser` | 5.27.1 | 5.43.0 | angular-eslint 14 peer (exact pin, schematic wrote `^5.36.2`) | none |
| `eslint` | 8.57.1 | 8.57.1 (no change) | angular-eslint 14 peer | none |
| Node | 14.21.3 | 14.21.3 (no change) | inside Angular 14 range `^14.15.0 \|\| ^16.10.0`; bump to 16.20.2 with 14 -> 15 | NORTHGATE-EOL-NODE14 carried (see section 6) |
| RxJS, zone.js, `tslib`, `@types/node` | 6.6.7, 0.11.4, 2.3.1, 16.18.11 | no change | inside matrix; retail-web is RxJS 6 | none |

- Xray report for the new versions: `docs/upgrade/LNTN-401/13-to-14/scanner-xray.log` (baseline `13-to-14/00-baseline-13/scanner-xray.log`)
- Lifecycle status of everything in the "to" column: Angular 14.3.0 end of life (vendor LTS ended 2023-11-18; intermediate wave position, 14 -> 15 follows); TypeScript 4.7 unsupported by vendor (bounded by the Angular 14 range); Node 14.21.3 end of life (2023-04-30, NORTHGATE-EOL-NODE14); eslint 8.57.1 end of life (2024-10-05); angular-eslint 14.4.0 unsupported (tied to Angular 14).
- Confirm no version moves outside the estate version map without an ADR: ADR 0002 (`docs/adr/0002-angular-13-to-14.md`) records the hop and the decision to keep Node 14 / RxJS 6; `docs/upgrade/LNTN-401/COMPATIBILITY_MATRIX.md` has the 14 column.

## 6. Testing and evidence

| evidence | location | result |
|---|---|---|
| Unit tests and coverage (library default threshold 30% lines) | `13-to-14/test.log`, `13-to-14/coverage-summary.txt` | 21/21 specs pass (0 skipped); 97.33% lines (baseline 97.33%), 97.43% statements, 87.85% branches, 100% functions |
| Sonar quality gate | `13-to-14/scanner-sonar.log` | PASSED |
| Checkmarx scan (no High or Critical open) | `13-to-14/scanner-cx.log` | PASSED, Critical 0 High 0 Medium 0 |
| Xray dependency scan (no High or Critical open) | `13-to-14/scanner-xray.log` | Policy gate FAILED: Critical 0 (baseline 0), High 3 (baseline 6). No new finding id; see table below |
| npm audit `--audit-level=high` | `13-to-14/npm-audit.log`, `13-to-14/npm-audit-production.log` | dev tree 139 (baseline 193); production tree 17, identical set to baseline; all require Angular majors outside the 14 matrix |
| Production build, zero warnings | `13-to-14/build.log`, `13-to-14/verify-partial-ivy.log`, `13-to-14/publish-dry-run.log`, `13-to-14/angular-json-schema.log` | exit 0, 0 warnings, partial-Ivy verifier PASS on `dist/` and the packed tarball, `angular.json` valid against CLI 14.2.13 schema |
| Estate verification | `13-to-14/verify-estate.log`, `13-to-14/forbidden-strings.log` | `verify-estate.sh lantern-sdk` pass 16 fail 0 skip 0; GIS-1180 clean |
| Consumer verification | `13-to-14/CONSUMERS.md` and `13-to-14/consumers/retail-web/lantern-4.0.0/` | retail-web (Angular 14.3.0, Node 16.20.2) **PASS** in scratch checkouts: `npm ci`, lint, `test:ci` 196/196 executed, `build:prod` (pre-existing 2.05 MB budget warning only), `verify-estate.sh retail-web` 16/16, `estate-up.sh` + `smoke.sh` 18 pass / 0 fail, app boot on 4200. business-web NOT_APPLICABLE. No consumer repository changed. |
| Publish rehearsal | `13-to-14/publish-verdaccio.log`, `13-to-14/verdaccio-lantern-versions.log` | 4.0.0 published to the local Verdaccio (Artifactory stand-in) via the same `publish:local` flow the release job uses; peers `>=14.0.0 <15.0.0` |
| uat regression suite | not applicable | library publish only; no deployable |
| Manual UAT sign off | not applicable | no UI |
| Performance test | not applicable | Low risk; retail-web initial bundle unchanged at 2.05 MB with 4.0.0 |
| Accessibility check | not applicable | no UI |
| Security review | not applicable | GIS-STD-014/021/030 material unchanged; no `.npmrc`, `checkmarx.yml`, `SECURITY.md` change; masking specs unchanged and passing |

Open scanner findings carried into prod, with the GIS risk acceptance reference for each:

| finding id | severity | GIS acceptance | expiry |
|---|---|---|---|
| XRAY-127400 NORTHGATE-EOL-ANGULAR (`@angular/core@14.3.0`) | High | GIS-2618 (open High for the Lantern line; Lantern is now level with the estate, 14 -> 15 follows in the wave) | on Lantern 14 -> 15 release |
| XRAY-127300 NORTHGATE-EOL-NODE14 (`node@14.21.3`) | High | GIS-RA request raised via KAN-13 (Node 16.20.2 planned with the 14 -> 15 hop, Angular 15 drops Node 14) | TBC by GIS |
| XRAY-124800 CVE-2024-4068 (`webpack-dev-middleware@5.3.3`, dev only, via `@angular-devkit/build-angular` 14.2.13; fix 5.3.4 unreachable without npm `overrides`) | High | carried from baseline (5.3.0 -> 5.3.3, same finding id); GIS-RA request KAN-13 | TBC by GIS |
| npm audit: `@angular/common\|compiler\|core@14.3.0` advisories (13 High, 4 Moderate, production tree) | High | identical set to the 13.4.0 baseline; fixed versions are Angular >= 17/19; covered by GIS-2618 and the LNTN-401 catch-up plan | on each subsequent hop |

Resolved since the 3.0.0 record: XRAY-121600 (`minimatch@3.0.4`) and XRAY-122310 (`semver@7.3.4`,
`semver@7.3.5`) are no longer present in the 14.2.13 / angular-eslint 14 dev tree. None of the
dev-only findings ship in the published package (`dist/lantern-sdk` depends only on `tslib`).

## 7. Implementation plan

1. DAE release engineer: merge PR `feature/LNTN-401-angular-13-to-14` -> `develop` after two approvals (one DAE, `@northgate/cswt-architecture` for `docs/adr/`, `@northgate/gis-appsec` for section 6). 5 min.
2. Release manager: `develop` -> `release/2026.10` at code freeze 2026-10-02 17:00 ET.
3. Jenkins `lantern-sdk-release` (Node 14.21.3 agent): `npm ci`, `npm run lint`, `npm test`, `npm run build`, `npm run verify:partial-ivy`, pack, publish 4.0.0 to Artifactory `npm-northgate`. 15 min. Verify: `npm view @northgate/lantern-sdk@4.0.0 peerDependencies` shows `>=14.0.0 <15.0.0`.
4. Tag `lantern-sdk-v4.0.0` on the release commit; update Jira release version. 5 min.
5. No application deployment. DAE posts in `#dae-lantern` and raises the retail-web pin PR (MOL-4471) for the retail team to take on a later train.

Estimated duration: 30 minutes. Bridge: not required (no customer-facing change); DAE on `#dae-lantern`.
Communications: DAE posts the release note in `#dae-lantern`; service desk not involved.

## 8. Rollback plan

| | |
|---|---|
| Rollback trigger | `verify:partial-ivy` or the publish step fails in `lantern-sdk-release`; or retail-web's pin PR cannot link 4.0.0 on Angular 14 (contradicting `CONSUMERS.md`). |
| Rollback steps | 1. Revert the framework commit (`LNTN-401 Upgrade Angular 13 to 14`, `e9bdf60`) and its companion tooling/doc commits on `develop` via a revert PR. 2. If 4.0.0 was published: `npm deprecate @northgate/lantern-sdk@4.0.0 "withdrawn, use 3.0.0 / 2.4.1"` on Artifactory (never unpublish). 3. Consumers are unaffected: 2.4.1 stays published and pinned by retail-web. |
| Rollback duration | 15 minutes (revert PR + deprecate). |
| Point of no return | None for this CHG. Publishing 4.0.0 does not change any consumer; the version can be deprecated. |
| Rollback tested in uat on | not applicable (library publish; revert is a git operation, deprecate is reversible with `npm deprecate ... ""`). |

## 9. AI-assisted changes

| | |
|---|---|
| AI-assisted content present | Yes |
| Tool(s) and approved-tool register entry | Devin (Cognition), register entry AIT-014 (TECH-POL-031) |
| Commits or PRs carrying the `AI-Assisted:` trailer | All commits on `feature/LNTN-401-angular-13-to-14`; PR link in `REPORT.md` |
| Human reviewer(s) of the AI-assisted content (not the prompter) | TBC (DAE reviewer + `@northgate/cswt-architecture` + `@northgate/gis-appsec`) |
| Review evidence | PR review with `northgate-platform-tooling/docs/templates/PR_REVIEW_AI.md` checklist completed (to be linked) |
| Scanner results for AI-assisted files specifically | same as section 6, no delta (whole repository scanned; Checkmarx and Sonar clean) |

## 10. Post implementation

- Hypercare owner and duration: DAE on-call (business hours), 48 hours after publish.
- Success criteria: `@northgate/lantern-sdk@4.0.0` resolvable from Artifactory with the expected peer range; `lantern-sdk-release` green; no consumer build breakage (none expected, no pin changes in this CHG).
- Monitoring dashboards to watch: not applicable (no runtime change); Artifactory publish log.
- PIR required: No (Low risk) unless rollback is triggered.

## 11. Approvals

| role | name | date |
|---|---|---|
| Change owner | TBC | |
| Technical approver (not on the requesting team) | TBC (`@northgate/cswt-architecture`) | |
| GIS approver (section 6 carries accepted findings) | TBC (`@northgate/gis-appsec`) | |
| Business approver | not required (Low) | |
| CAB chair | | |
