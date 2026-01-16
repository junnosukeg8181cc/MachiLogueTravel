'use client';
import React from 'react';
import Icon from './Icon';

interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    onNavigateHome: () => void;
    locationName?: string;
    tags?: string[]; // タグを受け取る
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, onNavigateHome, locationName, tags }) => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 lg:px-12">
            {/* 左側: 戻るボタンとロゴ */}
            <div className="flex items-center z-10">
                <button onClick={onNavigateHome} className="flex items-center gap-4 group">
                    <div className="p-2 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition">
                        <Icon name="arrow_back" className="text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="font-bold text-xl tracking-tight text-primary flex items-center gap-2">
                        <Icon name="public" />
                        <span className="hidden sm:inline">MachiLogue</span>
                    </div>
                </button>
            </div>

            {/* 中央: 地名とタグ（絶対配置でど真ん中に固定） */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {locationName || '都市を選択'}
                </span>
                
                {/* タグ表示エリア */}
                {tags && tags.length > 0 && (
                    <div className="hidden md:flex gap-1 mt-0.5 opacity-90">
                        {tags.map((tag, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 whitespace-nowrap border border-primary/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* 右側: ダークモード切り替え */}
            <div className="flex items-center gap-3 z-10">
                <button onClick={toggleDarkMode} className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 transition">
                    <Icon name={isDarkMode ? 'light_mode' : 'dark_mode'} />
                </button>
            </div>
        </nav>
    );
};

export default Header;