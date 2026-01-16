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
        if (query.trim()) {
            onSearch(query.trim(), selectedTags);
        }
    };

    const toggleTag = (tag: SearchTag) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag) 
                : [...prev, tag]
        );
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
            <div className="text-center mb-8">
                <div className="font-bold text-5xl tracking-tight text-primary flex items-center gap-3 justify-center">
                    <Icon name="public" className="text-5xl" />
                    <h1>MachiLogue</h1>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">世界の都市を、データで探求する。</p>
            </div>

            <form onSubmit={handleFormSubmit} className="w-full max-w-xl space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="都市名やランドマークを入力..."
                        className="w-full px-6 py-4 pr-14 text-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 rounded-full shadow-soft focus:ring-2 focus:ring-primary focus:outline-none transition"
                        aria-label="検索"
                    />
                    <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 p-3 bg-primary hover:bg-primary-dark rounded-full text-white transition">
                        <Icon name="search" />
                    </button>
                </div>

                {/* タグ選択エリア */}
                <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">興味のあるテーマを選択:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {AVAILABLE_TAGS.map(tag => (
                            <button
                                type="button"
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 flex items-center gap-1 ${
                                    selectedTags.includes(tag)
                                        ? 'bg-primary text-white border-primary shadow-md'
                                        : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                }`}
                            >
                                {selectedTags.includes(tag) && <Icon name="check" className="text-xs" />}
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-slate-500 dark:text-slate-400 mb-4">または、人気の都市やランドマークを選択:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                    {suggestions.map(city => (
                        <button
                            key={city}
                            onClick={() => onSearch(city, selectedTags)}
                            className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-primary/50 transition font-medium"
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