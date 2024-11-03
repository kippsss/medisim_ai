'use client';

interface Props {
  startScenario: () => void;
}

export default function ChatInitialSelection({ startScenario }: Props) {
  return (
    <div>
      <h1 className="text-5xl font-bold">Welcome to medisimAI</h1>
      <h3 className="text-xl mt-4">
        I am your virtual patient, and have come to see you for treatment. You
        have to reply me like how a doctor would reply to a patient. To guess my
        diagnosis, you can say 'You have' followed by the disease name.
      </h3>
      <button className="btn btn-neutral mt-4" onClick={startScenario}>
        I'm ready
      </button>
    </div>
  );
}
