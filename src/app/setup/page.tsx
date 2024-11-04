'use client';
import { useRouter } from 'next/navigation';
import { TITLE, BUTTON_TEXT } from './constants';

export default function Setup() {
  const router = useRouter();

  const goToChat = () => {
    router.push('/chat');
  };
  return (
    <div className="flex flex-col p-40 h-screen justify-center">
      <h1 className="text-5xl font-bold">{TITLE}</h1>
      <button className="btn btn-neutral mt-4" onClick={goToChat}>
        {BUTTON_TEXT}
      </button>
    </div>
  );
}
