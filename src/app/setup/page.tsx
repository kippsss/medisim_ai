'use client';
import { useRouter } from 'next/navigation';
import { TITLE, BUTTON_TEXT } from './constants';
import SetupDiagnoses from './components/SetupDiagnoses';
import SetupModality from './components/SetupModality';
import { useEffect, useState } from 'react';
import { PossibleDiagnoses } from '../schema';
import { parsePossibleDiagnoses } from './utils';

export default function Setup() {
  const router = useRouter();

  const [showErrerAlert, setShowErrorAlert] = useState(false);
  const [possibleDiagnoses, setPossibleDiagnoses] = useState<PossibleDiagnoses>(
    {},
  );

  useEffect(() => {
    const value = localStorage.getItem('possibleDiagnoses') || undefined;
    if (value) setPossibleDiagnoses(JSON.parse(value));
    else setPossibleDiagnoses(parsePossibleDiagnoses());
  }, []);

  useEffect(() => setShowErrorAlert(false), [possibleDiagnoses]);

  const goToChat = () => {
    if (Object.values(possibleDiagnoses).every((value) => value === false))
      return setShowErrorAlert(true);
    localStorage.setItem(
      'possibleDiagnoses',
      JSON.stringify(possibleDiagnoses),
    );
    router.push('/chat');
  };

  return (
    <div className="flex flex-col gap-12 px-40 py-20 justify-center">
      {/* HEADER */}
      {showErrerAlert && (
        <div role="alert" className="alert alert-warning">
          You must select at least one possible diagnosis
        </div>
      )}
      <div>
        <h1 className="text-5xl font-bold">{TITLE}</h1>
      </div>

      {/* CONFIGURATIONS */}
      <div className="flex flex-col gap-12">
        <SetupDiagnoses
          possibleDiagnoses={possibleDiagnoses}
          setPossibleDiagnoses={setPossibleDiagnoses}
        />
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
