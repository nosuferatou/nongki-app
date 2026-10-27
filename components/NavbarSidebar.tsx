"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronRight,
  LayoutDashboard,
  Menu,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create", label: "Create event", icon: Plus },
];

export default function NavbarSidebar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur md:hidden">
        <Link
          href="/"
          onClick={closeMenu}
          className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-blue-600 text-sm text-white">
            N
          </span>
          Nongki
        </Link>
        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-primary-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="grid size-10 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 active:scale-[0.98]"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {isMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMenu}
          className="fixed inset-0 z-30 bg-slate-900/20 md:hidden"
        />
      )}

      <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white md:sticky md:top-0 md:flex md:h-screen md:flex-col">
        <Link
          href="/"
          className="flex h-20 items-center gap-3 px-6 text-xl font-bold tracking-tight text-slate-900"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-base text-white">
            N
          </span>
          Nongki
        </Link>
        <nav aria-label="Main navigation" className="flex-1">
          <Navigation pathname={pathname} />
        </nav>
        <div className="mt-auto px-6 py-5">
          <p className="text-xs font-medium text-slate-400">
            A little more time together.
          </p>
        </div>
      </aside>

      <nav
        id="mobile-primary-navigation"
        aria-label="Main navigation"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={cn(
          "fixed inset-y-16 left-0 z-40 w-72 border-r border-slate-200/80 bg-white px-4 py-5 transition-transform duration-200 md:hidden",
          isMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Navigation pathname={pathname} onNavigate={closeMenu} />
      </nav>
    </>
  );
}

function Navigation({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="px-4 py-3">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Workspace
      </p>
      <ul className="space-y-1">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-150",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
                )}
              >
                <Icon
                  aria-hidden="true"
                  size={18}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <ChevronRight
                    aria-hidden="true"
                    size={15}
                    className="text-blue-600"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
