// NestEgg — "Make the best household budget site" (best-household-budget-site-20261126-1457).
// A warm, family-focused household budget site: plain static files under app/ (ES modules, CSS, no build
// step, no network), its content held in its own files. This program hands it in: it copies app/ and
// screenshots/ from beside this file to /output and writes /output/dossier.json, the summary the judge
// reads (your screenshots, the first load's files and bytes, and your source), with the vendored make.fun
// library. Leave vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to be byte for
// byte what its own copy writes.
//
// NestEgg's own adaptation: before writing the dossier it checks the two hand-in folders are actually
// there, so a run from a half-copied tree fails loudly instead of handing in an empty entry.
//
// Serve it locally with `node serve.ts` style serving, or:
//   cd app && python3 -m http.server 8123
// then open http://127.0.0.1:8123/ — the dashboard, transactions, budgets, bills and goals pages.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

if (!existsSync(join(here, 'app', 'index.html'))) {
  throw new Error('NestEgg hand-in refused: app/index.html is missing beside main.ts');
}
if (!existsSync(join(here, 'screenshots'))) {
  throw new Error('NestEgg hand-in refused: screenshots/ is missing beside main.ts');
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
