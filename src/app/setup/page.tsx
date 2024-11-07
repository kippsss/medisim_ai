'use client';
import { useRouter } from 'next/navigation';
import { TITLE, BUTTON_TEXT } from './constants';
import SetupDiagnoses from './components/SetupDiagnoses';
import SetupModality from './components/SetupModality';

export default function Setup() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-12 px-40 py-20 justify-center">
      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-bold">{TITLE}</h1>
      </div>

      {/* BODY */}
      <div className="flex flex-col gap-12">
        <SetupDiagnoses />
        <SetupModality />
      </div>

      {/* FOOTER */}
      <div className="mt-20">
        <button
          className="btn btn-neutral w-full"
          onClick={() => router.push('/chat')}
        >
          {BUTTON_TEXT}
        </button>
      </div>
    </div>
  );
}
