import { useParams, useLocation } from 'react-router-dom';
import { useMemo, useEffect, useState, type ComponentType } from 'react';
import { getArticle } from '@/content';
import ArticleLayout from '@/components/ArticleLayout';
import { ArticleEditableProvider, EditModeProvider } from '@/lib/editable-context';
import { EditModeToggle } from '@/components/EditModeToggle';
import { EditableOverlay } from '@/components/EditableOverlay';

export default function ArticlePage() {
  const { category, article: articleSlug } = useParams<{
    category: string;
    article: string;
  }>();

  const routeKey = `${category ?? ''}/${articleSlug ?? ''}`;
  const result = useMemo(
    () => getArticle(category ?? '', articleSlug ?? ''),
    [category, articleSlug],
  );
  const { hash } = useLocation();
  const [loadedArticle, setLoadedArticle] = useState<{
    routeKey: string;
    Component: ComponentType;
  } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return true; }
      return false;
    };
    if (tryScroll()) return;
    // lazy 로드 후 재시도
    const timer = setTimeout(tryScroll, 500);
    return () => clearTimeout(timer);
  }, [hash, routeKey]);

  useEffect(() => {
    let cancelled = false;

    if (!result) return () => { cancelled = true; };

    setLoadError(null);
    result.article.component()
      .then((module) => {
        if (!cancelled) {
          setLoadedArticle({ routeKey, Component: module.default });
        }
      })
      .catch((err) => {
        // 재배포로 chunk 해시가 바뀌어 stale 탭의 dynamic import 가 실패하면
        // 한 번만 강제 새로고침해서 새 index.html 을 받아온다 (무한 루프 방지).
        const isImportFailure =
          err instanceof TypeError &&
          /dynamically imported module|Failed to fetch/i.test(err.message);
        if (isImportFailure && !sessionStorage.getItem('blog:reloaded-for-stale-chunk')) {
          sessionStorage.setItem('blog:reloaded-for-stale-chunk', '1');
          window.location.reload();
          return;
        }
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : '글을 불러오지 못했습니다.');
        }
      });

    return () => { cancelled = true; };
  }, [routeKey, result]);

  if (!result) {
    return <p className="text-muted-foreground">글을 찾을 수 없습니다.</p>;
  }

  const ArticleComponent =
    loadedArticle?.routeKey === routeKey ? loadedArticle.Component : null;

  return (
    <EditModeProvider>
      <ArticleEditableProvider key={routeKey} slug={articleSlug ?? ''}>
        <ArticleLayout
          key={routeKey}
          title={result.article.title}
          article={result.article}
          category={result.category}
        >
          <EditModeToggle />
          <EditableOverlay>
            {ArticleComponent
              ? <ArticleComponent key={routeKey} />
              : loadError
                ? (
                    <div className="rounded-lg border bg-muted/20 p-5">
                      <p className="font-medium text-foreground">글을 불러오지 못했습니다.</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        페이지를 새로고침하거나 잠시 후 다시 시도해 주세요.
                      </p>
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-4 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
                      >
                        새로고침
                      </button>
                    </div>
                  )
              : <p className="text-muted-foreground animate-pulse">로딩 중...</p>}
          </EditableOverlay>
        </ArticleLayout>
      </ArticleEditableProvider>
    </EditModeProvider>
  );
}
