// types/index.ts

export type SearchTag = '金融' | 'トレンド' | 'アート' | '民俗' | '交通・インフラ' | 'グルメ' | '人口流体' | '地政学' | '文化' | '宗教・思想' | '食文化' | '産業';
export type Tab = 'tourism' | 'history' | 'plan';

// ... (既存のEconomicMetricなどの定義はそのまま) ...
export interface EconomicMetric {
  value: string;
  currency?: string;
  growth?: string;
  comparison?: string; // e.g. "東京都の約1.2倍"
  insight?: string;    // e.g. "物価は高いけど、その分給料もええから生活水準は高いで"
}
export interface EconomicMetricSimple {
  value: string;
  comparison?: string;
  insight?: string;
}
export interface LivingCost {
  index: 'Low' | 'Medium' | 'High' | 'Very High';
  coffeePrice: string; // e.g. "550円"
  insight: string;     // e.g. "ランチは1000円超えるのが普通やな"
}

export interface EconomicSnapshotData {
  year: string;
  dataScope: string;
  cityPulse: string;   // e.g. "アジアの熱気が渦巻く、眠らない金融都市"
  livingCost: LivingCost;
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
  color?: string; // e.g. "Blue", "Red" - Gemini generated color hint
}
export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
  historicalContext?: string;
  color?: string; // e.g. "Blue", "Red"
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