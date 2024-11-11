'use client';
import { useEffect, useState } from 'react';

import { DIAGNOSE_CORRECT_TEXT } from '../constants';
import { useRouter } from 'next/navigation';
import { parsePossibleDiagnoses } from '@/app/setup/utils';
import { PossibleDiagnoses } from '@/app/schema';
import { selectRandomDiagnosis } from '../../utils';
import { Alert } from '@/app/components/Alert';

interface Props {
  startScenario: () => void;
}

export default function ChatDiagnoseModal({ startScenario }: Props) {
  const router = useRouter();

  const [alertMessage, setAlertMessage] = useState('');
  const [search, setSearch] = useState('');
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

    if (trueDiagnosisFromLocal) {
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

  const checkAnswer = (selectedDiagnosis: string) => {
    if (selectedDiagnosis == trueDiagnosis) {
      setAlertMessage('');
      setCorrect(true);
    } else {
      setAlertMessage(`${selectedDiagnosis} is incorrect`);
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

  const resetStates = () => {
    setAlertMessage('');
    setSearch('');
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => toggleModal('open')}>
        Diagnose
      </button>
      <dialog id="diagnose-modal" className="modal">
        <div className="modal-box pt-10">
          {/* MODAL HEADER */}
          {/* {!correct && (
            <h3 className="font-bold text-lg">{DIAGNOSE_SELECTION_TITLE}</h3>
          )} */}

          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-lg btn-circle btn-ghost absolute right-0 top-0"
              onClick={resetStates}
            >
              ✕
            </button>
          </form>

          {/* MODAL BODY */}
          {!correct ? (
            <ul className="mt-4 menu bg-base-200 rounded-box w-full max-h-96 overflow-y-auto flex-nowrap">
              <div className="flex justify-between items-center mx-4 my-2 gap-6">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  className="input w-full"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {Object.entries(possibleDiagnoses).map(
                ([diagnosis, isSelectable], index) =>
                  isSelectable &&
                  diagnosis.toLowerCase().includes(search.toLowerCase()) && (
                    <li key={index} onClick={() => checkAnswer(diagnosis)}>
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
          {!correct ? (
            <div className="mt-8">
              {alertMessage !== '' && (
                <Alert type="error" message={alertMessage} />
              )}
            </div>
          ) : (
            <div className="modal-action mt-16">
              {correct && (
                <div className="flex gap-4">
                  <button className="btn" onClick={() => router.push('/setup')}>
                    Back to setup
                  </button>
                  <button className="btn" onClick={nextScenario}>
                    Next scenario
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
