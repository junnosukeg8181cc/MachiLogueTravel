'use client';
import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

interface HeroProps {
    locationName: string;
    subtitle: string;
    tags: string[];
    headerImageUrl: string;
}

const ShareMenu: React.FC<{ locationName: string; onClose: () => void }> = ({ locationName, onClose }) => {
    const shareUrl = window.location.href;
    const shareText = `${locationName}の旅行情報をチェック！`;

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
        onClose();
    };

    const handleLineShare = () => {
        const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(lineUrl, '_blank', 'width=550,height=420');
        onClose();
    };

    return (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-surface-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[160px] z-50">
            <button
                onClick={handleTwitterShare}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
            >
                <Icon name="share" className="text-blue-500" />
                <span className="text-slate-700 dark:text-slate-200 font-medium">X（Twitter）</span>
            </button>
            <button
                onClick={handleLineShare}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
            >
                <Icon name="chat" className="text-green-500" />
                <span className="text-slate-700 dark:text-slate-200 font-medium">LINE</span>
            </button>
        </div>
    );
};

const Hero: React.FC<HeroProps> = ({ locationName, subtitle, tags, headerImageUrl }) => {
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const shareButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                shareButtonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !shareButtonRef.current.contains(event.target as Node)
            ) {
                setIsShareMenuOpen(false);
            }
        };

        if (isShareMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isShareMenuOpen]);

    return (
        <header className="relative z-10 h-[400px] lg:h-[450px] w-full overflow-hidden">
            <img alt={`${locationName} skyline`} className="absolute inset-0 w-full h-full object-cover" src={headerImageUrl} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
            <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12 pb-8 max-w-7xl mx-auto">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                             <span key={index} className={`px-3 py-1 text-white text-xs font-bold tracking-wider rounded-md uppercase shadow-sm ${index === 0 ? 'bg-gold' : 'bg-gray-800/60 backdrop-blur-md border border-white/20'}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md">{locationName}</h1>
                        <div className="relative">
                            <button
                                ref={shareButtonRef}
                                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                                className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white transition-all hover:scale-110 flex items-center justify-center"
                                aria-label="シェア"
                            >
                                <Icon name="share" className="text-lg" />
                            </button>
                            {isShareMenuOpen && (
                                <div ref={menuRef} className="absolute z-50">
                                    <ShareMenu locationName={locationName} onClose={() => setIsShareMenuOpen(false)} />
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-white/90 text-lg lg:text-xl font-light">{subtitle}</p>
                </div>
            </div>
        </header>
    );
};

export default Hero;
