// types/index.ts

export type SearchTag = '金融' | 'トレンド' | 'アート' | '民俗' | '交通・インフラ' | 'グルメ' | '人口流体' | '地政学' | '文化' | '宗教・思想' | '食文化' | '産業';
export type Tab = 'tourism' | 'history' | 'plan';

// ... (既存のEconomicMetricなどの定義はそのまま) ...
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
  historicalContext?: string;
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

// ★追加1: 決済情報の型定義
export interface PaymentInfo {
  currency: string;
  cashInfo: string;
  cardInfo: string;
  tipping: string;
  tippingRate: string;
}

export interface LocationData {
  locationName: string;
  subtitle: string;
  tags: string[];
  headerImageUrl: string;
  englishLocationName?: string;
  economicSnapshot: EconomicSnapshotData;
  majorIndustries: Industry[];
  historicalTimeline: TimelineEvent[];
  travelPlan: TravelPlan;
  deepDive: DeepDive;
  tourismInfo: TourismInfo;
  // ★追加2: ここに payment を追加！
  payment: PaymentInfo;
}