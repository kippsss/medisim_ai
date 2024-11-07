'use client';

import { useState } from 'react';
import { MODALITY_TEXT } from '../constants';
import { MODALITIES } from '../constants';

export default function SetupModality() {
  const [modality, setModality] = useState<string>('ttt');

  const selectModality = (key: string) => {
    if (key === 'ttt') {
      setModality(key);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="pl-2 pr-6 py-4">
        <h3 className="font-bold text-2xl">{MODALITY_TEXT}</h3>
      </div>

      {/* BODY */}
      <div>
        <ul className="menu bg-base-200 rounded-box w-full max-h-64 overflow-y-auto flex-nowrap">
          {Object.entries(MODALITIES).map(([key, value], index) => (
            <li
              key={index}
              className={key !== 'ttt' ? 'disabled' : ''}
              onClick={() => selectModality(key)}
            >
              <a className={key === modality ? 'active' : ''}>{value}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
