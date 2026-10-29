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
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/95 px-4 backdrop-blur dark:border-[#5C7057]/50 dark:bg-[#2b3629]/95 md:hidden">
        <Link
          href="/"
          onClick={closeMenu}
          className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-[#202734] dark:text-[#D1EDD3]"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-primary-light text-sm text-primary-dark">
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
          className="grid size-11 place-items-center rounded-xl text-secondary-dark transition-all hover:bg-secondary-light/50 active:scale-[0.98] dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/40"
        >
          {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </header>

      {isMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMenu}
          className="fixed inset-0 z-30 bg-primary-dark/20 md:hidden"
        />
      )}

      <aside className="hidden w-64 shrink-0 border-r border-slate-200/60 bg-white md:sticky md:top-0 md:flex md:h-screen md:flex-col dark:border-[#5C7057]/50 dark:bg-[#2b3629]">
        <Link
          href="/"
          className="flex h-20 items-center gap-3 px-6 text-lg font-semibold tracking-tight text-[#202734] dark:text-[#D1EDD3] sm:text-xl"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-primary-light text-base text-primary-dark">
            N
          </span>
          Nongki
        </Link>
        <nav aria-label="Main navigation" className="flex-1">
          <Navigation pathname={pathname} />
        </nav>
        <div className="mt-auto px-6 py-5">
          <p className="text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]">
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
          "fixed inset-y-16 left-0 z-40 w-72 border-r border-slate-200/60 bg-white px-4 py-5 transition-transform duration-200 dark:border-[#5C7057]/50 dark:bg-[#2b3629] md:hidden",
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
      <p className="mb-3 px-3 text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]">
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
                  "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-150 active:scale-[0.98]",
                  active
                    ? "bg-secondary-light/40 text-secondary-dark dark:bg-[#5C7057]/40 dark:text-[#D1EDD3]"
                    : "text-secondary-dark hover:bg-secondary-light/50 hover:text-primary-dark dark:text-[#ACC5A6] dark:hover:bg-[#5C7057]/30 dark:hover:text-[#D1EDD3]",
                )}
              >
                <Icon
                  aria-hidden="true"
                  size={16}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <ChevronRight
                    aria-hidden="true"
                    size={16}
                    className="text-primary-dark dark:text-[#D1EDD3]"
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
