import React from 'react';
// Supabase処理が入ったactionsから呼ぶ
import { getLocationData } from '@/lib/actions'; 
import DashboardClient from '@/components/DashboardClient';
import type { Metadata } from 'next';

export const maxDuration = 60;

// ページのPropsの型定義
type Props = {
  params: Promise<{ cityName: string }>;
  searchParams: Promise<{ tags?: string }>;
};

// ★修正1: メタデータ生成でも searchParams (タグ) を受け取る
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { cityName } = await params;
  const decodedName = decodeURIComponent(cityName);

  // ★重要: メタデータ生成時は重い処理 (getLocationData) を呼ばない
  // 初回アクセス時はデフォルトの画像や説明文を出し、ページ本体でAI生成結果を表示させるのがUX的にも正解
  return {
    title: `${decodedName}の観光・歴史・経済データ | MachiLogue`,
    description: `${decodedName}の詳細な観光ガイド。AIが分析中...`,
    // 画像などは一旦なし、またはデフォルト画像にする
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