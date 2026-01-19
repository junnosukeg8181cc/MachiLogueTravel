import { ImageResponse } from 'next/og';

// 画像の基本設定
export const runtime = 'edge';
export const alt = 'MachiLogue';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// ここが画像生成の本体や
export default function Image() {
  // あの青紫グラデーションの「M」アイコンのSVGや。
  // ※もし正確なSVGデータを持ってるなら、<path d="...">の中身をそれに差し替えてな。
  // ここではデザインを再現した近似のSVGを置いておくで。
  const iconSvg = (
    <svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blue-purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#2563eb' }} /> {/* Blue */}
          <stop offset="100%" style={{ stopColor: '#9333ea' }} /> {/* Purple */}
        </linearGradient>
      </defs>
      {/* ここに実際のロゴのパスデータを入れるのがベストやけど、
         雰囲気を再現するために、太い線のウェーブを描いてグラデーションを適用してるで。
      */}
      <path
        d="M15 65 C 30 35, 50 35, 65 65 S 100 35, 115 65"
        stroke="url(#blue-purple-gradient)"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
        transform="translate(-15, -15) scale(0.8)"
      />
       <path
        d="M15 65 C 30 35, 50 35, 65 65 S 100 35, 115 65"
        stroke="url(#blue-purple-gradient)"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
        transform="translate(-5, -5) scale(0.8)"
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
              // テキストの色（ダークグレー）
              color: '#1f2937',
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