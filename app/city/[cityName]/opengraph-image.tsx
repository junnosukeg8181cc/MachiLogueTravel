import { ImageResponse } from 'next/og';
import { searchCityImage } from '@/lib/image-search';

export const runtime = 'edge';
// メタデータ
export const alt = 'MachiLogue City Guide';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { cityName: string } }) {
    const { cityName } = await params;
    const decodedName = decodeURIComponent(cityName);

    // 画像検索 (Unsplash / Pexels)
    const imageUrl = await searchCityImage(decodedName);

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                    position: 'relative',
                }}
            >
                {/* 背景画像 */}
                <img
                    src={imageUrl}
                    alt={decodedName}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.6, // 暗くする
                    }}
                />

                {/* グラデーションオーバーレイ (CSSグラデーションはNext.js OGで一部制限があるが、シンプルなものはOK) */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
                    }}
                />

                {/* コンテンツ */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        color: 'white',
                    }}
                >
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 'bold',
                            marginBottom: 20,
                            fontFamily: 'sans-serif',
                            textShadow: '0 4px 10px rgba(0,0,0,0.5)',
                            textAlign: 'center',
                            padding: '0 40px',
                        }}
                    >
                        {decodedName}
                    </div>

                    <div
                        style={{
                            fontSize: 32,
                            fontWeight: 'normal',
                            opacity: 0.9,
                            marginTop: 10,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontFamily: 'sans-serif',
                        }}
                    >
                        <span style={{ fontWeight: 'bold' }}>MachiLogue</span>
                        <span>|</span>
                        <span>Travel & Economic Insight</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
