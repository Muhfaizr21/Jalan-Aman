import type { Metadata } from "next";
import ScrollReset from "@/components/ScrollReset";
import "./globals.css";

export const metadata: Metadata = {
  title: "JalanAman - Sistem Penentuan Rute Teraman dari Tindak Kriminalitas",
  description:
    "Platform navigasi cerdas dan pemetaan zona rawan kriminalitas untuk memandu perjalanan malam yang lebih aman dan terlindungi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <ScrollReset />
        {children}
      </body>
    </html>
  );
}
