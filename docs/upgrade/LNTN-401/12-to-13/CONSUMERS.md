<!-- Generated with AI assistance (AIT-014) on 2026-09-08; reviewed by <handle>. -->

# LNTN-401 Angular 12 -> 13: consumer verification for `@northgate/lantern-sdk` 3.0.0

Candidate: `@northgate/lantern-sdk@3.0.0`, peers `@angular/{common,core,router} >=13.0.0 <14.0.0`,
`rxjs >=6.5.0 <7.0.0`, partial-Ivy output. Published to Verdaccio only (`npm run publish:local`,
[`publish-verdaccio.log`](publish-verdaccio.log); registry state in
[`consumers/retail-web/verdaccio-lantern-versions.log`](consumers/retail-web/verdaccio-lantern-versions.log)).
Nothing was published to Artifactory.

Playbook rule: a partial-Ivy library is only supported on consumers at or above its Angular major,
and a consumer is verified formally (pin, `npm ci`, lint, test, build, `verify-estate.sh`,
`smoke.sh`) only when it is **on** the library's target major. No `@northgate/lantern-sdk` consumer
is on Angular 13, so no consumer changes pin in this PR.

## Result table

| Consumer | Angular | Node | Lantern pin today | Result | Notes |
|---|---|---|---|---|---|
| `northgate-retail-web` | 14.3.0 | 16.20.2 | 2.4.1 | **NOT_SUPPORTED_UNTIL_CONSUMER_HOP** | Angular 14 is outside 3.0.0's peer range (`<14.0.0`). retail-web pins 4.0.0 (Lantern on Angular 14) in its own MOL PR after the 13 -> 14 hop. Scratch evidence below, gathered for the 13 -> 14 CAB. |
| `northgate-business-web` | 14.2.12 | 14.21.3 | none | NOT_APPLICABLE | The Lantern README lists business-web as a consumer but its `package.json` has no `@northgate/lantern-sdk` dependency (estate overview, CNPY-2140 pin table). |
| Beacon ops console | n/a | n/a | unknown | NOT_APPLICABLE | Outside the `northgate-*` estate; not verifiable here. Listed for completeness. |

No FAIL, so release is not blocked. No consumer repository or lockfile in `/home/ubuntu/repos/` was
modified; retail-web's `package.json` still reads `"@northgate/lantern-sdk": "2.4.1"`.

## retail-web scratch evidence (not a formal verification)

Purpose: a data point for the 13 -> 14 hop showing that Angular 14's linker consumes Lantern's
partial-Ivy output and that retail-web's behaviour does not change. It is not the consumer gate: the
peer range says Angular 14 is unsupported until 4.0.0, and retail-web's pin bump is its own PR.

Method: two detached `git worktree`s of `northgate-retail-web` at `origin/develop` under
`/home/ubuntu/` (not inside the repo, not committed), Node 16.20.2, `CHROME_BIN` set, retail's own
`.npmrc` (`legacy-peer-deps=true` from MOL-3611, never passed on the command line):

- `baseline-2.4.1`: unmodified manifest, `npm ci`, `npm run build:prod`, `npm run test:ci`, `npm run lint`.
- `lantern-3.0.0`: same, with only the scratch `package.json` pin changed `2.4.1 -> 3.0.0` and the
  scratch lockfile regenerated.

Baseline caveat: the committed retail lockfile carries Artifactory integrity hashes for the
`@northgate/*` tarballs. Verdaccio serves rebuilt tarballs with different hashes, so `npm ci` fails
with `EINTEGRITY` on a fresh Verdaccio. For both scratch trees the `@northgate/*` `integrity`
fields were dropped from the **scratch** lockfile only (the mock-external `publish-internal.sh`
flow has the same property). `@northgate/lantern-sdk@2.4.1` was rebuilt from
`northgate-lantern-sdk@origin/develop` with `publish-internal.sh --only lantern-sdk` so the baseline
could install; as a side effect Verdaccio's `latest` dist-tag now points at 2.4.1 (consumers pin
exact versions, so nothing resolves through `latest`).

