/**
 * 편집 시스템 React Context — article/section 주입 + overrides 조회 + edit 모드 상태.
 *
 * 계층:
 *   <ArticleEditableProvider slug="helios-bootstrap">
 *     <SectionEditableProvider id="overview">
 *       <Editable>...</Editable>
 *       <Editable>...</Editable>
 *     </SectionEditableProvider>
 *   </ArticleEditableProvider>
 *
 * Section 안에 놓인 <Editable> 들은 렌더 순서대로 0,1,2... 자동 번호 부여.
 * 결합된 id = `${slug}:${sectionId}:${nth}` — 서버의 blog_blocks.id 와 일치.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchOverrides, queueBlockRegister, type OverrideItem } from "./editable-api";

// ── Edit 모드 (?edit=1 쿼리 또는 토글) ─────────────────────────────
function readEditModeFromUrl(): boolean {
  if (typeof window === "undefined") return false;
  const u = new URL(window.location.href);
  return u.searchParams.get("edit") === "1";
}

interface EditModeCtx {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}
const EditModeContext = createContext<EditModeCtx>({ enabled: false, setEnabled: () => {} });

export function EditModeProvider({ children }: { children: ReactNode }) {
  // 초기값만 URL ?edit=1 로부터 읽고, 이후엔 state 로만 관리.
  // (history.replaceState 를 여기서 호출하면 react-router 내부 location 과 어긋나
  //  일부 네비게이션·클릭 이벤트가 막히는 현상이 관찰됨.)
  const [enabled, setEnabled] = useState<boolean>(() => readEditModeFromUrl());
  return <EditModeContext.Provider value={{ enabled, setEnabled }}>{children}</EditModeContext.Provider>;
}

export function useEditMode() { return useContext(EditModeContext); }

// ── Article Context ───────────────────────────────────────────────
interface ArticleCtxValue {
  slug: string;
  overrides: Map<string, OverrideItem>;
  /** Editable 이 마운트 시 스스로 등록 — overrides 조회 대기열 */
  registerBlockForOverrideFetch: (id: string) => void;
}
const ArticleContext = createContext<ArticleCtxValue | null>(null);

export function ArticleEditableProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const [overrides, setOverrides] = useState<Map<string, OverrideItem>>(new Map());
  const pendingRef = useRef<Set<string>>(new Set());
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    flushTimerRef.current = null;
    const ids = Array.from(pendingRef.current);
    pendingRef.current.clear();
    if (ids.length === 0) return;
    const got = await fetchOverrides(ids);
    if (got.size === 0) return;
    setOverrides(prev => {
      const merged = new Map(prev);
      for (const [k, v] of got) merged.set(k, v);
      return merged;
    });
  }, []);

  const registerBlockForOverrideFetch = useCallback((id: string) => {
    pendingRef.current.add(id);
    if (flushTimerRef.current) return;
    flushTimerRef.current = setTimeout(flush, 120);
  }, [flush]);

  // slug 가 바뀌면 이전 오버라이드 캐시 비움 (다른 아티클로 이동)
  useEffect(() => {
    setOverrides(new Map());
    pendingRef.current.clear();
    if (flushTimerRef.current) { clearTimeout(flushTimerRef.current); flushTimerRef.current = null; }
  }, [slug]);

  const value = useMemo<ArticleCtxValue>(
    () => ({ slug, overrides, registerBlockForOverrideFetch }),
    [slug, overrides, registerBlockForOverrideFetch],
  );

  return <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>;
}

export function useArticleEditable(): ArticleCtxValue | null {
  return useContext(ArticleContext);
}

// ── Section Context — section 안에서 Editable 자동 번호 부여 ─────
// nthCounter 는 render 마다 리셋되어야 하므로, 각 렌더 스냅샷마다 새로 만든다.
interface SectionCtxValue {
  sectionId: string;
  nextNth: () => number;
}
const SectionContext = createContext<SectionCtxValue | null>(null);

export function SectionEditableProvider({ id, children }: { id: string; children: ReactNode }) {
  // 렌더 도중 "다음 번호" 를 동기적으로 할당해야 함 — React 트리 순회 순서가 곧 nth 순서.
  // 각 렌더마다 카운터 리셋. useMemo 는 children prop 이 바뀔 때마다 새로 실행되게 dep 에 children 포함.
  const value = useMemo<SectionCtxValue>(() => {
    let counter = 0;
    return {
      sectionId: id,
      nextNth: () => counter++,
    };
    // children 바뀔 때마다 nth 재할당 — 단, 구조 바뀌면 id 가 바뀌므로 override 도 stale 로 감지됨
  }, [id, children]);

  return <SectionContext.Provider value={value}>{children}</SectionContext.Provider>;
}

export function useSectionEditable(): SectionCtxValue | null {
  return useContext(SectionContext);
}

// ── 공용: 블록 id 조합 ────────────────────────────────────────────
export function composeBlockId(slug: string, sectionId: string, nth: number): string {
  return `${slug}:${sectionId}:${nth}`;
}

export { queueBlockRegister };
