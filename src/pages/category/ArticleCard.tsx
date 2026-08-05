import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Article } from '@/content';
import { thumbnails } from '@/components/thumbnails';
import { articlePath } from '@/lib/paths';

interface Props {
  article: Article;
  categorySlug: string;
  index: number;
  position?: number;
  total?: number;
  sequenceLabel?: string;
  learningStepLabel?: string;
  learningPathId?: string;
}

export default function ArticleCard({
  article,
  categorySlug,
  position,
  total,
  sequenceLabel = '핵심',
  learningStepLabel,
  learningPathId,
}: Props) {
  const Thumb = thumbnails[article.subcategory];
  const prefetched = useRef(false);
  const prefetch = () => {
    if (prefetched.current) return;
    prefetched.current = true;
    article.component().catch(() => { prefetched.current = false; });
  };
  // 뷰포트 진입 시 idle time 에 prefetch — hover 없이 바로 클릭해도 캐시 hit.
  // 한 카테고리 내 article 들이 codebase chunk 를 공유하므로 첫 카드만 받아도 후속은 module cache.
  const prefetchOnEnter = () => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => void };
    if (typeof w.requestIdleCallback === 'function') w.requestIdleCallback(prefetch);
    else setTimeout(prefetch, 0);
  };
  return (
    <motion.div
      onViewportEnter={prefetchOnEnter}
    >
      <Link
        to={articlePath(categorySlug, article.slug)}
        state={learningPathId ? { learningPathId } : undefined}
        data-learning-step-label={learningStepLabel}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        onTouchStart={prefetch}
        data-article-card={article.slug}
        className="group flex items-center gap-3 rounded-md border px-3 py-3 transition-colors hover:border-foreground/20 hover:bg-accent/30 sm:gap-4 sm:px-4"
      >
        {position && total && (
          <span className="w-9 shrink-0 text-center font-mono text-base font-bold tabular-nums text-foreground">
            <span className="block text-xs font-semibold text-muted-foreground">{sequenceLabel}</span>
            {String(position).padStart(2, '0')}
          </span>
        )}
        {Thumb && (
          <div className="shrink-0 w-14 h-14 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center overflow-hidden p-1.5">
            <div className="h-10 w-10 [&>svg]:h-full [&>svg]:w-full"><Thumb /></div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          {learningStepLabel && (
            <p className="mb-1 text-xs font-bold text-blue-700 dark:text-blue-300">{learningStepLabel}</p>
          )}
          <h3 className="mb-1 text-sm font-semibold leading-snug transition-colors group-hover:text-foreground">
            {article.title}
          </h3>
          {article.summary && (
            <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
              {article.summary}
            </p>
          )}
          {(article.level || article.estimatedMinutes) && (
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              {article.level && <span>{article.level}</span>}
              {article.level && article.estimatedMinutes && <span aria-hidden="true">·</span>}
              {article.estimatedMinutes && <span>약 {article.estimatedMinutes}분</span>}
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {article.sections.slice(0, 4).map((sec) => (
              <span key={sec.id} className="rounded bg-accent px-1.5 py-0.5 text-xs text-muted-foreground">
                {sec.title}
              </span>
            ))}
            {article.sections.length > 4 && (
              <span className="text-xs text-muted-foreground/50">+{article.sections.length - 4}</span>
            )}
          </div>
        </div>
        <ArrowRight aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </Link>
    </motion.div>
  );
}
