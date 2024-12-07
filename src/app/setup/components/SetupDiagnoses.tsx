'use client';

import { DIAGNOSES_HEADER } from '../constants';
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
  console.log('possibleDiagnoses', possibleDiagnoses);
  const [selectAll, setSelectAll] = useState(true);
  const [search, setSearch] = useState('');

  // const toggleSelectAll = () => {
  //   const newSelectAll = !selectAll;
  //   setSelectAll(newSelectAll);

  //   const updatedDiagnoses = Object.keys(possibleDiagnoses).reduce(
  //     (acc, diagnosis) => {
  //       acc[diagnosis] = newSelectAll;
  //       return acc;
  //     },
  //     {} as PossibleDiagnoses,
  //   );

  //   setPossibleDiagnoses(updatedDiagnoses);
  // };

  const toggleDiagnosisSelect = (system: string, diagnosis: string) => {
    const isChecked = !possibleDiagnoses[system][diagnosis];
    const newPossibleDiagnoses = {
      ...possibleDiagnoses,
      [system]: {
        ...possibleDiagnoses[system],
        [diagnosis]: isChecked,
      },
    };
    setPossibleDiagnoses(newPossibleDiagnoses);
  };

  return (
    <div className="flex flex-col w-full">
      {/* HEADER */}
      <div className="flex flex-row justify-between items-center pl-2 pr-10 py-4">
        <h3 className="font-bold text-2xl">{DIAGNOSES_HEADER}</h3>
      </div>

      {/* BODY */}
      <div>
        <ul className="menu bg-base-200 rounded-box max-h-80 overflow-y-auto flex-nowrap">
          {Object.entries(possibleDiagnoses).map(([system, diagnoses]) => (
            <li key={system}>
              {/* <label className="label cursor-pointer font-bold">
                <span className="label-text">{system.toUpperCase()}</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDiagnosisSelect(diagnosis)}
                />
              </label> */}
              <details>
                <summary className="cursor-pointer font-bold">{system}</summary>
                <ul>
                  {Object.entries(diagnoses).map(([diagnosis, selected]) => (
                    <li key={diagnosis}>
                      <label className="label cursor-pointer">
                        <span className="label-text">{diagnosis}</span>
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={selected}
                          onChange={() =>
                            toggleDiagnosisSelect(system, diagnosis)
                          }
                        />
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
