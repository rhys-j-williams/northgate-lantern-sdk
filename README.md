# @northgate/lantern-sdk

Angular wrapper for the Lumenview Lantern web analytics script. Owned by **Digital Analytics
Enablement (DAE)**, Charlotte. Slack `#dae-lantern`, Jira `LNTN`. On-call is business hours only;
analytics is not a P1 service and nobody should be paged for it (see the SLO exemption in
`RISK-2019-118`).

Current release: **4.0.0** (Angular 14, partial Ivy; `LNTN-401`, 2026.10.2 train), the second and
last `LNTN-401` catch-up hop and the first release retail-web can pin. Previous lines: 3.0.0
(Angular 13, partial Ivy) and 2.4.1 (Angular 12, View Engine), both still published for consumers
on those majors. Next: Lantern follows the estate 14 -> 15 wave after `canopy-ui` 4 (Canopy MDC).

## What it does

- `LanternModule.forRoot(config)` loads the vendor script and wires everything below
- `LanternService` with `track`, `page`, `identify`, `reset`, `sessionId`
- page events on every router `NavigationEnd`, with ids and query strings masked
- `lanternTrack` attribute directive for click tracking
- `LanternSessionInterceptor` puts `X-Analytics-Session` on outbound `HttpClient` calls so BFF logs
  in Splunk can be joined to the vendor's session view

Consumers: retail-web (Northgate Online), business-web (Northgate Business), Beacon ops console
(read-only mode, `LNTN-302`). Iris does not use it; the Iris widget has its own vendor tagging.

## Installing

```
npm install @northgate/lantern-sdk@4.0.0 --save-exact
```

From Artifactory `npm-northgate`. Peer range is Angular 14 (`>=14.0.0 <15.0.0`, see below);
applications on Angular 13 stay on 3.0.0 and applications on Angular 12 on 2.4.1. Partial-Ivy
output is only supported on applications at or above the library's Angular major, so do not force
the install past the peer range: `legacy-peer-deps=true` in retail-web's `.npmrc` is there for
other reasons (`MOL-3611`). retail-web (Angular 14.3.0) is inside 4.0.0's range and was verified
against it (`docs/upgrade/LNTN-401/13-to-14/CONSUMERS.md`); its pin bump is a retail-web PR
(`MOL-4471`).

| library | Angular peer range | output | consumers |
| --- | --- | --- | --- |
| 2.4.1 | `>=12.0.0 <13.0.0` (retail-web installs it past the range with `legacy-peer-deps`; `ngcc` links it on install) | View Engine | retail-web 14.3.0 (current pin until `MOL-4471`), business-web |
| 3.0.0 | `>=13.0.0 <14.0.0` | partial Ivy | none in the estate (intermediate hop) |
| 4.0.0 | `>=14.0.0 <15.0.0` | partial Ivy | retail-web 14.3.0 (verified PASS; pin bump pending in `MOL-4471`) |

```ts
// app.module.ts
import { LanternModule } from '@northgate/lantern-sdk';

@NgModule({
  imports: [
    HttpClientModule,
    RouterModule.forRoot(routes),
    LanternModule.forRoot({
      writeKey: environment.lantern.writeKey,
      appName: 'retail-web',
      appVersion: environment.version,
      sessionHeaderUrlPrefixes: ['/api/', environment.bffBaseUrl],
      disabled: environment.name === 'qa'
    })
  ]
})
export class AppModule {}
```

`forRoot()` once, in `AppModule`. A second `forRoot()` in a lazy module throws on purpose
(`LNTN-219`; two vendor instances double counted business-web page views for a quarter).

Write keys are per application per environment and are not secrets; they live in `environment.ts`.
Do not point UAT at the prod write key, it pollutes the dashboards and Finance notice (`LNTN-388`).

### Config

| key | default | notes |
| --- | --- | --- |
| `writeKey` | required | Lumenview project write key |
| `scriptUrl` | Northgate hosted copy, see below | override only in the analytics sandbox |
| `collectorUrl` | script default | the local estate points this at `lantern-collector-mock` on 4607 |
| `trackRouterEvents` | `true` | |
| `attachSessionHeader` | `true` | |
| `sessionHeaderUrlPrefixes` | `[]` | empty means every request. Set it. GIS-1471 finding 6. |
| `sessionHeaderName` | `X-Analytics-Session` | changing it needs a Splunk field extraction change (`PLAT-1660`) |
| `disabled` | `false` | everything becomes a no-op; e2e suites use this |
| `debug` | `false` | console.debug every call |
| `appName`, `appVersion` | none | sent as context on every event |

### The vendor script

`lantern.min.js` is **not** loaded from the vendor CDN. The egress proxy blocks it everywhere but
the analytics sandbox, and Third Party Risk wanted a copy we control after the 2021 supply chain
review (`GIS-1188`). The default `scriptUrl` is the Northgate hosted copy at
`static.northgatetrust.example/vendor/lantern/4/`. DAE refreshes it when the vendor cuts a release we
have tested; the current copy is Web SDK 4.11. The refresh procedure is in the DAE runbook, and
involves the CAB because it is technically a prod change to a static bucket.

