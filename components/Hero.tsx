'use client';
import React, { useState } from 'react';
import Icon from './Icon';

interface HeroProps {
    locationName: string;
    subtitle: string;
    tags: string[];
    headerImageUrl: string;
}

const Hero: React.FC<HeroProps> = ({ locationName, subtitle, tags, headerImageUrl }) => {
    const [showShareMenu, setShowShareMenu] = useState(false);

    const handleShare = async (platform: string) => {
        const url = window.location.href;
        const text = `${locationName}の観光・経済・歴史データ | MachiLogue`;

        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'copy') {
            try {
                await navigator.clipboard.writeText(url);
                alert('URLをコピーしました！');
            } catch (err) {
                console.error('コピーに失敗しました', err);
            }
        }
        setShowShareMenu(false);
    };

    return (
        <div className="relative w-full h-[400px] overflow-hidden">
            {/* 背景画像 */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url(${headerImageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-sm rounded-full border border-white/30">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight shadow-sm">
                            {locationName}
                        </h1>
                        <p className="text-lg text-gray-200 max-w-2xl font-light leading-relaxed">
                            {subtitle}
                        </p>
                    </div>

                    {/* SNS共有ボタン (Hero右下に配置) */}
                    <div className="relative mb-2">
                         <button 
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-full text-white transition-all shadow-lg"
                        >
                            <Icon name="ios_share" />
                        </button>
                        
                        {showShareMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in zoom-in-95">
                                    <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-200">
                                        <span className="font-bold text-blue-400">X</span> Twitter
                                    </button>
                                    <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-200">
                                        <span className="font-bold text-blue-600">f</span> Facebook
                                    </button>
                                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                                    <button onClick={() => handleShare('copy')} className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-200">
                                        <Icon name="content_copy" className="text-sm" /> URLコピー
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;