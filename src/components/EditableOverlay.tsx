/**
 * <EditableOverlay> — article 전체를 감싸는 click-to-edit 레이어.
 *
 * edit 모드 ON 이면 내부 DOM 에 마우스오버·클릭 이벤트를 걸어:
 *   - target 에서 가장 가까운 "편집 가능 후보" 블록을 탐지 (<p>, <li>, <h2~h4>, <blockquote>, <td>, SVG 등)
 *   - 텍스트 블록: kind=text, innerText 스냅샷 + sha256 해시 → LLM 변환 플로우
 *   - Viz/SVG/이미지: kind=visual, outerHTML 일부를 라벨로 스냅샷 → 수동 처리 큐
 *   - block_id = "{articleSlug}:{sectionId}:{hash앞12자}" — 자동 생성 (서버에서 auto-register)
 *   - hover 시 점선 outline + "✎" 배지, 클릭 시 EditPopover
 *
 * 장점: 아티클마다 <Editable> 일일이 안 감싸도 됨 → 수백 개 아티클에 즉시 적용.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useEditMode, useArticleEditable } from "@/lib/editable-context";
import { sha256Hex16, fetchOverrides } from "@/lib/editable-api";
import { EditPopover } from "./EditPopover";

// 편집 가능 후보 태그. SVG 요소는 tagName 이 lowercase("svg") 로 반환되므로
// 대소문자 통일해서 비교 (아래 findVisualContainer 에서 .toUpperCase() 적용).
const TEXT_TAGS = new Set(["P", "LI", "H2", "H3", "H4", "BLOCKQUOTE", "TD", "TH", "DD", "DT"]);
const VISUAL_TAGS = new Set(["SVG", "CANVAS", "IMG", "VIDEO"]);
const MIN_TEXT_LEN = 6;     // 너무 짧은 텍스트(버튼 라벨 등) 제외
const MAX_TEXT_LEN = 4000;

interface Candidate {
  el: Element;
  kind: "text" | "visual";
  text: string;
  hash: string;
  sectionId: string;
  blockId: string;
}

function findSectionId(el: Element): string {
  let cur: Element | null = el;
  while (cur && cur !== document.body) {
    if (cur.tagName === "SECTION") {
      const id = (cur as HTMLElement).id;
      if (id) return id;
    }
    cur = cur.parentElement;
  }
  return "root";
}

function findVisualContainer(el: Element): Element | null {
  // SVG 안의 <rect>/<g> 등 자식을 클릭해도 가장 바깥 SVG 까지 올라감.
  // .viz, [data-viz], <svg>, <canvas>, <img>, <video> 가 기준.
  // SVG tagName 은 lowercase("svg") 이므로 toUpperCase 로 정규화.
  let cur: Element | null = el;
  while (cur && cur !== document.body) {
    const tag = cur.tagName?.toUpperCase?.() ?? "";
    if (VISUAL_TAGS.has(tag)) return cur;
    // HTMLElement 한정 — className 이 string 인 건 HTMLElement 만.
    if (cur instanceof HTMLElement) {
      const cls = cur.className;
      if (typeof cls === "string" && /\bviz\b/i.test(cls)) return cur;
      if (cur.dataset.viz != null) return cur;
    }
    cur = cur.parentElement;
  }
  return null;
}

function findTextBlock(el: Element): HTMLElement | null {
  let cur: Element | null = el;
  while (cur && cur !== document.body) {
    const tag = cur.tagName?.toUpperCase?.() ?? "";
    if (TEXT_TAGS.has(tag)) {
      const text = (cur as HTMLElement).innerText?.trim() ?? "";
      if (text.length >= MIN_TEXT_LEN && text.length <= MAX_TEXT_LEN) {
        return cur as HTMLElement;
      }
    }
    cur = cur.parentElement;
  }
  return null;
}

async function classify(target: Element, articleSlug: string): Promise<Candidate | null> {
  // 1) Visual 우선 체크 — SVG/img/viz 컨테이너에 올라간 클릭이면 그걸 우선.
  const visual = findVisualContainer(target);
  if (visual) {
    const sectionId = findSectionId(visual);
    const vid = (visual as HTMLElement).id || "";
    const label = (visual.getAttribute("aria-label") || visual.getAttribute("title")
      || (visual.tagName?.toLowerCase?.() ?? "visual") + (vid ? `#${vid}` : "")).slice(0, 120);
    // visual 은 outerHTML 일부 + label 로 스냅샷. LLM 이 처리 안 하니 아주 정확할 필요 X.
    const snapshot = `[VISUAL: ${label}]`;
    const hash = await sha256Hex16(snapshot);
    return {
      el: visual, kind: "visual",
      text: snapshot, hash, sectionId,
      blockId: `${articleSlug}:${sectionId}:v-${hash.slice(0, 12)}`,
    };
  }

  // 2) 텍스트 블록
  const text = findTextBlock(target);
  if (text) {
    const sectionId = findSectionId(text);
    const body = (text.innerText ?? "").trim();
    if (body.length < MIN_TEXT_LEN) return null;
    const hash = await sha256Hex16(body);
    return {
      el: text, kind: "text",
      text: body, hash, sectionId,
      blockId: `${articleSlug}:${sectionId}:t-${hash.slice(0, 12)}`,
    };
  }
  return null;
}

// ── 주 컴포넌트 ───────────────────────────────────────────────────
interface Props { children: ReactNode }

export function EditableOverlay({ children }: Props) {
  const { enabled: editMode } = useEditMode();
  const article = useArticleEditable();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoverEl, setHoverEl] = useState<Element | null>(null);
  const [hoverKind, setHoverKind] = useState<"text" | "visual" | null>(null);
  const [selected, setSelected] = useState<Candidate | null>(null);
  // 다중 선택: shift/ctrl-click 으로 토글. text 블록만 모아 한 지시문으로 일괄 변환.
  // Map<blockId, Candidate> 로 순서 유지 없이 관리 (Array.from 시 insertion order 유지됨).
  const [multiSel, setMultiSel] = useState<Map<string, Candidate>>(new Map());
  const [multiMode, setMultiMode] = useState(false);  // "N개 편집" 클릭 시 popover 오픈
  // ref 로 최신 multiSel 을 동기화 — 이벤트 핸들러(클로저)는 이걸 읽어서 선택 여부를 판정한다.
  // (onClick 은 editMode/article 의존성으로만 재바인딩되므로 state 는 stale).
  const multiSelRef = useRef<Map<string, Candidate>>(new Map());
  useEffect(() => { multiSelRef.current = multiSel; }, [multiSel]);

  // hover 대상 — outline 은 DOM 에 직접 style 로 쓰고, 배지는 React 가 fixed position 으로 렌더.
  // (SVG 내부엔 HTML 자식이 렌더 안되므로 배지를 SVG 자식으로 append 하면 사라진다 → 별도 레이어 필요.)
  const [badge, setBadge] = useState<{ top: number; left: number; kind: "text" | "visual" } | null>(null);

  // 다중 선택된 블록에만 붙는 solid indigo outline. hover 와 경쟁하지 않도록 아래 핸들러에서 존중.
  const SELECTED_OUTLINE = "2px solid rgb(99 102 241)";
  const SELECTED_BG = "rgba(99,102,241,0.10)";
  const applySelectedStyle = useCallback((el: Element) => {
    const st = (el as any).style;
    if (!st) return;
    st.outline = SELECTED_OUTLINE;
    st.outlineOffset = "3px";
    st.background = SELECTED_BG;
    st.borderRadius = "4px";
    st.cursor = "pointer";
    (el as HTMLElement).dataset.multiSelected = "1";
  }, []);
  const clearSelectedStyle = useCallback((el: Element) => {
    const st = (el as any).style;
    if (!st) return;
    st.outline = ""; st.outlineOffset = "";
    st.background = ""; st.borderRadius = ""; st.cursor = "";
    delete (el as HTMLElement).dataset.multiSelected;
  }, []);

  const clearHoverStyle = useCallback((el: Element | null) => {
    if (!el) return;
    // 다중 선택된 블록은 hover 가 "해제" 되더라도 선택 outline 을 유지해야 한다.
    if ((el as HTMLElement).dataset?.multiSelected === "1") {
      // hover 상태로 덧칠해놨던 것은 지우고 선택 outline 으로 복원
      applySelectedStyle(el);
      return;
    }
    const st = (el as any).style;
    if (st) {
      st.outline = "";
      st.outlineOffset = "";
      st.background = "";
      st.borderRadius = "";
      st.cursor = "";
    }
  }, [applySelectedStyle]);

  const applyHoverStyle = useCallback((el: Element, kind: "text" | "visual") => {
    // 이미 선택된 블록은 hover outline 으로 덮지 않는다 (선택 스타일이 더 강해야 함).
    if ((el as HTMLElement).dataset?.multiSelected === "1") {
      // 배지만 갱신하고 outline 은 건드리지 않음
      const rect = (el as HTMLElement).getBoundingClientRect?.() ?? (el as any).getBBox?.();
      if (rect) setBadge({ top: rect.top + 2, left: rect.right - 56, kind });
      return;
    }
    const color = kind === "visual" ? "rgb(168 85 247)" /* purple */ : "rgb(37 99 235)" /* blue */;
    const bg = kind === "visual" ? "rgba(168,85,247,0.08)" : "rgba(59,130,246,0.08)";
    const st = (el as any).style;
    if (!st) return;
    st.outline = `2px dashed ${color}`;
    st.outlineOffset = "3px";
    st.background = bg;
    st.borderRadius = "4px";
    st.cursor = "pointer";
    // 배지 위치: getBoundingClientRect 로 계산 후 fixed position 으로 렌더 (SVG/HTML 모두 동작).
    const rect = (el as HTMLElement).getBoundingClientRect?.() ?? (el as any).getBBox?.();
    if (!rect) return;
    setBadge({
      top: rect.top + 2,
      left: rect.right - 56,
      kind,
    });
  }, []);

  // 페이지 로드 시점에 article 의 모든 text 블록을 스캔 → block_id 리스트 구축 →
  // DB 에서 overrides 일괄 조회 → 해시 일치 블록의 DOM textContent 를 override body 로 교체.
  // edit 모드와 독립적. admin 이 apply 한 수정이 실제 방문자 화면에 반영되는 경로.
  useEffect(() => {
    if (!article) return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    (async () => {
      // children (ArticleComponent) 이 lazy 로드 중이면 잠시 후 재시도 — MutationObserver 로 대체.
      // 첫 mount 시엔 바로 스캔, 이후 DOM 변경되면 다시 스캔 (단 디바운스).
      let scanTimer: ReturnType<typeof setTimeout> | null = null;
      const scan = async () => {
        scanTimer = null;
        if (cancelled) return;
        // 모든 텍스트 후보 elements 찾기
        const candidates: Array<{ el: HTMLElement; text: string; blockId: string }> = [];
        const seen = new Set<string>();
        const selector = Array.from(TEXT_TAGS).map(t => t.toLowerCase()).join(",");
        const all = container.querySelectorAll<HTMLElement>(selector);
        for (const el of all) {
          // 이미 override 적용된 블록은 재스캔 시 skip (textContent 가 override 본문인데 다시 해싱하면 원본 해시 안 나옴)
          if (el.dataset.overrideApplied === "1") continue;
          const text = (el.innerText ?? "").trim();
          if (text.length < MIN_TEXT_LEN || text.length > MAX_TEXT_LEN) continue;
          const hash = await sha256Hex16(text);
          const sectionId = findSectionId(el);
          const blockId = `${article.slug}:${sectionId}:t-${hash.slice(0, 12)}`;
          if (seen.has(blockId)) continue;
          seen.add(blockId);
          candidates.push({ el, text, blockId });
        }
        if (candidates.length === 0) return;
        // fetchOverrides 는 id 기준 map. baseTextHash 가 현재 원본 hash 와 일치하는 것만 적용.
        const ids = candidates.map(c => c.blockId);
        const map = await fetchOverrides(ids);
        if (cancelled || map.size === 0) return;
        for (const c of candidates) {
          const ov = map.get(c.blockId);
          if (!ov) continue;
          // block_id 안에 이미 원본 hash 앞 12자가 들어가므로 매치되면 해시 일치 보장.
          // innerText 로 치환 — 자식 HTML 은 날아가지만, 이 블록은 프로세 스타일 텍스트 전제.
          c.el.innerText = ov.body;
          c.el.dataset.overrideApplied = "1";
          c.el.dataset.overrideRevision = String(ov.updatedAt ?? "");
        }
      };
      // 초기 + 디바운스 재스캔
      scanTimer = setTimeout(scan, 200);
      const mo = new MutationObserver(() => {
        if (scanTimer) clearTimeout(scanTimer);
        scanTimer = setTimeout(scan, 400);
      });
      mo.observe(container, { childList: true, subtree: true });
      return () => { mo.disconnect(); if (scanTimer) clearTimeout(scanTimer); };
    })();
    return () => { cancelled = true; };
  }, [article]);

  // 마우스 이벤트 — edit 모드 ON 일 때만 활성.
  useEffect(() => {
    if (!editMode || !article) return;
    const container = containerRef.current;
    if (!container) return;

    let pendingEl: Element | null = null;
    let pendingKind: "text" | "visual" | null = null;

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      // popover 안의 이벤트는 무시
      if ((target as HTMLElement).closest("[data-edit-popover]")) return;

      // 어떤 블록에 매치되는지 판정만 (비동기 hash 계산은 클릭 때로 미룸)
      const visual = findVisualContainer(target);
      if (visual) {
        if (pendingEl === visual) return;
        if (pendingEl) clearHoverStyle(pendingEl);
        applyHoverStyle(visual, "visual");
        pendingEl = visual; pendingKind = "visual";
        setHoverEl(visual); setHoverKind("visual");
        return;
      }
      const text = findTextBlock(target);
      if (text) {
        if (pendingEl === text) return;
        if (pendingEl) clearHoverStyle(pendingEl);
        applyHoverStyle(text, "text");
        pendingEl = text; pendingKind = "text";
        setHoverEl(text); setHoverKind("text");
        return;
      }
      // 매치 없음 — 기존 hover clear
      if (pendingEl) { clearHoverStyle(pendingEl); pendingEl = null; pendingKind = null; setHoverEl(null); setHoverKind(null); setBadge(null); }
    };

    const onClick = async (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      if ((target as HTMLElement).closest("[data-edit-popover]")) return;
      if ((target as HTMLElement).closest("[data-edit-floatbar]")) return;
      const cand = await classify(target, article.slug);
      if (!cand) return;
      e.preventDefault();
      e.stopPropagation();

      // text 블록은 클릭 시 선택 집합에 토글 추가. visual 은 즉시 단일 popover (multi 미지원).
      // 주의: React StrictMode 에서 setState 의 updater 가 두 번 실행되므로 DOM 변이는
      // updater 바깥에서 1회만 수행해야 한다 (안 그러면 toggle 가 홀짝 반복되어 안 먹힘).
      if (cand.kind === "visual") {
        setSelected(cand);
        return;
      }

      const current = multiSelRef.current;
      const isSelected = current.has(cand.blockId);
      if (isSelected) clearSelectedStyle(cand.el);
      else applySelectedStyle(cand.el);
      setMultiSel(prev => {
        const next = new Map(prev);
        if (isSelected) next.delete(cand.blockId);
        else next.set(cand.blockId, cand);
        return next;
      });
    };

    container.addEventListener("mouseover", onMouseOver, true);
    container.addEventListener("click", onClick, true);
    // 스크롤 시 배지 위치 재계산
    const onScroll = () => {
      if (!pendingEl) return;
      const rect = (pendingEl as HTMLElement).getBoundingClientRect?.() ?? (pendingEl as any).getBBox?.();
      if (rect && pendingKind) setBadge({ top: rect.top + 2, left: rect.right - 56, kind: pendingKind });
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      container.removeEventListener("mouseover", onMouseOver, true);
      container.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      if (pendingEl) clearHoverStyle(pendingEl);
      // edit 모드 OFF 로 변하면 multi-select 도 같이 리셋. outline 은 아래 전체 초기화 루프가 지움.
      setMultiSel(new Map());
      setMultiMode(false);
      setBadge(null);
      // 모든 요소의 outline/bg 초기화 — 잠재적 leak 방어 (SVG 포함 모두)
      container.querySelectorAll<HTMLElement>("*").forEach(el => {
        const s = (el as any).style;
        if (s && (s.outline || s.background)) {
          s.outline = ""; s.outlineOffset = "";
          s.background = ""; s.borderRadius = ""; s.cursor = "";
        }
      });
    };
  }, [editMode, article, applyHoverStyle, clearHoverStyle]);

  // 사용되지 않는 변수 경고 억제 — hoverEl/hoverKind 는 devtools 디버깅용으로 보존.
  void hoverEl; void hoverKind;

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {children}
      {editMode && badge && (
        <div
          style={{
            position: "fixed",
            top: Math.max(4, badge.top),
            left: Math.max(4, badge.left),
            zIndex: 40,
            fontSize: 11,
            lineHeight: 1,
            padding: "4px 7px",
            borderRadius: 5,
            background: badge.kind === "visual" ? "rgb(168 85 247)" : "rgb(37 99 235)",
            color: "white",
            fontWeight: 600,
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
          aria-hidden
        >
          {badge.kind === "visual" ? "✎ Viz" : "✎ 편집"}
        </div>
      )}
      {selected && article && (
        <div data-edit-popover="1">
          <EditPopover
            blockId={selected.blockId}
            articleSlug={article.slug}
            originalText={selected.text}
            originalHash={selected.hash}
            anchorEl={selected.el}
            onClose={() => setSelected(null)}
            kind={selected.kind}
          />
        </div>
      )}

      {/* 선택 플로팅 바 — 하나 이상 고르면 노출. 1 개면 "편집", 여러 개면 "일괄 편집". */}
      {editMode && multiSel.size > 0 && !multiMode && (
        <div
          data-edit-floatbar="1"
          style={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 45,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            background: "white",
            color: "rgb(30 41 59)",
            border: "1px solid rgb(203 213 225)",
            borderRadius: 999,
            boxShadow: "0 6px 22px rgba(0,0,0,0.18)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span>
            <span style={{ color: "rgb(99 102 241)", fontWeight: 700 }}>🧩 {multiSel.size}</span> 블록 선택됨
          </span>
          <button
            type="button"
            onClick={() => setMultiMode(true)}
            style={{ padding: "4px 11px", background: "rgb(99 102 241)", color: "white", borderRadius: 6, fontWeight: 600 }}
          >{multiSel.size === 1 ? "편집 →" : "일괄 편집 →"}</button>
          <button
            type="button"
            onClick={() => {
              multiSel.forEach(c => clearSelectedStyle(c.el));
              setMultiSel(new Map());
            }}
            style={{ padding: "4px 9px", color: "rgb(100 116 139)", fontSize: 12 }}
          >해제</button>
        </div>
      )}

      {/* popover — 선택 블록이 1 개면 single-mode, 여러 개면 multi-mode 로 라우팅 */}
      {multiMode && article && multiSel.size > 0 && (() => {
        const arr = Array.from(multiSel.values());
        const cleanup = () => {
          arr.forEach(c => clearSelectedStyle(c.el));
          setMultiSel(new Map());
          setMultiMode(false);
        };
        return (
          <div data-edit-popover="1">
            {arr.length === 1 ? (
              <EditPopover
                blockId={arr[0].blockId}
                articleSlug={article.slug}
                originalText={arr[0].text}
                originalHash={arr[0].hash}
                anchorEl={arr[0].el}
                onClose={cleanup}
                kind={arr[0].kind}
              />
            ) : (
              <EditPopover
                articleSlug={article.slug}
                blocks={arr.map(c => ({ blockId: c.blockId, text: c.text, hash: c.hash }))}
                anchorEl={arr[0].el}
                onClose={cleanup}
                kind="text"
              />
            )}
          </div>
        );
      })()}
    </div>
  );
}

export { findTextBlock, findVisualContainer, findSectionId };
