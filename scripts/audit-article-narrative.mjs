import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4177';
const reportPath = process.env.NARRATIVE_AUDIT_REPORT ?? '/tmp/article-narrative-audit.json';
const routeFilter = (process.env.NARRATIVE_AUDIT_ROUTES ?? '')
  .split(',')
  .map((route) => route.trim())
  .filter(Boolean);
const routePrefix = process.env.NARRATIVE_AUDIT_ROUTE_PREFIX?.trim() ?? '';
const requested = (process.env.NARRATIVE_AUDIT_VIEWPORTS ?? 'desktop,mobile').split(',');
const viewportMap = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};
const viewports = requested
  .map((name) => ({ name, ...viewportMap[name] }))
  .filter((viewport) => viewport.width);

const browser = await chromium.launch({ headless: true });
const discovery = await browser.newPage({ viewport: viewportMap.desktop });
await discovery.goto(`${base}/lab/blog/`, { waitUntil: 'networkidle' });
const discovered = await discovery.locator('a[href]').evaluateAll((links) => (
  [...new Set(links
    .map((link) => link.getAttribute('href') ?? '')
    .filter((href) => /^\/lab\/blog\/[^/]+\/[^/#?]+$/.test(href)))]
));
await discovery.close();

const prefixRoutes = routePrefix
  ? discovered.filter((route) => route.startsWith(routePrefix))
  : discovered;
const routes = (routeFilter.length
  ? discovered.filter((route) => routeFilter.includes(route))
  : prefixRoutes).sort();
const findings = [];
const stats = { routes: routes.length, checks: 0, scenes: 0, stepViz: 0, visualSurfaces: 0 };

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  let runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
  });

  for (const route of routes) {
    runtimeErrors = [];
    stats.checks += 1;
    try {
      await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await page.locator('h1').waitFor({ state: 'visible', timeout: 10_000 });
      await page.waitForTimeout(520);
    } catch (error) {
      findings.push({ severity: 'error', viewport: viewport.name, route, kind: 'navigation', message: error.message });
      continue;
    }

    const audit = await page.evaluate(() => {
      const scenes = Array.from(document.querySelectorAll('[data-scene]'));
      const stepViz = Array.from(document.querySelectorAll('[data-step-viz]'));
      const visualSurfaces = Array.from(document.querySelectorAll('.article-viz-surface'));
      const sceneIssues = scenes.flatMap((scene, index) => {
        const issues = [];
        if (!scene.querySelector('[data-scene-question]')) issues.push({ index, kind: 'scene-missing-question' });
        if (scene.getAttribute('data-scene-has-takeaway') !== 'true') issues.push({ index, kind: 'scene-missing-takeaway' });
        return issues;
      });
      const stepIssues = stepViz.flatMap((viz, index) => {
        const narrative = viz.querySelector('[data-step-viz-narrative]');
        const stage = viz.querySelector('[data-step-viz-stage]');
        if (!narrative || !stage) return [{ index, kind: 'step-viz-missing-narrative' }];
        const before = Boolean(narrative.compareDocumentPosition(stage) & Node.DOCUMENT_POSITION_FOLLOWING);
        return before ? [] : [{ index, kind: 'step-viz-narrative-after-stage' }];
      });
      const headingJumps = Array.from(document.querySelectorAll('article h2, article h3')).flatMap((heading) => {
        let next = heading.nextElementSibling;
        while (next && next.matches('script, style')) next = next.nextElementSibling;
        if (!next) return [];
        const surface = next.matches('.article-viz-surface')
          ? next
          : next.querySelector(':scope > .article-viz-surface');
        if (!surface) return [];
        if (surface !== next) {
          let previous = surface.previousElementSibling;
          while (previous && previous.matches('script, style')) previous = previous.previousElementSibling;
          if (previous) return [];
        }
        if (surface.hasAttribute('data-viz-context') || surface.querySelector('[data-scene-question], [data-step-viz-narrative]')) return [];
        return [{
          kind: 'heading-directly-to-viz',
          heading: (heading.textContent ?? '').trim().slice(0, 80),
        }];
      });
      const mobileStartsCropped = innerWidth <= 640
        ? visualSurfaces.flatMap((surface, index) => {
            if (!surface.hasAttribute('data-viz-needs-pan')) return [];
            const target = surface.querySelector('[data-viz-readable-target="true"]');
            if (!target) return [];
            const surfaceWidth = surface.getBoundingClientRect().width;
            const targetWidth = target.getBoundingClientRect().width;
            return targetWidth > surfaceWidth + 2 && !surface.hasAttribute('data-viz-inline-detail')
              ? [{ index, kind: 'mobile-default-cropped', surfaceWidth: Math.round(surfaceWidth), targetWidth: Math.round(targetWidth) }]
              : [];
          })
        : [];

      return {
        scenes: scenes.length,
        stepViz: stepViz.length,
        visualSurfaces: visualSurfaces.length,
        overflow: document.documentElement.scrollWidth - innerWidth,
        issues: [...sceneIssues, ...stepIssues, ...headingJumps, ...mobileStartsCropped],
      };
    });

    stats.scenes += audit.scenes;
    stats.stepViz += audit.stepViz;
    stats.visualSurfaces += audit.visualSurfaces;
    if (audit.overflow > 1) {
      findings.push({ severity: 'error', viewport: viewport.name, route, kind: 'document-overflow', pixels: audit.overflow });
    }
    runtimeErrors.forEach((message) => findings.push({
      severity: 'error', viewport: viewport.name, route, kind: 'runtime', message,
    }));
    audit.issues.forEach((issue) => findings.push({
      severity: 'warning', viewport: viewport.name, route, ...issue,
    }));
  }
  await context.close();
}

await browser.close();

const report = {
  generatedAt: new Date().toISOString(),
  base,
  viewports: viewports.map(({ name, width, height }) => ({ name, width, height })),
  stats,
  summary: {
    errors: findings.filter((finding) => finding.severity === 'error').length,
    warnings: findings.filter((finding) => finding.severity === 'warning').length,
  },
  findings,
};

await writeFile(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ reportPath, ...report.stats, ...report.summary }, null, 2));
if (report.summary.errors > 0 || report.summary.warnings > 0) process.exitCode = 1;
