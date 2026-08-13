import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Category, Subcategory } from "@/content";
import { thumbnails } from "@/components/thumbnails";
import {
  getArticlesInSubcategory,
  getSubcategoryHref,
} from "@/content/subcategory-navigation";

export default function SubcategoryCard({
  cat,
  sub,
}: {
  cat: Category;
  sub: Subcategory;
}) {
  const articles = getArticlesInSubcategory(cat, sub);
  const count = articles.length;
  const onlyArticle = count === 1 ? articles[0] : undefined;
  const Thumb = thumbnails[sub.slug];
  return (
    <Link to={getSubcategoryHref(cat, sub)}>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border bg-card hover:border-primary/40 hover:shadow-sm transition-colors h-full overflow-hidden"
      >
        <div className="bg-muted/20 flex items-center justify-center h-24 border-b border-border/50 p-3">
          {Thumb && (
            <div className="max-h-16 max-w-[80px]">
              <Thumb />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1">{sub.name}</h3>
          <p className="text-xs text-muted-foreground">
            {sub.description ?? `${count}개의 글`}
          </p>
          <p className="mt-2 text-xs font-semibold text-primary/80">
            {onlyArticle ? "단일 가이드 · 바로 읽기 →" : `${count}개 글 묶음 →`}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
