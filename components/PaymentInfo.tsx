import React from 'react';
import { PaymentInfo as PaymentType } from '@/types';
import Icon from './Icon'; // Iconコンポーネントを使ってる場合

export default function PaymentInfo({ data }: { data?: PaymentType }) {
  // ★追加: データが無い場合のガード処理
  // データがまだ生成されていない、または古いキャッシュデータの場合は何も表示しない（またはローディング表示）
  if (!data) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-full flex items-center justify-center">
        <p className="text-gray-400 text-sm">決済情報なし</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-full flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-4">
        {/* アイコンの書き方はプロジェクトに合わせて調整してな */}
        <span className="material-icons-outlined text-emerald-500 text-2xl">
          payments
        </span>
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
          現地のお金・決済
        </h3>
      </div>

      <div className="space-y-4">
        {/* 通貨 */}
        <div className="flex items-start gap-3">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
             <span className="material-icons-outlined text-emerald-600 dark:text-emerald-400 text-sm">
               currency_exchange
             </span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">通貨</p>
            {/* ここで落ちていたので data があることが保証された今なら安全 */}
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{data.currency}</p>
          </div>
        </div>

        {/* 決済事情 */}
        <div className="flex items-start gap-3">
           <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
             <span className="material-icons-outlined text-blue-600 dark:text-blue-400 text-sm">
               credit_card
             </span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">決済事情</p>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">
              {data.cardInfo}
            </p>
            <p className="text-xs text-slate-500 mt-1">※{data.cashInfo}</p>
          </div>
        </div>

        {/* チップ */}
        <div className="flex items-start gap-3">
           <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
             <span className="material-icons-outlined text-amber-600 dark:text-amber-400 text-sm">
               savings
             </span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">チップ</p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{data.tipping}</span>
              {data.tippingRate && (
                <span className="text-xs text-slate-500">({data.tippingRate})</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}