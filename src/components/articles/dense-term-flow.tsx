import { useEffect, type RefObject } from "react";

const EXCLUDED_CONTAINER =
  "[data-term-breakdown], [data-formula-explained], .not-prose, pre, code";

function isDenseList(paragraph: HTMLParagraphElement) {
  if (paragraph.closest(EXCLUDED_CONTAINER)) return false;

  const text = paragraph.textContent?.replace(/\s+/g, " ").trim() ?? "";
  const interpuncts = (text.match(/·/g) ?? []).length;
  const commas = (text.match(/[,，]/g) ?? []).length;

  return (
    (text.length >= 220 && interpuncts >= 6) ||
    (text.length >= 260 && interpuncts >= 3 && commas >= 6)
  );
}

function addVisibleBreaks(paragraph: HTMLParagraphElement) {
  if (paragraph.dataset.denseTermFlow === "true" || !isDenseList(paragraph)) {
    return;
  }

  // Mark first so the MutationObserver does not revisit nodes that this pass adds.
  paragraph.dataset.denseTermFlow = "true";

  const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest("code, pre, kbd, math, script, style")) {
        return NodeFilter.FILTER_REJECT;
      }
      return node.textContent?.includes("·")
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  const textNodes: Text[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    textNodes.push(node as Text);
  }

  for (const node of textNodes) {
    const parts = node.data.split("·");
    if (parts.length < 2) continue;

    const fragment = document.createDocumentFragment();
    parts.forEach((part, index) => {
      if (index > 0) {
        fragment.append(document.createElement("br"));
        const marker = document.createElement("span");
        marker.dataset.termFlowMarker = "true";
        marker.setAttribute("aria-hidden", "true");
        marker.textContent = "— ";
        fragment.append(marker);
      }
      fragment.append(document.createTextNode(part));
    });
    node.replaceWith(fragment);
  }
}

function formatScope(scope: HTMLElement) {
  scope.querySelectorAll<HTMLParagraphElement>("p").forEach(addVisibleBreaks);
}

/**
 * Long operational lists occur in many legacy articles as plain JSX text.
 * This presentation-only pass gives every middle-dot-separated item a line.
 * New concepts still belong in TermBreakdown, where they receive definitions,
 * examples, and boundaries instead of relying on this fallback.
 */
export function useDenseTermFlow(
  scopeRef: RefObject<HTMLDivElement | null>,
  routeKey: string,
) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    formatScope(scope);
    const observer = new MutationObserver(() => formatScope(scope));
    observer.observe(scope, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [routeKey, scopeRef]);
}
