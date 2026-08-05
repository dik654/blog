/**
 * Blog 편집 백엔드 호출 유틸 — context-manager agent 의 /api/blog-edits/* 에 대응.
 *
 * 같은 도메인이면 상대 경로로 nginx 프록시 경유. 로컬 개발(vite dev server)은
 * vite.config.ts 의 server.proxy 가 localhost:18002 (agent api-server) 로 포워드.
 *
 * VITE_EDIT_API 를 빌드타임에 주입하면 다른 오리진으로도 쏠 수 있다.
 */

const API_BASE = (import.meta.env.VITE_EDIT_API as string | undefined) ?? "/api/blog-edits";

// ── 해시 ─────────────────────────────────────────────────────────
// sha256 16자 hex. 서버의 sha256Hex16 과 정확히 일치해야 함 (hash_mismatch 방어).
export async function sha256Hex16(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  const bytes = new Uint8Array(hash);
  let out = "";
  for (let i = 0; i < 8; i++) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}

// ── 타입 ─────────────────────────────────────────────────────────
export interface BlockMeta {
  id: string;              // "{slug}:{section}:{nth}"
  articleSlug: string;
  sectionId: string;
  nth: number;
  textHash: string;
}

export interface OverrideItem {
  blockId: string;
  body: string;
  baseTextHash: string;
  updatedAt: string;
}

// ── 블록 일괄 등록 ───────────────────────────────────────────────
// 같은 페이지의 <Editable> 들이 첫 마운트 시 한 번만 호출하도록 디바운스된 큐 사용.
const pendingRegister = new Map<string, BlockMeta>();
let registerFlushTimer: ReturnType<typeof setTimeout> | null = null;

export function queueBlockRegister(b: BlockMeta): void {
  pendingRegister.set(b.id, b);
  if (registerFlushTimer) return;
  registerFlushTimer = setTimeout(flushRegister, 150);
}

async function flushRegister(): Promise<void> {
  registerFlushTimer = null;
  if (pendingRegister.size === 0) return;
  const blocks = Array.from(pendingRegister.values());
  pendingRegister.clear();
  try {
    await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks }),
    });
  } catch {
    // 실패해도 렌더는 계속. 다음 페이지 마운트 때 재시도됨.
  }
}

// ── 오버라이드 조회 ──────────────────────────────────────────────
// 페이지 마운트 시 모인 블록 id 들을 조회. 긴 아티클은 query string 이
// 프록시/서버 한도를 넘지 않도록 URL 길이 기준으로 나눠 요청한다.
const MAX_OVERRIDE_QUERY_LENGTH = 6000;

function chunkOverrideIds(ids: string[]): string[][] {
  const chunks: string[][] = [];
  let current: string[] = [];
  let currentLength = 0;

  for (const id of ids) {
    const encodedLength = encodeURIComponent(id).length;
    const separatorLength = current.length > 0 ? 3 : 0; // encoded comma: %2C
    if (current.length > 0 && currentLength + separatorLength + encodedLength > MAX_OVERRIDE_QUERY_LENGTH) {
      chunks.push(current);
      current = [];
      currentLength = 0;
    }
    currentLength += (current.length > 0 ? 3 : 0) + encodedLength;
    current.push(id);
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

export async function fetchOverrides(ids: string[]): Promise<Map<string, OverrideItem>> {
  if (ids.length === 0) return new Map();
  const out = new Map<string, OverrideItem>();

  for (const chunk of chunkOverrideIds(ids)) {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/overrides?ids=${encodeURIComponent(chunk.join(","))}`);
    } catch {
      continue;
    }
    if (!res.ok) continue;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) continue;
    const data = await res.json().catch(() => ({ overrides: [] })) as { overrides?: OverrideItem[] };
    for (const o of data.overrides ?? []) out.set(o.blockId, o);
  }

  return out;
}

// ── 편집 요청 제출 ───────────────────────────────────────────────
export interface SubmitBlock {
  blockId: string;
  renderedText: string;
  renderedHash: string;
}

export interface SubmitInput {
  // single-block: blockId/renderedText/renderedHash 세트
  blockId?: string;
  renderedText?: string;
  renderedHash?: string;
  // multi-block: blocks 배열. blockId 세트와 둘 중 하나만 채우면 됨.
  blocks?: SubmitBlock[];
  articleSlug: string;
  instruction: string;
  // "text" = LLM 텍스트 변환, "visual" = Viz 블록 수정, "text_to_viz" = 본문 → 새 Viz 생성
  kind?: "text" | "visual" | "text_to_viz";
}

export type SubmitResult =
  | { ok: true; role: "admin" | "user" }
  | { ok: false; reason: "not_logged_in" | "not_approved" | string; detail?: string };

export type SessionRole = "admin" | "user" | "none";
export interface SessionInfo {
  role: SessionRole;
  status?: "pending" | "approved" | "rejected";
  email?: string;
  name?: string;
}

// NextAuth 세션 체크 — credentials:include 로 쿠키 전송.
// role: "admin" | "user" (approved·is_admin 아님) | "none" (비로그인/거절/대기)
let _sessionCache: { at: number; info: SessionInfo } | null = null;
export async function getSession(force = false): Promise<SessionInfo> {
  const now = Date.now();
  if (!force && _sessionCache && now - _sessionCache.at < 60_000) return _sessionCache.info;
  try {
    const r = await fetch("/api/auth/session", { credentials: "include" });
    if (!r.ok) { const info: SessionInfo = { role: "none" }; _sessionCache = { at: now, info }; return info; }
    const j = await r.json() as { user?: { is_admin?: boolean; status?: string; email?: string; name?: string } } | null;
    if (!j?.user) { const info: SessionInfo = { role: "none" }; _sessionCache = { at: now, info }; return info; }
    const info: SessionInfo = {
      role: j.user.is_admin ? "admin" : (j.user.status === "approved" ? "user" : "none"),
      status: j.user.status as any,
      email: j.user.email,
      name: j.user.name,
    };
    _sessionCache = { at: now, info };
    return info;
  } catch {
    const info: SessionInfo = { role: "none" };
    _sessionCache = { at: now, info };
    return info;
  }
}

export async function submitEdit(input: SubmitInput): Promise<SubmitResult> {
  const sess = await getSession();
  if (sess.role === "none") {
    return { ok: false, reason: "not_logged_in", detail: sess.status ? `세션 상태: ${sess.status}` : undefined };
  }
  const endpoint = sess.role === "admin"
    ? "/api/admin/blog-edits/submit-as-admin"
    : "/api/admin/blog-edits/submit-user";
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(input),
    });
    if (res.ok) return { ok: true, role: sess.role };
    if (res.status === 401) {
      _sessionCache = null;
      return { ok: false, reason: "not_logged_in" };
    }
    if (res.status === 404) return { ok: false, reason: "block_not_found" };
    const j = await res.json().catch(() => ({} as any)) as { error?: string; detail?: string };
    return { ok: false, reason: j.error ?? `http_${res.status}`, detail: j.detail };
  } catch (e: any) {
    return { ok: false, reason: "network", detail: String(e.message ?? e) };
  }
}
