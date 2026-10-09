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
import { CATEGORY_DOMAIN } from "../src/content/domains.ts";

const args = process.argv.slice(2);
function opt(name, fallback) {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
}
const base = opt("base", "http://localhost:5199").replace(/\/$/, "");
const outRoot = opt("out", "output/playwright/sweep");
const noScreenshot = args.includes("--no-screenshot");
const optionValues = new Set(["--base", "--out"].flatMap((name) => { const i = args.indexOf(name); return i >= 0 && i + 1 < args.length ? [args[i + 1]] : []; }));
let routes = args.filter((arg) => !arg.startsWith("--") && !optionValues.has(arg));
if (args.includes("--registrations")) {
  const dir = "src/content/registrations";
  const modules = fs.existsSync(dir) ? fs.readdirSync(dir).filter((name) => name.endsWith(".ts")) : [];
  for (const name of modules) {
    const text = fs.readFileSync(path.join(dir, name), "utf8");
    const categories = Object.keys(CATEGORY_DOMAIN).join("|");
    const match = text.match(new RegExp(`"((?:${categories})/[a-z0-9-]+)"\\s*:`));
    if (match) routes.push(match[1]);
  }
}
routes = [...new Set(routes)];

/** route key(`ai/foo`)를 공개 주소(`/cs/ai/foo`)로 바꿉니다. */
function publicPathOf(route) {
  const domain = CATEGORY_DOMAIN[route.split("/", 1)[0]];
  if (!domain) {
    console.error(`대분류가 등록되지 않은 route 입니다: ${route}`);
    process.exit(1);
  }
  return `${domain}/${route}`;
}
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

const IGNORED_CONSOLE = [
  /React DevTools/,
  /Download the React DevTools/,
  /\[vite\]/,
  /HMR/,
  /favicon/,
  // recharts ResponsiveContainer's first ResizeObserver tick can fire before the
  // flex parent has settled its width, logging a transient -1/-1 warning even
  // though the chart measures and renders correctly moments later (verified via
  // getBoundingClientRect after a settle delay). Known upstream recharts timing
  // quirk, not a real layout bug — see recharts/recharts#2381 and similar issues.
  /width\(-1\) and height\(-1\) of chart/,
];

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
    const visible = (el) => el.getClientRects().length > 0;
    const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    // 페이지 스크롤이 멈출 때까지 기다린다. html 에 scroll-behavior: smooth 가 걸려 있어
    // scrollIntoView 직후에 재면 스크롤 도중의 좌표가 잡혀 수천 px 의 가짜 흔들림이 나온다.
    const settle = async () => {
      let last = -1;
      for (let i = 0; i < 40; i += 1) {
        await frame();
        if (window.scrollY === last) return;
        last = window.scrollY;
      }
    };
    for (const [index, canvas] of canvases.entries()) {
      canvas.scrollIntoView({ block: "start", behavior: "instant" });
      await settle();
      await new Promise((r) => setTimeout(r, 80));
      // 장면 버튼(aria-pressed)은 데스크톱 컨트롤에만 있다. 모바일에서는 display:none 이라
      // 좌표가 전부 0 으로 잡히므로, 보이는 버튼(이전/다음/재생)만 흔들림 측정 대상으로 삼고
      // 장면 전환은 보이는 "다음" 버튼으로 한다.
      const sceneButtons = [...canvas.querySelectorAll("[data-viz-controls] button[aria-pressed]")];
      const controlButtons = [...canvas.querySelectorAll("[data-viz-controls] button")].filter(visible);
      const sceneButtonsVisible = sceneButtons.some(visible);
      const nextButton = controlButtons.find((b) => /다음|next/i.test(b.textContent || b.getAttribute("aria-label") || ""));
      const scenes = sceneButtons.length;
      const baseFrame = rect(canvas);
      const baseScroll = window.scrollY;
      // control 은 frame 기준 상대 좌표로 잰다 (sticky control 이 page scroll 로 움직이는 것은 흔들림이 아님)
      const relative = (b) => {
        const r = rect(b);
        const f = rect(canvas);
        return { x: r.x - f.x, y: r.y - f.y, w: r.w, h: r.h };
      };
      const baseButtons = controlButtons.map(relative);
      let maxFrameDelta = 0;
      let maxButtonDelta = 0;
      let scrolled = 0;
      const steps = sceneButtonsVisible
        ? sceneButtons
        : nextButton
          ? Array.from({ length: Math.max(scenes - 1, 0) }, () => nextButton)
          : [];
      for (const button of steps) {
        if (button.disabled) break;
        button.click();
        await new Promise((r) => setTimeout(r, 120));
        await settle();
        scrolled = Math.max(scrolled, Math.abs(window.scrollY - baseScroll));
        const frameRect = rect(canvas);
        maxFrameDelta = Math.max(
          maxFrameDelta,
          Math.abs(frameRect.x - baseFrame.x),
          Math.abs(frameRect.w - baseFrame.w),
          Math.abs(frameRect.h - baseFrame.h),
        );
        controlButtons.forEach((b, i) => {
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
        scenes,
        frameHeight: baseFrame.h,
        fitsViewport: baseFrame.h <= window.innerHeight,
        maxFrameDelta,
        maxButtonDelta,
        scrolled,
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
      const response = await page.goto(`${base}/${publicPathOf(route)}`, { waitUntil: "networkidle", timeout: 90_000 });
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
