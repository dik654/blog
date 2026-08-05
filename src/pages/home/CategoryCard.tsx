import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Files, Route } from 'lucide-react';
import type { Category } from '@/content';
import { categoryPath } from '@/lib/paths';

interface Props {
  category: Category;
  index: number;
}

export default function CategoryCard({ category: cat, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      viewport={{ once: true }}
    >
      <Link
        to={categoryPath(cat.slug)}
        className="group grid min-h-36 grid-cols-[2.25rem_minmax(0,1fr)_1.25rem] gap-3 border-t border-border py-5 transition-colors hover:bg-muted/25"
      >
        <span className="font-mono text-[11px] font-bold tabular-nums text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
        <span className="min-w-0">
          <h3 className="text-base font-bold group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">{cat.name}</h3>
          <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">{cat.description}</span>
          <span className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Route aria-hidden className="h-3 w-3" />
              {cat.subcategories.length}개 경로
            </span>
            <span className="flex items-center gap-1.5">
              <Files aria-hidden className="h-3 w-3" />
              {cat.articles.length}개 글
            </span>
          </span>
        </span>
        <ArrowRight aria-hidden className="mt-0.5 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </Link>
    </motion.div>
  );
}
