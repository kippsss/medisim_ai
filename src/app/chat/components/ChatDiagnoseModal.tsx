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
  const [searchedDiagnoses, setSearchedDiagnoses] = useState<string[]>([]);
  // Flatten the possibleDiagnoses object to get an array of selected diagnoses
  const selectedDiagnosesFlattened = Object.entries(possibleDiagnoses).flatMap(
    ([_, diagnoses]) =>
      Object.entries(diagnoses)
        .filter(([_, value]) => value)
        .map(([diagnosis]) => diagnosis),
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

  useEffect(() => {
    if (search === '') return;
    setSearchedDiagnoses(
      selectedDiagnosesFlattened.filter((diagnosis) =>
        diagnosis.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search]);

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
    const trueDiagnosis = selectRandomDiagnosis(selectedDiagnosesFlattened);
    localStorage.setItem('trueDiagnosis', trueDiagnosis);
    // Need to set the true diagnosis to the state so that it can be displayed
    setTrueDiagnosis(trueDiagnosis);

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
        <div className="modal-box px-10 pt-16 pb-8">
          {/* MODAL HEADER */}
          {/* {!correct && (
            <h3 className="font-bold text-lg">{DIAGNOSE_SELECTION_TITLE}</h3>
          )} */}

          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2"
              onClick={resetStates}
            >
              ✕
            </button>
          </form>

          {/* MODAL BODY */}
          {!correct ? (
            <>
              <div className="flex justify-between items-center mx-1 my-2 gap-6">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  className="input input-bordered w-full"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* <ul className="mt-4 menu bg-base-200 rounded-box w-full max-h-96 overflow-y-auto flex-nowrap">
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
              </ul> */}
              <ul className="menu bg-base-200 rounded-box max-h-80 overflow-y-auto flex-nowrap">
                {search === '' ? (
                  // If search is empty, list all possible diagnoses classified by system
                  <>
                    {Object.entries(possibleDiagnoses).map(
                      ([system, diagnoses]) => (
                        <li key={system}>
                          <details>
                            <summary className="cursor-pointer font-bold">
                              {system}
                            </summary>
                            <ul>
                              {Object.entries(diagnoses).map(
                                ([diagnosis, selected]) =>
                                  selected && (
                                    <li
                                      key={diagnosis}
                                      onClick={() => checkAnswer(diagnosis)}
                                    >
                                      <label className="label cursor-pointer">
                                        <span className="label-text">
                                          {diagnosis}
                                        </span>
                                      </label>
                                    </li>
                                  ),
                              )}
                            </ul>
                          </details>
                        </li>
                      ),
                    )}
                  </>
                ) : (
                  // If search is non-empty, list all filtered diagnoses unclassified by system
                  <>
                    {searchedDiagnoses.length === 0 ? (
                      <li>No results found</li>
                    ) : (
                      searchedDiagnoses.map((diagnosis, index) => (
                        <li key={index} onClick={() => checkAnswer(diagnosis)}>
                          <label className="label cursor-pointer">
                            <span className="label-text">{diagnosis}</span>
                          </label>
                        </li>
                      ))
                    )}
                  </>
                )}
              </ul>
            </>
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
