
import React from 'react';
import type { Industry } from '../types';
import Icon from './Icon';

interface MajorIndustriesProps {
    industries: Industry[];
}

// カラーマッピング: APIから来る色の名前(Yellow, Blue等)をTailwindクラスに変換
const getColorClasses = (colorKey: string) => {
    switch (colorKey?.toLowerCase()) {
        case 'red': return "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
        case 'blue': return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
        case 'green': return "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400";
        case 'yellow': return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400";
        case 'purple': return "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
        case 'orange': return "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400";
        case 'teal': return "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400";
        case 'pink': return "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400";
        default: return "bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400";
    }
};

// colorKeyが以前のフォーマット(Industry name)の場合のフォールバック
const legacyIconColors: { [key: string]: string } = {
    Finance: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
    Tech: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    "Creative Arts": "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
    Education: "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400",
    Other: "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
};

const MajorIndustries: React.FC<MajorIndustriesProps> = ({ industries }) => {
    return (
        <section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {industries.map((industry) => (
                    <div key={industry.name} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition cursor-default shadow-sm group">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform ${industry.color ? getColorClasses(industry.color) : (legacyIconColors[industry.colorKey] || legacyIconColors['Other'])}`}>
                            <Icon name={industry.icon} className="text-3xl leading-none" />
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-center text-sm">{industry.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MajorIndustries;
