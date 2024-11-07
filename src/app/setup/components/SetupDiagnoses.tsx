'use client';

import { useDiagnoses } from '@/app/contexts/DiagnosesContext';

interface Props {}

export default function SetupDiagnoses({}: Props) {
  const { diagnoses, setDiagnoses } = useDiagnoses();

  const handleCheckboxChange = (diagnosis: string) => {
    const isChecked = !diagnoses[diagnosis];
    setDiagnoses({ ...diagnoses, [diagnosis]: isChecked });
  };
  return (
    <ul className="menu bg-base-200 rounded-box w-full max-h-64 overflow-y-auto flex-nowrap">
      {Object.keys(diagnoses).map((diagnosis, index) => (
        <li key={index}>
          <label className="label cursor-pointer">
            <span className="label-text">{diagnosis}</span>
            <input
              type="checkbox"
              className="checkbox"
              checked={diagnoses[diagnosis]}
              onChange={() => handleCheckboxChange(diagnosis)}
            />
          </label>
        </li>
      ))}
    </ul>
  );
}
