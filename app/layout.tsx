import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "AppTracker — China Mastery & RUYA Services",
  description: "Expense & income tracker for China Mastery and RUYA Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased" suppressHydrationWarning={true}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
