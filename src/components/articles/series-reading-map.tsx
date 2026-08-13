import { Link } from "react-router-dom";
import { getCategoryBySlug } from "@/content";
import type { SeriesReadingPath } from "@/content/series-reading-paths";

export default function SeriesReadingMap({
  categorySlug,
  path,
}: {
  categorySlug: string;
  path: SeriesReadingPath;
}) {
  const category = getCategoryBySlug(categorySlug);
  const articles = new Map(
    category?.articles.map((article) => [article.slug, article]) ?? [],
  );

  return (
    <div className="not-prose my-8 min-w-0 rounded-2xl border border-border/70 bg-card p-4 sm:p-6">
      <div className="mb-5">
        <h3 className="text-base font-bold text-foreground">{path.title}</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {path.question}
        </p>
      </div>

      <div className="grid gap-3">
        {path.groups.map((group, index) => (
          <section
            key={group.label}
            className="grid min-w-0 gap-3 rounded-2xl border border-border/70 bg-muted/15 p-4 lg:grid-cols-[9rem_minmax(0,1fr)]"
          >
            <div>
              <span className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-[11px] font-black tracking-[0.12em] text-primary">
                PATH {String(index + 1).padStart(2, "0")}
              </span>
              <h4 className="mt-2 text-sm font-bold text-foreground">
                {group.label}
              </h4>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                {group.purpose}
              </p>
            </div>

            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              {group.slugs.map((slug) => {
                const article = articles.get(slug);
                if (!article) return null;
                return (
                  <Link
                    key={slug}
                    to={`/${categorySlug}/${slug}`}
                    className="min-w-0 rounded-xl border border-border/60 bg-background/75 px-3 py-2.5 transition-colors hover:border-primary/35 hover:bg-primary/[0.03]"
                  >
                    <span className="block text-xs font-semibold leading-5 text-foreground">
                      {article.title}
                    </span>
                    <span className="mt-0.5 block line-clamp-2 text-[11px] leading-4 text-muted-foreground">
                      {article.sections
                        .slice(0, 3)
                        .map((section) => section.title)
                        .join(" · ")}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
