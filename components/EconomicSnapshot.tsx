import React from 'react';
import type { EconomicSnapshotData } from '../types';
import Icon from './Icon';

interface EconomicSnapshotProps {
    data: EconomicSnapshotData;
}

// 数値をカンマ区切りにするヘルパー関数
const formatNumber = (val: string) => {
    // 数字以外の文字が含まれている場合はそのまま返す（例: "3.5%" など）
    const num = parseFloat(val.replace(/,/g, ''));
    if (isNaN(num)) return val;
    
    // もともと%や通貨記号がついていない単純な数字列の場合のみ整形
    if (/^\d+$/.test(val)) {
        return Number(val).toLocaleString();
    }
    return val;
};

const EconomicSnapshot: React.FC<EconomicSnapshotProps> = ({ data }) => {
    return (
        <section>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">経済スナップショット</h2>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{data.year}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{data.dataScope}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary dark:text-blue-400">
                            <Icon name="attach_money" className="text-2xl" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-1">
                            <Icon name="trending_up" className="text-sm" />
                            {data.gdp.growth}
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">経済規模</p>
                    <h3 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {formatNumber(data.gdp.value)} <span className="text-2xl font-normal text-gray-500 ml-1">{data.gdp.currency}</span>
                    </h3>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                        <Icon name="swap_horiz" className="text-2xl" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">貿易量</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatNumber(data.tradeVolume.value)} <span className="text-base font-normal text-gray-500">{data.tradeVolume.currency}</span>
                    </h3>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                        <Icon name="flight_takeoff" className="text-2xl" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">年間訪問者数</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(data.annualVisitors.value)}</h3>
                </div>
                 <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                        <Icon name="work" className="text-2xl" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">失業率</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{data.unemploymentRate.value}</h3>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
                        <Icon name="payments" className="text-2xl" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">インフレ率</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{data.inflationRate.value}</h3>
                </div>
            </div>
        </section>
    );
};

export default EconomicSnapshot;