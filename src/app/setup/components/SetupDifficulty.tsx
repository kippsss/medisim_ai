'use client';

import { DIFFICULTY_HEADER, DIFFICULTY_DESCRIPTIONS } from '../constants';
import { useState } from 'react';

interface Props {}

export default function SetupDifficulty({}: Props) {
  const [difficulty, setDifficulty] = useState<'1' | '2' | '3' | '4' | '5'>(
    '3',
  );

  const changeDifficulty = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDifficulty(event.target.value as '1' | '2' | '3' | '4' | '5');
  };

  return (
    <div className="flex flex-col w-full">
      {/* HEADER */}
      <div className="flex flex-row justify-between items-center pl-2 pr-6 py-4">
        <h3 className="font-bold text-2xl">{DIFFICULTY_HEADER}</h3>
      </div>

      {/* BODY */}
      <div>
        <input
          type="range"
          min="1"
          max="5"
          value={difficulty}
          className="range"
          step="1"
          onChange={changeDifficulty}
        />
        <div className="flex w-full justify-between px-2 text-xs">
          {DIFFICULTY_DESCRIPTIONS.map((difficultyDescription, index) => (
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
