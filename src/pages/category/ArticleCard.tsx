import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Article } from '@/content';

interface Props {
  article: Article;
  categorySlug: string;
  index: number;
}

export default function ArticleCard({ article, categorySlug, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <Link
        to={`/${categorySlug}/${article.slug}`}
        className="group flex items-center justify-between rounded-lg border px-5 py-4 transition-all hover:border-foreground/20 hover:bg-accent/30"
      >
        <div className="min-w-0">
          <h3 className="text-sm font-semibold mb-1.5 group-hover:text-foreground transition-colors">
            {article.title}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {article.sections.map((sec) => (
              <span
                key={sec.id}
                className="rounded bg-accent px-1.5 py-0.5 text-[11px] text-muted-foreground"
              >
                {sec.title}
              </span>
            ))}
          </div>
        </div>

        <div className="ml-4 flex shrink-0 items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          {article.sections.length}개 섹션
          <svg
            className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
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
