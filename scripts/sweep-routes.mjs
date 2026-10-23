#!/usr/bin/env node
/**
 * 공개 route 를 실제 브라우저(Chromium)로 열어 desktop 1440×1000 · mobile 390×844 에서
 * overflow · KaTeX 오류 · console 오류 · Viz 장면 전환 시 frame/control 흔들림을 검사한다.
 *
 *   node scripts/sweep-routes.mjs ai/foo ai/bar            # route 지정
 *   node scripts/sweep-routes.mjs --registrations          # src/content/registrations/*.ts 의 route 전부
 *   node scripts/sweep-routes.mjs --catalog                # 실제 공개 catalog 의 article route 전부
 *   node scripts/sweep-routes.mjs --entry-only             # 공통 입구 지도와 page overflow만 빠르게 검사
 *   node scripts/sweep-routes.mjs --registrations --shard 0/8 # 전수 검사를 8개 병렬 조각으로 분할
 *   node scripts/sweep-routes.mjs --base http://localhost:5199 --out output/playwright/sweep
 *
 * dev server 가 떠 있어야 한다: `npx vite --port 5199` (또는 --base 로 다른 주소).
 * 결과: <out>/<stamp>/summary.json + route 별 screenshot(png). 실패가 있으면 exit 1.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { CATEGORY_DOMAIN } from "../src/content/domains.ts";
import { loadPublicArticleCatalog } from "./lib/public-article-catalog.mjs";

const args = process.argv.slice(2);
function opt(name, fallback) {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
}
const base = opt("base", "http://localhost:5199").replace(/\/$/, "");
const outRoot = opt("out", "output/playwright/sweep");
const noScreenshot = args.includes("--no-screenshot");
const entryOnly = args.includes("--entry-only");
const shardOption = opt("shard", "");
const optionValues = new Set(["--base", "--out", "--shard"].flatMap((name) => { const i = args.indexOf(name); return i >= 0 && i + 1 < args.length ? [args[i + 1]] : []; }));
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
if (args.includes("--catalog")) {
  const catalog = await loadPublicArticleCatalog();
  routes.push(...catalog.map((article) => article.route));
}
routes = [...new Set(routes)].sort();

if (shardOption) {
  const match = shardOption.match(/^(\d+)\/(\d+)$/);
  if (!match) {
    console.error("--shard는 0/8처럼 '조각 번호/전체 조각 수'로 지정해야 합니다.");
    process.exit(1);
  }
  const shardIndex = Number(match[1]);
  const shardCount = Number(match[2]);
  if (shardCount < 1 || shardIndex < 0 || shardIndex >= shardCount) {
    console.error(`유효하지 않은 --shard 값입니다: ${shardOption}`);
    process.exit(1);
  }
  routes = routes.filter((_, index) => index % shardCount === shardIndex);
}

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
    const canvases = [...document.querySelectorAll("[data-viz-canvas]")].filter((el) => {
      if (!el.querySelector("[data-viz-controls]")) return false;
      // 하나의 Viz가 내부 장면에도 data-viz-canvas를 둘 수 있다. 화면에서 실제로
      // 크기와 스크롤을 책임지는 가장 바깥 canvas만 검사해야, 바깥 scrollport에
      // 안전하게 담긴 긴 내부 장면을 별도 viewport 실패로 중복 계산하지 않는다.
      const ancestorCanvas = el.parentElement?.closest("[data-viz-canvas]");
      return !ancestorCanvas?.querySelector("[data-viz-controls]");
    });
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
      const owner = canvas.closest("[data-viz]");
      const isLessonFlow = owner?.getAttribute("data-viz") === "lesson-flow-v4";
      if (isLessonFlow) {
        const details = owner.querySelector("details[data-concept-detail]");
        if (details instanceof HTMLDetailsElement) details.open = true;
      }
      canvas.scrollIntoView({ block: "start", behavior: "instant" });
      await settle();
      await new Promise((r) => setTimeout(r, 80));
      // 장면 버튼(aria-pressed)은 데스크톱 컨트롤에만 있다. 모바일에서는 display:none 이라
      // 좌표가 전부 0 으로 잡히므로, 보이는 버튼(이전/다음/재생)만 흔들림 측정 대상으로 삼고
      // 장면 전환은 보이는 "다음" 버튼으로 한다.
      const currentSceneButtons = () =>
        isLessonFlow
          ? [...owner.querySelectorAll('button[role="tab"][aria-selected]')]
          : [
              ...canvas.querySelectorAll(
                '[data-viz-controls] button[aria-pressed]',
              ),
            ];
      const currentControlButtons = () =>
        [...canvas.querySelectorAll("[data-viz-controls] button")].filter(visible);
      const findControl = (pattern) =>
        currentControlButtons().find((button) =>
          pattern.test(
            button.textContent || button.getAttribute("aria-label") || "",
          ),
        );
      const sceneButtons = currentSceneButtons();
      const pauseButton = findControl(/일시정지|pause/i);
      if (pauseButton) {
        pauseButton.click();
        await frame();
      }
      const scenes = sceneButtons.length;
      const baseFrame = rect(canvas);
      const baseScroll = window.scrollY;
      // control 은 frame 기준 상대 좌표로 잰다 (sticky control 이 page scroll 로 움직이는 것은 흔들림이 아님)
      const relative = (b) => {
        const r = rect(b);
        const f = rect(canvas);
        return { x: r.x - f.x, y: r.y - f.y, w: r.w, h: r.h };
      };
      const baseButtons = currentControlButtons().map(relative);
      let maxFrameDelta = 0;
      let maxButtonDelta = 0;
      let scrolled = 0;
      const sampledSceneIndexes = sceneButtons.length
        ? [...new Set([0, Math.floor(sceneButtons.length / 2), sceneButtons.length - 1])]
        : [];
      const measureAfterClick = async (button) => {
        if (!button || button.disabled) return false;
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
        currentControlButtons().forEach((b, i) => {
          const r = relative(b);
          const b0 = baseButtons[i];
          if (!b0) return;
          maxButtonDelta = Math.max(
            maxButtonDelta,
            Math.abs(r.x - b0.x),
            Math.abs(r.y - b0.y),
            Math.abs(r.w - b0.w),
            Math.abs(r.h - b0.h),
          );
        });
        return true;
      };
      for (const sceneIndex of sampledSceneIndexes) {
        await measureAfterClick(currentSceneButtons()[sceneIndex]);
      }
      const nextClicks = isLessonFlow ? 4 : sceneButtons.length ? 0 : 12;
      for (let click = 0; click < nextClicks; click += 1) {
        const nextButton = findControl(/다음|next/i);
        if (!(await measureAfterClick(nextButton))) break;
      }
      const scrollTarget =
        canvas.querySelector("[data-lesson-scroll-region]") || canvas;
      const canvasOverflow =
        canvas.scrollWidth > canvas.clientWidth + 1 ||
        scrollTarget.scrollWidth > scrollTarget.clientWidth + 1;
      const verticalOverflow =
        scrollTarget.scrollHeight > scrollTarget.clientHeight + 1;
      const maxScrollTop = Math.max(
        0,
        scrollTarget.scrollHeight - scrollTarget.clientHeight,
      );
      scrollTarget.scrollTop = maxScrollTop;
      await frame();
      const reachableEnd = Math.abs(scrollTarget.scrollTop - maxScrollTop) <= 2;
      const stickyControl = canvas.querySelector("[data-viz-controls]");
      const controlRect = stickyControl?.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const controlVisibleAtEnd = !stickyControl || (
        controlRect.bottom <= canvasRect.bottom + 2 &&
        controlRect.top >= canvasRect.top - 2
      );
      scrollTarget.scrollTop = 0;
      results.push({
        index,
        name:
          owner?.getAttribute("data-viz-name") ||
          owner?.getAttribute("data-viz") ||
          canvas.getAttribute("aria-label") ||
          `viz-${index}`,
        scenes,
        frameHeight: baseFrame.h,
        fitsViewport: baseFrame.h <= window.innerHeight,
        maxFrameDelta,
        maxButtonDelta,
        scrolled,
        canvasHorizontalOverflow: canvasOverflow,
        verticalOverflow,
        reachableEnd,
        controlVisibleAtEnd,
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
      const response = await page.goto(`${base}/${publicPathOf(route)}`, {
        waitUntil: entryOnly ? "domcontentloaded" : "networkidle",
        timeout: 90_000,
      });
      if (!response || response.status() >= 400) result.issues.push(`HTTP ${response?.status()}`);
      await page.waitForSelector("[data-article-body]", { timeout: 60_000 });
      // Suspense fallback도 data-article-body 안에 있으므로 실제 lazy article이
      // 마운트됐다는 별도 marker를 기다린 뒤 본문·수식·시각화를 측정합니다.
      await page.waitForSelector("[data-article-content]", { timeout: 60_000 });
      await page.waitForTimeout(entryOnly ? 250 : 800);
      const metrics = await page.evaluate(async () => {
        const doc = document.documentElement;
        const katexErrors = document.querySelectorAll(".katex-error").length;
        const body = document.querySelector("[data-article-body]");
        const wideElements = [];
        const hasOverflowBoundary = (element) => {
          let current = element.parentElement;
          while (current && current !== body) {
            const overflowX = getComputedStyle(current).overflowX;
            if (["auto", "scroll"].includes(overflowX)) {
              return true;
            }
            current = current.parentElement;
          }
          return false;
        };
        if (body) {
          for (const el of body.querySelectorAll("*")) {
            // SVG 내부 좌표는 viewBox 기준이라 개별 g/path의 client rect가 SVG
            // viewport 밖으로 나가도 문서가 넘친 것은 아닙니다. 바깥 SVG 자체와
            // HTML label을 검사하고, SVG의 내부 도형은 전용 Viz 감사에 맡깁니다.
            if (
              el instanceof SVGElement &&
              el.tagName.toLowerCase() !== "svg"
            ) {
              continue;
            }
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.right > window.innerWidth + 1 && getComputedStyle(el).overflowX !== "auto" && getComputedStyle(el).overflowX !== "scroll") {
              if (!hasOverflowBoundary(el)) {
                wideElements.push(`${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${String(el.className).split(" ").slice(0, 2).join(".")} right=${Math.round(r.right)}`);
                if (wideElements.length >= 5) break;
              }
            }
          }
        }
        const entryFlowElement = document.querySelector(
          '[data-viz="article-entry-flow"]',
        );
        let entryFlow = null;
        if (entryFlowElement) {
          const stageButtons = [...entryFlowElement.querySelectorAll("ol button")];
          const heights = [];
          for (const button of stageButtons) {
            button.click();
            await new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            );
            heights.push(Math.round(entryFlowElement.getBoundingClientRect().height));
          }
          const height = Math.max(
            Math.round(entryFlowElement.getBoundingClientRect().height),
            ...heights,
          );
          entryFlow = {
            height,
            heights,
            fitsViewport: height <= window.innerHeight,
            horizontalOverflow:
              entryFlowElement.scrollWidth > entryFlowElement.clientWidth + 1,
            stageContentOverflow: stageButtons.filter(
              (button) =>
                button.scrollWidth > button.clientWidth + 1 ||
                button.scrollHeight > button.clientHeight + 1,
            ).length,
            stages: stageButtons.length,
          };
        }

        const onboarding = document.querySelector(
          '[aria-label="이 글을 읽는 방법"]',
        );
        const quickStart = document.querySelector("[data-article-quick-start]");
        const lessonPrimer = document.querySelector("[data-lesson-primer]");
        const learningContract = document.querySelector(
          "[data-learning-contract]",
        );
        const follows = (before, after) =>
          Boolean(
            before &&
              after &&
              before.compareDocumentPosition(after) &
                Node.DOCUMENT_POSITION_FOLLOWING,
          );
        const termCardWidths = [
          ...document.querySelectorAll("[data-term-card]"),
        ].map((element) => Math.round(element.getBoundingClientRect().width));

        return {
          documentOverflow: doc.scrollWidth > doc.clientWidth + 1,
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          katexErrors,
          h2Count: document.querySelectorAll("[data-article-body] h2").length,
          wideElements,
          entryFlow,
          quickStart: Boolean(quickStart),
          articleOrder: {
            onboardingBeforeBody: follows(onboarding, body),
            bodyBeforePrimer: follows(body, lessonPrimer),
            primerBeforeReview: follows(lessonPrimer, learningContract),
          },
          termCards: {
            count: termCardWidths.length,
            minimumWidth:
              termCardWidths.length > 0 ? Math.min(...termCardWidths) : 0,
          },
          scopeMap: Boolean(
            document.querySelector(
              '[aria-label="전체 학습 구조에서 현재 글의 위치"]',
            ),
          ),
        };
      });
      Object.assign(result, metrics);
      if (metrics.documentOverflow) result.issues.push(`document horizontal overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
      if (metrics.katexErrors) result.issues.push(`katex errors ${metrics.katexErrors}`);
      if (metrics.wideElements.length) result.issues.push(`elements past viewport: ${metrics.wideElements.join(" | ")}`);
      if (!metrics.scopeMap) result.issues.push("article scope map missing");
      if (!metrics.articleOrder.onboardingBeforeBody) result.issues.push("article onboarding is not before body");
      if (!metrics.articleOrder.bodyBeforePrimer) result.issues.push("article body is not before lesson primer");
      if (!metrics.articleOrder.primerBeforeReview) result.issues.push("lesson primer is not before review contract");
      if (metrics.termCards.count < 1) result.issues.push("term cards missing");
      else if (metrics.termCards.minimumWidth < 250) result.issues.push(`term card too narrow: ${metrics.termCards.minimumWidth}px`);
      if (!metrics.entryFlow && !metrics.quickStart) {
        result.issues.push("article entry flow or quick start missing");
      }
      if (metrics.entryFlow) {
        if (!metrics.entryFlow.fitsViewport) result.issues.push(`entry flow ${metrics.entryFlow.height}px taller than viewport ${viewport.height}px`);
        if (metrics.entryFlow.horizontalOverflow) result.issues.push("entry flow horizontal overflow");
        if (metrics.entryFlow.stageContentOverflow) result.issues.push(`entry flow has ${metrics.entryFlow.stageContentOverflow} clipped stage(s)`);
        if (metrics.entryFlow.stages < 2) result.issues.push(`entry flow has only ${metrics.entryFlow.stages} stage`);
        const entryHeightDelta = Math.max(...metrics.entryFlow.heights) - Math.min(...metrics.entryFlow.heights);
        if (entryHeightDelta > 2) result.issues.push(`entry flow shifts height by ${entryHeightDelta}px`);
      }
      result.viz = entryOnly ? [] : await measureViz(page);
      for (const viz of result.viz) {
        const label = `viz#${viz.index}(${viz.name})`;
        if (viz.maxFrameDelta > 2 || viz.maxButtonDelta > 2) result.issues.push(`${label} shifts frame ${viz.maxFrameDelta}px / buttons ${viz.maxButtonDelta}px`);
        if (!viz.fitsViewport) result.issues.push(`${label} frame ${viz.frameHeight}px taller than viewport ${viewport.height}px`);
        if (viz.canvasHorizontalOverflow) result.issues.push(`${label} canvas horizontal overflow`);
        if (!viz.reachableEnd) result.issues.push(`${label} cannot scroll to its final content`);
        if (!viz.controlVisibleAtEnd) result.issues.push(`${label} controls are hidden at the end of the scroll area`);
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
