'use client';
import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface WeatherData {
    temperature: number;
    weathercode: number;
    time: string;
}

interface WeatherForecastProps {
    latitude: number;
    longitude: number;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ latitude, longitude }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
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
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Asia%2FTokyo`
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
                    });
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

    const getWeatherIcon = (code: number): string => {
        // WMO Weather interpretation codes (WW)
        if (code === 0) return 'wb_sunny'; // Clear sky
        if (code <= 3) return 'wb_cloudy'; // Mainly clear, partly cloudy
        if (code <= 49) return 'cloud'; // Fog
        if (code <= 59) return 'opacity'; // Drizzle
        if (code <= 69) return 'rainy'; // Rain
        if (code <= 79) return 'ac_unit'; // Snow
        if (code <= 84) return 'thunderstorm'; // Rain showers
        if (code <= 86) return 'ac_unit'; // Snow showers
        if (code <= 99) return 'thunderstorm'; // Thunderstorm
        return 'wb_cloudy';
    };

    const getWeatherDescription = (code: number): string => {
        if (code === 0) return '快晴';
        if (code <= 3) return '晴れ';
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
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">天気情報を取得中...</p>
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
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary dark:text-blue-400">
                        <Icon name={getWeatherIcon(weather.weathercode)} className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">本日の天気</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {Math.round(weather.temperature)}°C
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{getWeatherDescription(weather.weathercode)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherForecast;
