'use client'; // ← 【必須】これがないとエラーになります

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TourismInfo } from '@/types'; // パスを @/types に修正

// Leafletのデフォルトアイコン設定（Next.js環境でのバグ修正）
// 以前の delete L.Icon.Default.prototype._getIconUrl; のやり方だと
// Next.jsのビルド時にエラーになることがあるため、明示的に設定します。
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapControllerProps {
    latitude: number;
    longitude: number;
}

const MapController: React.FC<MapControllerProps> = ({ latitude, longitude }) => {
    const map = useMap();

    useEffect(() => {
        // マウント時に地図のサイズを再計算（グレーアウト防止）
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);

        return () => clearTimeout(timer);
    }, [map]);

    useEffect(() => {
        // 座標が変更されたらスムーズに移動
        if (latitude && longitude) {
            map.flyTo([latitude, longitude], 13, {
                duration: 1.5,
            });
        }
    }, [latitude, longitude, map]);

    return null;
};

interface CityMapProps {
    tourismInfo: TourismInfo;
    locationName: string;
}

const CityMap: React.FC<CityMapProps> = ({ tourismInfo, locationName }) => {
    const { latitude, longitude } = tourismInfo;

    if (!latitude || !longitude) {
        return (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 text-center text-gray-500 dark:text-gray-400">
                地図データが利用できません
            </div>
        );
    }

    return (
        <div className="relative z-0 isolate rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 h-[400px]">
             {/* MapContainerにkeyを与えることで、都市が変わった時に強制的に地図を作り直させます。
                 これがないと、前の都市の地図が残ったりバグったりすることがあります。 */}
            <MapContainer
                key={`${latitude}-${longitude}`} 
                center={[latitude, longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                scrollWheelZoom={true}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        <div className="text-center">
                            <strong className="text-primary">{locationName}</strong>
                        </div>
                    </Popup>
                </Marker>
                <MapController latitude={latitude} longitude={longitude} />
            </MapContainer>
        </div>
    );
};

export default CityMap;