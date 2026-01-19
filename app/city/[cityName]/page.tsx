import React from 'react';
import { getLocationData } from '@/lib/actions'; 
import DashboardClient from '@/components/DashboardClient';
import type { Metadata } from 'next';
// ★修正: ここでの import PaymentInfo ... は削除したで（使わんからな）

// 念のため60秒にしておく
export const maxDuration = 60;

// ページのPropsの型定義
type Props = {
  params: Promise<{ cityName: string }>;
  searchParams: Promise<{ tags?: string }>;
};

// ★準備: 5枚のデフォルト画像リスト
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
          url: selectedImage,
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

  // ★ここでデータ取得（payment情報も含まれてる）
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