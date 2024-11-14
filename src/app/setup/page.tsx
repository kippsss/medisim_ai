'use client';
import { useRouter } from 'next/navigation';
import { TITLE, BUTTON_TEXT } from './constants';
import SetupDiagnoses from './components/SetupDiagnoses';
// import SetupModality from './components/SetupModality';
import { useEffect, useState } from 'react';
import { PossibleDiagnoses } from '../schema';
import { parsePossibleDiagnoses } from './utils';
import { Alert } from '@/app//components/Alert';
// import SetupDifficulty from './components/SetupDifficulty';
// import SetupModel from './components/SetupModel';
import { selectRandomDiagnosis } from '../utils';
import { DefaultPageContainer } from '../components/DefaultPageContainer';

export default function Setup() {
  const router = useRouter();

  const [showDiagnosesAlert, setShowDiagnosesAlert] = useState(false);
  const [possibleDiagnoses, setPossibleDiagnoses] = useState<PossibleDiagnoses>(
    {},
  );
  const [difficulty, setDifficulty] = useState<string>('3');
  const [model, setModel] = useState<string>('gpt-4o-mini');
  const [modality, setModality] = useState<string>('ttt');

  useEffect(() => {
    const possibleDiagnosesValue =
      localStorage.getItem('possibleDiagnoses') || undefined;
    if (possibleDiagnosesValue)
      setPossibleDiagnoses(JSON.parse(possibleDiagnosesValue));
    else setPossibleDiagnoses(parsePossibleDiagnoses());

    setDifficulty(localStorage.getItem('difficulty') || '3');

    setModel(localStorage.getItem('model') || 'gpt-4o-mini');

    setModality(localStorage.getItem('modality') || 'ttt');
  }, []);

  useEffect(() => setShowDiagnosesAlert(false), [possibleDiagnoses]);

  const goToChat = () => {
    // Check if at least one possible diagnosis is selected
    if (Object.values(possibleDiagnoses).every((value) => value === false))
      return setShowDiagnosesAlert(true);

    // Select a random true diagnosis
    const trueDiagnosis = selectRandomDiagnosis(
      Object.keys(possibleDiagnoses).filter(
        (key) => possibleDiagnoses[key] === true,
      ),
    );

    // Save all configurations to local storage
    localStorage.setItem(
      'possibleDiagnoses',
      JSON.stringify(possibleDiagnoses),
    );
    localStorage.setItem('trueDiagnosis', trueDiagnosis);
    localStorage.setItem('difficulty', difficulty);
    localStorage.setItem('model', model);
    localStorage.setItem('modality', modality);

    // Go to chat interface
    router.push('/chat');
  };

  return (
    <DefaultPageContainer>
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
      <div className="mb-10">
        <h1 className="text-5xl font-bold">{TITLE}</h1>
      </div>

      {/* CONFIGURATIONS */}
      <div className="flex flex-col gap-12">
        {/* SCENARIO RELATED */}
        <div className="flex gap-12 flex-col lg:flex-row">
          <SetupDiagnoses
            possibleDiagnoses={possibleDiagnoses}
            setPossibleDiagnoses={setPossibleDiagnoses}
          />
          {/* <SetupDifficulty
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          /> */}
        </div>

        {/* MODEL RELATED */}
        {/* <div className="flex gap-12 flex-col lg:flex-row">
          <SetupModel model={model} setModel={setModel} />
          <SetupModality modality={modality} setModality={setModality} />
        </div> */}
      </div>

      {/* ACTION BUTTON */}
      <div className="mt-20 w-full">
        <button className="btn btn-neutral w-full" onClick={goToChat}>
          {BUTTON_TEXT}
        </button>
      </div>
    </DefaultPageContainer>
  );
}
