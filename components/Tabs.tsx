'use client';
import React from 'react';
import Icon from './Icon';
// ★修正箇所: '../App' ではなく、共通の型定義 '@/types' から読み込む
import type { Tab } from '@/types';

interface TabsProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    // タブの設定を配列で管理（スッキリしててええな！）
    const tabItems: { id: Tab, label: string; icon: string }[] = [
        { id: 'tourism', label: '観光', icon: 'explore' }, // icon名は 'travel_explore' か 'explore' か確認してな(Icon.tsxに依存)
        { id: 'history', label: '歴史', icon: 'history_edu' },
        { id: 'plan', label: 'プラン', icon: 'map' }, // icon名は 'flight_takeoff' か 'map' か好みで
    ];
    
    return (
        // ヘッダー(h-16=64px)の直下に張り付くように top-16 を指定
        <div className="bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 overflow-x-auto no-scrollbar">
                {tabItems.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 flex items-center gap-2 transition whitespace-nowrap border-b-2 text-sm sm:text-base ${
                            activeTab === tab.id
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                        }`}
                    >
                        <Icon name={tab.icon} />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Tabs;