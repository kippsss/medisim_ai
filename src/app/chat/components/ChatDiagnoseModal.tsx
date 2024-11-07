'use client';
import { useState } from 'react';
import { useDiagnoses } from '../../contexts/DiagnosesContext';

import { DIAGNOSE_SELECTION_TITLE, DIAGNOSE_CORRECT_TEXT } from '../constants';

interface Props {
  actualDiagnosis: string;
}

export default function ChatDiagnoseModal({ actualDiagnosis }: Props) {
  const [correct, setCorrect] = useState(false);

  const { diagnoses } = useDiagnoses();

  const openDiagnoseModal = () => {
    const modal = document.getElementById('diagnose-modal');
    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
  };

  const checkAnswer = (selectedDiagnosis: string, actualDiagnosis: string) => {
    if (selectedDiagnosis == actualDiagnosis) {
      setCorrect(true);
    } else {
      setCorrect(false);
    }
  };

  console.log(actualDiagnosis);

  return (
    <>
      <button className="btn btn-primary" onClick={openDiagnoseModal}>
        Diagnose
      </button>
      <dialog id="diagnose-modal" className="modal">
        <div className="modal-box">
          {/* MODAL HEADER */}
          {!correct && (
            <h3 className="font-bold text-lg">{DIAGNOSE_SELECTION_TEXT}</h3>
          )}

          {/* MODAL BODY */}
          {!correct ? (
            <ul className="mt-4 menu bg-base-200 rounded-box w-full max-h-96 overflow-y-auto flex-nowrap">
              {Object.keys(diagnoses).map((diagnosis, index) => (
                <li
                  key={index}
                  onClick={() => {
                    checkAnswer(diagnosis, actualDiagnosis);
                  }}
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
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              {!correct ? (
                <button className="btn">Close</button>
              ) : (
                <button className="btn">Next scenario</button>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
