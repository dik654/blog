import { useParams } from 'react-router-dom';
import { Suspense, lazy, useMemo } from 'react';
import { getArticle } from '@/content';
import ArticleLayout from '@/components/ArticleLayout';

export default function ArticlePage() {
  const { category, article: articleSlug } = useParams<{
    category: string;
    article: string;
  }>();

  const result = getArticle(category ?? '', articleSlug ?? '');

  const ArticleComponent = useMemo(() => {
    if (!result) return null;
    return lazy(result.article.component);
  }, [result]);

  if (!result || !ArticleComponent) {
    return <p className="text-muted-foreground">글을 찾을 수 없습니다.</p>;
  }

  return (
    <ArticleLayout title={result.article.title} sections={result.article.sections}>
      <Suspense
        fallback={<p className="text-muted-foreground animate-pulse">로딩 중...</p>}
      >
        <ArticleComponent />
      </Suspense>
    </ArticleLayout>
  );
}
