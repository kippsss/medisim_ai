'use client';

import { SELECT_MODEL_HEADER } from '../constants';
import { MODELS } from '../constants';

interface Props {
  model: string;
  setModel: (difficulty: string) => void;
}

export default function SetupModel({ model, setModel }: Props) {
  const selectModel = (key: string) => {
    if (key === 'gpt-4o-mini') {
      setModel(key);
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="pl-2 pr-6 py-4">
        <h3 className="font-bold text-2xl">{SELECT_MODEL_HEADER}</h3>
      </div>

      {/* BODY */}
      <div>
        <ul className="menu bg-base-200 rounded-box w-full max-h-64 overflow-y-auto flex-nowrap">
          {Object.entries(MODELS).map(([modelKey, modelLabel], index) => (
            <li
              key={index}
              className={modelKey !== 'gpt-4o-mini' ? 'disabled' : ''}
              onClick={() => selectModel(modelKey)}
            >
              <a className={modelKey === model ? 'active' : ''}>{modelLabel}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
