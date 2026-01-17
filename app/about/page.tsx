import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon';

export const metadata: Metadata = {
  title: 'MachiLogue（マチローグ）とは | データとAIで旅を科学する次世代ガイド',
  description: 'MachiLogueは、世界の都市を「観光」「経済」「歴史」のデータから多角的に分析するAIトラベルガイドです。ガイドブックには載っていない都市の素顔を可視化し、あなただけの知的な旅を提案します。',
  openGraph: {
    title: 'MachiLogueとは - データで旅を変える',
    description: 'AIが分析した都市データで、賢く深い旅へ。',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* ヘッダー的なナビゲーション */}
      <nav className="p-6 flex justify-between items-center max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary hover:opacity-80 transition">
          <Icon name="public" className="text-2xl" />
          <span>MachiLogue</span>
        </Link>
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-primary transition">
          トップへ戻る
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-24">
        
        {/* ヒーローセクション */}
        <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            旅は、<span className="text-primary">データ</span>で<br className="md:hidden"/>もっと深くなる。
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            MachiLogue（マチローグ）は、AIとビッグデータを活用して<br className="hidden md:inline"/>
            世界の都市を「解剖」する、新しい形のトラベル・インテリジェンスツールです。
          </p>
        </section>

        {/* 3つの特徴（SEOキーワード: 経済データ, 歴史, AI旅程） */}
        <section className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="analytics"
            title="都市の「今」を数値化"
            description="GDP、物価指数、治安、産業構造。ガイドブックには載らないリアルな経済データを可視化し、その街の本当の姿を浮き彫りにします。"
          />
          <FeatureCard 
            icon="history_edu"
            title="歴史を「物語」として"
            description="単なる年号の羅列ではなく、その都市が歩んできたストーリーをAIが要約。現代の風景に隠された歴史的背景を深く理解できます。"
          />
          <FeatureCard 
            icon="flight_takeoff"
            title="AIによる最適プラン"
            description="あなたの興味（金融、アート、グルメなど）に合わせて、AIが最適な観光ルートと立ち寄りスポットを瞬時に提案します。"
          />
        </section>

        {/* ミッションステートメント */}
        <section className="bg-white dark:bg-surface-dark p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">Why MachiLogue?</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-loose text-justify md:text-center">
            「綺麗な景色を見て終わり」の旅行はもう卒業しましょう。
            なぜその街は発展したのか？なぜその料理が名物なのか？
            すべての背景には理由（データと歴史）があります。
            MachiLogueは、知的好奇心旺盛なトラベラーのために、
            都市のコンテキスト（文脈）を提供します。
          </p>
        </section>

        {/* CTA（行動喚起） */}
        <section className="text-center space-y-8">
          <h2 className="text-3xl font-bold">さあ、知的冒険へ。</h2>
          <div className="flex justify-center">
            <Link 
              href="/"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <Icon name="search" />
              都市を検索する
              <span className="absolute right-[-5px] top-[-5px] flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
            </Link>
          </div>
        </section>

      </main>

      <footer className="py-8 text-center text-sm text-slate-400 dark:text-slate-600 border-t border-gray-100 dark:border-gray-800 mt-12">
        <p>© 2026 MachiLogue - Powered by Gemini AI & Next.js</p>
      </footer>
    </div>
  );
}

// サブコンポーネント（カード）
const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <div className="bg-white/50 dark:bg-surface-dark/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl flex items-center justify-center mb-4">
      <Icon name={icon} className="text-2xl" />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
      {description}
    </p>
  </div>
);