import React from 'react';
import type { EconomicSnapshotData, LivingCost } from '../types';
import Icon from './Icon';

interface EconomicSnapshotProps {
    data: EconomicSnapshotData;
}

// 数値をカンマ区切りにするヘルパー関数
const formatNumber = (val: string) => {
    const num = parseFloat(val.replace(/,/g, ''));
    if (isNaN(num)) return val;
    if (/^\d+$/.test(val)) return Number(val).toLocaleString();
    return val;
};

// メトリックカードコンポーネント
const MetricCard: React.FC<{
    title: string;
    value: string;
    unit?: string;
    subValue?: string;
    comparison?: string;
    insight?: string;
    icon: string;
    colorClass: string;
    subIcon?: string;
}> = ({ title, value, unit, subValue, comparison, insight, icon, colorClass, subIcon }) => {
    return (
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all h-full flex flex-col">
            <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                    <Icon name={icon} className="text-xl" />
                </div>
                {subValue && (
                    <div className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold flex items-center gap-1">
                        {subIcon && <Icon name={subIcon} className="text-xs" />}
                        {subValue}
                    </div>
                )}
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-1 tracking-wider uppercase">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {formatNumber(value)} <span className="text-sm font-normal text-gray-500">{unit}</span>
            </h3>

            {comparison && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                    vs {comparison}
                </p>
            )}

            {insight && (
                <div className="flex items-start gap-2 mt-auto">
                    <Icon name="lightbulb" className="text-amber-400 text-sm mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                        "{insight}"
                    </p>
                </div>
            )}
        </div>
    );
};

// Living Cost カードコンポーネント
const LivingCostCard: React.FC<{ livingCost?: LivingCost; className?: string }> = ({ livingCost, className = "" }) => {
    if (!livingCost) return null;

    const getLevelColor = (index: string) => {
        switch (index) {
            case 'High': return 'bg-red-500';
            case 'Very High': return 'bg-purple-600';
            case 'Medium': return 'bg-amber-500';
            case 'Low': return 'bg-emerald-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className={`bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-card text-white relative overflow-hidden h-full flex flex-col ${className}`}>
            <Icon name="local_cafe" className="absolute -right-6 -bottom-6 text-9xl text-white/5" />

            <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Living Cost Index</p>
                        <h3 className="text-3xl font-bold text-white tracking-tight">物価感</h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(livingCost.index)} text-white`}>
                        {livingCost.index} Lvl
                    </div>
                </div>

                <div className="flex items-end gap-2 mb-6 mt-auto">
                    <span className="text-4xl font-bold">{livingCost.coffeePrice}</span>
                    <span className="text-sm text-white/60 mb-1">/ カフェラテ1杯</span>
                </div>

                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-start gap-3">
                        <Icon name="tips_and_updates" className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium leading-relaxed text-white/90 italic">
                            "{livingCost.insight}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EconomicSnapshot: React.FC<EconomicSnapshotProps> = ({ data }) => {
    return (
        <section className="space-y-6">
            {/* Header with City Pulse */}
            <div className="relative overflow-hidden rounded-3xl bg-primary/5 dark:bg-primary/10 p-8 border border-primary/10">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-2">
                        <Icon name="query_stats" />
                        City DNA & Pulse
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
                        {data.cityPulse || "都市の鼓動を感じる"}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
                        <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm border border-gray-100 dark:border-gray-700 font-mono">
                            DATA: {data.year}
                        </span>
                        <span>{data.dataScope}</span>
                    </div>
                </div>
                <Icon name="analytics" className="absolute -right-6 -bottom-6 text-9xl text-primary/5 dark:text-primary/10 pointer-events-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. GDP */}
                <MetricCard
                    title="経済規模 (GDP)"
                    value={data.gdp.value}
                    unit={data.gdp.currency}
                    subValue={data.gdp.growth}
                    subIcon="trending_up"
                    comparison={data.gdp.comparison}
                    insight={data.gdp.insight}
                    icon="attach_money"
                    colorClass="bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                />

                {/* 2. Annual Visitors */}
                <MetricCard
                    title="年間訪問者数"
                    value={data.annualVisitors.value}
                    comparison={data.annualVisitors.comparison}
                    insight={data.annualVisitors.insight}
                    icon="flight_takeoff"
                    colorClass="bg-red-50 dark:bg-red-900/30 text-red-600"
                />

                {/* 3. Living Cost (Right col top) */}
                <LivingCostCard livingCost={data.livingCost} className="h-full" />

                {/* 4. Trade Volume */}
                <MetricCard
                    title="貿易量"
                    value={data.tradeVolume.value}
                    unit={data.tradeVolume.currency}
                    comparison={data.tradeVolume.comparison}
                    insight={data.tradeVolume.insight}
                    icon="swap_horiz"
                    colorClass="bg-orange-50 dark:bg-orange-900/30 text-orange-600"
                />

                {/* 5. Unemployment */}
                <MetricCard
                    title="失業率"
                    value={data.unemploymentRate.value}
                    comparison={data.unemploymentRate.comparison}
                    insight={data.unemploymentRate.insight}
                    icon="work"
                    colorClass="bg-purple-50 dark:bg-purple-900/30 text-purple-600"
                />

                {/* 6. Inflation Rate (Right col bottom) */}
                <MetricCard
                    title="インフレ率"
                    value={data.inflationRate.value}
                    comparison={data.inflationRate.comparison}
                    insight={data.inflationRate.insight}
                    icon="payments"
                    colorClass="bg-pink-50 dark:bg-pink-900/30 text-pink-600"
                />
            </div>
        </section>
    );
};

export default EconomicSnapshot;