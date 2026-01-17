'use client';
import React, { useState } from 'react';
import Icon from './Icon';

// 型定義（簡易的に記述。本来は types/index.ts から import 推奨）
interface ItineraryItem {
    time: string;
    title: string;
}

interface TravelPlan {
    title: string;
    itinerary: ItineraryItem[];
}

interface HeroProps {
    locationName: string;
    subtitle: string;
    tags: string[];
    headerImageUrl: string;
    travelPlan?: TravelPlan; // ★追加: 旅程データを受け取る
}

const Hero: React.FC<HeroProps> = ({ locationName, subtitle, tags, headerImageUrl, travelPlan }) => {
    const [showShareMenu, setShowShareMenu] = useState(false);

    const handleShare = async (platform: string) => {
        const url = window.location.href;
        
        // ★旅程の一部をテキストに含めるロジック
        let shareText = `${locationName}の観光・経済・歴史データ | MachiLogue`;
        
        if (travelPlan && travelPlan.itinerary && travelPlan.itinerary.length > 0) {
            // 最初の3つくらいのプランを抜粋
            const planDigest = travelPlan.itinerary.slice(0, 3)
                .map(item => `${item.time} ${item.title}`)
                .join('\n');
            
            shareText = `【${locationName}の旅プラン】\n${planDigest}\n...\n\n#MachiLogue`;
        }

        const encodedText = encodeURIComponent(shareText);
        const encodedUrl = encodeURIComponent(url);

        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        } else if (platform === 'line') {
            // LINEはスマホだとアプリが起動しやすい
            window.open(`https://line.me/R/msg/text/?${encodedText}%0D%0A${encodedUrl}`, '_blank');
        } else if (platform === 'copy') {
            try {
                await navigator.clipboard.writeText(`${shareText}\n${url}`);
                alert('リンクと旅程をコピーしました！');
            } catch (err) {
                console.error('コピーに失敗しました', err);
            }
        }
        setShowShareMenu(false);
    };

    return (
        <div className="relative w-full h-[400px] overflow-hidden group">
            {/* 背景画像 */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
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
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight shadow-sm text-shadow-lg">
                            {locationName}
                        </h1>
                        <p className="text-lg text-gray-200 max-w-2xl font-light leading-relaxed text-shadow-sm">
                            {subtitle}
                        </p>
                    </div>

                    {/* SNS共有ボタン */}
                    <div className="relative mb-2">
                         <button 
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-full text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                            aria-label="共有する"
                        >
                            <Icon name="ios_share" />
                        </button>
                        
                        {showShareMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                                <div className="absolute right-0 bottom-full mb-3 w-56 bg-white dark:bg-surface-dark rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in zoom-in-95 origin-bottom-right">
                                    
                                    <div className="px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                        旅程をシェア
                                    </div>

                                    <button onClick={() => handleShare('twitter')} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-200 transition-colors">
                                        <span className="flex items-center justify-center w-6 h-6 rounded bg-black text-white text-xs font-bold">X</span>
                                        <span className="font-medium">X (Twitter)</span>
                                    </button>
                                    
                                    <button onClick={() => handleShare('facebook')} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-200 transition-colors">
                                        <span className="flex items-center justify-center w-6 h-6 rounded bg-blue-600 text-white font-bold text-xs">f</span>
                                        <span className="font-medium">Facebook</span>
                                    </button>
                                    
                                    {/* ★LINE追加 */}
                                    <button onClick={() => handleShare('line')} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-200 transition-colors">
                                        <span className="flex items-center justify-center w-6 h-6 rounded bg-[#06C755] text-white font-bold text-xs">L</span>
                                        <span className="font-medium">LINE</span>
                                    </button>

                                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                                    
                                    <button onClick={() => handleShare('copy')} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-200 transition-colors">
                                        <Icon name="content_copy" className="text-slate-400" />
                                        <span className="font-medium">リンクをコピー</span>
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