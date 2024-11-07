'use client';
import { useRouter } from 'next/navigation';
import { TITLE, BUTTON_TEXT } from './constants';
import SetupDiagnoses from './components/SetupDiagnoses';
import SetupModality from './components/SetupModality';

export default function Setup() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-12 px-40 py-20 justify-center">
      <h1 className="text-5xl font-bold">{TITLE}</h1>
      <div className="flex flex-col gap-12">
        <SetupDiagnoses />
        <SetupModality />
      </div>
      <button
        className="btn btn-neutral mt-20"
        onClick={() => router.push('/chat')}
      >
        {BUTTON_TEXT}
      </button>
    </div>
  );
}
