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