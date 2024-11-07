'use client';
import { useDiagnoses } from '../../contexts/DiagnosesContext';

interface Props {
  actualDiagnosis: string;
}

const openDiagnoseModal = () => {
  const modal = document.getElementById('diagnose-modal');
  if (modal) {
    (modal as HTMLDialogElement).showModal();
  }
};

const checkAnswer = (selectedDiagnosis: string, actualDiagnosis: string) => {
  if (selectedDiagnosis == actualDiagnosis) {
    console.log('Diagnosis correct');
  } else {
    console.log('Diagnosis incorrect');
  }
};

export default function ChatDiagnoseModal({ actualDiagnosis }: Props) {
  const { diagnoses } = useDiagnoses();

  console.log(actualDiagnosis);

  return (
    <>
      <button className="btn btn-primary" onClick={openDiagnoseModal}>
        Diagnose
      </button>
      <dialog id="diagnose-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Diagnose me</h3>
          <ul className="mt-4 menu bg-base-200 rounded-box w-full max-h-96 overflow-y-auto flex-nowrap">
            {Object.keys(diagnoses).map((diagnosis, index) => (
              <li
                key={index}
                onClick={() => {
                  checkAnswer(diagnosis, actualDiagnosis);
                }}
              >
                <label className="label cursor-pointer">
                  <span className="label-text">{diagnosis}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
