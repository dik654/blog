/**
 * 블로그 정적 서빙 — dist/ 를 내장.
 *
 * 기대: 호출 원본(Next.js rewrites)이 /lab/* 또는 legacy /blog/* 를 그대로 보낸다.
 *   → 이 서버는 루트 경로에 dist/ 를 서빙하고, 존재하지 않는 경로는 SPA fallback 으로
 *     index.html 을 반환한다. vite `base: /lab/` 로 빌드했으므로 index.html 내부
 *     에셋 링크는 `/lab/…` 로 작성되어 있고, 브라우저는 그 경로로 다시 요청한다 →
 *     Next.js rewrites 가 다시 이 서버로 보내주는 식.
 *
 * 포트: BLOG_PORT (기본 14010)
 */

import path from "path";

const PORT   = Number(process.env.BLOG_PORT ?? 14010);
const DIST   = path.resolve(new URL(".", import.meta.url).pathname, "dist");

const TYPE_MAP: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".ico":  "image/x-icon",
  ".map":  "application/json",
  ".txt":  "text/plain; charset=utf-8",
  ".md":   "text/markdown; charset=utf-8",
};

const EDIT_API_TARGET = process.env.BLOG_EDIT_API_TARGET ?? "http://localhost:18002";

function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init.headers ?? {}),
    },
  });
}

function contentType(p: string): string {
  const ext = path.extname(p).toLowerCase();
  return TYPE_MAP[ext] ?? "application/octet-stream";
}

async function serveFile(abs: string): Promise<Response | null> {
  const f = Bun.file(abs);
  if (!(await f.exists())) return null;
  const headers: Record<string, string> = { "Content-Type": contentType(abs) };
  // 에셋은 파일 해시 붙어있어 장기 캐시
  if (/\/assets\//.test(abs)) headers["Cache-Control"] = "public, max-age=31536000, immutable";
  // HTML 은 매번 검증 — 새 빌드의 index.html 이 새 해시 chunk 를 참조하므로
  // 캐시된 HTML 을 계속 쓰면 사용자 브라우저가 영원히 옛 번들을 불러옴.
  else if (abs.endsWith(".html")) headers["Cache-Control"] = "no-cache, must-revalidate";
  return new Response(f, { headers });
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let p = decodeURIComponent(url.pathname);

    if (p === "/api/blog-edits/overrides" || p.startsWith("/api/blog-edits/overrides/")) {
      try {
        const upstreamUrl = new URL(`${url.pathname}${url.search}`, EDIT_API_TARGET);
        const upstream = await fetch(upstreamUrl, {
          method: req.method,
          headers: req.headers,
          body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
        });
        const contentType = upstream.headers.get("content-type") ?? "";
        if (upstream.ok && contentType.includes("application/json")) return upstream;
      } catch {
        // 편집 API 는 선택 기능이다. 정적 블로그 렌더링은 빈 override 로 계속 진행한다.
      }
      return json({ overrides: [] });
    }

    if (p === "/api/blog-edits/register" || p.startsWith("/api/blog-edits/register/")) {
      try {
        const upstreamUrl = new URL(`${url.pathname}${url.search}`, EDIT_API_TARGET);
        return await fetch(upstreamUrl, {
          method: req.method,
          headers: req.headers,
          body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
        });
      } catch {
        return json({ ok: false, disabled: true }, { status: 202 });
      }
    }

    if (p.startsWith("/api/blog-edits/")) {
      return json({ error: "blog edit api unavailable" }, { status: 503 });
    }

    // 디렉터리 요청은 index.html 로
    if (p.endsWith("/")) p += "index.html";
    // 배포 접두가 그대로 오면 벗겨서 dist 기준으로 맵핑
    if (p === "/lab" || p.startsWith("/lab/")) p = p.slice(4) || "/";
    if (p === "/blog" || p.startsWith("/blog/")) p = p.slice(5) || "/";
    if (p.endsWith("/")) p += "index.html";

    // 경로 이탈 방지
    const abs = path.join(DIST, p);
    if (!abs.startsWith(DIST)) return new Response("Forbidden", { status: 403 });

    // 1) 그대로 있는 파일
    const hit = await serveFile(abs);
    if (hit) return hit;

    // 2) 존재하지 않는 에셋은 404 로 끊는다.
    //    /assets/* 에 fallback index.html 을 주면 브라우저가 JS 자리에 HTML 을 받아
    //    "Expected JavaScript-or-Wasm module script" MIME 오류가 남.
    //    파일 확장자 있는 모든 요청도 마찬가지로 fallback 하지 않는다.
    if (/\/assets\//.test(p) || /\.[a-zA-Z0-9]+$/.test(p)) {
      return new Response("Not Found", { status: 404 });
    }

    // 3) SPA 라우팅 — 확장자 없는 경로만 index.html fallback
    const fallback = await serveFile(path.join(DIST, "index.html"));
    if (fallback) {
      return new Response(await fallback.text(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
        status: 200,
      });
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`[blog] serving ${DIST} on http://localhost:${PORT}`);
