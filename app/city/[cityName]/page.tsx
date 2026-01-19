import React from 'react';
// Supabase処理が入ったactionsから呼ぶ
import { getLocationData } from '@/lib/actions'; 
import DashboardClient from '@/components/DashboardClient';
import type { Metadata } from 'next';

// 念のため60秒にしておく
export const maxDuration = 60;

// ページのPropsの型定義
type Props = {
  params: Promise<{ cityName: string }>;
  searchParams: Promise<{ tags?: string }>;
};

// ★準備: 5枚のデフォルト画像リスト
// publicフォルダに og-1.jpg, og-2.jpg ... を置いておくこと
const OG_IMAGES = [
  '/og-1.jpg',
  '/og-2.jpg',
  '/og-3.jpg',
  '/og-4.jpg',
  '/og-5.jpg',
  '/og-6.jpg',
  '/og-7.jpg',
  '/og-8.jpg',
  '/og-9.jpg',
  '/og-10.jpg',
];

// ★修正: AIを待たず、都市名に基づいて画像を割り当てる「爆速メタデータ」
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cityName } = await params;
  const decodedName = decodeURIComponent(cityName);

  // ★ロジック: 文字列（都市名）を数値に変換して、5で割った余りを計算する
  // これにより、ランダムに見えて「その都市では常に同じ画像」が選ばれる（SNSで安定する）
  const nameScore = decodedName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIndex = nameScore % OG_IMAGES.length;
  const selectedImage = OG_IMAGES[imageIndex];

  return {
    title: `${decodedName}の観光・歴史・経済データ | MachiLogue`,
    description: `${decodedName}の詳細な観光ガイド。歴史、経済、旅行プランをAIが分析中...`,
    openGraph: {
      title: `${decodedName} - MachiLogue`,
      description: `${decodedName}の詳細データを確認する`,
      images: [
        {
          url: selectedImage, // 計算で選ばれた画像
          width: 1200,
          height: 630,
          alt: `${decodedName} - MachiLogue`,
        },
      ],
    },
  };
}

export default async function CityPage({ params, searchParams }: Props) {
  const { cityName } = await params;
  const { tags } = await searchParams;
  
  const decodedName = decodeURIComponent(cityName);
  const tagList = tags ? tags.split(',') : [];

  // ★ここで初めて重い処理 (AI生成 or DB取得) が走る
  const data = await getLocationData(decodedName, tagList);

  // 構造化データ（JSON-LD）の作成
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: data.locationName,
    description: data.subtitle,
    image: data.headerImageUrl,
    address: {
      '@type': 'PostalAddress',
      addressCountry: data.tourismInfo.regionalCenter,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.tourismInfo.latitude,
      longitude: data.tourismInfo.longitude,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <DashboardClient initialData={data} selectedTags={tagList} />
    </>
  );
}