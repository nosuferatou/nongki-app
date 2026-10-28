import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "react-day-picker/style.css";
import "./globals.css";

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
    <html lang="en" className="min-h-full antialiased">
      <body
        className={`${poppins.variable} ${poppins.className} min-h-screen bg-[#f7f9f4] text-primary-dark antialiased`}
      >
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
