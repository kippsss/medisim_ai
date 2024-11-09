'use client';

import { DIAGNOSES_TEXT } from '../constants';
import { useState } from 'react';
import { PossibleDiagnoses } from '@/app/schema';

interface Props {
  possibleDiagnoses: PossibleDiagnoses;
  setPossibleDiagnoses: (value: PossibleDiagnoses) => void;
}

export default function SetupDiagnoses({
  possibleDiagnoses,
  setPossibleDiagnoses,
}: Props) {
  const [selectAll, setSelectAll] = useState(true);
  console.log('possibleDiagnoses', possibleDiagnoses);
  console.log('Type of possibleDiagnoses:', typeof possibleDiagnoses);

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const updatedDiagnoses = Object.keys(possibleDiagnoses).reduce(
      (acc, diagnosis) => {
        acc[diagnosis] = newSelectAll;
        return acc;
      },
      {} as PossibleDiagnoses,
    );

    setPossibleDiagnoses(updatedDiagnoses);
  };

  const toggleDiagnosisSelect = (diagnosis: string) => {
    const isChecked = !possibleDiagnoses[diagnosis];
    setPossibleDiagnoses({ ...possibleDiagnoses, [diagnosis]: isChecked });
  };

  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <div className="flex flex-row justify-between items-center pl-2 pr-6 py-4">
        <h3 className="font-bold text-2xl">{DIAGNOSES_TEXT}</h3>
        <input
          type="checkbox"
          className="checkbox"
          checked={selectAll}
          onChange={toggleSelectAll}
        />
      </div>

      {/* BODY */}
      <div>
        <ul className="menu bg-base-200 rounded-box w-full max-h-64 overflow-y-auto flex-nowrap">
          {Object.entries(possibleDiagnoses).map(
            ([diagnosis, isChecked], index) => (
              <li key={index}>
                <label className="label cursor-pointer">
                  <span className="label-text">{diagnosis}</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={isChecked}
                    onChange={() => toggleDiagnosisSelect(diagnosis)}
                  />
                </label>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
