'use client';
import { useRouter } from 'next/navigation';
import { TITLE, SUBTITLE, BUTTON_TEXT } from './constants';
import { DefaultPageContainer } from './components/DefaultPageContainer';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const latestVersion = process.env.NEXT_PUBLIC_VERSION;
    const currentVersion = localStorage.getItem('version') || undefined;
    if (!latestVersion || !currentVersion || latestVersion !== currentVersion) {
      localStorage.clear();
      localStorage.setItem(
        'version',
        latestVersion === undefined ? 'VERSION_NOT_FOUND' : latestVersion,
      );
    }
  }, []);

  const goToSetup = () => {
    router.push('/setup');
  };

  return (
    <DefaultPageContainer classes="justify-center">
      <div className="flex flex-col h-full justify-center">
        <h1 className="text-5xl font-bold">{TITLE}</h1>
        <h3 className="text-xl mt-4">{SUBTITLE}</h3>
        <button className="btn btn-neutral mt-4" onClick={goToSetup}>
          {BUTTON_TEXT}
        </button>
      </div>
    </DefaultPageContainer>
  );
}
