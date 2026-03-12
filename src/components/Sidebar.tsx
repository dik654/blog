import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categories } from '@/content';
import CategoryItem from './sidebar/CategoryItem';

export default function Sidebar() {
  const { category: activeCategory, article: activeArticle } = useParams();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeCategory) {
      setExpanded((prev) => ({ ...prev, [activeCategory]: true }));
    }
  }, [activeCategory]);

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
      <nav className="py-4 px-3">
        <Link
          to="/"
          className="block px-3 py-1.5 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          전체 카테고리
        </Link>

        {categories.map((cat) => (
          <CategoryItem
            key={cat.slug}
            category={cat}
            isActive={activeCategory === cat.slug}
            isExpanded={expanded[cat.slug] ?? false}
            activeArticle={activeArticle}
            expanded={expanded}
            onToggle={toggle}
          />
        ))}
      </nav>
    </div>
  );
}
