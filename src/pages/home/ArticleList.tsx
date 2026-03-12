import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '@/content';

export default function ArticleList() {
  const allArticles = categories.flatMap((cat) =>
    cat.articles.map((article) => ({
      ...article,
      categorySlug: cat.slug,
      categoryName: cat.name,
      subcategoryName:
        cat.subcategories.find((s) => s.slug === article.subcategory)?.name ?? '',
    })),
  );

  if (allArticles.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">
        전체 아티클
      </h2>
      <ul className="space-y-1">
        {allArticles.map((article, i) => (
          <motion.li
            key={`${article.categorySlug}/${article.slug}`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            viewport={{ once: true }}
          >
            <Link
              to={`/${article.categorySlug}/${article.slug}`}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/50 group"
            >
              <span className="shrink-0 rounded bg-accent px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {article.categoryName}
              </span>
              <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                {article.title}
              </span>
              <span className="ml-auto text-xs text-muted-foreground shrink-0">
                {article.subcategoryName} · {article.sections.length}개 섹션
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
