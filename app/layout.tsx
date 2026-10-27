import type { Metadata } from "next";
import "react-day-picker/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nongki",
  description: "Plan your next gathering with Nongki.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-white text-black">
        <header className="bg-black text-white">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex h-16 max-w-3xl items-center px-4 sm:px-6"
          >
            <span className="text-lg font-bold tracking-tight">NONGKI.</span>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
