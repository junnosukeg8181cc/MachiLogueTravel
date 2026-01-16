import type { Metadata } from 'next';
import { getLocationData } from '@/lib/actions';
import DashboardClient from '@/components/DashboardClient';

// Next.js 15以降を見据えた型定義（paramsはPromiseになる可能性があります）
type Props = {
  params: Promise<{ cityName: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 1. 動的メタデータ生成 (SEO対策の要！)
// ページの中身を作る前に、Google検索結果に表示されるタイトルや説明文を自動で作ります。
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { cityName } = await params;
  const decodedCityName = decodeURIComponent(cityName);
  
  return {
    title: `${decodedCityName}の観光・歴史・経済完全ガイド | MachiLogue`,
    description: `AIが分析した${decodedCityName}の旅行ガイド。観光スポット、経済状況、歴史的な背景まで、あらゆるデータを可視化して提供します。`,
    openGraph: {
      title: `${decodedCityName}の全てをデータで可視化 - MachiLogue`,
      description: `${decodedCityName}への旅行前に知っておくべき情報を網羅。`,
    },
  };
}

// 2. ページ本体 (Server Component)
// ここはサーバー（Node.js）で実行されます。
export default async function CityPage({ params, searchParams }: Props) {
  // URLから都市名とタグを取得
  const { cityName } = await params;
  const { tags } = await searchParams;
  
  const decodedCityName = decodeURIComponent(cityName);
  // タグがカンマ区切りで来るので配列に戻す
  const tagList = typeof tags === 'string' ? tags.split(',') : [];

  // ★ここでサーバー側でデータを取得！ (ユーザーのブラウザは待機中)
  // loading.tsxを作れば、この待機中にローディング画面が出せます
  const locationData = await getLocationData(decodedCityName, tagList);

  // 構造化データ（JSON-LD）を作成
  // Googleに「これは記事ではなく、観光地のデータですよ」と教える最強のSEO対策
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: locationData.locationName,
    description: locationData.subtitle,
    image: locationData.headerImageUrl,
    publicAccess: true,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: locationData.tourismInfo.latitude,
      longitude: locationData.tourismInfo.longitude,
    }
  };

  return (
    <>
      {/* 構造化データを埋め込む */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* データをクライアントコンポーネントに渡して表示 */}
      <DashboardClient initialData={locationData} />
    </>
  );
}