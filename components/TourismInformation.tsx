'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Icon from './Icon';
import type { TourismInfo, Industry, EconomicSnapshotData, PaymentInfo as PaymentType } from '@/types';

// 地図と天気は動的インポート
const CityMap = dynamic(() => import('./CityMap'), {
    ssr: false,
    loading: () => <div className="h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
});
import WeatherForecast from './WeatherForecast';
import MajorIndustries from './MajorIndustries';
import EconomicSnapshot from './EconomicSnapshot';

interface TourismInformationProps {
    tourismInfo: TourismInfo;
    locationName: string;
    industries?: Industry[];
    economicSnapshot?: EconomicSnapshotData;
    payment: PaymentType;
}

const TourismInformation: React.FC<TourismInformationProps> = ({
    tourismInfo,
    locationName,
    industries,
    economicSnapshot,
    payment
}) => {
    const {
        latitude,
        longitude,
        regionalCenter,
        distanceFromCenter,
        language,
        currency,
        currencyCode,
        currencyRate,
        tourismInfo: tourismSummary,
    } = tourismInfo;

    const [realtimeRate, setRealtimeRate] = useState<string | null>(null);

    // リアルタイム為替レートの取得
    useEffect(() => {
        const fetchRate = async () => {
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

    // カードの共通デザインコンポーネント
    const InfoCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
        <div className={`bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700 ${className}`}>
            {children}
        </div>
    );

    // 基本情報アイテムの行コンポーネント
    const InfoItem = ({ icon, label, value, subValue }: { icon: string, label: string, value: string, subValue?: string | null }) => (
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <Icon name={icon} className="text-xl" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-1">{label}</p>
                <p className="text-slate-900 dark:text-white font-bold text-lg leading-tight">{value}</p>
                {subValue && (
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-snug">{subValue}</p>
                )}
            </div>
        </div>
    );

    return (
        <section className="space-y-12">

            {/* 1. 観光サマリと地図 (概要と地図) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 概要テキスト */}
                {tourismSummary && (
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <Icon name="explore" className="text-primary" />
                            概要
                        </h3>
                        <InfoCard className="flex-1 overflow-y-auto max-h-[400px]">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {tourismSummary}
                            </p>
                        </InfoCard>
                    </div>
                )}

                {/* 地図 */}
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <Icon name="map" className="text-primary" />
                        地図
                    </h3>
                    <div className="h-[300px] lg:h-full min-h-[300px] rounded-2xl overflow-hidden shadow-card border border-gray-100 dark:border-gray-700 relative z-0">
                        <CityMap tourismInfo={tourismInfo} locationName={locationName} />
                    </div>
                </div>
            </div>
            {/* 5. 天気予報 */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <Icon name="wb_sunny" className="text-primary" />
                    現地の天気
                </h3>
                <WeatherForecast latitude={latitude} longitude={longitude} />
            </div>

            {/* 2. 基本情報 & マネー */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <Icon name="info" className="text-primary" />
                    基本情報 & マネー
                </h3>

                <div className="space-y-4">
                    {/* 上段：中心都市と言語 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard>
                            <InfoItem
                                icon="place"
                                label="地域の中心"
                                value={regionalCenter}
                                subValue={distanceFromCenter}
                            />
                        </InfoCard>

                        <InfoCard>
                            <InfoItem
                                icon="language"
                                label="主要言語"
                                value={language}
                            />
                        </InfoCard>
                    </div>

                    {/* 下段：決済情報の統合カード */}
                    <InfoCard className="bg-gradient-to-br from-white to-slate-50 dark:from-surface-dark dark:to-slate-800/50 relative overflow-hidden">
                        {/* 背景の装飾アイコン */}
                        <Icon name="payments" className="absolute -bottom-10 -right-4 text-[10rem] text-primary/5 dark:text-primary/10 pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 p-2">

                            {/* 左側：通貨情報 */}
                            <div className="flex items-start gap-4 md:w-1/3">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                    <Icon name="currency_exchange" className="text-3xl" />
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-1">通貨 / レート</p>
                                    <p className="text-slate-900 dark:text-white font-bold text-2xl leading-tight">{currency}</p>
                                    <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mt-1">
                                        {realtimeRate || currencyRate || 'レート情報なし'}
                                    </p>
                                </div>
                            </div>

                            {/* 仕切り線 */}
                            <div className="hidden md:block w-px h-16 bg-gray-200 dark:bg-gray-700/50 mx-2" />
                            <hr className="md:hidden border-gray-100 dark:border-gray-700/50" />

                            {/* 右側：決済事情とチップ */}
                            <div className="flex-1">
                                {payment ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* 決済事情 */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-200 font-bold text-sm">
                                                <Icon name="credit_card" className="text-blue-500" />
                                                決済事情
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                                {payment.cardInfo}
                                            </p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
                                                ※{payment.cashInfo}
                                            </p>
                                        </div>
                                        {/* チップ + 物価感一言 */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-200 font-bold text-sm">
                                                <Icon name="savings" className="text-amber-500" />
                                                チップ & 予算感
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                                {payment.tipping}
                                            </p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1 mb-2">
                                                {payment.tippingRate}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-2">
                                        <p className="text-xs text-gray-400">詳細な決済情報は読み込めませんでした</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>

            {/* 3. City DNA & Pulse (経済スナップショット) - ここに配置！ */}
            {economicSnapshot && (
                <div>
                    <EconomicSnapshot data={economicSnapshot} />
                </div>
            )}

            {/* 4. 主要産業 */}
            {industries && industries.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <Icon name="factory" className="text-primary" />
                        主要産業
                    </h3>
                    <MajorIndustries industries={industries} />
                </div>
            )}



        </section>
    );
};

export default TourismInformation;