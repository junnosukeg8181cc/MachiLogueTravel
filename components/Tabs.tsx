'use client';
import React from 'react';
import Icon from './Icon';
import type { Tab } from '../App';

interface TabsProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    const tabItems: { id: Tab, label: string; icon: string }[] = [
        { id: 'tourism', label: '観光', icon: 'explore' },
        { id: 'history', label: '歴史', icon: 'history_edu' },
        { id: 'plan', label: 'プラン', icon: 'map' },
    ];
    
    return (
        // 修正: ヘッダー(h-16=64px)の直下に張り付くように top-16 を指定
        // もし隙間が空く場合は top-[63px] などに微調整してください
        <div className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex gap-8 overflow-x-auto no-scrollbar">
                {tabItems.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'border-primary text-primary font-semibold'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white font-medium'
                        }`}
                    >
                        <Icon name={tab.icon} className="text-lg" />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Tabs;