'use client';
import { useRouter } from 'next/navigation';
import { TITLE, BUTTON_TEXT } from './constants';
import SetupDiagnoses from './components/SetupDiagnoses';
import SetupModality from './components/SetupModality';

export default function Setup() {
  const router = useRouter();

  return (
    <div className="flex flex-col p-40 h-screen justify-center">
      <h1 className="text-5xl font-bold">{TITLE}</h1>
      <div className="flex flex-row mt-20">
        <div className="flex flex-row justify-center w-1/2 form-control">
          <SetupDiagnoses />
        </div>
        <div className="flex flex-row justify-center w-1/2">
          <SetupModality />
        </div>
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