The SDK installs the vendor's queue stub before the script arrives, so a `page` fired on the first
`NavigationEnd` is not lost if the network is slow. Same behaviour as the vendor snippet.

For the local estate, `mock-external/lantern-collector-mock` serves a stand-in `lantern.min.js`
on port 4607 and stores whatever you send it; `estate-up.sh` publishes this package to the local
Verdaccio so the apps resolve it the same way they would from Artifactory.

## Privacy rules baked in

Most of this came out of `GIS-1471` (Q3 2022 privacy review of analytics traffic). Do not undo
them in application code.

- page paths are masked: query string and fragment dropped, segments that look like a customer,
  account, card, payment, transaction or statement id become `:id`. Numeric segments of six or
  more digits too. Use `data: { lanternPage: 'account-detail' }` on a route if you want a name
  instead of a path.
- `identify()` takes the opaque `CUS-` id. Never the login name, never the email address.
- the click directive sends the element's text with digits replaced by `#` and capped at 40
  characters. A masked card number on a button label was finding 5.
- the session header goes to the URL prefixes you list and nowhere else.

## Build and release

Node **14.21.3** (`.nvmrc`), Angular **14.3.0** (CLI 14.2.13), ng-packagr **14.2.2**, TypeScript
**4.7.4**, RxJS 6.6.7, zone.js 0.11.4, TypeScript target es2020. Lint is angular-eslint 14
(`.eslintrc.json`); TSLint and codelyzer were removed in 3.0.0 because the CLI 13 dropped the TSLint
builder and codelyzer does not support Angular 13. Node stays 14 for the 14 line (inside Angular 14's
`^14.15.0 || ^16.10.0`); the bump to 16.20.2 comes with 14 -> 15. The full matrix is in
`docs/upgrade/LNTN-401/COMPATIBILITY_MATRIX.md`.

```
nvm use
npm ci
npm run lint
npm test            # Karma, ChromeHeadless; CHROME_BIN if Chrome is somewhere odd
npm run build       # ng-packagr, production config
npm run verify:partial-ivy
npm run publish:local   # build, verify, pack, verify the tarball, publish to the registry in .npmrc
```

The library is built with **Angular 14 and Ivy partial compilation** (`compilationMode: "partial"` in
`tsconfig.lib.prod.json`), the Angular Package Format 14 layout (`fesm2015`, `fesm2020`, `esm2020`,
`index.d.ts`, no UMD, no `.metadata.json`). Consuming applications link the output with the Angular linker in their
own build, so the package must never be newer than the application's Angular major; the peer range
enforces that. `scripts/verify-partial-ivy.js` (`verify:partial-ivy`) is the release gate: it fails
if the output contains full-Ivy `ɵɵdefine*` or `ngcc` markers, if `ɵɵngDeclare*` markers or the
declaration types are missing, if a public API symbol disappears, if the Angular or rxjs peer range drifts, or if the
package version and the `SDK_VERSION` stamp disagree with the workspace version. The rationale for
the format change and for doing 12 -> 13 -> 14 as two releases is in
`docs/adr/0001-angular-12-to-13.md`; the 13 -> 14 hop itself is `docs/adr/0002-angular-13-to-14.md`;
the vendor script contract (`installQueueStub`, the queue drain, `lantern.min.js` 4.11) is unchanged.

`@types/node` is pinned to 16.18.11. Newer `@types/node` declare `Disposable`, which TS 4.x cannot
parse. Do not let Renovate move it (there is a rule, check `renovate.json` in platform-tooling if
it starts bumping again).

### Release cadence

Twice a year with the H1 and H2 trains. Patch releases as needed for defects, published from the
`lantern-sdk-release` Jenkins job (or a laptop for a patch, with a CAB standard change). Tag as
`lantern-sdk-vX.Y.Z`. Consumers pin exact versions; DAE raises the bump PRs in the app repos
during the release window, app teams merge them. History in `CHANGELOG.md`.

## Known issues

- `LNTN-441` the interceptor adds the header to `HttpClient` calls only. Anything going through
  `fetch` or the old `$http` shim in business-web is not tagged.
- `LNTN-377` the queue stub caps at whatever the vendor script does on drain; we have seen the
  first `identify` dropped on very slow 3G profiles. Not reproducible in Chrome devtools throttling.
- SSR: the service is a no-op outside the browser platform. Nobody renders server side today; it
  is there because business-web tried it once (`MBZ-2077`, reverted).
- The Beacon console loads the module with `disabled: true` and still gets the directive so that
  the templates compile. Fine, just odd to read.

## History

Started 2020 as an inline snippet in retail-web, extracted to a library in early 2021 after
business-web copied the snippet and diverged (`LNTN-101`). 1.x was the un-scoped `lantern-angular`
package; 2.0 (Nov 2021) renamed it to `@northgate/lantern-sdk` and moved to Angular 12. 2.2 added the
router masking after GIS-1471. 2.4 is the last View Engine line. 3.0 (`LNTN-401`) moved to Angular 13
and partial Ivy as the first of two catch-up hops ahead of the estate's Angular 15 wave; 4.0
(`LNTN-401`) moved to Angular 14 and is the first release the Angular 14 applications can pin.
