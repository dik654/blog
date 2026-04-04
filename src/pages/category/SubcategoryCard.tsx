import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Category, Subcategory } from '@/content';
import { thumbnailUrls } from '@/components/thumbnails/urls';

export function findSubcategory(subs: Subcategory[], slug: string): Subcategory | null {
  for (const sub of subs) {
    if (sub.slug === slug) return sub;
    if (sub.children) { const f = findSubcategory(sub.children, slug); if (f) return f; }
  }
  return null;
}

export function countArticles(cat: Category, sub: Subcategory): number {
  if (sub.children) return sub.children.reduce((s, c) => s + countArticles(cat, c), 0);
  return cat.articles.filter((a) => a.subcategory === sub.slug).length;
}

export default function SubcategoryCard({ cat, sub }: { cat: Category; sub: Subcategory }) {
  const count = countArticles(cat, sub);
  const url = thumbnailUrls[sub.slug];
  return (
    <Link to={`/${cat.slug}?sub=${sub.slug}`}>
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
        className="rounded-xl border bg-card hover:border-primary/40 hover:shadow-sm transition-colors h-full overflow-hidden">
        <div className="bg-muted/20 flex items-center justify-center h-24 border-b border-border/50 p-3">
          {url && <img src={url} alt={sub.name} className="max-h-16 max-w-[80px] object-contain" loading="lazy" />}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1">{sub.name}</h3>
          <p className="text-xs text-muted-foreground">{sub.description ?? `${count}개의 글`}</p>
        </div>
      </motion.div>
    </Link>
  );
}
