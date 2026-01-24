'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Linkコンポーネントをimport
import Icon from './Icon';
import type { SearchTag } from '../types';

interface LandingPageProps {
    onSearch: (location: string, tags: SearchTag[]) => void;
}

const AVAILABLE_TAGS: SearchTag[] = ['金融', '地政学', '文化', '宗教・思想', '交通・インフラ', '食文化', '産業'];

const LandingPage: React.FC<LandingPageProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<SearchTag[]>([]);

    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const ALL_SUGGESTIONS = [
            'イスタンブール', 'ヴェネツィア', 'パナマ運河', 'ジブラルタル', 'サグラダ・ファミリア',
            'モン・サン・ミシェル', 'ペトラ遺跡', '厳島神社', 'ウォール街', 'ブルジュ・ハリファ',
            'シンガポール', 'ベルリンの壁跡', 'アンコール・ワット', 'マチュ・ピチュ', 'ポンペイ',
            '京都', 'ニューヨーク', 'ドバイ', 'サンフランシスコ', 'アムステルダム', '香港'
        ];
        const shuffled = [...ALL_SUGGESTIONS].sort(() => 0.5 - Math.random());
        setSuggestions(shuffled.slice(0, 4));
    }, []);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim(), selectedTags);
        }
    };

    const toggleTag = (tag: SearchTag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? [] : [tag]
        );
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4 transition-colors duration-300">

            {/* ヘッダー部分 */}
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 font-bold tracking-tight text-primary">
                    <Icon name="public" className="!text-4xl md:!text-5xl" />
                    <h1 className="text-4xl md:text-5xl">MachiLogue</h1>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-2 text-base md:text-lg font-medium">
                    世界の都市を、データで探求する。
                </p>
            </div>

            {/* 検索フォーム */}
            <form onSubmit={handleFormSubmit} className="w-full max-w-xl space-y-8">
                <div className="relative group">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="都市名やランドマークを入力..."
                        className="w-full px-6 py-4 md:py-5 pr-14 text-base md:text-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 rounded-2xl shadow-soft focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-300 group-hover:shadow-lg"
                        aria-label="検索"
                    />
                    <button
                        type="submit"
                        className="absolute top-1/2 right-3 -translate-y-1/2 p-3 bg-primary hover:bg-primary-dark rounded-xl text-white shadow-md flex items-center justify-center transition-colors"
                    >
                        <Icon name="search" />
                    </button>
                </div>

                {/* タグ選択エリア */}
                <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">興味のあるテーマを選択:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {AVAILABLE_TAGS.map(tag => (
                            <button
                                type="button"
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 flex items-center gap-1.5 ${selectedTags.includes(tag)
                                    ? 'bg-primary text-white border-primary shadow-md'
                                    : 'bg-white/80 dark:bg-surface-dark/80 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-white dark:hover:bg-surface-dark'
                                    }`}
                            >
                                {selectedTags.includes(tag) && <Icon name="check" className="text-xs" />}
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </form>

            {/* おすすめキーワード */}
            <div className="mt-12 text-center space-y-10">
                <div>
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

                {/* ★追加: MachiLogueとは？へのリンク */}
                <div>
                    <Link
                        href="/about"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5"
                    >
                        <Icon name="info" className="text-base" />
                        MachiLogueとは？
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;