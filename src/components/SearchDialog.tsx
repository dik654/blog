import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '@/content';
import type { Article, Category } from '@/content';
import { Search } from 'lucide-react';

interface SearchResult {
  category: Category;
  article: Article;
  matchedSection?: string;
}

function buildIndex() {
  const results: { category: Category; article: Article; searchText: string }[] = [];
  for (const cat of categories) {
    for (const article of cat.articles) {
      const sectionTexts = article.sections
        .map((s) => s.title + (s.subsections?.map((ss) => ss.title).join(' ') ?? ''))
        .join(' ');
      results.push({
        category: cat,
        article,
        searchText: `${article.title} ${sectionTexts}`.toLowerCase(),
      });
    }
  }
  return results;
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const index = useMemo(buildIndex, []);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/);
    return index
      .filter((item) => tokens.every((t) => item.searchText.includes(t)))
      .map((item) => {
        const section = item.article.sections.find((s) =>
          tokens.some(
            (t) =>
              s.title.toLowerCase().includes(t) ||
              s.subsections?.some((ss) => ss.title.toLowerCase().includes(t)),
          ),
        );
        return {
          category: item.category,
          article: item.article,
          matchedSection: section?.title,
        };
      })
      .slice(0, 20);
  }, [query, index]);

  useEffect(() => setSelectedIdx(-1), [results]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setSelectedIdx(-1);
  }, []);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) { close(); return false; }
          return true;
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  // click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  // scroll selected into view
  useEffect(() => {
    if (selectedIdx < 0) return;
    const el = listRef.current?.children[selectedIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  const goTo = (r: SearchResult) => {
    close();
    navigate(`/${r.category.slug}/${r.article.slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && selectedIdx >= 0 && results[selectedIdx]) {
      goTo(results[selectedIdx]);
    } else if (e.key === 'Escape') {
      close();
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => { if (open) close(); else setOpen(true); }}
        className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ${
          open
            ? 'border-accent-foreground/20 bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent'
        }`}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">검색</span>
        <kbd className="hidden sm:inline-flex ml-1 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[400px] rounded-lg border bg-background shadow-lg">
          <div className="flex items-center gap-2 border-b px-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="아티클 제목이나 섹션으로 검색..."
              className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {query.trim() && (
            <div ref={listRef} className="max-h-72 overflow-y-auto p-1.5">
              {results.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">결과 없음</p>
              )}
              {results.map((r, i) => (
                <Link
                  key={`${r.category.slug}/${r.article.slug}`}
                  to={`/${r.category.slug}/${r.article.slug}`}
                  onClick={close}
                  className={`flex flex-col gap-0.5 rounded-md px-3 py-2 text-sm transition-colors ${
                    i === selectedIdx ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                  onMouseEnter={() => setSelectedIdx(i)}
                >
                  <span className="font-medium">{r.article.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.category.name}
                    {r.matchedSection && ` · ${r.matchedSection}`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
