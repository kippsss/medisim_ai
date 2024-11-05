'use client';
import { useRouter } from 'next/navigation';
import { TITLE, BUTTON_TEXT } from './constants';
import { useState } from 'react';

export default function Setup() {
  const router = useRouter();
  const goToChat = () => {
    router.push('/chat');
  };

  const diagnosesString = process.env.NEXT_PUBLIC_DIAGNOSES || '';
  const diagnoses = diagnosesString.split(',');

  const [selectedDiagnoses, setSelectedDiagnoses] = useState(diagnoses);

  const handleCheckboxChange = (diagnosis: string) => {
    setSelectedDiagnoses((prevSelectedDiagnoses) =>
      prevSelectedDiagnoses.includes(diagnosis)
        ? prevSelectedDiagnoses.filter((item) => item !== diagnosis)
        : [...prevSelectedDiagnoses, diagnosis],
    );
  };

  return (
    <div className="flex flex-col p-40 h-screen justify-center">
      <h1 className="text-5xl font-bold">{TITLE}</h1>
      <div className="flex flex-row mt-20">
        <div className="flex flex-row justify-center w-1/2 form-control">
          <ul className="menu bg-base-200 rounded-box w-full max-h-64 overflow-y-auto flex-nowrap">
            {diagnoses.map((diagnosis, index) => (
              <li key={index}>
                <label className="label cursor-pointer">
                  <span className="label-text">{diagnosis}</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedDiagnoses.includes(diagnosis)}
                    onChange={() => handleCheckboxChange(diagnosis)}
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-row justify-center w-1/2">
          Modality selection
        </div>
      </div>
      <button className="btn btn-neutral mt-20" onClick={goToChat}>
        {BUTTON_TEXT}
      </button>
    </div>
  );
}
