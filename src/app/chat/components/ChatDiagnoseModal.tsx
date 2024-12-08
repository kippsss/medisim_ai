'use client';
import { useEffect, useState } from 'react';

import { CORRECT_TEXT, GAVE_UP_TEXT } from '../constants';
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
  const [status, setStatus] = useState<'guessing' | 'correct' | 'gaveUp'>(
    'guessing',
  );
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
      setStatus('correct');
    } else {
      setAlertMessage(`${selectedDiagnosis} is incorrect`);
      setStatus('guessing');
    }
  };

  const nextScenario = () => {
    setStatus('guessing');

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

  const giveUp = () => {
    setStatus('gaveUp');
  };

  const getHighlightedText = (text: string, highlight: string) => {
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { backgroundColor: '#ffff66' }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
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
          {status === 'guessing' ? (
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
                            <span className="label-text">
                              {getHighlightedText(diagnosis, search)}
                            </span>
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
              <h3 className="text-2xl">
                {status === 'correct' ? CORRECT_TEXT : GAVE_UP_TEXT}
              </h3>
              <h1 className="font-bold text-5xl text-center">
                {trueDiagnosis}
              </h1>
            </div>
          )}

          {/* MODAL FOOTER */}
          {status === 'guessing' ? (
            <div className="flex mt-8 gap-4">
              {alertMessage !== '' && (
                <Alert type="error" message={alertMessage} />
              )}
              <button className="btn ml-auto" onClick={giveUp}>
                Give up
              </button>
            </div>
          ) : (
            <div className=" modal-action flex gap-4 mt-16">
              <button className="btn" onClick={() => router.push('/setup')}>
                Back to setup
              </button>
              <button className="btn" onClick={nextScenario}>
                Next scenario
              </button>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
