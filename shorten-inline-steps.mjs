/**
 * Shorten body texts in Data files where the Viz file has inline Step functions.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, basename } from 'path';

const files = execSync(
  `grep -rl "body:.*\\\\\\\\n.*\\\\\\\\n" --include="*Data.ts" src/pages/articles/`,
  { encoding: 'utf-8' }
).trim().split('\n').filter(Boolean);

let modified = 0, bodiesShortened = 0;

for (const file of files) {
  const dir = dirname(file);
  const dirFiles = readdirSync(dir);

  // Skip if already has separate Parts/Steps files
  const hasPartsFile = dirFiles.some(f =>
    (f.includes('Steps') || f.includes('Parts')) && f.endsWith('.tsx')
  );
  if (hasPartsFile) continue;

  // Check if the Viz file has inline Step functions
  const base = basename(file).replace(/Data\.ts$/, '').replace(/VizData\.ts$/, 'Viz');
  const vizCandidates = dirFiles.filter(f => f.endsWith('.tsx') && !f.includes('Data'));
  let hasInlineSteps = false;
  for (const vf of vizCandidates) {
    try {
      const vizSrc = readFileSync(`${dir}/${vf}`, 'utf-8');
      if (/function Step\d|const R = \[/.test(vizSrc)) {
        hasInlineSteps = true;
        break;
      }
    } catch {}
  }

  if (!hasInlineSteps) continue;

  let src = readFileSync(file, 'utf-8');
  let changed = false;

  src = src.replace(/body:\s*'([^']*\\n[^']*)'/g, (match, body) => {
    if (!body.includes('\\n')) return match;

    const lines = body.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length <= 1) return match;

    let best = lines[0];
    if (best.length < 25 && lines.length > 1) {
      best = best + ' — ' + lines[1];
    }
    if (best.length > 85) {
      best = best.substring(0, 82) + '...';
    }
    best = best.replace(/'/g, "\\'");

    changed = true;
    bodiesShortened++;
    return `body: '${best}'`;
  });

  if (changed) {
    writeFileSync(file, src);
    modified++;
  }
}

console.log(`Modified: ${modified}, Bodies shortened: ${bodiesShortened}`);
