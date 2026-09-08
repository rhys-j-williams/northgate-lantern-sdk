#!/usr/bin/env node
/*
 * Post-build gate, LNTN-401 (supersedes the View Engine gate from LNTN-412). Confirms
 * dist/lantern-sdk is an Ivy *partial* compilation (compilationMode: "partial"): every Angular
 * class carries an ɵɵngDeclare* call for the consumer's linker, there is no full-Ivy
 * (ɵɵdefine*) output that would tie the package to one Angular patch line, none of the View
 * Engine artefacts (*.metadata.json, "metadata" entry point) remain, and the published peer range
 * is the Angular major the build was compiled with (partial output is only supported on consumers
 * at or above that major).
 *
 * Runs against dist/ by default; pass a tarball path to inspect a packed .tgz instead (that is what
 * the release checklist does before `npm publish`).
 *
 * Exit 0 = good, 1 = wrong format, 2 = could not find the build.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const PACKAGE_NAME = '@northgate/lantern-sdk';
const PARTIAL_MARKERS = [
  '\u0275\u0275ngDeclareDirective',
  '\u0275\u0275ngDeclareNgModule',
  '\u0275\u0275ngDeclareInjectable',
  '\u0275\u0275ngDeclareFactory'
];
const FULL_IVY_MARKERS = [
  '\u0275\u0275defineComponent',
  '\u0275\u0275defineDirective',
  '\u0275\u0275defineNgModule',
  '\u0275\u0275defineInjectable',
  '\u0275\u0275defineInjector'
];
const IVY_DECLARATION_TYPES = [
  '\u0275\u0275DirectiveDeclaration',
  '\u0275\u0275NgModuleDeclaration',
  '\u0275\u0275InjectableDeclaration',
  '\u0275\u0275FactoryDeclaration'
];
const PUBLIC_API = [
  'LanternModule',
  'LanternService',
  'LanternRouterTracker',
  'maskPath',
  'LanternTrackDirective',
  'LanternSessionInterceptor',
  'LANTERN_CONFIG',
  'LanternConfig',
  'installQueueStub'
];

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p, out);
    } else {
      out.push(p);
    }
  }
  return out;
}

function unpack(tgz, tmp) {
  execFileSync('tar', ['-xzf', tgz, '-C', tmp]);
  return path.join(tmp, 'package');
}

function verify(root) {
  if (!fs.existsSync(path.join(root, 'package.json'))) {
    console.error(`verify-partial-ivy: no package at ${root}; run npm run build first`);
    return 2;
  }

  const files = walk(root, []);
  const problems = [];

  const metadata = files.filter((f) => f.endsWith('.metadata.json'));
  for (const m of metadata) {
    problems.push(`${path.relative(root, m)} is View Engine metadata; check compilationMode in tsconfig.lib.prod.json`);
  }

  const bundles = files.filter((f) => /\.m?js$/.test(f) && !f.endsWith('.map'));
  const fesm = bundles.filter((f) => path.basename(path.dirname(f)).startsWith('fesm'));
  if (fesm.length === 0) {
    problems.push('no fesm* bundle emitted; this does not look like an ng-packagr build');
  }
  for (const f of fesm) {
    const src = fs.readFileSync(f, 'utf8');
    for (const marker of PARTIAL_MARKERS) {
      if (!src.includes(marker)) {
        problems.push(`${path.relative(root, f)} has no ${marker}; expected a partial compilation`);
      }
    }
    for (const marker of FULL_IVY_MARKERS) {
      if (src.includes(marker)) {
        problems.push(`${path.relative(root, f)} contains full-Ivy marker ${marker}; the linker cannot process it`);
      }
    }
    if (src.includes('__ivy_ngcc__') || src.includes('ngcc_version')) {
      problems.push(`${path.relative(root, f)} was processed by ngcc; publish the raw build`);
    }
  }

  const dts = files.filter((f) => f.endsWith('.d.ts'));
  const dtsText = dts.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  for (const decl of IVY_DECLARATION_TYPES) {
    if (!dtsText.includes(decl)) {
      problems.push(`no ${decl} in the d.ts output; Ivy type declarations are missing`);
    }
  }
  for (const symbol of PUBLIC_API) {
    if (!dtsText.includes(symbol)) {
      problems.push(`public API symbol ${symbol} is not exported from the typings`);
    }
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  if (pkg.name !== PACKAGE_NAME) {
    problems.push(`unexpected package name ${pkg.name}`);
  }
  if (pkg.metadata) {
    problems.push('package.json still has a View Engine "metadata" entry point');
  }
  for (const field of ['module', 'es2020', 'esm2020', 'fesm2020', 'fesm2015', 'typings']) {
    if (!pkg[field]) {
      problems.push(`package.json is missing the ${field} entry point ng-packagr 13 writes`);
    }
  }
  if (!pkg.exports || !pkg.exports['.']) {
    problems.push('package.json has no "exports" map');
  }
  const major = angularMajor();
  const expectedPeer = `>=${major}.0.0 <${major + 1}.0.0`;
  for (const dep of ['@angular/common', '@angular/core', '@angular/router']) {
    const peer = (pkg.peerDependencies || {})[dep] || '';
    if (peer !== expectedPeer) {
      problems.push(`${dep} peer range is "${peer}", expected "${expectedPeer}" (the Angular major this build was compiled with)`);
    }
  }

  console.log(`verify-partial-ivy: ${pkg.name}@${pkg.version} at ${root}`);
  console.log(`  metadata files : ${metadata.length}`);
  console.log(`  js/mjs files   : ${bundles.length} (${fesm.length} fesm bundles)`);
  console.log(`  d.ts files     : ${dts.length}`);
  if (problems.length) {
    console.error('  FAIL');
    for (const p of problems) {
      console.error('   - ' + p);
    }
    return 1;
  }
  console.log('  OK: Ivy partial compilation, no View Engine output');
  return 0;
}

function angularMajor() {
  const workspace = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8'));
  return Number(workspace.dependencies['@angular/core'].split('.')[0]);
}

function main() {
  const arg = process.argv[2];
  let root = path.resolve(__dirname, '..', 'dist', 'lantern-sdk');
  let tmp = null;
  try {
    if (arg) {
      if (arg.endsWith('.tgz')) {
        tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lantern-verify-'));
        root = unpack(path.resolve(arg), tmp);
      } else {
        root = path.resolve(arg);
      }
    }
    process.exitCode = verify(root);
  } finally {
    if (tmp) {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }
}

main();
