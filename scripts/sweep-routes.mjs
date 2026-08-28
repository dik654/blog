#!/usr/bin/env node
/**
 * 공개 route 를 실제 브라우저(Chromium)로 열어 desktop 1440×1000 · mobile 390×844 에서
 * overflow · KaTeX 오류 · console 오류 · Viz 장면 전환 시 frame/control 흔들림을 검사한다.
 *
 *   node scripts/sweep-routes.mjs ai/foo ai/bar            # route 지정
 *   node scripts/sweep-routes.mjs --registrations          # src/content/registrations/*.ts 의 route 전부
 *   node scripts/sweep-routes.mjs --base http://localhost:5199 --out output/playwright/sweep
 *
 * dev server 가 떠 있어야 한다: `npx vite --port 5199` (또는 --base 로 다른 주소).
 * 결과: <out>/<stamp>/summary.json + route 별 screenshot(png). 실패가 있으면 exit 1.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const args = process.argv.slice(2);
function opt(name, fallback) {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
}
const base = opt("base", "http://localhost:5199").replace(/\/$/, "");
const outRoot = opt("out", "output/playwright/sweep");
const noScreenshot = args.includes("--no-screenshot");
let routes = args.filter((arg) => !arg.startsWith("--") && !/^https?:/.test(arg) && !arg.startsWith("output"));
if (args.includes("--registrations")) {
  const dir = "src/content/registrations";
  const modules = fs.existsSync(dir) ? fs.readdirSync(dir).filter((name) => name.endsWith(".ts")) : [];
  for (const name of modules) {
    const text = fs.readFileSync(path.join(dir, name), "utf8");
    const match = text.match(/"((?:ai|gpu|blockchain|crypto|p2p|tee)\/[a-z0-9-]+)"\s*:/);
    if (match) routes.push(match[1]);
  }
}
routes = [...new Set(routes)];
if (routes.length === 0) {
  console.error("검사할 route 가 없습니다.");
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outDir = path.join(outRoot, stamp);
fs.mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

const IGNORED_CONSOLE = [/React DevTools/, /Download the React DevTools/, /\[vite\]/, /HMR/, /favicon/];

async function measureViz(page) {
  return page.evaluate(async () => {
    const results = [];
    const canvases = [...document.querySelectorAll("[data-viz-canvas]")].filter((el) =>
      el.querySelector("[data-viz-controls]"),
    );
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    };
    for (const [index, canvas] of canvases.entries()) {
      canvas.scrollIntoView({ block: "start" });
      await new Promise((r) => setTimeout(r, 80));
      const buttons = [...canvas.querySelectorAll("[data-viz-controls] button[aria-pressed]")];
      const baseFrame = rect(canvas);
      // control 은 frame 기준 상대 좌표로 잰다 (sticky control 이 page scroll 로 움직이는 것은 흔들림이 아님)
      const relative = (b) => {
        const r = rect(b);
        const f = rect(canvas);
        return { x: r.x - f.x, y: r.y - f.y, w: r.w, h: r.h };
      };
      const baseButtons = buttons.map(relative);
      let maxFrameDelta = 0;
      let maxButtonDelta = 0;
      for (const button of buttons) {
        button.click();
        await new Promise((r) => setTimeout(r, 120));
        const frame = rect(canvas);
        maxFrameDelta = Math.max(
          maxFrameDelta,
          Math.abs(frame.x - baseFrame.x),
          Math.abs(frame.w - baseFrame.w),
          Math.abs(frame.h - baseFrame.h),
        );
        buttons.forEach((b, i) => {
          const r = relative(b);
          const b0 = baseButtons[i];
          maxButtonDelta = Math.max(
            maxButtonDelta,
            Math.abs(r.x - b0.x),
            Math.abs(r.y - b0.y),
            Math.abs(r.w - b0.w),
            Math.abs(r.h - b0.h),
          );
        });
      }
      const canvasOverflow = canvas.scrollWidth > canvas.clientWidth + 1;
      results.push({
        index,
        scenes: buttons.length,
        frameHeight: baseFrame.h,
        fitsViewport: baseFrame.h <= window.innerHeight,
        maxFrameDelta,
        maxButtonDelta,
        canvasHorizontalOverflow: canvasOverflow,
      });
    }
    return results;
  });
}

const browser = await chromium.launch();
const summary = { base, stamp, routes: [] };
let failures = 0;

for (const route of routes) {
  const entry = { route, viewports: {} };
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    const consoleMessages = [];
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        const text = message.text();
        if (!IGNORED_CONSOLE.some((pattern) => pattern.test(text))) consoleMessages.push(`${message.type()}: ${text.slice(0, 200)}`);
      }
    });
    page.on("pageerror", (error) => consoleMessages.push(`pageerror: ${String(error).slice(0, 200)}`));
    const result = { ok: true, issues: [] };
    for (let attempt = 0; attempt < 3; attempt += 1) {
    result.issues = [];
    try {
      const response = await page.goto(`${base}/${route}`, { waitUntil: "networkidle", timeout: 90_000 });
      if (!response || response.status() >= 400) result.issues.push(`HTTP ${response?.status()}`);
      await page.waitForSelector("[data-article-body]", { timeout: 60_000 });
      await page.waitForTimeout(800);
      const metrics = await page.evaluate(() => {
        const doc = document.documentElement;
        const katexErrors = document.querySelectorAll(".katex-error").length;
        const body = document.querySelector("[data-article-body]");
        const wideElements = [];
        if (body) {
          for (const el of body.querySelectorAll("*")) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.right > window.innerWidth + 1 && getComputedStyle(el).overflowX !== "auto" && getComputedStyle(el).overflowX !== "scroll") {
              const parentScroll = el.closest("[style*='overflow'], .overflow-x-auto, .overflow-auto, pre, table");
              if (!parentScroll) {
                wideElements.push(`${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${String(el.className).split(" ").slice(0, 2).join(".")} right=${Math.round(r.right)}`);
                if (wideElements.length >= 5) break;
              }
            }
          }
        }
        return {
          documentOverflow: doc.scrollWidth > doc.clientWidth + 1,
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          katexErrors,
          h2Count: document.querySelectorAll("[data-article-body] h2").length,
          wideElements,
        };
      });
      Object.assign(result, metrics);
      if (metrics.documentOverflow) result.issues.push(`document horizontal overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
      if (metrics.katexErrors) result.issues.push(`katex errors ${metrics.katexErrors}`);
      if (metrics.wideElements.length) result.issues.push(`elements past viewport: ${metrics.wideElements.join(" | ")}`);
      result.viz = await measureViz(page);
      for (const viz of result.viz) {
        if (viz.maxFrameDelta > 2 || viz.maxButtonDelta > 2) result.issues.push(`viz#${viz.index} shifts frame ${viz.maxFrameDelta}px / buttons ${viz.maxButtonDelta}px`);
        if (!viz.fitsViewport) result.issues.push(`viz#${viz.index} frame ${viz.frameHeight}px taller than viewport ${viewport.height}px`);
        if (viz.canvasHorizontalOverflow) result.issues.push(`viz#${viz.index} canvas horizontal overflow`);
      }
      if (consoleMessages.length) result.issues.push(`console: ${consoleMessages.slice(0, 3).join(" || ")}`);
      result.console = consoleMessages;
      if (!noScreenshot) {
        await page.evaluate(() => window.scrollTo(0, 0));
        const file = path.join(outDir, `${route.replace("/", "--")}-${viewport.name}.png`);
        await page.screenshot({ path: file, fullPage: true });
        result.screenshot = file;
      }
    } catch (error) {
      const text = String(error);
      if (/Execution context was destroyed|Navigation|Target closed/.test(text) && attempt < 2) {
        await page.waitForTimeout(1500);
        continue; // dev server HMR reload 로 context 가 바뀐 경우 재시도
      }
      result.issues.push(`exception: ${text.slice(0, 200)}`);
    }
    break;
    }
    result.ok = result.issues.length === 0;
    if (!result.ok) failures += 1;
    entry.viewports[viewport.name] = result;
    await context.close();
    console.log(`${result.ok ? "ok  " : "FAIL"} ${route} @${viewport.name}${result.ok ? "" : "\n     - " + result.issues.join("\n     - ")}`);
  }
  summary.routes.push(entry);
}

await browser.close();
fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
console.log(`\n요약: ${routes.length} routes × ${VIEWPORTS.length} viewports · 실패 ${failures} · ${path.join(outDir, "summary.json")}`);
process.exit(failures ? 1 : 0);
