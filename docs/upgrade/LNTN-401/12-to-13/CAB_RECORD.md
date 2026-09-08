<!-- Generated with AI assistance (AIT-014) on 2026-09-08; reviewed by <handle>. -->
<!-- Draft from northgate-platform-tooling/governance/CAB_TEMPLATE.md (template 4.2, RM-STD-003). Not yet submitted. -->
# Change Advisory Board submission — CSWT

## 1. Record

| field | value |
|---|---|
| CHG number | CHG_______ (assigned by ITSM on save; not an emergency change) |
| Change type | Normal |
| Release train | 2026.10.2 (code freeze Fri 2026-10-02, CAB Tue 2026-10-06, deploy Thu 2026-10-08). 2026.09.2 froze on 2026-09-04 before this change was ready; 2026.09.4 is skipped for the Q3 freeze (Thu 2026-09-24 17:00 to Mon 2026-10-05 09:00 ET). |
| Requested implementation window | Thu 2026-10-08 20:00 to 23:00 ET |
| Requesting team | Digital Analytics Enablement (DAE), Charlotte |
| Change owner (accountable) | TBC (DAE, M2 or above) |
| Implementer | TBC (DAE release engineer running `lantern-sdk-release`) |
| Business sponsor | TBC (Digital Analytics product owner) |
| Application(s) and CMDB app-id(s) | `@northgate/lantern-sdk` (shared library; CMDB app-id TBC from the DAE service record). No deployable application changes in this CHG. |
| Environment(s) | Artifactory `npm-northgate` (package publish only; no prod-east / prod-west deployment) |
| Jira release version | LNTN-401 / 3.0.0 (demo mirror: KAN-1 epic, KAN-2 story) |
| Evidence bundle | `docs/upgrade/LNTN-401/12-to-13/` on branch `feature/LNTN-401-angular-12-to-13` (Artifactory `generic-cswt-release-evidence` URL to be added by `Jenkinsfile.release`) |

## 2. Summary of change

This is a framework (Angular major) upgrade of a shared library. `@northgate/lantern-sdk`, the Angular
wrapper for the Lumenview Lantern analytics script, moves from Angular 12.2.17 (View Engine, out of vendor
support since 2022, GIS-2618 / TR-1102) to Angular 13.4.0 and is published as 3.0.0 with Ivy partial
compilation output. This is the first of two catch-up hops (12 -> 13, then 13 -> 14) that Lantern needs
before the estate's Angular 14 -> 15 wave can start; it also delivers the estate prerequisite that Lantern
must have an Ivy build before any application reaches Angular 16 (where `ngcc` is removed). No application
picks up 3.0.0 in this change: the only live consumer, retail-web (Angular 14), keeps 2.4.1 until the
13 -> 14 hop publishes a release whose peer range includes Angular 14. Public API and the GIS-1471 masking
behaviour are unchanged.

## 3. Scope

### In scope

| component | from | to | change |
|---|---|---|---|
| `northgate-lantern-sdk` / `@northgate/lantern-sdk` | 2.4.1 (tag `lantern-sdk-v2.4.1`, Angular 12.2.17, View Engine) | 3.0.0 (tag `lantern-sdk-v3.0.0`, Angular 13.4.0, partial Ivy) | framework hop, output format, peer range `>=13 <14`, TSLint -> angular-eslint, release gate `verify:partial-ivy` |
| `northgate-cswt-workspace/scripts/verify-estate.sh` | View Engine assertion for Lantern | Angular-major-aware assertion (partial Ivy for Lantern >= 3) | companion PR, branch `feature/LNTN-401-lantern-partial-ivy-verify` |

### Out of scope / explicitly not changing

- retail-web's Lantern pin (2.4.1) and its `ngcc` `postinstall`; the pin bump is a retail-web PR after Lantern 13 -> 14 (KAN-3 / MOL story).
- business-web, keystone-web, ledgerline-web, iris-widget, canopy-ui: no change.
- The Lantern 13 -> 14 hop (separate branch, PR and CHG).
- The hosted vendor script `lantern.min.js` (Web SDK 4.11) and its `scriptUrl`; the collector URL; the `X-Analytics-Session` header name (PLAT-1660).
- GIS-1471 masking rules (`maskPath`, directive text masking, `identify` opaque id, session header URL prefixes): unchanged, covered by the existing specs.
- Node version (14.21.3), RxJS (6.6.7), zone.js (0.11.4): unchanged.
- Artifactory configuration, WAF, IdP, database: not applicable, no such components in this library.

## 4. Risk assessment

| | |
|---|---|
| Risk rating | Low (RM-STD-003 appendix A). Library publish only; no customer-facing deployment in this CHG; no consumer pins change. Analytics is not a P1 service (RISK-2019-118). |
| Customer impact during implementation | None expected. Publishing a new package version has no runtime effect until a consumer pins it. |
| Customer impact if it goes wrong | None for this CHG. Should a future consumer pin 3.0.0 and the partial-Ivy linker fail, that consumer's build fails before deployment; no runtime path. |
| Regulatory or data classification considerations | `DATA_CLASSIFICATION.md`: Synthetic, Non Restricted. No PII flow changes; masking behaviour unchanged (GIS-1471). |
| Dependencies on other changes | Companion workspace PR (verify-estate.sh) must merge before the estate check is re-run in CI. None on production changes. |
| Blast radius | Consumers of `@northgate/lantern-sdk`: retail-web (live, stays on 2.4.1), business-web (README lists it; not in its `package.json`), Beacon ops console (outside the estate). |

