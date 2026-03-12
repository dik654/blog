import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Category } from '@/content';

interface Props {
  category: Category;
  index: number;
}

export default function CategoryCard({ category: cat, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link
        to={`/${cat.slug}`}
        className="group block rounded-xl border p-6 transition-all hover:border-foreground/20 hover:shadow-md"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold group-hover:text-foreground transition-colors">
            {cat.name}
          </h3>
          <span
            className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground"
          >
            {cat.articles.length}편
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-5">{cat.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {cat.subcategories.map((sub) => {
            const count = cat.articles.filter((a) => a.subcategory === sub.slug).length;
            return (
              <span
                key={sub.slug}
                className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground transition-colors group-hover:border-foreground/15"
              >
                {sub.name}
                {count > 0 && (
                  <span className="ml-1 text-foreground font-medium">{count}</span>
                )}
              </span>
            );
          })}
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <span className="group-hover:text-foreground transition-colors">
            자세히 보기
          </span>
          <svg
            className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
