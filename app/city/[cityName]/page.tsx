import React from 'react';
// Supabase処理が入ったactionsから呼ぶ
import { getLocationData } from '@/lib/actions'; 
import DashboardClient from '@/components/DashboardClient';
import type { Metadata } from 'next';

export const maxDuration = 30;

// ページのPropsの型定義
type Props = {
  params: Promise<{ cityName: string }>;
  searchParams: Promise<{ tags?: string }>;
};

// ★修正1: メタデータ生成でも searchParams (タグ) を受け取る
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { cityName } = await params;
  const { tags } = await searchParams; // ★ここでタグを取得
  
  const decodedName = decodeURIComponent(cityName);
  const tagList = tags ? tags.split(',') : []; // ★タグリストを作成

  // ★修正2: getLocationDataに tagList も渡す
  // これでページ本体の呼び出しと引数が完全に一致し、キャッシュが効く（APIリクエストが1回になる）
  const data = await getLocationData(decodedName, tagList);

  return {
    title: `${decodedName}の観光・歴史・経済データ | MachiLogue`,
    description: data.subtitle || `${decodedName}の詳細な観光ガイド。歴史、経済、旅行プランをAIが分析。`,
    openGraph: {
      title: `${decodedName} - MachiLogue`,
      description: data.subtitle,
      images: [
        {
          url: data.headerImageUrl, 
          width: 1200,
          height: 630,
          alt: decodedName,
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

  // ここは変更なし（メタデータ側と同じ引数なので、キャッシュされた結果が即座に返り、APIは呼ばれない）
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