import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'; // ★追加
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", style: ["normal", "italic"] });

export const metadata: Metadata = {
  // サイトのベースURL設定
  metadataBase: new URL('https://machi-logue-travel.vercel.app'),
  
  title: "MachiLogue - 世界の都市をデータで探求する",
  description: "観光、歴史、経済データをAIが可視化するトラベルダッシュボード",
  
  // Search Consoleの所有権確認コード
  verification: {
    google: 'EwekBe2YOZRPisPcGPqlydeRYZWnMUb7bP9s1htLzdc',
  },

  openGraph: {
    title: "MachiLogue - データで旅するAIガイド",
    description: "世界の都市を「観光」「経済」「歴史」のデータから多角的に分析。",
    url: 'https://machi-logue-travel.vercel.app',
    siteName: 'MachiLogue',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MachiLogue - データで旅するAIガイド",
    description: "世界の都市をデータで可視化するトラベルダッシュボード",
  },
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
        {/* ★Google Analyticsの埋め込み。IDは環境変数から取得します */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}