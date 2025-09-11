import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ReportsProvider } from "./context/ReportsContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Market Health Tracker",
  description: "Track and generate market health reports in real-time",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-slate-50 text-gray-900 antialiased`}>
        <ReportsProvider>
          <main className="min-h-screen">{children}</main>
        </ReportsProvider>
      </body>
    </html>
  );
}
