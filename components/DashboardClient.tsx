'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import Header from './Header';
import Hero from './Hero';
import Tabs from './Tabs';
import HistoryPage from './HistoryPage';
import PlanPage from './PlanPage';
import TourismInformation from './TourismInformation';
// Tab型もここからインポート
import type { LocationData, Tab } from '@/types';

// 地図コンポーネントを動的にインポート（SSR回避）
const CityMap = dynamic(() => import('./CityMap'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-2xl" />
});

interface Props {
  initialData: LocationData;
  selectedTags: string[];
}

const DashboardClient: React.FC<Props> = ({ initialData, selectedTags }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('tourism');
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // スクロール位置の基準となる「動かない目印」のref
    const scrollRef = useRef<HTMLDivElement>(null);

    // ダークモードの制御
    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) root.classList.add('dark');
        else root.classList.remove('dark');
    }, [isDarkMode]);

    // タブ変更とスクロールをセットで行う関数
    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);

        // 「目印」の位置を基準にスクロール
        if (scrollRef.current) {
            const headerHeight = 64; // ヘッダーの高さ (h-16 = 64px)
            
            // 目印の絶対位置を計算
            const elementPosition = scrollRef.current.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'tourism':
                return (
                    <div className="space-y-8">
                        <TourismInformation 
                            tourismInfo={initialData.tourismInfo} 
                            locationName={initialData.locationName} 
                            industries={initialData.majorIndustries}
                            economicSnapshot={initialData.economicSnapshot}
                            // ★ここ修正: 決済情報を渡す！
                            payment={initialData.payment}
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
                tags={selectedTags} 
            />
            <main className="pt-16 pb-24 min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
                <Hero
                    locationName={initialData.locationName}
                    subtitle={initialData.subtitle}
                    tags={initialData.tags}
                    headerImageUrl={initialData.headerImageUrl}
                    travelPlan={initialData.travelPlan}
                />
                
                {/* スクロール位置の基準点 */}
                <div ref={scrollRef} className="scroll-mt-16" />

                <div className="sticky top-16 z-40 bg-background-light dark:bg-background-dark transition-colors duration-300 shadow-sm">
                    <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {renderContent()}
                </div>
            </main>
        </>
    );
};

export default DashboardClient;