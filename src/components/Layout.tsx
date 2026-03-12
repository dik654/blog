import { Link, Outlet, useLocation } from 'react-router-dom';
import { categories } from '@/content';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center px-8">
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
      <aside className="hidden lg:block w-56 fixed top-14 bottom-0 left-0 border-r z-40 bg-background overflow-y-auto">
        <Sidebar />
      </aside>
      <div className="lg:pl-56">
        <main className="mx-auto max-w-[1400px] px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