Specific failure mode for the follow-on hop: a consumer on Angular 14 linking partial-Ivy output. Evidence
gathered in `CONSUMERS.md` (scratch retail-web build against 3.0.0) so the 13 -> 14 CAB has a data point.

## 5. Dependency and platform changes

| dependency | from | to | reason | DEPENDENCY_POLICY.md exception ref (if any) |
|---|---|---|---|---|
| `@angular/*` (8 packages) | 12.2.17 | 13.4.0 | framework hop N -> N+1 | none |
| `@angular/cli`, `@angular-devkit/build-angular` | 12.2.18 | 13.3.11 | CLI for Angular 13 | none |
| `@angular/compiler-cli` | 12.2.17 | 13.4.0 | matches core | none |
| `ng-packagr` | 12.2.7 | 13.3.1 | library builder for Angular 13 / APF 13 | none |
| `typescript` | 4.3.5 | 4.6.4 | Angular 13.4 range `>=4.4.3 <4.7.0` | none |
| `@angular-eslint/*` (5 packages) | - | 13.5.0 | replaces TSLint builder removed in CLI 13 | none |
| `@typescript-eslint/eslint-plugin`, `parser` | - | 5.27.1 | angular-eslint 13 peer | none |
| `eslint` | - | 8.57.1 | angular-eslint 13 peer | none |
| `tslint`, `codelyzer` | 6.1.3, 6.0.2 | removed | deprecated; codelyzer peers Angular < 13 | none |
| Node | 14.21.3 | 14.21.3 (no change) | inside Angular 13 range | NORTHGATE-EOL-NODE14 carried (see section 6) |

- Xray report for the new versions: `docs/upgrade/LNTN-401/12-to-13/scanner-xray.log` (baseline `00-baseline/scanner-xray.log`)
- Lifecycle status of everything in the "to" column: Angular 13.4.0 end of life (vendor LTS ended 2023-05-04; intermediate hop, next hop follows immediately); TypeScript 4.6 unsupported by vendor (bounded by the Angular 13 range); Node 14.21.3 end of life (2023-04-30, NORTHGATE-EOL-NODE14); eslint 8.57.1 end of life (2024-10-05); angular-eslint 13.5.0 unsupported (tied to Angular 13).
- Confirm no version moves outside the estate version map without an ADR: ADR 0001 (`docs/adr/0001-angular-12-to-13.md`) records the hop; Node/RxJS/zone.js unchanged.

## 6. Testing and evidence

| evidence | location | result |
|---|---|---|
| Unit tests and coverage (library default threshold 30% lines) | `12-to-13/test.log`, `12-to-13/coverage-summary.txt` | 21/21 specs pass; 97.33% lines (baseline 93.42%), 97.51% statements, 86.55% branches, 100% functions |
| Sonar quality gate | `12-to-13/scanner-sonar.log` | PASSED, 0 bugs / 0 vulnerabilities / 0 code smells |
| Checkmarx scan (no High or Critical open) | `12-to-13/scanner-cx.log` | PASSED, Critical 0 High 0 Medium 0 |
| Xray dependency scan (no High or Critical open) | `12-to-13/scanner-xray.log` | Policy gate FAILED: Critical 0 (baseline 3), High 6 (baseline 20). No new finding id; see table below |
| npm audit `--audit-level=high` | `12-to-13/npm-audit.log`, `12-to-13/npm-audit-production.log` | dev tree 193 (baseline 395); production tree 17, identical to baseline; all require majors outside the 13 matrix |
| Production build, zero warnings | `12-to-13/build.log`, `12-to-13/verify-partial-ivy.log`, `12-to-13/angular-json-schema.log` | exit 0, 0 warnings, partial-Ivy verifier PASS, `angular.json` valid against CLI 13.3.11 schema |
| Estate verification | `12-to-13/verify-estate.log`, `12-to-13/forbidden-strings.log` | `verify-estate.sh lantern-sdk` pass 16 fail 0; GIS-1180 clean |
| Consumer verification | `12-to-13/CONSUMERS.md` | retail-web (Angular 14): not a supported target of 3.0.0's peer range; scratch build evidence recorded for the 13 -> 14 hop |
| uat regression suite | not applicable | library publish only; no deployable |
| Manual UAT sign off | not applicable | no UI |
| Performance test | not applicable | Low risk |
| Accessibility check | not applicable | no UI |
| Security review | not applicable | GIS-STD-014/021/030 material unchanged; no `.npmrc`, `checkmarx.yml`, `SECURITY.md` change |

