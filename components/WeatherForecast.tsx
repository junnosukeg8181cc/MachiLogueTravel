'use client';
import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface WeatherData {
    temperature: number;
    weathercode: number;
    time: string;
    is_day: number; // 昼か夜かのフラグ
}

interface WeatherForecastProps {
    latitude: number;
    longitude: number;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ latitude, longitude }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [localTime, setLocalTime] = useState<string | null>(null); // 現地時間
    const [utcOffsetSeconds, setUtcOffsetSeconds] = useState<number>(0); // 時差
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!latitude || !longitude) {
                setError('座標情報がありません');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                // ★修正: timezone=Asia%2FTokyo を timezone=auto に変更して、現地の時間を取得
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
                );
                
                if (!response.ok) {
                    throw new Error('天気データの取得に失敗しました');
                }

                const data = await response.json();
                
                if (data.current_weather) {
                    setWeather({
                        temperature: data.current_weather.temperature,
                        weathercode: data.current_weather.weathercode,
                        time: data.current_weather.time,
                        is_day: data.current_weather.is_day,
                    });
                    // 時差情報を保存
                    setUtcOffsetSeconds(data.utc_offset_seconds);
                } else {
                    throw new Error('天気データが見つかりませんでした');
                }
            } catch (err) {
                console.error('Weather fetch error:', err);
                setError(err instanceof Error ? err.message : '天気データの取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
    }, [latitude, longitude]);

    // ★追加: リアルタイム時計（1秒ごとに更新）
    useEffect(() => {
        if (weather === null) return;

        const updateClock = () => {
            // 現在のUTC時間を取得
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            
            // 現地のUTCオフセットを使って現地時間を計算
            const cityTime = new Date(utc + (1000 * utcOffsetSeconds));
            
            // HH:MM 形式に整形
            const timeString = cityTime.toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
            });
            setLocalTime(timeString);
        };

        updateClock(); // 初回実行
        const timer = setInterval(updateClock, 1000); // 1秒ごとに更新

        return () => clearInterval(timer);
    }, [utcOffsetSeconds, weather]);

    const getWeatherIcon = (code: number, isDay: number): string => {
        // 夜の場合は月のアイコンにするロジック
        const isNight = isDay === 0;

        if (code === 0) return isNight ? 'nights_stay' : 'wb_sunny';
        if (code <= 3) return isNight ? 'cloud' : 'wb_cloudy';
        if (code <= 49) return 'cloud'; 
        if (code <= 59) return 'grain'; 
        if (code <= 69) return 'rainy';
        if (code <= 79) return 'ac_unit'; 
        if (code <= 99) return 'thunderstorm';
        return 'wb_cloudy';
    };

    const getWeatherDescription = (code: number): string => {
        if (code === 0) return '快晴';
        if (code <= 3) return '晴れ・曇り';
        if (code <= 49) return '霧';
        if (code <= 59) return '霧雨';
        if (code <= 69) return '雨';
        if (code <= 79) return '雪';
        if (code <= 84) return 'にわか雨';
        if (code <= 86) return 'にわか雪';
        if (code <= 99) return '雷雨';
        return '不明';
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary dark:text-blue-400">
                        <Icon name="wb_sunny" className="text-2xl animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">現地の天気を取得中...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                        <Icon name="error_outline" className="text-2xl" />
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{error || '天気データが利用できません'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    {/* 天気アイコン */}
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary dark:text-blue-400 shadow-sm">
                        <Icon name={getWeatherIcon(weather.weathercode, weather.is_day)} className="text-4xl" />
                    </div>
                    
                    {/* 天気情報 */}
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Current Weather</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                                {Math.round(weather.temperature)}°C
                            </h3>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {getWeatherDescription(weather.weathercode)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ★追加: 現地時間表示 */}
                <div className="text-right pl-4 border-l border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Local Time</p>
                    <p className="text-3xl font-mono font-semibold text-slate-900 dark:text-white tracking-tight">
                        {localTime || '--:--'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WeatherForecast;