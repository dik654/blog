import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { domains } from "@/content";
import { categoryHref, domainHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * 상단 네비게이션은 카테고리가 아니라 대분류를 먼저 보여 줍니다. 카테고리를
 * 평면으로 늘어놓으면 영역이 늘어날수록 한 줄에 담기지 않고, 독자가 "무엇에
 * 대한 블로그인지"를 읽기 어려워집니다.
 */
export default function DomainNav() {
  const location = useLocation();
  const [openDomain, setOpenDomain] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!openDomain) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenDomain(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenDomain(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openDomain]);

  return (
    <nav ref={navRef} className="hidden gap-1 md:flex">
      {domains.map((domain) => {
        const isActive =
          location.pathname === domainHref(domain.slug) ||
          domain.categories.some((category) =>
            location.pathname.startsWith(categoryHref(category.slug)),
          );

        if (domain.categories.length === 1) {
          const only = domain.categories[0];
          return (
            <Link
              key={domain.slug}
              to={categoryHref(only.slug)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              {domain.name}
            </Link>
          );
        }

        const isOpen = openDomain === domain.slug;
        return (
          <div key={domain.slug} className="relative">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenDomain(isOpen ? null : domain.slug)}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
                isActive || isOpen
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              {domain.name}
              <span aria-hidden="true" className="text-[10px]">
                ▾
              </span>
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-60 rounded-xl border bg-background p-1.5 shadow-lg">
                <p className="px-2.5 py-1.5 text-[11px] leading-5 text-muted-foreground">
                  {domain.description}
                </p>
                <Link
                  to={domainHref(domain.slug)}
                  onClick={() => setOpenDomain(null)}
                  className="mb-1 block rounded-lg px-2.5 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-accent"
                >
                  {domain.name} 전체 · 읽는 순서 →
                </Link>
                {domain.categories.map((category) => {
                  const href = categoryHref(category.slug);
                  return (
                    <Link
                      key={category.slug}
                      to={href}
                      onClick={() => setOpenDomain(null)}
                      className={cn(
                        "block rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-accent",
                        location.pathname.startsWith(href)
                          ? "bg-accent font-medium text-accent-foreground"
                          : "text-foreground",
                      )}
                    >
                      {category.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