Open scanner findings carried into prod, with the GIS risk acceptance reference for each:

| finding id | severity | GIS acceptance | expiry |
|---|---|---|---|
| XRAY-127400 NORTHGATE-EOL-ANGULAR (`@angular/core@13.4.0`) | High | GIS-2618 (open High for the Lantern line; intermediate hop, 13 -> 14 follows) | on Lantern 13 -> 14 release |
| XRAY-127300 NORTHGATE-EOL-NODE14 (`node@14.21.3`) | High | GIS-RA request raised via KAN-13 (Node bump planned with the 13 -> 14 / 14 -> 15 hop) | TBC by GIS |
| XRAY-121600 CVE-2022-3517 (`minimatch@3.0.4`, dev only, via `@angular-devkit/build-angular`) | High | carried from baseline; GIS-RA request KAN-13 | TBC by GIS |
| XRAY-122310 CVE-2022-25883 (`semver@7.3.5` via build-angular/cli; `semver@7.3.4` via `@angular-eslint/builder` -> nx; dev only) | High | carried from baseline (same finding id, one additional affected version); GIS-RA request KAN-13 | TBC by GIS |
| XRAY-124800 CVE-2024-4068 (`webpack-dev-middleware@5.3.0`, dev only, via `@angular-devkit/build-angular`) | High | carried from baseline (5.0.0 -> 5.3.0); GIS-RA request KAN-13 | TBC by GIS |
| npm audit: `@angular/common|compiler|core@13.4.0` advisories (13 High, 4 Moderate, production tree) | High | identical set to the 12.2.17 baseline; fixed versions are Angular >= 17/19; covered by GIS-2618 and the LNTN-401 catch-up plan | on each subsequent hop |

None of the dev-only findings ship in the published package (`dist/lantern-sdk` depends only on `tslib`).

## 7. Implementation plan

1. DAE release engineer: merge PR `feature/LNTN-401-angular-12-to-13` -> `develop` after two approvals (one DAE, `@northgate/cswt-architecture` for `docs/adr/`). 5 min.
2. Release manager: `develop` -> `release/2026.10` at code freeze 2026-10-02 17:00 ET.
3. Jenkins `lantern-sdk-release` (Node 14.21.3 agent): `npm ci`, `npm run lint`, `npm test`, `npm run build`, `npm run verify:partial-ivy`, pack, publish 3.0.0 to Artifactory `npm-northgate`. 15 min. Verify: `npm view @northgate/lantern-sdk@3.0.0 peerDependencies` shows `>=13.0.0 <14.0.0`.
4. Tag `lantern-sdk-v3.0.0` on the release commit; update Jira release version. 5 min.
5. No application deployment. Consumers are notified via `#dae-lantern`; nothing to do for them in this train.

Estimated duration: 30 minutes. Bridge: not required (no customer-facing change); DAE on `#dae-lantern`.
Communications: DAE posts the release note in `#dae-lantern`; service desk not involved.

## 8. Rollback plan

| | |
|---|---|
| Rollback trigger | `verify:partial-ivy` or the publish step fails in `lantern-sdk-release`; or a consumer reports 3.0.0 cannot be linked on its Angular version. |
| Rollback steps | 1. Revert the framework commit (`LNTN-401 Upgrade Angular 12 to 13`) and its companion tooling/test/doc commits on `develop` via a revert PR. 2. If 3.0.0 was published: `npm deprecate @northgate/lantern-sdk@3.0.0 "withdrawn, use 2.4.1"` on Artifactory (never unpublish). 3. Consumers are unaffected: 2.4.1 stays published and pinned. |
| Rollback duration | 15 minutes (revert PR + deprecate). |
| Point of no return | None for this CHG. Publishing 3.0.0 does not change any consumer; the version can be deprecated. |
| Rollback tested in uat on | not applicable (library publish; revert is a git operation, deprecate is reversible with `npm deprecate ... ""`). |

## 9. AI-assisted changes

| | |
|---|---|
| AI-assisted content present | Yes |
| Tool(s) and approved-tool register entry | Devin (Cognition), register entry AIT-014 (TECH-POL-031) |
| Commits or PRs carrying the `AI-Assisted:` trailer | All commits on `feature/LNTN-401-angular-12-to-13` (Lantern) and `feature/LNTN-401-lantern-partial-ivy-verify` (workspace); PR links in `REPORT.md` |
| Human reviewer(s) of the AI-assisted content (not the prompter) | TBC (DAE reviewer + `@northgate/cswt-architecture`) |
| Review evidence | PR review with `northgate-platform-tooling/docs/templates/PR_REVIEW_AI.md` checklist completed (to be linked) |
| Scanner results for AI-assisted files specifically | same as section 6, no delta (whole repository scanned; Checkmarx and Sonar clean) |

## 10. Post implementation

- Hypercare owner and duration: DAE on-call (business hours), 48 hours after publish.
- Success criteria: `@northgate/lantern-sdk@3.0.0` resolvable from Artifactory with the expected peer range; `lantern-sdk-release` green; no consumer build breakage (none expected, no pin changes).
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
