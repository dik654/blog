import { Link } from 'react-router-dom';
import { categories } from '@/content';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Study Notes</h1>
        <p className="text-muted-foreground">공부한 것들을 정리하는 공간</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/${cat.slug}`}
            className="group rounded-lg border p-6 transition-colors hover:border-foreground/20 hover:bg-accent/50"
          >
            <h2 className="text-xl font-semibold mb-1">{cat.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
            <div className="flex flex-wrap gap-2">
              {cat.subcategories.map((sub) => (
                <Badge key={sub.slug} variant="secondary">
                  {sub.name}
                </Badge>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {cat.articles.length}개의 글
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
