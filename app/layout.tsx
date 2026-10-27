import type { Metadata } from "next";
import "react-day-picker/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nongki",
  description: "Plan your next gathering with Nongki.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="min-h-full antialiased">
      <body className="min-h-screen bg-slate-50/70 text-slate-900">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
