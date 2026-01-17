
import React from 'react';
import type { Industry } from '../types';
import Icon from './Icon';

interface MajorIndustriesProps {
    industries: Industry[];
}

const iconColors: { [key: string]: string } = {
    Finance: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
    Tech: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    "Creative Arts": "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
    Education: "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400",
    Other: "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
};

const MajorIndustries: React.FC<MajorIndustriesProps> = ({ industries }) => {
    return (
        <section>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">主要産業</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {industries.map((industry) => (
                    <div key={industry.name} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition cursor-default shadow-sm group">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform ${iconColors[industry.colorKey] || iconColors['Other']}`}>
                            {/* ★修正: サイズ指定(text-3xl)と leading-none を追加 */}
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
