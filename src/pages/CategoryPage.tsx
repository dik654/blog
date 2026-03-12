import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategoryBySlug } from '@/content';
import type { Subcategory } from '@/content';
import ArticleCard from './category/ArticleCard';

function findSubcategory(subs: Subcategory[], slug: string): Subcategory | null {
  for (const sub of subs) {
    if (sub.slug === slug) return sub;
    if (sub.children) {
      const found = findSubcategory(sub.children, slug);
      if (found) return found;
    }
  }
  return null;
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const subSlug = searchParams.get('sub');
  const cat = getCategoryBySlug(category ?? '');

  if (!cat) {
    return <p className="text-muted-foreground">카테고리를 찾을 수 없습니다.</p>;
  }

  const activeSub = subSlug ? findSubcategory(cat.subcategories, subSlug) : null;
  const filtered = activeSub
    ? cat.articles.filter((a) => a.subcategory === activeSub.slug)
    : cat.articles;
  const title = activeSub ? activeSub.name : cat.name;
  const description = activeSub
    ? `${cat.name} › ${activeSub.name}`
    : cat.description;

  return (
    <div className="max-w-4xl">
      <motion.div
        key={subSlug ?? 'all'}
        className="mb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight mb-1">{title}</h1>
        <p className="text-sm text-muted-foreground">
          {description} &middot; {filtered.length}개의 글
        </p>
      </motion.div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground/60 py-4">
          아직 작성된 글이 없습니다.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((article, i) => (
            <ArticleCard
              key={article.slug}
              article={article}
              categorySlug={cat.slug}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
