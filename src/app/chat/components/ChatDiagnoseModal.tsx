'use client';
import { useDiagnoses } from '../../contexts/DiagnosesContext';

interface Props {
  diagnosis: string;
}

const handleDiagnose = () => {
  const modal = document.getElementById('diagnose-modal');
  if (modal) {
    (modal as HTMLDialogElement).showModal();
  }
};

export default function ChatDiagnoseModal({ diagnosis }: Props) {
  const { diagnoses } = useDiagnoses();
  return (
    <>
      <button className="btn btn-primary" onClick={handleDiagnose}>
        Diagnose
      </button>
      <dialog id="diagnose-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Diagnose me</h3>
          <ul className="mt-4 menu bg-base-200 rounded-box w-full max-h-64 overflow-y-auto flex-nowrap">
            {Object.keys(diagnoses).map((diagnosis, index) => (
              <li key={index}>
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
