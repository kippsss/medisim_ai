'use client';
import { useRouter } from 'next/navigation';
import { TITLE, BUTTON_TEXT } from './constants';

export default function Setup() {
  const router = useRouter();
  const goToChat = () => {
    router.push('/chat');
  };

  return (
    <div className="flex flex-col p-40 h-screen justify-center">
      <h1 className="text-5xl font-bold">{TITLE}</h1>
      <div className="flex flex-row mt-20">
        <div className="flex flex-row justify-center w-1/2">
          <ul className="menu bg-base-200 rounded-box w-56">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
            <li>
              <a>Item 3</a>
            </li>
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
