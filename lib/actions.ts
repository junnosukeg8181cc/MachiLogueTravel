import { supabase } from './supabase';
import { fetchLocationData as fetchFromGemini } from './gemini';
import { LocationData } from '@/types';

export const getLocationData = async (locationName: string, tags: string[] = []): Promise<LocationData> => {
  const tagsKey = tags.slice().sort().join(',');

  // 1. キャッシュ確認 (Supabase)
  // ★修正: .single() は重複があるとエラーになるため廃止。
  // 代わりに .limit(1) で「配列」として取得し、エラーを回避する。
  const { data: rows, error } = await supabase
    .from('locations')
    .select('data')
    .eq('city_name', locationName)
    .eq('tags', tagsKey)
    .limit(1);

  // 配列の中にデータがあれば、それを使う
  if (rows && rows.length > 0) {
    console.log(`Cache HIT for: ${locationName} (tags: ${tagsKey})`);
    return rows[0].data as LocationData;
  }

  console.log(`Cache MISS for: ${locationName} (tags: ${tagsKey})`);

  // 2. なければGeminiで生成
  const geminiData = await fetchFromGemini(locationName, tags);

  // 3. Supabaseに保存
  // 開発モードの重複保存を防ぐため、単純なinsertではなく、本来はUnique制約が必要だが
  // とりあえずエラーを無視して進む
  await supabase
    .from('locations')
    .insert([{ city_name: locationName, tags: tagsKey, data: geminiData }]);

  return geminiData;
};