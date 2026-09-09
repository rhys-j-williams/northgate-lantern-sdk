<!-- Generated with AI assistance (AIT-014) on 2026-09-09; reviewed by <handle>. -->

# LNTN-401 Angular 14 -> 15: consumer verification for `@northgate/lantern-sdk` 5.0.0

Candidate: `@northgate/lantern-sdk@5.0.0`, peers `@angular/{common,core,router} ^15.0.0`,
`rxjs ^7.5.0`, partial-Ivy output. Published to Verdaccio only via `npm run publish:local`
([`publish-verdaccio.log`](publish-verdaccio.log); pack preview in [`publish-dry-run.log`](publish-dry-run.log);
`npm view @northgate/lantern-sdk@5.0.0 --registry http://localhost:4873` in
[`verdaccio-lantern-versions.log`](verdaccio-lantern-versions.log)). Nothing was published to Artifactory.

Playbook rule: a partial-Ivy library is only supported on consumers at or above its Angular major.
retail-web is on Angular **14.3.0**, *below* 5.0.0's peer range, so the expected and correct result
for retail-web today is a peer-range **FAIL**: 5.0.0 is not installable there until retail-web moves
to Angular 15 in its own Stage 3 change (MOL-4471), which pins Lantern 5.0.0 and Canopy 4.0.0
together. The candidate is therefore verified functionally in a scratch Angular 15.2 host instead
(playbook rule 5). The verification ran in scratch checkouts only; no consumer repository was
modified or pushed.

## Result table

| Consumer | Angular | Node | Lantern pin today | Result | Notes |
|---|---|---|---|---|---|
| `northgate-retail-web` | 14.3.0 | 16.20.2 | 2.4.1 | **FAIL (expected)** | `ERESOLVE`: `peer @angular/common@"^15.0.0" from @northgate/lantern-sdk@5.0.0` vs `Found: @angular/common@14.3.0` in a scratch worktree of `origin/develop` (`8b456b7`). This is the peer range doing its job. retail-web stays on 2.4.1 today and moves to 5.0.0 in MOL-4471 (Stage 3) together with its own Angular 15 hop; 4.0.0 remains its supported Angular 14 target in the meantime. Evidence under [`consumers/retail-web/lantern-5.0.0/`](consumers/retail-web/lantern-5.0.0/). |
| Angular 15.2 scratch host (`ng new lantern-host15`) | 15.2.10 | 16.20.2 | 5.0.0 | **PASS** | Stand-in for the Stage 3 retail-web@15 shape: `LanternModule.forRoot`, router page tracking with GIS-1471 masking, `lanternTrack`, `LanternSessionInterceptor` compile under the Angular 15 linker; production build exit 0; 4/4 specs. Evidence under [`consumers/angular15-scratch-host/`](consumers/angular15-scratch-host/). |
| `northgate-business-web` | 14.2.12 | 14.21.3 | none | NOT_APPLICABLE | No `@northgate/lantern-sdk` dependency in its `package.json` (estate overview). |
| Beacon ops console | n/a | n/a | unknown | NOT_APPLICABLE | Outside the `northgate-*` estate; not verifiable here. Listed for completeness. |

The only FAIL is the expected one; the release is not blocked by it. `/home/ubuntu/repos/northgate-retail-web`
was not modified (`git status` clean, `git worktree list` back to the single main checkout) and no
retail PR was opened; retail-web `develop` still reads `"@northgate/lantern-sdk": "2.4.1"`.

## retail-web (Angular 14.3.0): method and result

