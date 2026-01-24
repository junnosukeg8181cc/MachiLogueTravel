import React, { useState } from 'react';
import type { TimelineEvent, DeepDive } from '../types';
import Icon from './Icon';

// アイコンの色定義
const timelineIconColors: { [key: string]: string } = {
    "default": "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
};

// --- Deep Dive Card Component ---
const DeepDiveCard: React.FC<{ deepDive: DeepDive }> = ({ deepDive }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-[#f8f5e4] dark:bg-slate-800/50 rounded-2xl p-6 relative border border-black/5 dark:border-white/5 shadow-sm mt-12">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Deep Dive</h2>
                <button className="text-slate-400 hover:text-slate-800 transition-colors">
                    <Icon name="bookmark_border" />
                </button>
            </div>
            <h3 className="font-bold text-3xl text-slate-900 dark:text-white mb-6 font-serif leading-tight">{deepDive.title}</h3>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg prose prose-slate dark:prose-invert font-serif">
                <p className="first-letter:text-7xl first-letter:font-bold first-letter:text-slate-900 dark:first-letter:text-white first-letter:mr-3 first-letter:float-left first-letter:leading-[1]">
                    {deepDive.summary}
                </p>
                {isExpanded && (
                    <div className="mt-4 space-y-4 animate-in fade-in duration-500">
                        {deepDive.fullStory.split(/\n\s*\n/).slice(1).map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-300/50 dark:border-slate-600/50 space-y-6">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full text-center bg-slate-900 hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                    {isExpanded ? '閉じる' : '記事の続きを読む'}
                    <Icon name={isExpanded ? 'expand_less' : 'expand_more'} />
                </button>
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <Icon name="menu_book" />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider">{deepDive.source.name}</p>
                        <p className="text-sm italic">{deepDive.source.details}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main HistoryPage Component ---
const HistoryPage: React.FC<{ events: TimelineEvent[], deepDive: DeepDive }> = ({ events, deepDive }) => {

    if (!events || events.length === 0) {
        return <p className="p-8 text-center text-slate-500">歴史データがありません。</p>;
    }

    const getIconColor = (title: string) => timelineIconColors[title] || timelineIconColors.default;

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">歴史タイムライン</h2>
                <div className="bg-white dark:bg-slate-900/50 rounded-3xl shadow-sm p-6 lg:p-10 border border-slate-100 dark:border-slate-800">
                    <div className="relative">
                        {events.map((event, index) => (
                            <div key={`${event.title}-${index}`} className="relative flex gap-8 pb-12 last:pb-0">
                                {/* ... (線の描画部分はそのまま) ... */}
                                {index < events.length - 1 && (
                                    <div className="absolute top-12 bottom-0 left-6 -ml-px w-[2px] bg-slate-100 dark:bg-slate-800"></div>
                                )}
                                <div className="z-10 flex-shrink-0 w-12">
                                    <div className={`w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-sm ${getIconColor(event.title)}`}>
                                        {/* ★修正: text-xl に leading-none を追加 */}
                                        <Icon name={event.icon} className="text-xl leading-none" />
                                    </div>
                                </div>
                                <div className="pt-2 flex-1">
                                    <time className="text-slate-400 font-mono text-sm font-bold block mb-1">{event.year}</time>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{event.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {deepDive && (
                <section className="pt-4 pb-12">
                    <DeepDiveCard deepDive={deepDive} />
                </section>
            )}
        </div>
    );
};

export default HistoryPage;