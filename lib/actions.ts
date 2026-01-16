import { supabase } from './supabase';
import { fetchLocationData as fetchFromGemini } from './gemini';
import { LocationData } from '@/types';

export const getLocationData = async (locationName: string, tags: string[] = []): Promise<LocationData> => {
  const tagsKey = tags.slice().sort().join(',');

  // 1. キャッシュ確認 (Supabase)
  const { data: cache } = await supabase
    .from('locations')
    .select('data')
    .eq('city_name', locationName)
    .eq('tags', tagsKey)
    .single();

  if (cache && cache.data) {
    return cache.data as LocationData;
  }

  // 2. なければGeminiで生成
  const geminiData = await fetchFromGemini(locationName, tags);

  // 3. Supabaseに保存（エラーが出ても無視して進む）
  await supabase
    .from('locations')
    .insert([{ city_name: locationName, tags: tagsKey, data: geminiData }]);

  return geminiData;
};