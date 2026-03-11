import { Link, useParams } from 'react-router-dom';
import { getCategoryBySlug } from '@/content';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const cat = getCategoryBySlug(category ?? '');
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  if (!cat) {
    return <p className="text-muted-foreground">카테고리를 찾을 수 없습니다.</p>;
  }

  const filteredArticles = selectedSub
    ? cat.articles.filter((a) => a.subcategory === selectedSub)
    : cat.articles;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">{cat.name}</h1>
        <p className="text-muted-foreground">{cat.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedSub(null)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors cursor-pointer',
            selectedSub === null
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent',
          )}
        >
          전체
        </button>
        {cat.subcategories.map((sub) => (
          <button
            key={sub.slug}
            onClick={() => setSelectedSub(sub.slug)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors cursor-pointer',
              selectedSub === sub.slug
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent',
            )}
          >
            {sub.name}
          </button>
        ))}
      </div>

      <Separator className="mb-6" />

      {filteredArticles.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          아직 작성된 글이 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/${cat.slug}/${article.slug}`}
              className="block rounded-lg border p-4 transition-colors hover:bg-accent/50"
            >
              <h3 className="font-medium mb-1">{article.title}</h3>
              <Badge variant="outline" className="text-xs">
                {cat.subcategories.find((s) => s.slug === article.subcategory)?.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
