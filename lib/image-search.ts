// lib/image-search.ts

// デフォルト画像
export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80";

// サーバー側の環境変数からキーを取得
// 注意: このファイルはServer ComponentまたはAPI Routeでのみimportされることを想定
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
const pexelsApiKey = process.env.PEXELS_API_KEY;

// Pexels画像検索
const fetchImageFromPexels = async (query: string): Promise<string | null> => {
    if (!pexelsApiKey) return null;

    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
            { headers: { Authorization: pexelsApiKey } }
        );
        const data = await response.json();
        return data.photos?.[0]?.src?.landscape || null;
    } catch (e) {
        console.error("Pexels fetch error:", e);
        return null;
    }
};

// 画像検索 (Unsplash -> Pexels -> Default)
export const searchCityImage = async (query: string): Promise<string> => {
    // 1. Try Unsplash
    if (unsplashAccessKey) {
        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
                { headers: { Authorization: `Client-ID ${unsplashAccessKey}` } }
            );
            const data = await response.json();
            const url = data.results?.[0]?.urls?.regular;
            if (url) return url;
        } catch (e) {
            console.error("Unsplash fetch error:", e);
        }
    }

    // 2. Try Pexels (Fallback)
    const pexelsImage = await fetchImageFromPexels(query);
    if (pexelsImage) return pexelsImage;

    // 3. Fallback to Default
    return DEFAULT_IMAGE;
};
