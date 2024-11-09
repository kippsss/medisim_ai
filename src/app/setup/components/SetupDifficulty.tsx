'use client';

import { DIFFICULTY_HEADER, DIFFICULTY_LEVEL_LABELS } from '../constants';

interface Props {
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
}

export default function SetupDifficulty({ difficulty, setDifficulty }: Props) {
  const changeDifficulty = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDifficulty(event.target.value);
  };

  return (
    <div className="flex flex-col w-full">
      {/* HEADER */}
      <div className="flex flex-row justify-between items-center pl-2 pr-6 py-4">
        <h3 className="font-bold text-2xl">{DIFFICULTY_HEADER}</h3>
      </div>

      {/* BODY */}
      <div>
        <div className="px-5">
          <input
            type="range"
            min="1"
            max="5"
            value={difficulty}
            className="range"
            step="1"
            onChange={changeDifficulty}
          />
        </div>
        <div className="flex w-full justify-between">
          {DIFFICULTY_LEVEL_LABELS.map((difficultyDescription, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <span>|</span>
              <span>{difficultyDescription}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
