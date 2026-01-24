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



// AIを待たず、都市名に基づいて画像を割り当てる「爆速メタデータ」
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cityName } = await params;
  const decodedName = decodeURIComponent(cityName);



  return {
    title: `${decodedName}の観光・歴史・経済データ | MachiLogue`,
    // ★ここを修正：「旅行プラン」を削って「観光地概要」にフォーカス
    description: `${decodedName}の観光地概要と詳細データ。歴史、経済、文化をAIが多角的に分析したトラベルダッシュボード。`,
    openGraph: {
      title: `${decodedName} - MachiLogue`,
      description: `${decodedName}の観光地概要と詳細データを確認する`,
      // images: opengraph-image.tsx が自動的に補完する
    },
  };
}

export default async function CityPage({ params, searchParams }: Props) {
  const { cityName } = await params;
  const { tags } = await searchParams;

  const decodedName = decodeURIComponent(cityName);
  const tagList = tags ? tags.split(',') : [];

  const data = await getLocationData(decodedName, tagList);

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