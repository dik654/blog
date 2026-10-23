import { Link } from "react-router-dom";
import type { Article, Category, Subcategory } from "@/content";
import { DOMAIN_META, domainOf } from "@/content/domains";
import { categoryHref, domainHref } from "@/lib/routes";

type ScopeNode = {
  id: string;
  level: string;
  label: string;
  href?: string;
  current?: boolean;
};

function findSubcategoryPath(
  subcategories: readonly Subcategory[],
  slug: string,
  parents: readonly Subcategory[] = [],
): readonly Subcategory[] {
  for (const subcategory of subcategories) {
    const path = [...parents, subcategory];
    if (subcategory.slug === slug) return path;
    if (subcategory.children) {
      const child = findSubcategoryPath(subcategory.children, slug, path);
      if (child.length > 0) return child;
    }
  }
  return [];
}

function ScopeItem({ node, index }: { node: ScopeNode; index: number }) {
  const body = (
    <>
      <span className="text-[10px] font-bold text-muted-foreground">
        {String(index + 1).padStart(2, "0")} · {node.level}
      </span>
      <strong className="mt-1.5 block text-sm leading-5 text-foreground">
        {node.label}
      </strong>
    </>
  );

  return (
    <li
      className={`relative w-[9.75rem] shrink-0 snap-start sm:w-auto sm:shrink ${
        node.current ? "sm:col-span-2" : ""
      }`}
    >
      {node.href && !node.current ? (
        <Link
          to={node.href}
          className="block h-full min-h-[4.75rem] border-b border-border bg-background px-3 py-2.5 transition-colors hover:border-primary hover:bg-primary/[0.025]"
        >
          {body}
        </Link>
      ) : (
        <div
          aria-current={node.current ? "page" : undefined}
          className={`h-full min-h-[4.75rem] border-b px-3 py-2.5 ${
            node.current
              ? "border-primary bg-primary/[0.045]"
              : "border-border bg-background"
          }`}
        >
          {body}
        </div>
      )}
    </li>
  );
}

export default function ArticleScopeMap({
  category,
  article,
}: {
  category: Category;
  article: Article;
}) {
  const domainSlug = domainOf(category.slug);
  const domain = DOMAIN_META.find((candidate) => candidate.slug === domainSlug);
  const subcategoryPath = findSubcategoryPath(
    category.subcategories,
    article.subcategory,
  );
  const nodes: ScopeNode[] = [
    {
      id: `domain:${domainSlug}`,
      level: "대분류",
      label: domain?.name ?? domainSlug,
      href: domainHref(domainSlug),
    },
    {
      id: `category:${category.slug}`,
      level: "카테고리",
      label: category.name,
      href: categoryHref(category.slug),
    },
    ...subcategoryPath.map((subcategory, index) => ({
      id: `subcategory:${subcategory.slug}`,
      level:
        subcategoryPath.length === 1
          ? "세부 영역"
          : `세부 영역 ${index + 1}`,
      label: subcategory.name,
      href: `${categoryHref(category.slug)}?sub=${subcategory.slug}`,
    })),
    {
      id: `article:${article.slug}`,
      level: "현재 글",
      label: article.title,
      current: true,
    },
  ];
  const mobileParent = subcategoryPath.at(-1);
  const mobileParentLabel = mobileParent?.name ?? category.name;
  const mobileParentHref = mobileParent
    ? `${categoryHref(category.slug)}?sub=${mobileParent.slug}`
    : categoryHref(category.slug);

  return (
    <nav
      className="not-prose border border-border bg-muted/[0.12] p-3 sm:p-4"
      aria-label="전체 학습 구조에서 현재 글의 위치"
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 sm:mb-3">
        <p className="text-xs font-bold text-primary">전체에서 현재 위치</p>
        <p className="hidden text-[11px] leading-5 text-muted-foreground sm:block">
          왼쪽의 넓은 범위에서 오른쪽의 현재 질문으로 확대합니다.
        </p>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 text-xs sm:hidden">
        <Link
          to={domainHref(domainSlug)}
          className="inline-flex min-h-11 shrink-0 items-center text-muted-foreground hover:text-primary"
        >
          {domain?.name ?? domainSlug}
        </Link>
        <span aria-hidden="true" className="text-muted-foreground">›</span>
        <Link
          to={mobileParentHref}
          className="inline-flex min-h-11 max-w-[7rem] shrink items-center truncate text-muted-foreground hover:text-primary"
        >
          {mobileParentLabel}
        </Link>
        <span aria-hidden="true" className="text-muted-foreground">›</span>
        <strong aria-current="page" className="min-w-0 flex-1 truncate text-foreground">
          {article.title}
        </strong>
      </div>

      <ol className="hidden min-w-0 gap-2 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))]">
        {nodes.map((node, index) => (
          <ScopeItem key={node.id} node={node} index={index} />
        ))}
      </ol>
    </nav>
  );
}
