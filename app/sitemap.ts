import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // ★ここも新しいURLに書き換え！
  const baseUrl = 'https://machi-logue-travel.vercel.app';

  const cities = [
    "東京", "大阪", "京都", "札幌", "福岡", "那覇", "横浜", "名古屋", "金沢", "広島", "仙台",
    "ソウル", "台北", "香港", "バンコク", "シンガポール", "パリ", "ロンドン", "ローマ", "ニューヨーク", "ロサンゼルス", "ドバイ",
    "東京タワー", "東京スカイツリー", "USJ", "清水寺", "富士山", "エッフェル塔", "サグラダ・ファミリア", "自由の女神", "マチュピチュ"
  ];

  const cityUrls = cities.map((city) => ({
    url: `${baseUrl}/city/${encodeURIComponent(city)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...cityUrls,
  ];
}