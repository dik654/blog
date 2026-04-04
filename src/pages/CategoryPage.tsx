import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategoryBySlug } from '@/content';
import SubcategoryCard, { findSubcategory } from './category/SubcategoryCard';
import ArticleCard from './category/ArticleCard';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const subSlug = searchParams.get('sub');
  const cat = getCategoryBySlug(category ?? '');
  if (!cat) return <p className="text-muted-foreground">카테고리를 찾을 수 없습니다.</p>;

  const activeSub = subSlug ? findSubcategory(cat.subcategories, subSlug) : null;

  if (!activeSub) {
    return (
      <div className="max-w-4xl">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{cat.name}</h1>
          <p className="text-sm text-muted-foreground">{cat.description}</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cat.subcategories.map((sub, i) => (
            <motion.div key={sub.slug} initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <SubcategoryCard cat={cat} sub={sub} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const filtered = activeSub.children
    ? cat.articles.filter((a) => activeSub.children!.some((c) => c.slug === a.subcategory))
    : cat.articles.filter((a) => a.subcategory === activeSub.slug);

  return (
    <div className="max-w-4xl">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Link to={`/${cat.slug}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← {cat.name}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mt-2 mb-1">{activeSub.name}</h1>
        <p className="text-sm text-muted-foreground">{activeSub.description ?? `${filtered.length}개의 글`}</p>
      </motion.div>
      {activeSub.children && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {activeSub.children.map((child, i) => (
            <motion.div key={child.slug} initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <SubcategoryCard cat={cat} sub={child} />
            </motion.div>
          ))}
        </div>
      )}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground/60 py-4">아직 작성된 글이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((article, i) => (
            <ArticleCard key={article.slug} article={article} categorySlug={cat.slug} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
