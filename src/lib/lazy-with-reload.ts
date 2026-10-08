import { lazy, type ComponentType, type LazyExoticComponent } from "react";

const STORAGE_KEY = "blog:article-chunk-reload";
const HISTORY_KEY = "__blogArticleChunkReload";
const RELOAD_GUARD_MS = 60_000;

interface ReloadGuard {
  routeKey?: string;
  at?: number;
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

export function isRecoverableModuleLoadError(error: unknown) {
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Loading chunk .* failed|Load failed/i.test(
    errorMessage(error),
  );
}

function reloadOnce(routeKey: string) {
  if (typeof window === "undefined") return false;

  const now = Date.now();
  let previous: ReloadGuard | null = null;
  try {
    previous = JSON.parse(
      window.sessionStorage.getItem(STORAGE_KEY) ?? "null",
    ) as ReloadGuard | null;
  } catch {
    // 사생활 보호 설정이 storage를 막으면 history state를 사용합니다.
  }

  const historyState =
    typeof window.history.state === "object" && window.history.state !== null
      ? (window.history.state as Record<string, unknown>)
      : {};
  const historyGuard = historyState[HISTORY_KEY] as ReloadGuard | undefined;
  previous ??= historyGuard ?? null;

  if (
    previous?.routeKey === routeKey &&
    typeof previous.at === "number" &&
    now - previous.at < RELOAD_GUARD_MS
  ) {
    return false;
  }

  const guard = { routeKey, at: now };
  let recorded = false;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(guard));
    recorded = true;
  } catch {
    // 아래 history state 기록을 시도합니다.
  }
  try {
    window.history.replaceState(
      { ...historyState, [HISTORY_KEY]: guard },
      "",
    );
    recorded = true;
  } catch {
    // guard를 어디에도 기록하지 못하면 무한 reload를 피하려고 재시도하지 않습니다.
  }
  if (!recorded) return false;

  window.location.reload();
  return true;
}

function clearReloadGuard() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // 사생활 보호 설정으로 storage가 막혀도 module load 성공에는 영향이 없습니다.
  }
  try {
    const state =
      typeof window.history.state === "object" && window.history.state !== null
        ? { ...(window.history.state as Record<string, unknown>) }
        : {};
    delete state[HISTORY_KEY];
    window.history.replaceState(state, "");
  } catch {
    // history state 정리에 실패해도 module load 성공에는 영향이 없습니다.
  }
}

/**
 * 배포가 교체되는 순간 이전 index가 더는 존재하지 않는 chunk를 가리키면 최신
 * 문서를 한 번만 다시 받습니다. 반복 실패는 caller의 error boundary로 넘깁니다.
 */
export function lazyWithReload(
  loader: () => Promise<{ default: ComponentType }>,
  routeKey: string,
): LazyExoticComponent<ComponentType> {
  return lazy(async () => {
    try {
      const module = await loader();
      clearReloadGuard();
      return module;
    } catch (error) {
      if (isRecoverableModuleLoadError(error) && reloadOnce(routeKey)) {
        return new Promise<never>(() => undefined);
      }
      throw error;
    }
  });
}
