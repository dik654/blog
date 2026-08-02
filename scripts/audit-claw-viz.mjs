import { chromium } from 'playwright';

const ORIGIN = (process.env.QA_BASE_URL ?? 'https://heru.ragdoll-bigeye.ts.net').replace(/\/$/, '');
const BASE = `${ORIGIN}/lab/blog/ai`;
const PAGES = [
  'agent-frameworks?path=ai-agent-runtime-cases',
  'claw-compaction',
  'claw-bash',
  'claw-mcp',
  'claw-task-team',
  'claw-permissions',
  'claw-tool-system',
  'claw-subagent-orchestration',
  'claw-recovery',
  'claw-telemetry',
  'claw-session',
  'claw-hooks',
  'xml-prompting',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch();
const fails = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();

  page.on('pageerror', (e) => fails.push({ kind: 'pageerror', vp: vp.name, msg: e.message }));
  page.on('console', (m) => {
    if (m.type() === 'error') fails.push({ kind: 'console', vp: vp.name, msg: m.text() });
  });

  for (const slug of PAGES) {
    const url = `${BASE}/${slug}`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    // wait for framer-motion entries
    await page.waitForTimeout(2000);

    // 1) check horizontal overflow on any element
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return { scrollW: doc.scrollWidth, clientW: doc.clientWidth };
    });
    if (overflow.scrollW > overflow.clientW + 1) {
      fails.push({ kind: 'overflow-x', vp: vp.name, slug, ...overflow });
    }

    // 2) Audit semantic Viz surfaces, including HTML/Framer Motion labs without SVG.
    const surfaces = await page.evaluate(() => {
      const out = [];
      const surfaceSelector = [
        '[data-viz-canvas]',
        '[data-step-viz-stage]',
        '[data-runtime-ownership-lab]',
        '[data-agent-selection-lab]',
        '[data-orchestration-contract-lab]',
        '[data-recovery-boundary-lab]',
        '[data-telemetry-pipeline-lab]',
        '[data-session-field-map]',
        '[data-session-owner-map]',
        '[data-xml-boundary]',
      ].join(',');
      const containers = document.querySelectorAll(surfaceSelector);
      containers.forEach((surface, ci) => {
        const rect = surface.getBoundingClientRect();
        const clippedControls = [...surface.querySelectorAll('button, code, output, [data-math-fit]')]
          .flatMap((element) => {
            const target = element.getBoundingClientRect();
            if (target.width < 1 || target.height < 1) return [];
            if (target.left >= rect.left - 1 && target.right <= rect.right + 1) return [];
            return [{
              tag: element.tagName,
              text: (element.textContent ?? '').trim().slice(0, 80),
              left: Math.round(target.left),
              right: Math.round(target.right),
            }];
          });
        const svgCounts = [];
        surface.querySelectorAll('svg').forEach((svg) => {
        const targets = svg.querySelectorAll('rect, polygon, circle, ellipse, foreignObject');
        const boxes = [];
        targets.forEach((el) => {
          if (el.tagName === 'rect' && el.getAttribute('fill') === null) return; // skip bg pattern rects
          try {
            const b = el.getBBox();
            // skip pattern/defs sized 0
            if (b.width < 2 || b.height < 2) return;
            const tag = el.tagName;
            const text = el.getAttribute('data-label') || '';
            boxes.push({ tag, text, x: b.x, y: b.y, w: b.width, h: b.height });
          } catch (_) {}
        });
          svgCounts.push(boxes.length);
        });
        out.push({
          ci,
          clientWidth: surface.clientWidth,
          scrollWidth: surface.scrollWidth,
          svgCounts,
          clippedControls,
        });
      });
      return out;
    });
    for (const surface of surfaces) {
      if (surface.scrollWidth > surface.clientWidth + 1) {
        fails.push({ kind: 'viz-overflow-x', vp: vp.name, slug, ...surface });
      }
      for (const clippedControl of surface.clippedControls) {
        fails.push({
          kind: 'viz-control-clip',
          vp: vp.name,
          slug,
          surface: surface.ci,
          ...clippedControl,
        });
      }
    }

    // 3) check that no text element is clipped by its parent foreignObject — measure scrollHeight vs offsetHeight
    const clipped = await page.evaluate(() => {
      const arr = [];
      document.querySelectorAll('.not-prose foreignObject > div').forEach((d) => {
        if (d.scrollHeight > d.clientHeight + 1 || d.scrollWidth > d.clientWidth + 1) {
          arr.push({
            html: d.outerHTML.slice(0, 120),
            scrollH: d.scrollHeight, clientH: d.clientHeight,
            scrollW: d.scrollWidth, clientW: d.clientWidth,
          });
        }
      });
      return arr;
    });
    if (clipped.length) {
      clipped.forEach((c) => fails.push({ kind: 'fo-clip', vp: vp.name, slug, ...c }));
    }

    // 4) screenshot to disk for visual review
    const fn = `/tmp/claw-audit-${vp.name}-${slug}.png`;
    await page.screenshot({ path: fn, fullPage: true });

    console.log(`[${vp.name}] ${slug} ok · surfaces ${surfaces.length} · clip ${clipped.length} · shot ${fn}`);
  }
  await ctx.close();
}

await browser.close();

if (fails.length) {
  console.log('\n===== FAILURES =====');
  for (const f of fails) console.log(JSON.stringify(f));
  process.exitCode = 1;
} else {
  console.log('\nno failures detected.');
}
