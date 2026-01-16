'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // 地図を安全に読み込むため
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // next/router ではなく next/navigation

import Header from './Header';
import Hero from './Hero';
import Tabs from './Tabs';
import EconomicSnapshot from './EconomicSnapshot';
import MajorIndustries from './MajorIndustries';
import HistoryPage from './HistoryPage';
import PlanPage from './PlanPage';
import TourismInformation from './TourismInformation';
import type { LocationData } from '@/types';

// 地図コンポーネントを動的にインポート（SSR回避）
const CityMap = dynamic(() => import('./CityMap'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-2xl" />
});

type Tab = 'tourism' | 'history' | 'plan';

interface Props {
  initialData: LocationData; // サーバーから受け取る初期データ
}

const DashboardClient: React.FC<Props> = ({ initialData }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('tourism');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // ダークモードの制御
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) root.classList.add('dark');
        else root.classList.remove('dark');
    }, [isDarkMode]);

    const renderContent = () => {
        switch (activeTab) {
            case 'tourism':
                return (
                    <div className="space-y-8">
                        {/* TourismInformationの中でCityMapを使うため、propsを渡す */}
                        <TourismInformation 
                            tourismInfo={initialData.tourismInfo} 
                            locationName={initialData.locationName} 
                            industries={initialData.majorIndustries}
                            economicSnapshot={initialData.economicSnapshot}
                        />
                    </div>
                );
            case 'history':
                return <HistoryPage events={initialData.historicalTimeline} deepDive={initialData.deepDive} />;
            case 'plan':
                return <PlanPage plan={initialData.travelPlan} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Header 
                isDarkMode={isDarkMode} 
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                onNavigateHome={() => router.push('/')} 
                locationName={initialData.locationName} 
                tags={initialData.tags} 
            />
            <main className="pt-16 pb-16 min-h-screen">
                <Hero
                    locationName={initialData.locationName}
                    subtitle={initialData.subtitle}
                    tags={initialData.tags}
                    headerImageUrl={initialData.headerImageUrl}
                />
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
                    {renderContent()}
                </div>
            </main>
        </>
    );
};

export default DashboardClient;