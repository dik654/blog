import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchDialog from "./SearchDialog";
import DomainNav from "./DomainNav";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background overscroll-none">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 sm:px-6">
          <Link
            to="/"
            className="mr-4 whitespace-nowrap text-base font-semibold tracking-tight sm:mr-10 sm:text-lg"
          >
            Dylan's Study Notes
          </Link>
          <DomainNav />
          <div className="ml-auto">
            <SearchDialog />
          </div>
        </div>
      </header>
      <aside className="fixed bottom-0 left-0 top-14 z-40 hidden w-72 overflow-y-auto border-r bg-background lg:block">
        <Sidebar />
      </aside>
      <div className="pt-14 lg:pl-72">
        <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
