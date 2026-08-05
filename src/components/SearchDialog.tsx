import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '@/content';
import type { Article, Category } from '@/content';
import { coreItemSlug, publishedCoreTracks, type CoreItem, type CoreTrack } from '@/content/core';
import { labDocs, labDocPath, type LabDoc } from '@/content/lab-management';
import { Search } from 'lucide-react';
import { articlePath, coreItemPath } from '@/lib/paths';

interface SearchResult {
  title: string;
  scope: string;
  path: string;
  matchedSection?: string;
}

interface BlogIndexEntry {
  type: 'blog';
  category: Category;
  article: Article;
  searchText: string;
}

interface CoreIndexEntry {
  type: 'core';
  track: CoreTrack;
  item: CoreItem;
  searchText: string;
  matchedSection?: string;
}

interface LabIndexEntry {
  type: 'lab';
  doc: LabDoc;
  searchText: string;
  matchedSection?: string;
}

function buildIndex() {
  const results: Array<BlogIndexEntry | CoreIndexEntry | LabIndexEntry> = [];
  for (const doc of labDocs) {
    results.push({
      type: 'lab',
      doc,
      searchText: [
        doc.label,
        doc.eyebrow,
        doc.title,
        doc.summary,
        doc.sections.map((section) => `${section.title} ${section.body ?? ''} ${section.items.map((item) => `${item.title} ${item.body} ${item.meta ?? ''}`).join(' ')}`).join(' '),
        doc.checklist.join(' '),
      ].join(' ').toLowerCase(),
    });
  }
  for (const cat of categories) {
    for (const article of cat.articles) {
      const sectionTexts = article.sections
        .map((s) => s.title + (s.subsections?.map((ss) => ss.title).join(' ') ?? ''))
        .join(' ');
      results.push({
        type: 'blog',
        category: cat,
        article,
        searchText: `${article.title} ${sectionTexts}`.toLowerCase(),
      });
    }
  }
  for (const track of publishedCoreTracks) {
    for (const item of track.items) {
      const articleSections = item.article?.sections
        .map((s) => s.title + (s.subsections?.map((ss) => ss.title).join(' ') ?? ''))
        .join(' ') ?? '';
      results.push({
        type: 'core',
        track,
        item,
        searchText: [
          track.title,
          track.eyebrow,
          item.title,
          item.summary,
          item.stack.join(' '),
          item.evidence?.join(' ') ?? '',
          item.units?.join(' ') ?? '',
          item.notes?.map((note) => `${note.title} ${note.body}`).join(' ') ?? '',
          articleSections,
        ].join(' ').toLowerCase(),
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

  const index = useMemo(() => buildIndex(), []);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/);
    return index
      .filter((item) => tokens.every((t) => item.searchText.includes(t)))
      .map((item) => {
        if (item.type === 'lab') {
          const section = item.doc.sections.find((s) =>
            tokens.some(
              (t) =>
                s.title.toLowerCase().includes(t) ||
                s.items.some((card) => card.title.toLowerCase().includes(t) || card.body.toLowerCase().includes(t)),
            ),
          );
          return {
            title: item.doc.label,
            scope: '랩 관리 문서',
            path: labDocPath(item.doc.slug),
            matchedSection: section?.title,
          };
        }
        if (item.type === 'core') {
          const section = item.item.article?.sections.find((s) =>
            tokens.some(
              (t) =>
                s.title.toLowerCase().includes(t) ||
                s.subsections?.some((ss) => ss.title.toLowerCase().includes(t)),
            ),
          );
          return {
            title: item.item.article?.title ?? item.item.title,
            scope: `코어 · ${item.track.title}`,
            path: coreItemPath(item.track.slug, coreItemSlug(item.item)),
            matchedSection: section?.title,
          };
        }
        const section = item.article.sections.find((s) =>
          tokens.some(
            (t) =>
              s.title.toLowerCase().includes(t) ||
              s.subsections?.some((ss) => ss.title.toLowerCase().includes(t)),
          ),
        );
        return {
          title: item.article.title,
          scope: item.category.name,
          path: articlePath(item.category.slug, item.article.slug),
          matchedSection: section?.title,
        };
      })
      .slice(0, 20);
  }, [query, index]);

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
    navigate(r.path);
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
        type="button"
        onClick={() => { if (open) close(); else setOpen(true); }}
        aria-label="검색 열기"
        className={`flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors sm:min-w-0 ${
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
        <div className="fixed inset-x-3 top-16 z-50 rounded-lg border bg-background shadow-lg sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[400px] sm:max-w-[calc(100vw-1.5rem)]">
          <div className="flex items-center gap-2 border-b px-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIdx(-1);
              }}
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
                  key={r.path}
                  to={r.path}
                  onClick={close}
                  className={`flex flex-col gap-0.5 rounded-md px-3 py-2 text-sm transition-colors ${
                    i === selectedIdx ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                  onMouseEnter={() => setSelectedIdx(i)}
                >
                  <span className="font-medium">{r.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.scope}
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
