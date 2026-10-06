import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import SearchDialog from "./SearchDialog";
import DomainNav from "./DomainNav";

export default function Layout() {
  const location = useLocation();
  const [mobileSidebarState, setMobileSidebarState] = useState(() => ({
    open: false,
    pathname: location.pathname,
  }));
  const mobileSidebarOpen =
    mobileSidebarState.open &&
    mobileSidebarState.pathname === location.pathname;
  const mobileSidebarRef = useRef<HTMLElement>(null);
  const mobileSidebarCloseRef = useRef<HTMLButtonElement>(null);
  const mobileSidebarTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = mobileSidebarTriggerRef.current;
    const desktopMedia = window.matchMedia("(min-width: 1024px)");
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => {
      mobileSidebarCloseRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileSidebarState({ open: false, pathname: location.pathname });
        return;
      }
      if (event.key !== "Tab") return;

      const drawer = mobileSidebarRef.current;
      const focusable = mobileSidebarRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!drawer?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as Node | null;
      if (
        target &&
        !mobileSidebarRef.current?.contains(target) &&
        target !== mobileSidebarTriggerRef.current
      ) {
        mobileSidebarCloseRef.current?.focus();
      }
    };
    const onDesktopViewport = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMobileSidebarState({ open: false, pathname: location.pathname });
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    desktopMedia.addEventListener("change", onDesktopViewport);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      desktopMedia.removeEventListener("change", onDesktopViewport);
      trigger?.focus();
    };
  }, [location.pathname, mobileSidebarOpen]);

  return (
    <div className="min-h-svh bg-background overscroll-none">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 sm:px-6">
          <button
            ref={mobileSidebarTriggerRef}
            data-mobile-sidebar-trigger
            type="button"
            aria-label={mobileSidebarOpen ? "카테고리 메뉴 닫기" : "카테고리 메뉴 열기"}
            aria-expanded={mobileSidebarOpen}
            aria-controls="mobile-category-sidebar"
            onClick={() =>
              setMobileSidebarState({
                open: !mobileSidebarOpen,
                pathname: location.pathname,
              })
            }
            className="mr-2 flex size-9 shrink-0 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 lg:hidden"
          >
            {mobileSidebarOpen ? (
              <X className="size-4.5" aria-hidden="true" />
            ) : (
              <Menu className="size-4.5" aria-hidden="true" />
            )}
          </button>
          <Link
            to="/"
            className="mr-2 min-w-0 truncate whitespace-nowrap text-base font-semibold tracking-tight sm:mr-10 sm:text-lg"
          >
            Dylan's Study Notes
          </Link>
          <DomainNav />
          <div className="ml-auto">
            <SearchDialog />
          </div>
        </div>
      </header>

      {mobileSidebarOpen && (
        <>
          <div
            aria-hidden="true"
            data-mobile-sidebar-backdrop
            className="fixed inset-x-0 bottom-0 top-14 z-40 bg-foreground/25 lg:hidden"
            onClick={() =>
              setMobileSidebarState({
                open: false,
                pathname: location.pathname,
              })
            }
          />
          <aside
            id="mobile-category-sidebar"
            ref={mobileSidebarRef}
            data-mobile-sidebar-dialog
            role="dialog"
            aria-modal="true"
            aria-label="전체 카테고리"
            className="fixed bottom-0 left-0 top-14 z-50 flex w-[calc(100vw-3rem)] max-w-80 flex-col border-r bg-background shadow-xl lg:hidden"
          >
            <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
              <p className="text-sm font-bold text-foreground">전체 카테고리</p>
              <button
                ref={mobileSidebarCloseRef}
                type="button"
                aria-label="카테고리 메뉴 닫기"
                onClick={() =>
                  setMobileSidebarState({
                    open: false,
                    pathname: location.pathname,
                  })
                }
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <X className="size-4.5" aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <Sidebar
                onNavigate={() =>
                  setMobileSidebarState({
                    open: false,
                    pathname: location.pathname,
                  })
                }
              />
            </div>
          </aside>
        </>
      )}

      <aside className="fixed bottom-0 left-0 top-14 z-40 hidden w-72 overflow-hidden border-r bg-background lg:block">
        <Sidebar />
      </aside>
      <div className="lg:pl-72">
        <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
