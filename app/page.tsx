'use client';

import { useRouter } from 'next/navigation';
import LandingPage from '@/components/LandingPage';
import { SearchTag } from '@/types';

export default function Home() {
  const router = useRouter();

  const handleSearch = (location: string, tags: SearchTag[]) => {
    // タグがある場合はURLパラメータにする
    const query = tags.length > 0 ? `?tags=${tags.join(',')}` : '';
    // Next.jsのルーターでページ移動
    router.push(`/city/${encodeURIComponent(location)}${query}`);
  };

  return (
    <main>
      <LandingPage onSearch={handleSearch} />
    </main>
  );
}