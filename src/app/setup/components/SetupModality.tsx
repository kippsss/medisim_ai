'use client';

import { SELECT_MODALITY_HEADER } from '../constants';
import { MODALITIES } from '../constants';

interface Props {
  modality: string;
  setModality: (modality: string) => void;
}

export default function SetupModality({ modality, setModality }: Props) {
  const selectModality = (key: string) => {
    if (key === 'ttt') {
      setModality(key);
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="pl-2 pr-6 py-4">
        <h3 className="font-bold text-2xl">{SELECT_MODALITY_HEADER}</h3>
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
