import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { LocationData } from "@/types"; // さっき作った型定義を読み込み

// サーバー側の環境変数からキーを取得
const apiKey = process.env.GEMINI_API_KEY;
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

const genAI = new GoogleGenerativeAI(apiKey || "");

// Unsplash画像検索
const fetchImageFromUnsplash = async (query: string): Promise<string> => {
    if (!unsplashAccessKey) return "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80";

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
            { headers: { Authorization: `Client-ID ${unsplashAccessKey}` } }
        );
        const data = await response.json();
        return data.results?.[0]?.urls?.regular || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80";
    } catch (e) {
        console.error("Image fetch error:", e);
        return "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80";
    }
};

// スキーマ定義（ここは元のコードと同じやけど、長いから省略せずに書くで）
const locationSchema = {
    description: "Location data schema",
    type: SchemaType.OBJECT,
    properties: {
        locationName: { type: SchemaType.STRING },
        englishLocationName: { type: SchemaType.STRING, description: "For image search (e.g. 'Osaka')" },
        subtitle: { type: SchemaType.STRING },
        tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        economicSnapshot: {
            type: SchemaType.OBJECT,
            properties: {
                year: { type: SchemaType.STRING },
                dataScope: { type: SchemaType.STRING },
                gdp: { type: SchemaType.OBJECT, properties: { value: { type: SchemaType.STRING }, currency: { type: SchemaType.STRING }, growth: { type: SchemaType.STRING } }, required: ["value", "currency", "growth"] },
                tradeVolume: { type: SchemaType.OBJECT, properties: { value: { type: SchemaType.STRING }, currency: { type: SchemaType.STRING } }, required: ["value", "currency"] },
                annualVisitors: { type: SchemaType.OBJECT, properties: { value: { type: SchemaType.STRING } }, required: ["value"] },
                unemploymentRate: { type: SchemaType.OBJECT, properties: { value: { type: SchemaType.STRING } }, required: ["value"] },
                inflationRate: { type: SchemaType.OBJECT, properties: { value: { type: SchemaType.STRING } }, required: ["value"] }
            },
            required: ["year", "dataScope", "gdp", "tradeVolume", "annualVisitors", "unemploymentRate", "inflationRate"],
        },
        majorIndustries: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.OBJECT, properties: { name: { type: SchemaType.STRING }, icon: { type: SchemaType.STRING }, colorKey: { type: SchemaType.STRING } }, required: ["name", "icon", "colorKey"] },
        },
        historicalTimeline: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.OBJECT, properties: { year: { type: SchemaType.STRING }, title: { type: SchemaType.STRING }, description: { type: SchemaType.STRING }, icon: { type: SchemaType.STRING } }, required: ["year", "title", "description", "icon"] },
        },
        deepDive: {
            type: SchemaType.OBJECT,
            properties: {
                title: { type: SchemaType.STRING },
                summary: { type: SchemaType.STRING },
                fullStory: { type: SchemaType.STRING },
                source: { type: SchemaType.OBJECT, properties: { name: { type: SchemaType.STRING }, details: { type: SchemaType.STRING } }, required: ["name", "details"] },
            },
            required: ["title", "summary", "fullStory", "source"],
        },
        travelPlan: {
            type: SchemaType.OBJECT,
            properties: {
                title: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING },
                itinerary: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.OBJECT, properties: { time: { type: SchemaType.STRING }, title: { type: SchemaType.STRING }, description: { type: SchemaType.STRING }, icon: { type: SchemaType.STRING }, historicalContext: { type: SchemaType.STRING } }, required: ["time", "title", "description", "icon", "historicalContext"] }
                }
            },
            required: ["title", "description", "itinerary"]
        },
        tourismInfo: {
            type: SchemaType.OBJECT,
            properties: {
                latitude: { type: SchemaType.NUMBER },
                longitude: { type: SchemaType.NUMBER },
                regionalCenter: { type: SchemaType.STRING },
                distanceFromCenter: { type: SchemaType.STRING },
                language: { type: SchemaType.STRING },
                currency: { type: SchemaType.STRING },
                currencyCode: { type: SchemaType.STRING },
                currencyRate: { type: SchemaType.STRING },
                area: { type: SchemaType.STRING },
                tourismInfo: { type: SchemaType.STRING }
            },
            required: ["latitude", "longitude", "regionalCenter", "distanceFromCenter", "language", "currency", "currencyCode", "currencyRate", "area", "tourismInfo"]
        }
    },
    required: ["locationName", "englishLocationName", "subtitle", "tags", "economicSnapshot", "majorIndustries", "historicalTimeline", "travelPlan", "deepDive", "tourismInfo"],
};

export const fetchLocationData = async (location: string, tags: string[] = []): Promise<LocationData> => {
    // サーバーサイドなのでconsole.logはサーバーのターミナルに出ます
    console.log(`Fetching data for: ${location}`);

    const modelsToTry = [
        "gemini-2.5-flash-lite", // エース
        "gemini-2.5-flash",
        "gemini-3-flash-preview", // ちょっと賢い版
    ]

    const tagsInstruction = tags.length > 0 
        ? `\n**ユーザーの関心テーマ:** ${tags.join(', ')}に関連する情報を優先してください。` 
        : "";

    const prompt = `
        Role: トラベルジャーナリスト兼経済アナリスト。
        Objective: 「${location}」のデータを生成する。
        ${tagsInstruction}
        Rules:
        1. 日本語で出力。
        2. アイコン名(icon)は英語のsnake_case (例: "history_edu")。
        3. Deep Diveは2000文字程度の長編記事風に。
        4. tourismInfoのcurrencyCodeは3文字のISOコード(USD, JPY等)必須。
    `;

    for (const modelId of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelId,
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: locationSchema as any,
                }
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const jsonText = response.text();
            
            if (!jsonText) throw new Error("Empty response");
            
            const data = JSON.parse(jsonText);
            const imageUrl = await fetchImageFromUnsplash(data.englishLocationName || location);

            return { ...data, headerImageUrl: imageUrl } as LocationData;

        } catch (error: any) {
            console.warn(`Model ${modelId} failed:`, error.message);
        }
    }

    throw new Error("データの取得に失敗しました。");
};