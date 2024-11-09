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
  const [difficulty, setDifficulty] = useState<string>('3');

  useEffect(() => {
    const possibleDiagnosesValue =
      localStorage.getItem('possibleDiagnoses') || undefined;
    if (possibleDiagnosesValue)
      setPossibleDiagnoses(JSON.parse(possibleDiagnosesValue));
    else setPossibleDiagnoses(parsePossibleDiagnoses());

    setDifficulty(localStorage.getItem('difficulty') || '3');
  }, []);

  useEffect(() => setShowDiagnosesAlert(false), [possibleDiagnoses]);

  const goToChat = () => {
    // Save all selected options to local storage
    if (Object.values(possibleDiagnoses).every((value) => value === false))
      return setShowDiagnosesAlert(true);
    localStorage.setItem(
      'possibleDiagnoses',
      JSON.stringify(possibleDiagnoses),
    );

    localStorage.setItem('difficulty', difficulty);

    // Go to chat interface
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
        <div className="flex gap-12 flex-col lg:flex-row">
          <SetupDiagnoses
            possibleDiagnoses={possibleDiagnoses}
            setPossibleDiagnoses={setPossibleDiagnoses}
          />
          <SetupDifficulty
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
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
