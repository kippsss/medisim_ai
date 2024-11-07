'use client';
import { useState } from 'react';
import { useDiagnoses } from '../../contexts/DiagnosesContext';

import { DIAGNOSE_SELECTION_TITLE, DIAGNOSE_CORRECT_TEXT } from '../constants';
import { useRouter } from 'next/navigation';

interface Props {
  actualDiagnosis: string;
  startScenario: () => void;
}

export default function ChatDiagnoseModal({
  actualDiagnosis,
  startScenario,
}: Props) {
  const [correct, setCorrect] = useState(false);

  const router = useRouter();
  const { diagnoses } = useDiagnoses();

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
    startScenario();
    toggleModal('close');
  };

  console.log(actualDiagnosis);

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
              {Object.keys(diagnoses).map((diagnosis, index) => (
                <li
                  key={index}
                  onClick={() => checkAnswer(diagnosis, actualDiagnosis)}
                >
                  <label className="label cursor-pointer">
                    <span className="label-text">{diagnosis}</span>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-8">
              <h3 className="text-2xl">{DIAGNOSE_CORRECT_TEXT}</h3>
              <h1 className="font-bold text-5xl text-center">
                {actualDiagnosis}
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
