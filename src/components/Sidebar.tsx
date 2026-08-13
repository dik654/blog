import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { categories } from "@/content";
import CategoryItem from "./sidebar/CategoryItem";

export default function Sidebar() {
  const { category: activeCategory, article: activeArticle } = useParams();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !activeArticle) return;
    const frame = requestAnimationFrame(() => {
      const current = container.querySelector<HTMLElement>(
        '[aria-current="page"]',
      );
      if (!current) return;
      const containerBox = container.getBoundingClientRect();
      const currentBox = current.getBoundingClientRect();
      if (
        currentBox.top < containerBox.top + 72 ||
        currentBox.bottom > containerBox.bottom - 24
      ) {
        container.scrollTo({
          top:
            container.scrollTop +
            currentBox.top -
            containerBox.top -
            container.clientHeight * 0.3,
          behavior: "smooth",
        });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [activeArticle, activeCategory]);

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      ref={scrollRef}
      className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-gradient-to-b from-background to-muted/[0.08]"
    >
      <nav className="px-3 py-4">
        <Link
          to="/"
          className="mb-2 flex items-center justify-between rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
        >
          <span>전체 카테고리</span>
          <span aria-hidden="true">↗</span>
        </Link>

        {categories.map((cat) => (
          <CategoryItem
            key={cat.slug}
            category={cat}
            isActive={activeCategory === cat.slug}
            isExpanded={expanded[cat.slug] ?? activeCategory === cat.slug}
            activeArticle={activeArticle}
            expanded={expanded}
            onToggle={toggle}
          />
        ))}
      </nav>
    </div>
  );
}