- Detached `git worktree` of `northgate-retail-web` at `origin/develop` (`8b456b7`) in
  `/home/ubuntu/scratch-retail-web-lantern-5.0.0`, outside the repo, removed afterwards. Node
  16.20.2 / npm 8.19.4 (retail's own `.nvmrc`).
- Step 1, strict peers, straight from the tarball so that the result does not depend on Verdaccio:
  `npm install /home/ubuntu/northgate-lantern-sdk-5.0.0.tgz --package-lock-only --ignore-scripts
  --no-audit --no-fund --legacy-peer-deps=false` (`--ignore-scripts` because retail's `postinstall`
  runs `ngcc` and nothing is installed in lock-only mode; same workaround as the 13 -> 14 evidence).
  Result: **`ERESOLVE unable to resolve dependency tree`**, `While resolving:
  @northgate/retail-web@14.31.2`, `Found: @angular/common@14.3.0`, `Could not resolve dependency:
  peer @angular/common@"^15.0.0" from @northgate/lantern-sdk@5.0.0`, exit 1
  ([`install-strict-peers.log`](consumers/retail-web/lantern-5.0.0/install-strict-peers.log)).
- Step 2, retail-web's committed `.npmrc` as is (`legacy-peer-deps=true`, MOL-3611), resolving the
  published 5.0.0 from Verdaccio: the lock-only install "succeeds" (npm 8 does not enforce peers
  under `legacy-peer-deps`), but `npm ls --package-lock-only` reports `@angular/common@14.3.0`,
  `@angular/core@14.3.0` and `@angular/router@14.3.0` as **`invalid: "^15.0.0" from
  node_modules/@northgate/lantern-sdk`** and exits 1 with `ELSPROBLEMS`
  ([`install-legacy-peer-deps.log`](consumers/retail-web/lantern-5.0.0/install-legacy-peer-deps.log)).
  Not taken further: a partial-Ivy library compiled against Angular 15 is not supported on an
  Angular 14 linker regardless of what `legacy-peer-deps` lets npm write to the lockfile, and the
  README says so. Retail-web must not force 5.0.0 past the peer range.
- Only the scratch `package.json` / `package-lock.json` changed; the worktree was removed.

## Angular 15.2 scratch host: method

- `npx -y @angular/cli@15.2.11 new lantern-host15 --routing --style=css --skip-git --skip-install
  --package-manager=npm` in `/home/ubuntu/scratch-lantern-host15`
  ([`ng-new.log`](consumers/angular15-scratch-host/ng-new.log)). A fresh `ng new` was used rather
  than `ng update`-ing the retail-web scratch tree: retail-web's Angular 15 move is Stage 3's own
  work (Material MDC, Canopy 4.0.0, ngrx 15 ...) and a throwaway `ng update` of it would have
  produced a half-migrated tree whose failures say nothing about Lantern.
- Pinned to the estate's Angular 15 line before install: `@angular/*` 15.2.10, `@angular/cli` and
  `@angular-devkit/build-angular` 15.2.11, `@angular/compiler-cli` 15.2.10, `rxjs` **7.5.7**
  (retail-web's RxJS, inside the new `^7.5.0` peer), `zone.js` 0.12.0, `typescript` 4.9.5,
  `@types/node` 16.18.11 (the generated app first resolved `@types/node@22.20.2`, which TS 4.9
  cannot parse: `TS2502 'CompressionStream' is referenced directly or indirectly in its own type
  annotation`, see [`build-attempt1-types-node.log`](consumers/angular15-scratch-host/build-attempt1-types-node.log);
  the same pin Lantern and retail-web already carry).
- `npm install @northgate/lantern-sdk@5.0.0 --registry http://localhost:4873 --no-audit --no-fund`
  with strict peers (the `ng new` host has no `.npmrc`, so npm 8's default peer enforcement applies) ([`install.log`](consumers/angular15-scratch-host/install.log)): exit 0, no
  `ERESOLVE`, `npm ls` shows `@northgate/lantern-sdk@5.0.0` with `@angular/{common,core,router}@15.2.10`
  and `rxjs@7.5.7` deduped and valid. Installed package: version 5.0.0, peers `^15.0.0` / `^7.5.0`,
  no `.metadata.json`, no `__ivy_ngcc__` / `ngcc_version` markers, `ɵɵngDeclare*` markers present.
- App wiring (copied into [`consumers/angular15-scratch-host/`](consumers/angular15-scratch-host/)):
  `app.module.ts` imports `HttpClientModule` and `LanternModule.forRoot({ writeKey, scriptUrl,
  sessionHeaderUrlPrefixes: ['/api/'], appName, appVersion })`; `app-routing.module.ts` declares
  `''` (`data.lanternPage: 'home'`) and `accounts/:id`; `home.component.ts` has
  `<button lanternTrack="transfer.submit" [lanternProps]="{ amountBand: 'low' }">`.

## Angular 15.2 scratch host: results (Lantern 5.0.0)

| Check | Result | Log |
|---|---|---|
| `ng build --configuration production` | exit 0, no warnings; initial total 232.67 kB (64.43 kB transfer); Lantern linked by the Angular 15 linker inside `@angular-devkit/build-angular` 15.2.11 | [`build.log`](consumers/angular15-scratch-host/build.log) |
| `ng test --watch=false --browsers=ChromeHeadless --code-coverage` | Karma 6.4.4 / Chrome Headless 137: `Executed 4 of 4 SUCCESS`, exit 0 | [`test.log`](consumers/angular15-scratch-host/test.log) |
| `LanternModule.forRoot` | vendor `load` receives the write key; the injected `<script>` carries `data-lantern-sdk="5.0.0"` | [`app.component.spec.ts`](consumers/angular15-scratch-host/app.component.spec.ts) spec 1 |
| router page tracking | `LanternRouterTracker` is instantiated by `forRoot`; navigating to `/accounts/ACC-12345678?tab=x` produces a `page` event whose path is masked to `/accounts/:id` (GIS-1471 rules 1-3 unchanged) | spec 2 |
| `lanternTrack` directive | `LanternTrackDirective` is discoverable on the button; click emits `track('transfer.submit', { amountBand: 'low', ...})` with `sdk: '@northgate/lantern-sdk@5.0.0'` | spec 3 |
| `LanternSessionInterceptor` | registered by `forRoot`; `GET /api/accounts` carries `X-Analytics-Session`, `GET https://third.party.example/x` does not | spec 4 |

Reading: everything retail-web will use from Lantern (module bootstrap, router page events and their
masking, the click directive, the session header) compiles and behaves on Angular 15.2.10 / RxJS
7.5.7 / TS 4.9.5 / zone.js 0.12.0, which is the toolchain retail-web lands on in Stage 3. The first
spec draft asserted `sdk: '5.0.0'`; the SDK has always sent the package-qualified stamp
(`@northgate/lantern-sdk@<version>`), so the *spec* was corrected, not the library.

## What the retail-web pin PR must do (MOL-4471, Stage 3, not this PR)

- Move retail-web to Angular 15.2.x first (its own hop, with Canopy 4.0.0), then pin
  `@northgate/lantern-sdk` `2.4.1 -> 5.0.0` (exact) and regenerate the lockfile against Artifactory.
  Do not pin 5.0.0 while retail-web is on Angular 14: the strict-peer `ERESOLVE` above is the
  expected outcome and `legacy-peer-deps=true` only hides it.
- `npm ci`, lint, `test:ci`, `build:prod`, `verify-estate.sh retail-web`, `smoke.sh` as in the 4.0.0
  evidence ([`../13-to-14/CONSUMERS.md`](../13-to-14/CONSUMERS.md)).
- Once no View Engine `@northgate/*` package remains in retail-web, drop `ngcc` from `postinstall`
  (prerequisite for the estate's Angular 16 hop; Lantern's own 15 -> 16 is blocked on LNTN-140 / KAN-24).
- Until retail-web has moved, or for 90 days after 5.0.0 ships (GIS-STD-022 s3), 4.0.0 stays in
  security support as the Angular 14 line; a retail-web pin bump to 4.0.0 in the meantime is still
  valid (verified PASS in the 13 -> 14 evidence) and is MOL-4471's call.
- Verdaccio `latest` dist-tag: consumers pin exact versions, so nothing resolves through `latest`.
