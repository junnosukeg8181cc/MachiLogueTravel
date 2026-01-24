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



// AIを待たず、都市名に基づいて画像を割り当てる「爆速メタデータ」 ... ではなく、概要取得のためにデータフェッチを行う
// ★修正: キャッシュがある時だけAI概要を使い、ない時は汎用テキストで高速化する
import { getCachedLocationData } from '@/lib/actions';

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { cityName } = await params;
  const { tags } = await searchParams;
  const decodedName = decodeURIComponent(cityName);
  const tagList = tags ? tags.split(',') : [];

  // 1. キャッシュからのみデータ取得を試みる (高速)
  const data = await getCachedLocationData(decodedName, tagList);

  // ハッシュタグ生成
  const hashtags = [`#${decodedName}`, ...tagList.map(t => `#${t}`)].join(' ');

  let description = "";

  if (data) {
    // キャッシュヒット: AI生成された詳細な概要を使う
    description = `${data.subtitle} ${hashtags}`;
  } else {
    // キャッシュミス: ページ読み込みをブロックしないよう、汎用テキストを使う
    description = `${decodedName}の観光地概要と詳細データ。歴史、経済、文化をAIが多角的に分析したトラベルダッシュボード。 ${hashtags}`;
  }

  return {
    title: `${decodedName}の観光・歴史・経済データ | MachiLogue`,
    description: description,
    openGraph: {
      title: `${decodedName} - MachiLogue`,
      description: description,
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