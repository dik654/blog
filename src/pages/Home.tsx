import { categories } from '@/content';
import Hero from './home/Hero';
import CategoryCard from './home/CategoryCard';
import TechStack from './home/TechStack';
import ArticleList from './home/ArticleList';

export default function Home() {
  return (
    <div className="max-w-4xl">
      <Hero />

      <section className="mb-14">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">
          학습 분야
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} category={cat} index={i} />
          ))}
        </div>
      </section>

      <TechStack />

      <ArticleList />
    </div>
  );
}
