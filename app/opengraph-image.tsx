import { ImageResponse } from 'next/og';

// 画像の基本設定
export const runtime = 'edge';
export const alt = 'MachiLogue';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

// ここが画像生成の本体や (Cache Buster: Updated color)
export default function Image() {
    // あの青紫グラデーションの「M」アイコンのSVGや。
    // ※もし正確なSVGデータを持ってるなら、<path d="...">の中身をそれに差し替えてな。
    // ここではデザインを再現した近似のSVGを置いておくで。
    const iconSvg = (
        <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Globe Icon (public) equivalent - Matching LP primary color (#0052CC) */}
            <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 7.92 7.05 4.56 11 4.07V19.93ZM13 19.93V4.07C16.95 4.56 20 7.92 20 12C20 16.08 16.95 19.44 13 19.93Z"
                fill="#0052CC"
            />
            <path
                d="M12 4C14.5 4 16.5 7 16.5 12C16.5 17 14.5 20 12 20M12 4C9.5 4 7.5 7 7.5 12C7.5 17 9.5 20 12 20"
                stroke="white"
                strokeWidth="1.5"
                strokeOpacity="0.3"
                fill="none"
            />
            <path
                d="M4 12H20M5 8H19M5 16H19"
                stroke="white"
                strokeWidth="1.5"
                strokeOpacity="0.3"
                fill="none"
            />
        </svg>
    );

    return new ImageResponse(
        (
            // ▼▼▼ ここから下が画像のデザインを定義するJSXや ▼▼▼
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // 背景色（スクショに近い明るいグレー）
                    backgroundColor: '#f3f4f6',
                    // ※背景の幾何学模様はコードで再現すると複雑すぎるから、今回はクリーンな単色にしてるで。
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* 左側のアイコン */}
                    <div style={{ display: 'flex', marginRight: '30px' }}>
                        {iconSvg}
                    </div>

                    {/* 右側のテキスト */}
                    <div
                        style={{
                            fontSize: 110,
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            // テキストの色（LPに合わせてprimary color）
                            color: '#0052CC',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        MachiLogue
                    </div>
                </div>
            </div>
            // ▲▲▲ ここまで ▲▲▲
        ),
        // 画像のサイズオプション
        {
            ...size,
        }
    );
}
