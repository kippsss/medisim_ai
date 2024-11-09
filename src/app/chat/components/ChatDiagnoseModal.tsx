'use client';
import { use, useEffect, useState } from 'react';

import { DIAGNOSE_SELECTION_TITLE, DIAGNOSE_CORRECT_TEXT } from '../constants';
import { useRouter } from 'next/navigation';
import { parsePossibleDiagnoses } from '@/app/setup/utils';
import { PossibleDiagnoses } from '@/app/schema';
import { selectRandomDiagnosis } from '../../utils';

interface Props {
  startScenario: () => void;
}

export default function ChatDiagnoseModal({ startScenario }: Props) {
  const router = useRouter();

  const [correct, setCorrect] = useState(false);
  const [trueDiagnosis, setTrueDiagnosis] = useState<string>('');
  const [possibleDiagnoses, setPossibleDiagnoses] = useState<PossibleDiagnoses>(
    {},
  );

  useEffect(() => {
    // This will only run when opening the modal for the first time.
    const value = localStorage.getItem('possibleDiagnoses') || undefined;
    if (value) setPossibleDiagnoses(JSON.parse(value));
    else setPossibleDiagnoses(parsePossibleDiagnoses());

    const trueDiagnosisFromLocal =
      localStorage.getItem('trueDiagnosis') || undefined;

    console.log('trueDiagnosisFromLocal', trueDiagnosisFromLocal);
    if (trueDiagnosisFromLocal) {
      console.log('trueDiagnosisFromLocal', trueDiagnosisFromLocal);
      setTrueDiagnosis(trueDiagnosisFromLocal);
    }
  }, []);

  const toggleModal = (action: 'open' | 'close') => {
    const modal = document.getElementById('diagnose-modal');
    if (modal) {
      if (action === 'open') {
        (modal as HTMLDialogElement).showModal();
      } else {
        (modal as HTMLDialogElement).close();
      }
    }
  };

  const checkAnswer = (selectedDiagnosis: string, actualDiagnosis: string) => {
    if (selectedDiagnosis == actualDiagnosis) {
      setCorrect(true);
    } else {
      setCorrect(false);
    }
  };

  const nextScenario = () => {
    setCorrect(false);

    // Select a random true diagnosis
    const randomDiagnosis = selectRandomDiagnosis(
      Object.keys(possibleDiagnoses).filter(
        (key) => possibleDiagnoses[key] === true,
      ),
    );
    localStorage.setItem('trueDiagnosis', randomDiagnosis);
    // Need to set the true diagnosis to the state so that it can be displayed
    setTrueDiagnosis(randomDiagnosis);

    startScenario();
    toggleModal('close');
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => toggleModal('open')}>
        Diagnose
      </button>
      <dialog id="diagnose-modal" className="modal">
        <div className="modal-box">
          {/* MODAL HEADER */}
          {!correct && (
            <h3 className="font-bold text-lg">{DIAGNOSE_SELECTION_TITLE}</h3>
          )}

          {/* MODAL BODY */}
          {!correct ? (
            <ul className="mt-4 menu bg-base-200 rounded-box w-full max-h-96 overflow-y-auto flex-nowrap">
              {Object.entries(possibleDiagnoses).map(
                ([diagnosis, isSelectable], index) =>
                  isSelectable && (
                    <li
                      key={index}
                      onClick={() => checkAnswer(diagnosis, trueDiagnosis)}
                    >
                      <label className="label cursor-pointer">
                        <span className="label-text">{diagnosis}</span>
                      </label>
                    </li>
                  ),
              )}
            </ul>
          ) : (
            <div className="flex flex-col gap-8">
              <h3 className="text-2xl">{DIAGNOSE_CORRECT_TEXT}</h3>
              <h1 className="font-bold text-5xl text-center">
                {trueDiagnosis}
              </h1>
            </div>
          )}

          {/* MODAL FOOTER */}
          <div className="modal-action mt-16">
            <form method="dialog">
              {!correct ? (
                <button className="btn">Close</button>
              ) : (
                <div className="flex gap-4">
                  <button className="btn" onClick={() => router.push('/setup')}>
                    Back to setup
                  </button>
                  <button className="btn" onClick={nextScenario}>
                    Next scenario
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
