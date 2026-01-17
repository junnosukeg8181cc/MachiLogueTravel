import React from 'react';
import { fetchLocationData } from '@/lib/gemini';
import DashboardClient from '@/components/DashboardClient';
import type { Metadata } from 'next';

export const maxDuration = 30;

// ページのPropsの型定義
type Props = {
  params: Promise<{ cityName: string }>;
  searchParams: Promise<{ tags?: string }>;
};

// ★1. 動的メタデータの生成（SEO対策の肝）
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cityName } = await params;
  const decodedName = decodeURIComponent(cityName);

  // データを取得（cacheしてるのでAPI消費は1回分で済みます）
  const data = await fetchLocationData(decodedName);

  return {
    title: `${decodedName}の観光・歴史・経済データ | MachiLogue`,
    description: data.subtitle || `${decodedName}の詳細な観光ガイド。歴史、経済、旅行プランをAIが分析。`,
    openGraph: {
      title: `${decodedName} - MachiLogue`,
      description: data.subtitle,
      images: [
        {
          url: data.headerImageUrl, // その都市の画像をSNSで表示
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

  // データ取得
  const data = await fetchLocationData(decodedName, tagList);

  // ★2. 構造化データ（JSON-LD）の作成
  // Googleに「ここは観光地ですよ」と伝えるデータ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: data.locationName,
    description: data.subtitle,
    image: data.headerImageUrl,
    address: {
      '@type': 'PostalAddress',
      addressCountry: data.tourismInfo.regionalCenter, // 国や地域名として使用
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.tourismInfo.latitude,
      longitude: data.tourismInfo.longitude,
    },
  };

  return (
    <>
      {/* 構造化データを埋め込むスクリプト */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <DashboardClient initialData={data} selectedTags={tagList} />
    </>
  );
}