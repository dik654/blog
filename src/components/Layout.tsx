import { Link, Outlet, useLocation } from 'react-router-dom';
import { categories } from '@/content';
import { cn } from '@/lib/utils';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
          <Link to="/" className="mr-8 text-lg font-semibold tracking-tight">
            Study Notes
          </Link>
          <nav className="flex gap-1">
            {categories.map((cat) => {
              const isActive = location.pathname.startsWith(`/${cat.slug}`);
              return (
                <Link
                  key={cat.slug}
                  to={`/${cat.slug}`}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {cat.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
