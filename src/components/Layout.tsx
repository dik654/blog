import { Link, Outlet, useLocation } from 'react-router-dom';
import { categories } from '@/content';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import SearchDialog from './SearchDialog';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background overscroll-none">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-6">
          <Link to="/" className="mr-10 text-lg font-semibold tracking-tight whitespace-nowrap">
            Dylan's Study Notes
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
          <div className="ml-auto">
            <SearchDialog />
          </div>
        </div>
      </header>
      <aside className="hidden lg:block w-56 fixed top-14 bottom-0 left-0 border-r z-40 bg-background overflow-y-auto">
        <Sidebar />
      </aside>
      <div className="lg:pl-56 pt-14">
        <main className="mx-auto max-w-[1400px] px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
