import { domains } from "@/content";
import Hero from "./home/Hero";
import CategoryCard from "./home/CategoryCard";
import TechStack from "./home/TechStack";
import ArticleList from "./home/ArticleList";

export default function Home() {
  return (
    <div className="max-w-4xl">
      <Hero />

      {domains.map((domain) => (
        <section key={domain.slug} className="mb-14">
          <h2 className="mb-1 border-b pb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {domain.name}
          </h2>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            {domain.description}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {domain.categories.map((cat, i) => (
              <CategoryCard key={cat.slug} category={cat} index={i} />
            ))}
          </div>
        </section>
      ))}

      <TechStack />

      <ArticleList />
    </div>
  );
}
