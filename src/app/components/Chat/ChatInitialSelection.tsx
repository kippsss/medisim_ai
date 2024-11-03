'use client';

import { TITLE, SUBTITLE, READY_BUTTON_TEXT } from './constants';

interface Props {
  startScenario: () => void;
}

export default function ChatInitialSelection({ startScenario }: Props) {
  return (
    <div>
      <h1 className="text-5xl font-bold">{TITLE}</h1>
      <h3 className="text-xl mt-4">{SUBTITLE}</h3>
      <button className="btn btn-neutral mt-4" onClick={startScenario}>
        {READY_BUTTON_TEXT}
      </button>
    </div>
  );
}
