'use client';
import { useRouter } from 'next/navigation';
import { TITLE, BUTTON_TEXT } from './constants';
import SetupDiagnoses from './components/SetupDiagnoses';
import SetupModality from './components/SetupModality';
import { useEffect, useState } from 'react';
import { PossibleDiagnoses } from '../schema';
import { parsePossibleDiagnoses } from './utils';
import { Alert } from '@/app//components/Alert';
import SetupDifficulty from './components/SetupDifficulty';

export default function Setup() {
  const router = useRouter();

  const [showDiagnosesAlert, setShowDiagnosesAlert] = useState(false);
  const [possibleDiagnoses, setPossibleDiagnoses] = useState<PossibleDiagnoses>(
    {},
  );

  useEffect(() => {
    const value = localStorage.getItem('possibleDiagnoses') || undefined;
    if (value) setPossibleDiagnoses(JSON.parse(value));
    else setPossibleDiagnoses(parsePossibleDiagnoses());
  }, []);

  useEffect(() => setShowDiagnosesAlert(false), [possibleDiagnoses]);

  const goToChat = () => {
    if (Object.values(possibleDiagnoses).every((value) => value === false))
      return setShowDiagnosesAlert(true);
    localStorage.setItem(
      'possibleDiagnoses',
      JSON.stringify(possibleDiagnoses),
    );
    router.push('/chat');
  };

  return (
    <div className="flex flex-col gap-12 px-40 py-20 justify-center">
      {/* ALERTS */}
      <div>
        {showDiagnosesAlert && (
          <Alert
            type="error"
            message="You must select at least one possible diagnosis"
          />
        )}
      </div>

      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-bold">{TITLE}</h1>
      </div>

      {/* CONFIGURATIONS */}
      <div className="flex flex-col gap-12">
        <div className="flex gap-12">
          <SetupDiagnoses
            possibleDiagnoses={possibleDiagnoses}
            setPossibleDiagnoses={setPossibleDiagnoses}
          />
          <SetupDifficulty>Difficulty</SetupDifficulty>
        </div>
        <SetupModality />
      </div>

      {/* ACTION BUTTON */}
      <div className="mt-20">
        <button className="btn btn-neutral w-full" onClick={goToChat}>
          {BUTTON_TEXT}
        </button>
      </div>
    </div>
  );
}
