import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '@/content';
import { categoryGroups } from '@/content/category-groups';
import { articlePath } from '@/lib/paths';

export default function ArticleList() {
  const allArticles = categories.flatMap((cat) =>
    cat.articles.map((article) => ({
      ...article,
      categorySlug: cat.slug,
      categoryName: cat.name,
      groupName: categoryGroups[cat.group ?? 'domain'].name,
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
              to={articlePath(article.categorySlug, article.slug)}
              className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/50 sm:grid-cols-[auto_auto_minmax(0,1fr)_auto]"
            >
              <span className="shrink-0 rounded bg-accent px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {article.categoryName}
              </span>
              <span className="hidden shrink-0 text-xs text-muted-foreground/70 sm:inline">
                {article.groupName}
              </span>
              <span className="min-w-0 break-words text-sm font-medium transition-colors group-hover:text-foreground">
                {article.title}
              </span>
              <span className="col-start-2 row-start-2 min-w-0 break-words text-xs text-muted-foreground sm:col-start-4 sm:row-start-1 sm:justify-self-end">
                {article.subcategoryName} · {article.sections.length}개 섹션
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
