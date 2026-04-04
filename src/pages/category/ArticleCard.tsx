import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Article } from '@/content';
import { thumbnailUrls } from '@/components/thumbnails/urls';

interface Props {
  article: Article;
  categorySlug: string;
  index: number;
}

export default function ArticleCard({ article, categorySlug, index }: Props) {
  const url = thumbnailUrls[article.subcategory];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <Link
        to={`/${categorySlug}/${article.slug}`}
        className="group flex items-center gap-4 rounded-lg border px-4 py-3 transition-all hover:border-foreground/20 hover:bg-accent/30"
      >
        {url && (
          <div className="shrink-0 w-14 h-14 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center overflow-hidden p-1.5">
            <img src={url} alt="" className="max-h-10 max-w-10 object-contain" loading="lazy" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold mb-1 group-hover:text-foreground transition-colors truncate">
            {article.title}
          </h3>
          <div className="flex flex-wrap gap-1">
            {article.sections.slice(0, 4).map((sec) => (
              <span key={sec.id} className="rounded bg-accent px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {sec.title}
              </span>
            ))}
            {article.sections.length > 4 && (
              <span className="text-[10px] text-muted-foreground/50">+{article.sections.length - 4}</span>
            )}
          </div>
        </div>
        <svg className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </motion.div>
  );
}