| Check | baseline (Lantern 2.4.1) | Lantern 3.0.0 | Log |
|---|---|---|---|
| `npm ci` | exit 0; `ngcc` postinstall processed `@northgate/lantern-sdk [es2015/esm2015]` | exit 0; `ngcc` postinstall ran and had nothing to process for Lantern (`__processed_by_ivy_ngcc__` absent) | [`baseline-2.4.1/install.log`](consumers/retail-web/baseline-2.4.1/install.log), [`lantern-3.0.0/install.log`](consumers/retail-web/lantern-3.0.0/install.log) |
| installed package | 2.4.1, peers `>=12 <13`, `__ivy_ngcc__/`, `bundles/`, `.metadata.json` present | 3.0.0, peers `>=13 <14`, `esm2020/ fesm2015/ fesm2020/`, no UMD, no metadata, no ngcc artefacts | [`baseline-2.4.1/installed-lantern.log`](consumers/retail-web/baseline-2.4.1/installed-lantern.log), [`lantern-3.0.0/installed-lantern.log`](consumers/retail-web/lantern-3.0.0/installed-lantern.log) |
| `npm run build:prod` | exit 0; `en-US` + `es`; initial total 2.05 MB; **pre-existing** warning `initial exceeded maximum budget ... not met by 54.00 kB` | exit 0; `en-US` + `es`; initial total 2.05 MB; same warning, `not met by 53.79 kB` (210 B smaller `main.*.js`) | [`baseline-2.4.1/build.log`](consumers/retail-web/baseline-2.4.1/build.log), [`lantern-3.0.0/build.log`](consumers/retail-web/lantern-3.0.0/build.log) |
| linked bundle | `sdk:"@northgate/lantern-sdk@2.4.1"`, `data-lantern-sdk` x2 | version literal `"3.0.0"`, `data-lantern-sdk` x2, zero `ngDeclare` left (linker consumed every partial declaration) | `installed-lantern.log` (both) |
| `npm run test:ci` | 196 of 198 (2 skipped, pre-existing) SUCCESS, exit 0; coverage 35.41 / 22.19 / 28.63 / 36.19 | 196 of 198 (same 2 skipped) SUCCESS, exit 0; coverage identical | [`baseline-2.4.1/test.log`](consumers/retail-web/baseline-2.4.1/test.log), [`lantern-3.0.0/test.log`](consumers/retail-web/lantern-3.0.0/test.log) |
| `npm run lint` | 0 errors, 2 warnings (`src/zone-flags.ts` `no-explicit-any`), exit 0 | identical | [`baseline-2.4.1/lint.log`](consumers/retail-web/baseline-2.4.1/lint.log), [`lantern-3.0.0/lint.log`](consumers/retail-web/lantern-3.0.0/lint.log) |
| `verify-estate.sh retail-web` | not run | `PASS localised builds en-US and es`; `SKIP repository checked out` (the script wants a real checkout at the component path, the scratch tree is a detached worktree) | [`lantern-3.0.0/verify-estate.log`](consumers/retail-web/lantern-3.0.0/verify-estate.log) |
| `smoke.sh` | not run | not run: needs the full mock estate (`estate-up.sh`) and its Lantern check posts a fixed event to `lantern-collector-mock` with `curl`, it does not exercise the SDK. Belongs to the retail-web 4.0.0 pin PR. | |

Reading: the budget warning, the 2 skipped specs and the 2 lint warnings exist on retail-web
`develop` today and are unchanged by Lantern 3.0.0; the initial bundle shrinks by 210 bytes. The
baseline coverage line is retail-web's own gate and is unaffected.

## What the 13 -> 14 consumer PR must do (not this PR)

- retail-web (MOL epic, mirror KAN-3): pin `@northgate/lantern-sdk` `2.4.1 -> 4.0.0`, `npm ci`,
  lint, `test:ci`, `build:prod`, `verify-estate.sh retail-web`, `smoke.sh` against `estate-up.sh`;
  once no View Engine package remains, drop `ngcc` from `postinstall` (prerequisite for 16).
- Verdaccio `latest` dist-tag: re-point at the newest release when 4.0.0 is published locally
  (`npm dist-tag add`), or ignore, since every consumer pins exact versions.
