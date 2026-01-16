import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
// LeafletのCSSを読み込む
import "leaflet/dist/leaflet.css"; 

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "MachiLogue - 世界の都市をデータで探求する",
  description: "観光、歴史、経済データをAIが可視化するトラベルダッシュボード",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${lora.variable}`}>
      <head>
        {/* マテリアルアイコンの読み込み */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body className="bg-gray-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}