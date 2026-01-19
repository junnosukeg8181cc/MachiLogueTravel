import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { LocationData } from "@/types";
import { cache } from 'react';

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

// スキーマ定義
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
        },
        // ★追加: 決済情報のスキーマ定義
        payment: {
            type: SchemaType.OBJECT,
            properties: {
                currency: { type: SchemaType.STRING, description: "Currency name (e.g. Euro)" },
                cashInfo: { type: SchemaType.STRING, description: "Short summary of cash necessity (e.g. 'Necessary for small shops')" },
                cardInfo: { type: SchemaType.STRING, description: "Short summary of card acceptance (e.g. 'Visa/Master widely accepted')" },
                tipping: { type: SchemaType.STRING, description: "Short summary of tipping culture" },
                tippingRate: { type: SchemaType.STRING, description: "e.g. '10-15%', 'Round up'" }
            },
            required: ["currency", "cashInfo", "cardInfo", "tipping", "tippingRate"]
        }
    },
    // ★追加: paymentを必須項目に追加
    required: ["locationName", "englishLocationName", "subtitle", "tags", "economicSnapshot", "majorIndustries", "historicalTimeline", "travelPlan", "deepDive", "tourismInfo", "payment"],
};

// 関数全体を cache() でラップ
export const fetchLocationData = cache(async (location: string, tags: string[] = []): Promise<LocationData> => {
    console.log(`Fetching data for: ${location}`);

    // これにより、1回のリクエスト失敗で即座にエラーを返し、API制限(429)の連鎖を防ぐ
    const modelId = "gemini-2.5-flash-lite";

    // タグがある場合の詳細指示
    const tagsInstruction = tags.length > 0 
        ? `\n**【最重要】ユーザーの関心テーマ:**\nユーザーは特に以下の分野に興味があります: ${tags.join(', ')}。\n歴史タイムライン、Deep Dive (fullStory)、旅行プランを作成する際は、これらのテーマに関連する出来事やスポット、文脈を優先的に取り上げてください。` 
        : "";

    // プロンプト定義
    const prompt = `
        Role: 世界のトップトラベルジャーナリスト兼経済アナリスト。
        Objective: 「${location}」の観光・経済・歴史・決済事情データを生成する。

        ${tagsInstruction}

        **【重要】言語とアイコンのルール (Strict Rules):**
        1. **文章はすべて日本語**で出力してください。
        2. **ただし、アイコン名 (icon fields) だけは絶対に翻訳しないでください！**
            - Google Material Icons の公式名（英語のsnake_case）をそのまま使ってください。
            - OK: "history_edu", "attach_money", "train"
            - NG: "歴史", "お金", "電車", "Train" (大文字NG)
        
        **データ生成ルール:**
        - **Deep Dive (fullStory):** 読者を惹き込む「1000文字以上の長編レポート」が必要です。
            単なる羅列ではなく、以下の5つの視点を**それぞれ200文字以上**深く掘り下げて、一つの物語として構成してください。
            1. 【歴史の深層】: 起源から現代に至るまでのドラマチックな変遷
            2. 【経済の鼓動】: 産業構造の変化と、それが人々の生活にどう影響しているか
            3. 【文化と人々】: 地元の人しか知らない風習、食文化、気質
            4. 【知られざる側面】: 一般的なガイドブックには載らない裏話や課題
            5. 【未来への展望】: この都市が今後どう変わっていくかの予測
        - **数値データ:** 推定値で良いので、必ず具体的な数字を入れてください（"不明"はNG）。
        - **観光情報 (tourismInfo):** - 緯度経度は正確な数値で出力してください。
            - currencyCodeは必ず3文字のISOコード（例: USD）で出力してください。
            - 観光情報サマリは日本語で300文字程度で記述してください。
        
        - **決済・お金事情 (payment): ★追加項目**
            - currency: 現地通貨名
            - cashInfo: 現金の必要性（例：「屋台や地方では必須」「ほぼ完全キャッシュレス」など簡潔に）
            - cardInfo: クレジットカード事情（例：「VISA/Masterはどこでも使える」「JCBは一部のみ」など）
            - tipping: チップ文化の有無（例：「義務」「気持ち程度」「不要」）
            - tippingRate: チップの相場（例：「会計の10-15%」「端数を切り上げる程度」）
    `;

    try {
        const model = genAI.getGenerativeModel({
            model: modelId,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: locationSchema as any,
            }
        });

        // ★修正2: Unsplash検索とGemini生成を「並列」に実行して時間を節約
        // 画像検索には入力された location (例: "台北") をそのまま使うことで、Geminiの結果を待たずに検索開始できる
        const [geminiResult, headerImageUrl] = await Promise.all([
            model.generateContent(prompt),
            fetchImageFromUnsplash(location) // Unsplashは日本語検索も対応してるのでこれでOK
        ]);

        const response = await geminiResult.response;
        const jsonText = response.text();
        
        if (!jsonText) throw new Error("Empty response");
        
        const data = JSON.parse(jsonText);

        // 並列取得した画像をデータにマージ
        return { ...data, headerImageUrl } as LocationData;

    } catch (error: any) {
        console.error(`Gemini API Error (${modelId}):`, error.message);
        throw new Error("API制限またはエラーによりデータの取得に失敗しました。しばらく時間を置いてから再試行してください。");
    }
});