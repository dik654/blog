import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_DOMAIN, DOMAIN_META } from "@/content/domains";

const APP_ROUTE_PREFIXES = new Set([
  ...DOMAIN_META.map((domain) => domain.slug),
  ...Object.keys(CATEGORY_DOMAIN),
]);

function normalizedBasePath(baseUrl: string) {
  if (!baseUrl || baseUrl === "/") return "";
  return `/${baseUrl.replace(/^\/+|\/+$/g, "")}`;
}

function appRouteFromRootHref(href: string, basePath: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return undefined;
  if (basePath && (href === basePath || href.startsWith(`${basePath}/`))) {
    return undefined;
  }

  const pathname = href.split(/[?#]/, 1)[0];
  const firstSegment = pathname.slice(1).split("/", 1)[0];
  return APP_ROUTE_PREFIXES.has(firstSegment) ? href : undefined;
}

/**
 * 오래된 글에 남은 `<a href="/cs/…">`를 GitHub Pages의 `/blog/` 바깥으로
 * 보내지 않게 보정합니다. href 자체도 고쳐 새 탭과 주소 복사가 올바른 URL을
 * 얻고, 같은 탭의 일반 클릭은 React Router로 넘겨 전체 문서 재요청을 피합니다.
 */
export default function InternalLinkBridge() {
  const navigate = useNavigate();

  useEffect(() => {
    const basePath = normalizedBasePath(import.meta.env.BASE_URL);
    if (!basePath) return;

    const rewriteAnchor = (anchor: HTMLAnchorElement) => {
      const href = anchor.getAttribute("href");
      if (!href) return;
      const appRoute = appRouteFromRootHref(href, basePath);
      if (!appRoute) return;

      anchor.dataset.appRoute = appRoute;
      anchor.setAttribute("href", `${basePath}${appRoute}`);
    };

    const rewriteTree = (node: ParentNode) => {
      if (node instanceof HTMLAnchorElement) rewriteAnchor(node);
      node.querySelectorAll?.<HTMLAnchorElement>("a[href]").forEach(rewriteAnchor);
    };

    rewriteTree(document);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) rewriteTree(node);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[data-app-route]");
      if (!anchor || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const appRoute = anchor.dataset.appRoute;
      if (!appRoute) return;
      event.preventDefault();
      navigate(appRoute);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick, true);
    };
  }, [navigate]);

  return null;
}
