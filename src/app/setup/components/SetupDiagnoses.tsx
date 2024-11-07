'use client';

import { useDiagnoses } from '@/app/contexts/DiagnosesContext';
import { DIAGNOSES_TEXT } from '../constants';
import { useState } from 'react';

export default function SetupDiagnoses() {
  const [selectAll, setSelectAll] = useState(true);

  const { diagnoses, setDiagnoses } = useDiagnoses();

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const updatedDiagnoses = Object.keys(diagnoses).reduce((acc, diagnosis) => {
      acc[diagnosis] = newSelectAll;
      return acc;
    }, {} as { [key: string]: boolean });

    setDiagnoses(updatedDiagnoses);
  };

  const toggleDiagnosisSelect = (diagnosis: string) => {
    const isChecked = !diagnoses[diagnosis];
    setDiagnoses({ ...diagnoses, [diagnosis]: isChecked });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center pl-2 pr-6 py-4">
        <h3 className="font-bold text-2xl">{DIAGNOSES_TEXT}</h3>
        <input
          type="checkbox"
          className="checkbox"
          checked={selectAll}
          onChange={toggleSelectAll}
        />
      </div>
      <ul className="menu bg-base-200 rounded-box w-full max-h-64 overflow-y-auto flex-nowrap">
        {Object.keys(diagnoses).map((diagnosis, index) => (
          <li key={index}>
            <label className="label cursor-pointer">
              <span className="label-text">{diagnosis}</span>
              <input
                type="checkbox"
                className="checkbox"
                checked={diagnoses[diagnosis]}
                onChange={() => toggleDiagnosisSelect(diagnosis)}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
