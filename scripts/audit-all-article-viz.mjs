import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4177';
const limit = Number(process.env.VIZ_AUDIT_LIMIT ?? 0);
const reportPath = process.env.VIZ_AUDIT_REPORT ?? '/tmp/article-viz-audit.json';
const routeFilter = (process.env.VIZ_AUDIT_ROUTES ?? '')
  .split(',')
  .map((route) => route.trim())
  .filter(Boolean);
const routePrefix = process.env.VIZ_AUDIT_ROUTE_PREFIX?.trim() ?? '';
const requested = (process.env.VIZ_AUDIT_VIEWPORTS ?? 'desktop,mobile').split(',');
const viewportMap = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 360, height: 800 },
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

const prefixRoutes = routePrefix ? discovered.filter((route) => route.startsWith(routePrefix)) : discovered;
const selectedRoutes = routeFilter.length > 0
  ? discovered.filter((route) => routeFilter.includes(route))
  : prefixRoutes;
const routes = (limit > 0 ? selectedRoutes.slice(0, limit) : selectedRoutes).sort();
const findings = [];
const stats = { routes: routes.length, checks: 0, surfaces: 0, svgs: 0, formulas: 0 };

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  let activeRoute = '';
  let runtimeErrors = [];

  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
  });

  for (const [routeIndex, route] of routes.entries()) {
    if (routeIndex % 25 === 0) {
      console.error(`[viz-audit] ${viewport.name} ${routeIndex}/${routes.length}`);
    }
    activeRoute = route;
    runtimeErrors = [];
    stats.checks += 1;

    let response;
    try {
      response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await page.locator('h1').waitFor({ state: 'visible', timeout: 10_000 });
      await page.waitForFunction(
        (expectedPath) => (
          window.location.pathname === expectedPath
          && Boolean(document.querySelector('h1')?.textContent?.trim())
        ),
        route,
        { timeout: 10_000 },
      );
      await page.waitForTimeout(520);
      await page.waitForFunction(
        (expectedPath) => (
          window.location.pathname === expectedPath
          && Boolean(document.querySelector('h1')?.textContent?.trim())
        ),
        route,
        { timeout: 10_000 },
      );
    } catch (error) {
      findings.push({ severity: 'error', viewport: viewport.name, route: activeRoute, kind: 'navigation', message: error.message });
      continue;
    }

    const audit = await page.evaluate(() => {
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        if (rect.width <= 1 || rect.height <= 1) return false;

        let opacity = 1;
        let current = element;
        while (current && current !== document.documentElement) {
          const style = getComputedStyle(current);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          opacity *= Number(style.opacity || 1);
          if (opacity <= 0.12) return false;
          current = current.parentElement;
        }
        return true;
      };
      const intersectionRatio = (a, b) => {
        const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
        const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        const area = width * height;
        return area / Math.max(1, Math.min(a.width * a.height, b.width * b.height));
      };

      const surfaceResults = Array.from(document.querySelectorAll('.article-viz-surface')).map((surface, surfaceIndex) => {
        const surfaceRect = surface.getBoundingClientRect();
        const semanticRoot = surface.querySelector('[data-viz-canvas], .step-viz-canvas') ?? surface;
        const visuals = Array.from(surface.querySelectorAll('svg[viewBox], canvas, img'))
          .filter((svg) => {
            const rect = svg.getBoundingClientRect();
            return rect.width >= 180 && rect.height >= 80 && visible(svg);
          });
        const htmlContent = Array.from(semanticRoot.querySelectorAll('p, span, strong, em, code, dt, dd, li, button, input, select'))
          .filter((element) => (
            visible(element)
            && !element.closest('figcaption, .article-viz-inline-tool, .sr-only')
          ));
        const svgs = visuals.filter((element) => element.tagName.toLowerCase() === 'svg');
        const overlaps = [];
        const smallText = [];

        svgs.forEach((svg, svgIndex) => {
          const texts = Array.from(svg.querySelectorAll('text')).filter(visible);
          const boxes = texts.map((text) => ({
            text: (text.textContent ?? '').trim().slice(0, 60),
            rect: text.getBoundingClientRect(),
          })).filter((item) => item.text);

          boxes
            .filter((item) => item.rect.height < 11.5)
            .slice(0, 12)
            .forEach((item) => smallText.push({
              svgIndex,
              text: item.text,
              height: Number(item.rect.height.toFixed(2)),
            }));

          for (let i = 0; i < boxes.length; i += 1) {
            for (let j = i + 1; j < boxes.length; j += 1) {
              const ratio = intersectionRatio(boxes[i].rect, boxes[j].rect);
              if (ratio > 0.35) {
                overlaps.push({ svgIndex, a: boxes[i].text, b: boxes[j].text, ratio: Number(ratio.toFixed(2)) });
                if (overlaps.length >= 12) break;
              }
            }
            if (overlaps.length >= 12) break;
          }
        });

        const clipped = Array.from(surface.querySelectorAll('foreignObject > div'))
          .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
          .map((element) => ({
            text: (element.textContent ?? '').trim().slice(0, 80),
            dx: element.scrollWidth - element.clientWidth,
            dy: element.scrollHeight - element.clientHeight,
          }));

        const internalScroll = [
          surface,
          ...surface.querySelectorAll('[data-viz-canvas], .step-viz-canvas'),
        ]
          .filter((element) => element.scrollWidth > element.clientWidth + 2)
          .map((element) => ({
            element: element === surface ? 'surface' : element.className || element.tagName,
            pixels: element.scrollWidth - element.clientWidth,
          }));

        return {
          surfaceIndex,
          width: Math.round(surfaceRect.width),
          height: Math.round(surfaceRect.height),
          semanticCanvas: surface.matches('[data-viz-canvas]') || Boolean(surface.querySelector('[data-viz-canvas]')),
          semanticOverview: Boolean(surface.querySelector('[data-scene-mobile-overview]')),
          hasDetailMode: (
            surface.hasAttribute('data-viz-needs-pan')
              && Boolean(surface.querySelector('[aria-label="세부 보기"], [aria-label="전체 구조 보기"]'))
          ) || (
            surface.hasAttribute('data-scene')
              && Boolean(surface.querySelector('[aria-label="시각화 전체화면으로 보기"]'))
          ),
          visuals: visuals.length,
          htmlContent: htmlContent.length,
          svgs: svgs.length,
          overlaps,
          smallText,
          clipped,
          internalScroll,
        };
      });

      const latexPattern = /\\(?:alpha|beta|gamma|delta|epsilon|theta|lambda|mu|sigma|tau|phi|omega|nabla|partial|sum|prod|frac|sqrt|mathbb|mathbf|mathrm|hat|bar|cdot|times|to|rightarrow)\b/;
      const rawSvgLatex = [...new Set(Array.from(document.querySelectorAll('article svg text'))
        .filter(visible)
        .map((element) => (element.textContent ?? '').trim())
        .filter((value) => latexPattern.test(value)))]
        .slice(0, 20);

      const rawTextLatex = [];
      const article = document.querySelector('article');
      if (article) {
        const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node && rawTextLatex.length < 20) {
          const parent = node.parentElement;
          const value = node.textContent?.trim() ?? '';
          if (
            parent
            && !parent.closest('pre, code, svg, .katex, script, style')
            && latexPattern.test(value)
            && visible(parent)
          ) rawTextLatex.push(value.slice(0, 120));
          node = walker.nextNode();
        }
      }

      const katexErrors = Array.from(document.querySelectorAll('.katex-error'))
        .filter(visible)
        .map((element) => ({
          text: (element.textContent ?? '').trim().slice(0, 120),
          title: (element.getAttribute('title') ?? '').slice(0, 160),
        }))
        .slice(0, 20);

      const formulaResults = Array.from(document.querySelectorAll('[data-math-fit]'))
        .filter(visible)
        .map((formula, formulaIndex) => {
          const rendered = formula.firstElementChild;
          let note = formula.closest('[data-formula-pair]')?.querySelector('[data-formula-note]') ?? null;
          let cursor = formula;

          // Legacy articles often render a formula box and its note as adjacent
          // siblings. Walk only the local wrapper chain so a distant section note
          // cannot accidentally validate an unrelated equation.
          for (let depth = 0; !note && cursor && depth < 4; depth += 1) {
            const sibling = cursor.nextElementSibling;
            if (sibling?.matches('[data-formula-note]')) note = sibling;
            cursor = cursor.parentElement;
          }

          const noteText = note?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
          return {
            formulaIndex,
            text: (formula.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 120),
            overflow: formula.scrollWidth - formula.clientWidth,
            fontSize: Number.parseFloat(getComputedStyle(rendered ?? formula).fontSize),
            scale: Number(formula.getAttribute('data-math-scale') ?? 1),
            hasNote: Boolean(note),
            koreanNote: /[가-힣]/.test(noteText),
            noteText: noteText.slice(0, 160),
          };
        });

      const articleRoot = document.querySelector('article');
      const htmlSmallText = articleRoot
        ? Array.from(articleRoot.querySelectorAll('*'))
          .filter((element) => {
            if (!visible(element) || element.closest('svg, pre, code, .katex, [role="math"], .sr-only')) return false;
            const ownText = Array.from(element.childNodes)
              .filter((node) => node.nodeType === Node.TEXT_NODE)
              .map((node) => node.textContent ?? '')
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim();
            return ownText.length > 0 && Number.parseFloat(getComputedStyle(element).fontSize) < 12;
          })
          .slice(0, 100)
          .map((element) => ({
            text: Array.from(element.childNodes)
              .filter((node) => node.nodeType === Node.TEXT_NODE)
              .map((node) => node.textContent ?? '')
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 100),
            fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
            tag: element.tagName.toLowerCase(),
          }))
        : [];

      const undersizedControls = articleRoot
        ? Array.from(articleRoot.querySelectorAll('button, input, select, textarea, [role="button"], [role="tab"]'))
          .filter((element) => {
            if (!visible(element) || element.matches(':disabled') || element.hasAttribute('data-inline-hit-area')) return false;
            if (element.matches('input[type="checkbox"], input[type="radio"]')) {
              const label = element.closest('label');
              const labelRect = label?.getBoundingClientRect();
              if (labelRect && labelRect.width >= 43.5 && labelRect.height >= 43.5) return false;
            }
            return true;
          })
          .flatMap((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width < 43.5 || rect.height < 43.5
              ? [{
                  label: (element.getAttribute('aria-label') ?? element.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 80),
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                  tag: element.tagName.toLowerCase(),
                }]
              : [];
          })
          .slice(0, 100)
        : [];

      return {
        h1: document.querySelector('h1')?.textContent?.trim() ?? '',
        overflow: document.documentElement.scrollWidth - innerWidth,
        surfaces: surfaceResults,
        formulas: formulaResults,
        rawSvgLatex,
        rawTextLatex: [...new Set(rawTextLatex)],
        katexErrors,
        htmlSmallText,
        undersizedControls,
      };
    });

    stats.surfaces += audit.surfaces.length;
    stats.svgs += audit.surfaces.reduce((sum, surface) => sum + surface.svgs, 0);
    stats.formulas += audit.formulas.length;

    if (response?.status() !== 200) {
      findings.push({ severity: 'error', viewport: viewport.name, route, kind: 'http', status: response?.status() });
    }
    if (!audit.h1) findings.push({ severity: 'error', viewport: viewport.name, route, kind: 'missing-h1' });
    if (audit.overflow > 1) findings.push({ severity: 'error', viewport: viewport.name, route, kind: 'document-overflow', pixels: audit.overflow });
    runtimeErrors.forEach((message) => findings.push({ severity: 'error', viewport: viewport.name, route, kind: 'runtime', message }));
    audit.rawSvgLatex.forEach((text) => findings.push({ severity: 'error', viewport: viewport.name, route, kind: 'raw-svg-latex', text }));
    audit.rawTextLatex.forEach((text) => findings.push({ severity: 'error', viewport: viewport.name, route, kind: 'raw-text-latex', text }));
    audit.katexErrors.forEach((error) => findings.push({ severity: 'error', viewport: viewport.name, route, kind: 'katex-error', ...error }));
    audit.htmlSmallText.forEach((item) => findings.push({ severity: 'error', viewport: viewport.name, route, kind: 'html-text-too-small', ...item }));
    audit.undersizedControls.forEach((item) => findings.push({ severity: 'error', viewport: viewport.name, route, kind: 'undersized-control', ...item }));
    audit.formulas.forEach((formula) => {
      if (formula.overflow > 1) {
        findings.push({
          severity: 'error',
          viewport: viewport.name,
          route,
          kind: 'formula-overflow',
          ...formula,
        });
      }
      if (formula.fontSize < 12) {
        findings.push({
          severity: 'error',
          viewport: viewport.name,
          route,
          kind: 'formula-text-too-small',
          ...formula,
        });
      }
      if (!formula.hasNote || !formula.koreanNote) {
        findings.push({
          severity: 'error',
          viewport: viewport.name,
          route,
          kind: formula.hasNote ? 'formula-note-not-korean' : 'formula-note-missing',
          ...formula,
        });
      }
    });

    audit.surfaces.forEach((surface) => {
      if (
        surface.visuals === 0
        && surface.htmlContent === 0
        && !surface.semanticCanvas
        && !surface.semanticOverview
        && surface.height > 100
      ) {
        findings.push({ severity: 'error', viewport: viewport.name, route, kind: 'blank-viz', surface: surface.surfaceIndex });
      }
      surface.overlaps.forEach((overlap) => findings.push({
        severity: 'warning', viewport: viewport.name, route, kind: 'svg-text-overlap', surface: surface.surfaceIndex, ...overlap,
      }));
      if (!surface.hasDetailMode) {
        surface.smallText.forEach((small) => findings.push({
          severity: 'warning', viewport: viewport.name, route, kind: 'small-svg-text-without-detail-mode', surface: surface.surfaceIndex, ...small,
        }));
      }
      surface.clipped.forEach((clip) => findings.push({
        severity: 'error', viewport: viewport.name, route, kind: 'foreign-object-clip', surface: surface.surfaceIndex, ...clip,
      }));
      surface.internalScroll.forEach((scroll) => findings.push({
        severity: 'error', viewport: viewport.name, route, kind: 'default-viz-scroll', surface: surface.surfaceIndex, ...scroll,
      }));
    });
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

if (report.summary.errors > 0) process.exitCode = 1;
