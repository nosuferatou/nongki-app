import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "react-day-picker/style.css";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://nongki-app.vercel.app",
  ),
  title: "Nongki",
  description: "Plan your next gathering with Nongki.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="min-h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-preference" strategy="beforeInteractive">
          {`try {
  const savedTheme = localStorage.getItem("nongki-theme");
  const useDarkTheme = savedTheme
    ? savedTheme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", useDarkTheme);
  document.documentElement.style.colorScheme = useDarkTheme ? "dark" : "light";
} catch {
  const useDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", useDarkTheme);
  document.documentElement.style.colorScheme = useDarkTheme ? "dark" : "light";
}`}
        </Script>
      </head>
      <body
        className={`${poppins.variable} ${poppins.className} min-h-screen bg-[#f7f9f4] text-primary-dark antialiased dark:bg-[#2b3629] dark:text-[#D1EDD3]`}
      >
        <ThemeProvider>
          <div className="min-h-screen">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
