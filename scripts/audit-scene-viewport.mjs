import { chromium } from 'playwright';

const baseUrl = process.env.SCENE_AUDIT_BASE_URL ?? 'http://127.0.0.1:4177';
const routes = [
  '/lab/blog/ai/attention-theory',
  '/lab/blog/ai/backprop-optimization',
  '/lab/blog/ai/diffusion-models',
  '/lab/blog/ai/transformer-architecture',
  '/lab/blog/ai/scene-engine-test',
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

function shortRoute(route) {
  return route.split('/').filter(Boolean).at(-1);
}

async function inspectScene(scene, route, viewport, sceneIndex, step) {
  return scene.evaluate((root, context) => {
    const svg = root.querySelector('svg[data-viz-fit="true"]');
    if (!svg) return [];

    const target = (svg.getAttribute('data-scene-target-viewbox') ?? '')
      .split(/\s+/)
      .map(Number);
    if (target.length !== 4 || target.some((value) => !Number.isFinite(value))) return [];
    const [viewX, viewY, viewWidth, viewHeight] = target;
    const viewRight = viewX + viewWidth;
    const viewBottom = viewY + viewHeight;

    const tolerance = 1;
    const findings = [];
    const candidates = svg.querySelectorAll('text');

    for (const element of candidates) {
      const rect = element.getBBox();
      if (rect.width < 0.1 || rect.height < 0.1) continue;
      const right = rect.x + rect.width;
      const bottom = rect.y + rect.height;

      const intersects = right > viewX + tolerance
        && rect.x < viewRight - tolerance
        && bottom > viewY + tolerance
        && rect.y < viewBottom - tolerance;
      if (!intersects) continue;

      const overflow = {
        left: Math.max(0, viewX - rect.x),
        right: Math.max(0, right - viewRight),
        top: Math.max(0, viewY - rect.y),
        bottom: Math.max(0, bottom - viewBottom),
      };
      const clipped = Object.values(overflow).some((amount) => amount > tolerance);
      if (!clipped) continue;

      findings.push({
        ...context,
        text: element.textContent?.trim().slice(0, 90) ?? '',
        overflow: Object.fromEntries(
          Object.entries(overflow)
            .filter(([, amount]) => amount > tolerance)
            .map(([side, amount]) => [side, Math.round(amount * 10) / 10]),
        ),
        viewBox: svg.getAttribute('data-scene-target-viewbox'),
      });
    }

    return findings;
  }, {
    route,
    viewport: viewport.name,
    scene: sceneIndex + 1,
    step,
  });
}

async function auditRoute(browser, route, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: 'reduce',
  });
  await context.addInitScript(() => {
    window.MutationObserver = class {
      observe() {}
      disconnect() {}
      takeRecords() { return []; }
    };
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push({
    route,
    viewport: viewport.name,
    kind: 'pageerror',
    message: error.message,
  }));

  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  const scenes = page.locator('[data-scene]');
  const sceneCount = await scenes.count();
  const findings = [];
  let stateCount = 0;

  for (let sceneIndex = 0; sceneIndex < sceneCount; sceneIndex += 1) {
    const scene = scenes.nth(sceneIndex);
    const buttons = scene.locator('button[aria-label^="step "]');
    const stepCount = await buttons.count();
    const firstStep = viewport.name === 'mobile' ? 1 : 0;

    for (let step = firstStep; step < stepCount; step += 1) {
      await buttons.nth(step).evaluate((button) => button.click());
      await page.waitForTimeout(24);
      findings.push(...await inspectScene(scene, route, viewport, sceneIndex, step));
      stateCount += 1;
    }
  }

  const documentOverflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (documentOverflow.scrollWidth > documentOverflow.clientWidth + 1) {
    errors.push({
      route,
      viewport: viewport.name,
      kind: 'document-overflow',
      ...documentOverflow,
    });
  }

  await context.close();
  return { route, viewport: viewport.name, sceneCount, stateCount, findings, errors };
}

const browser = await chromium.launch();
const jobs = viewports.flatMap((viewport) => (
  routes.map((route) => auditRoute(browser, route, viewport))
));
const reports = await Promise.all(jobs);
await browser.close();

const totals = reports.reduce((result, report) => ({
  scenes: result.scenes + report.sceneCount,
  states: result.states + report.stateCount,
  clips: result.clips + report.findings.length,
  errors: result.errors + report.errors.length,
}), { scenes: 0, states: 0, clips: 0, errors: 0 });

for (const report of reports) {
  console.log(
    `${report.viewport.padEnd(7)} ${shortRoute(report.route).padEnd(25)}`
    + ` scenes=${String(report.sceneCount).padStart(2)}`
    + ` states=${String(report.stateCount).padStart(3)}`
    + ` clips=${String(report.findings.length).padStart(3)}`,
  );
}

console.log(`\nTotals: ${JSON.stringify(totals)}`);

const findings = reports.flatMap((report) => report.findings);
if (findings.length > 0) {
  console.log('\nClipped SVG labels:');
  for (const finding of findings.slice(0, 160)) console.log(JSON.stringify(finding));
  if (findings.length > 160) console.log(`... ${findings.length - 160} more`);
}

const errors = reports.flatMap((report) => report.errors);
if (errors.length > 0) {
  console.log('\nRuntime/layout errors:');
  for (const error of errors) console.log(JSON.stringify(error));
}

if (findings.length > 0 || errors.length > 0) process.exitCode = 1;
