import { categories } from '@/content';
import { groupCategories } from '@/content/category-groups';
import Hero from './home/Hero';
import CategoryCard from './home/CategoryCard';
import TechStack from './home/TechStack';
import ArticleList from './home/ArticleList';
import LearningPaths from './home/LearningPaths';

export default function Home() {
  const grouped = groupCategories(categories);

  return (
    <div className="max-w-4xl">
      <Hero />
      <LearningPaths />

      <section className="mb-14 space-y-8">
        {grouped.map((group) => (
          <div key={group.id}>
            <div className="mb-3 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 border-b border-border pb-3">
              <span className="font-mono text-[10px] font-bold text-muted-foreground">{group.eyebrow}</span>
              <div>
                <h2 className="text-sm font-bold">{group.name}</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{group.description}</p>
              </div>
            </div>
            <div className="grid gap-x-8 sm:grid-cols-2">
              {group.categories.map((cat, i) => (
                <CategoryCard key={cat.slug} category={cat} index={i} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <TechStack />

      <ArticleList />
    </div>
  );
}
