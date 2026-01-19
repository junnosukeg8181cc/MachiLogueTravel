export type SearchTag = '金融' | 'トレンド' | 'アート' | '民俗' | '交通・インフラ' | 'グルメ' | '人口流体';

// ★これを追加！
export type Tab = 'tourism' | 'history' | 'plan';

export interface EconomicMetric {
  value: string;
  currency?: string;
  growth?: string;
}

export interface EconomicMetricSimple {
    value: string;
}

export interface EconomicSnapshotData {
  year: string;
  dataScope: string;
  gdp: EconomicMetric;
  tradeVolume: EconomicMetric;
  annualVisitors: EconomicMetric;
  unemploymentRate: EconomicMetricSimple;
  inflationRate: EconomicMetricSimple;
}

export interface Industry {
  name: string;
  icon: string;
  colorKey: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
  historicalContext?: string; // オプショナルに変更
}

export interface DeepDive {
    title: string;
    summary: string;
    fullStory: string;
    source: {
        name: string;
        details: string;
    };
}

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  icon: string;
  historicalContext: string;
}

export interface TravelPlan {
  title: string;
  description: string;
  itinerary: ItineraryItem[];
}

export interface TourismInfo {
  latitude: number;
  longitude: number;
  regionalCenter: string;
  distanceFromCenter: string;
  language: string;
  currency: string;
  currencyCode: string;
  currencyRate: string;
  area: string;
  tourismInfo: string;
}

export interface LocationData {
  locationName: string;
  subtitle: string;
  tags: string[];
  headerImageUrl: string;
  englishLocationName?: string; // 追加
  economicSnapshot: EconomicSnapshotData;
  majorIndustries: Industry[];
  historicalTimeline: TimelineEvent[];
  travelPlan: TravelPlan;
  deepDive: DeepDive;
  tourismInfo: TourismInfo;
}

export interface PaymentInfo {
  currency: string;        // 通貨 (例: ユーロ、ドル)
  cashInfo: string;        // 現金の必要性 (例: 屋台では必須、ほぼ不要など)
  cardInfo: string;        // カード事情 (例: VISA/MasterはどこでもOKなど)
  tipping: string;         // チップ文化 (例: 義務、気持ち程度、なし)
  tippingRate: string;     // チップ相場 (例: 15-20%、端数を切り上げ)
}

export interface CityData {
  // ...既存のプロパティ
  payment: PaymentInfo; // ★ここを追加
}