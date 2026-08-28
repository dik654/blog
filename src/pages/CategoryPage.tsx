import { useParams, useSearchParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCategoryBySlug } from "@/content";
import SubcategoryCard from "./category/SubcategoryCard";
import {
  findSubcategory,
  getArticlesInSubcategory,
  getDirectArticlesInSubcategory,
  sortSubcategoriesForReading,
} from "@/content/subcategory-navigation";
import ArticleCard from "./category/ArticleCard";
import CategoryReadingMap from "./category/CategoryReadingMap";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const subSlug = searchParams.get("sub");
  const cat = getCategoryBySlug(category ?? "");
  if (!cat)
    return (
      <p className="text-muted-foreground">카테고리를 찾을 수 없습니다.</p>
    );

  const activeSub = subSlug
    ? findSubcategory(cat.subcategories, subSlug)
    : null;

  if (!activeSub) {
    return (
      <div className="max-w-4xl">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold tracking-tight mb-1">{cat.name}</h1>
          <p className="text-sm text-muted-foreground">{cat.description}</p>
        </motion.div>
        <CategoryReadingMap category={cat} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {sortSubcategoriesForReading(cat, cat.subcategories).map((sub, i) => (
            <motion.div
              key={sub.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <SubcategoryCard cat={cat} sub={sub} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const allArticles = getArticlesInSubcategory(cat, activeSub);
  const directArticles = getDirectArticlesInSubcategory(cat, activeSub);
  const visibleArticles = activeSub.children ? directArticles : allArticles;

  if (allArticles.length === 1) {
    return <Navigate to={`/${cat.slug}/${allArticles[0].slug}`} replace />;
  }

  return (
    <div className="max-w-4xl">
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          to={`/${cat.slug}`}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {cat.name}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mt-2 mb-1">
          {activeSub.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {activeSub.description ?? `${allArticles.length}개의 글`}
        </p>
        {!activeSub.children && allArticles.length > 1 && (
          <p className="mt-3 max-w-2xl text-xs leading-5 text-foreground/65">
            아래 글은 게시 시각이 아니라 선수 개념에서 구현·평가로 이어지는
            실제 읽기 순서입니다. 이미 아는 단계는 건너뛰어도 됩니다.
          </p>
        )}
        {activeSub.children && (
          <p className="mt-3 max-w-2xl text-xs leading-5 text-foreground/65">
            이 페이지는 여러 세부 주제를 묶는 입구입니다. 아래에서 먼저 읽을
            소주제를 고르세요. 각 소주제의 글을 이 페이지에 다시 나열하지 않아
            같은 글이 여러 경로에 중복되어 보이지 않습니다.
          </p>
        )}
      </motion.div>
      {activeSub.children && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {activeSub.children.map((child, i) => (
            <motion.div
              key={child.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <SubcategoryCard cat={cat} sub={child} />
            </motion.div>
          ))}
        </div>
      )}
      {visibleArticles.length === 0 && !activeSub.children ? (
        <p className="text-sm text-muted-foreground/60 py-4">
          아직 작성된 글이 없습니다.
        </p>
      ) : visibleArticles.length > 0 ? (
        <>
          {activeSub.children && (
            <h2 className="mb-3 text-sm font-bold text-foreground">
              이 묶음의 공통 글
            </h2>
          )}
          <div className="space-y-2">
            {visibleArticles.map((article, i) => (
              <ArticleCard
                key={article.slug}
                article={article}
                categorySlug={cat.slug}
                index={i}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
