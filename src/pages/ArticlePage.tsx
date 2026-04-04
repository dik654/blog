import { useParams, useLocation } from 'react-router-dom';
import { Suspense, lazy, useMemo, useEffect } from 'react';
import { getArticle } from '@/content';
import ArticleLayout from '@/components/ArticleLayout';

export default function ArticlePage() {
  const { category, article: articleSlug } = useParams<{
    category: string;
    article: string;
  }>();

  const result = getArticle(category ?? '', articleSlug ?? '');
  const { hash } = useLocation();

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
  }, [hash, result]);

  const ArticleComponent = useMemo(() => {
    if (!result) return null;
    return lazy(result.article.component);
  }, [result]);

  if (!result || !ArticleComponent) {
    return <p className="text-muted-foreground">글을 찾을 수 없습니다.</p>;
  }

  return (
    <ArticleLayout title={result.article.title}>
      <Suspense
        fallback={<p className="text-muted-foreground animate-pulse">로딩 중...</p>}
      >
        <ArticleComponent />
      </Suspense>
    </ArticleLayout>
  );
}
