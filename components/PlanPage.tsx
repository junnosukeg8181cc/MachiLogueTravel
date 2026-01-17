
import React from 'react';
import Icon from './Icon';
import type { TravelPlan } from '../types';

interface PlanPageProps {
    plan: TravelPlan | null;
}

const PlanPage: React.FC<PlanPageProps> = ({ plan }) => {
    if (!plan) {
         return (
             <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-card p-8 border border-gray-100 dark:border-gray-700 animate-pulse">
                <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-8 max-w-lg mx-auto"></div>
                <div className="space-y-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         );
    }
    
    return (
        <section>
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-card p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <Icon name="route" className="text-5xl text-primary mb-4" />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{plan.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">{plan.description}</p>
                </div>
                
                <div className="space-y-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                    {plan.itinerary.map((item, index) => (
                        <div key={index} className="flex gap-6 items-start">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex-shrink-0 flex items-center justify-center text-primary dark:text-blue-400">
                                    {/* ★修正: text-3xl に leading-none を追加 */}
                                    <Icon name={item.icon} className="text-3xl leading-none" />
                                </div>
                                 <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-2 whitespace-nowrap">{item.time}</span>
                            </div>
                            <div className="mt-1">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">{item.description}</p>
                                <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <Icon name="history" className="text-base mt-0.5" />
                                    <p>{item.historicalContext}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlanPage;
