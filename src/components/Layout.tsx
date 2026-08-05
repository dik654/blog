import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import SearchDialog from './SearchDialog';
import { BLOG_ROOT, CORE_ROOT, LAB_ROOT } from '@/lib/paths';

export default function Layout() {
  const location = useLocation();
  const [drawerLocationKey, setDrawerLocationKey] = useState<string | null>(null);
  const mobileOpen = drawerLocationKey === location.key;
  const isLabOverview = location.pathname === LAB_ROOT;
  const topItems = [
    { href: LAB_ROOT, label: '랩 개요' },
    { href: BLOG_ROOT, label: '블로그' },
    { href: `${BLOG_ROOT}/map`, label: '지도' },
    { href: CORE_ROOT, label: '코어' },
    { href: `${LAB_ROOT}/cicd`, label: 'CI/CD' },
    { href: `${LAB_ROOT}/projects`, label: '프로젝트' },
  ];

  return (
    <div className="min-h-screen bg-background overscroll-none">
      <button
        type="button"
        onClick={() => setDrawerLocationKey(location.key)}
        aria-label="메뉴 열기"
        className="fixed left-2 top-1.5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-md border bg-background/95 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent hover:text-foreground lg:hidden"
      >
        <Menu aria-hidden className="h-5 w-5" />
      </button>

      {/* 데스크톱 사이드바 (fixed) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 overflow-y-auto border-r bg-background lg:block">
        <Sidebar />
      </aside>

      {/* 모바일 드로어 */}
      <MobileSidebar open={mobileOpen} onClose={() => setDrawerLocationKey(null)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-14 lg:px-6">
            <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
              {topItems.map((item, index) => {
                const active = item.href === LAB_ROOT
                  ? location.pathname === LAB_ROOT
                  : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                      index > 2 && 'hidden sm:inline-flex',
                      active && 'bg-accent text-foreground',
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="shrink-0">
              <SearchDialog />
            </div>
          </div>
        </header>

        <main
          className={cn(
            'mx-auto',
            isLabOverview
              ? 'max-w-none px-0 py-0'
              : 'max-w-[1400px] px-4 pb-6 pt-6 md:px-8 md:py-8',
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
