import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Article } from "@/content";
import { thumbnails } from "@/components/thumbnails";
import {
  ARTICLE_INTENT_DESCRIPTIONS,
  inferArticleIntent,
} from "@/content/article-guidance";
import { ARTICLE_EVIDENCE } from "@/content/article-evidence";

interface Props {
  article: Article;
  categorySlug: string;
  index: number;
}

export default function ArticleCard({ article, categorySlug, index }: Props) {
  const Thumb = thumbnails[article.subcategory];
  const intent = inferArticleIntent(article);
  const evidence = ARTICLE_EVIDENCE[`${categorySlug}/${article.slug}`] ?? [];
  const paperCount = evidence.filter(
    (item) => item.kind.includes("논문") || item.kind.includes("연구"),
  ).length;
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
        {Thumb && (
          <div className="shrink-0 w-14 h-14 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center overflow-hidden p-1.5">
            <div className="max-h-10 max-w-10">
              <Thumb />
            </div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              {intent}
            </span>
            <span className="text-xs text-muted-foreground">
              {ARTICLE_INTENT_DESCRIPTIONS[intent]}
            </span>
            {paperCount > 0 && (
              <span className="rounded bg-violet-500/10 px-1.5 py-0.5 text-xs font-bold text-violet-700 dark:text-violet-300">
                원 논문 {paperCount}
              </span>
            )}
            {evidence.length > 0 && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
                근거 {evidence.length}
              </span>
            )}
          </div>
          <h3 className="mb-1 text-sm font-semibold transition-colors group-hover:text-foreground">
            {article.title}
          </h3>
          <div className="flex flex-wrap gap-1">
            {article.sections.slice(0, 4).map((sec) => (
              <span
                key={sec.id}
                className="rounded bg-accent px-1.5 py-0.5 text-xs text-muted-foreground"
              >
                {sec.title}
              </span>
            ))}
            {article.sections.length > 4 && (
              <span className="text-xs text-muted-foreground/50">
                +{article.sections.length - 4}
              </span>
            )}
          </div>
        </div>
        <svg
          className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </motion.div>
  );
}
