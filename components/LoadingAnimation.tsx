'use client';
import React from 'react';
import Icon from './Icon';

const LoadingAnimation: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center p-4">
            <div className="relative w-48 h-48">
                <div className="absolute inset-0 border-4 border-dashed border-blue-200 dark:border-blue-800 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-8 border-4 border-dashed border-blue-300 dark:border-blue-700 rounded-full animate-spin-slow-reverse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                        <Icon name="public" className="text-6xl text-primary animate-pulse" />
                    </div>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8">AIが旅のデータを生成中...</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">最高の情報をお届けするために、少々お待ちください。</p>
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-slow-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
                .animate-spin-slow-reverse {
                    animation: spin-slow-reverse 12s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default LoadingAnimation;
