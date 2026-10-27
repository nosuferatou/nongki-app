import type { ReactNode } from "react";
import NavbarSidebar from "@/components/NavbarSidebar";

export default function AdminLayoutShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen md:flex">
      <NavbarSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
