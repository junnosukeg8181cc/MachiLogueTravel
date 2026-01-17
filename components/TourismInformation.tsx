'use client';
import React, { useState, useEffect } from 'react';
// ★修正: 普通のimportを削除
// import CityMap from './CityMap'; 

// ★修正: next/dynamicを使って、サーバー側での読み込みを無効化(ssr: false)する
import dynamic from 'next/dynamic';
const CityMap = dynamic(() => import('./CityMap'), { 
    ssr: false,
    loading: () => <div className="h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
});

import WeatherForecast from './WeatherForecast';
import MajorIndustries from './MajorIndustries';
import EconomicSnapshot from './EconomicSnapshot';
import Icon from './Icon';
import type { TourismInfo, Industry, EconomicSnapshotData } from '../types';

interface TourismInformationProps {
    tourismInfo: TourismInfo;
    locationName: string;
    industries?: Industry[];
    economicSnapshot?: EconomicSnapshotData;
}

const TourismInformation: React.FC<TourismInformationProps> = ({ 
    tourismInfo, 
    locationName,
    industries,
    economicSnapshot
}) => {
    // ... (以下のコードは変更なし。そのまま維持してください) ...
    const {
        latitude,
        longitude,
        regionalCenter,
        distanceFromCenter,
        language,
        currency,
        currencyCode,
        currencyRate,
        area,
        tourismInfo: tourismSummary,
    } = tourismInfo;

    const [realtimeRate, setRealtimeRate] = useState<string | null>(null);

    // リアルタイム為替レートの取得
    useEffect(() => {
        const fetchRate = async () => {
            // 日本円の場合やコードがない場合はスキップ
            if (!currencyCode || currencyCode === 'JPY') return;

            try {
                const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currencyCode}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                const jpyRate = data.rates.JPY;
                if (jpyRate) {
                    setRealtimeRate(`1 ${currencyCode} = ${jpyRate.toFixed(2)} JPY (現在)`);
                }
            } catch (error) {
                console.error("Failed to fetch realtime currency rate:", error);
            }
        };

        fetchRate();
    }, [currencyCode]);

    const infoItems = [
        {
            icon: 'place',
            label: '地域の中心',
            value: regionalCenter,
            subValue: distanceFromCenter,
        },
        {
            icon: 'language',
            label: '主要言語',
            value: language,
        },
        {
            icon: 'attach_money',
            label: '通貨',
            value: currency,
            // リアルタイムレートが取れていればそれを表示、なければGeminiの概算を表示
            subValue: realtimeRate || currencyRate,
        },
        {
            icon: 'square_foot',
            label: '地域面積',
            value: area,
        },
    ];

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">観光情報</h2>
           
            {/* 1. 最上部セクション: 観光サマリと地図 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 左側: 観光情報サマリ */}
                {tourismSummary && (
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                            <Icon name="explore" className="text-primary" />
                            観光情報サマリ
                        </h3>
                        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-card border border-gray-100 dark:border-gray-700 flex-1 overflow-y-auto max-h-[400px]">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line break-words">
                                {tourismSummary}
                            </p>
                        </div>
                    </div>
                )}

                {/* 右側: 地図 */}
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                        <Icon name="map" className="text-primary" />
                        地図
                    </h3>
                    <div className="h-[400px] rounded-xl overflow-hidden">
                        <CityMap tourismInfo={tourismInfo} locationName={locationName} />
                    </div>
                </div>
            </div>

            {/* 2. 第2セクション: 天気予報 */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <Icon name="wb_sunny" className="text-primary" />
                    天気予報
                </h3>
                <WeatherForecast latitude={latitude} longitude={longitude} />
            </div>

            {/* 3. 第3セクション: 基本情報グリッド */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <Icon name="info" className="text-primary" />
                    基本情報
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {infoItems.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                                    <Icon name={item.icon} className="text-xl" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{item.label}</p>
                                    <p className="text-slate-900 dark:text-white font-semibold text-base">{item.value}</p>
                                    {item.subValue && (
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{item.subValue}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. 第4セクション: 主要産業 */}
            {industries && industries.length > 0 && (
                <MajorIndustries industries={industries} />
            )}

            {/* 5. 第5セクション: 経済スナップショット */}
            {economicSnapshot && (
                <EconomicSnapshot data={economicSnapshot} />
            )}
        </section>
    );
};

export default TourismInformation;