'use client';
import React, { useState } from 'react';
import Icon from './Icon';
import type { SearchTag } from '../types';

interface LandingPageProps {
    onSearch: (location: string, tags: SearchTag[]) => void;
}

const AVAILABLE_TAGS: SearchTag[] = ['金融', 'トレンド', 'アート', '民俗', '交通・インフラ', 'グルメ', '人口流体'];

const LandingPage: React.FC<LandingPageProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<SearchTag[]>([]);
    const suggestions = ["東京タワー", "パリ", "ギザのピラミッド", "パルテノン神殿"];

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) onSearch(query.trim(), selectedTags);
    };

    const toggleTag = (tag: SearchTag) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4 transition-colors duration-300">
            
            {/* ヘッダー: アイコンを確実に大きく */}
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-4 font-bold tracking-tight text-primary">
                    {/* !text-[80px] で強制的にサイズ指定 */}
                    <Icon name="public" className="!text-[80px]" />
                    <h1 className="text-6xl sm:text-7xl">MachiLogue</h1>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-2 text-xl font-medium">
                    世界の都市を、データで探求する。
                </p>
            </div>

            <form onSubmit={handleFormSubmit} className="w-full max-w-xl space-y-8">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="都市名やランドマークを入力..."
                        className="w-full px-6 py-5 pr-14 text-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 rounded-2xl shadow-soft focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-300"
                    />
                    <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 p-3 bg-primary hover:bg-primary-dark rounded-xl text-white shadow-md">
                        <Icon name="search" />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">興味のあるテーマを選択:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {AVAILABLE_TAGS.map(tag => (
                            <button
                                type="button"
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 flex items-center gap-1.5 ${
                                    selectedTags.includes(tag)
                                        ? 'bg-primary text-white border-primary shadow-md'
                                        : 'bg-white/80 dark:bg-surface-dark/80 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                }`}
                            >
                                {selectedTags.includes(tag) && <Icon name="check" className="text-xs" />}
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </form>

            <div className="mt-12 text-center">
                <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm font-medium">または、人気の都市やランドマークから:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                    {suggestions.map(city => (
                        <button
                            key={city}
                            onClick={() => onSearch(city, selectedTags)}
                            className="px-5 py-2.5 bg-white/80 dark:bg-surface-dark/80 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-surface-dark hover:border-primary/50 hover:shadow-md transition-all duration-200 font-medium text-slate-700 dark:text-slate-200"
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;