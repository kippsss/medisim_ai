import { TITLE, SUBTITLE, READY_BUTTON_TEXT } from './constants';

interface Props {
  setShowHero: (showHero: boolean) => void;
}

export default function Hero({ setShowHero }: Props) {
  return (
    <div className="flex flex-col p-40 h-screen justify-center">
      <h1 className="text-5xl font-bold">{TITLE}</h1>
      <h3 className="text-xl mt-4">{SUBTITLE}</h3>
      <button
        className="btn btn-neutral mt-4"
        onClick={() => {
          setShowHero(false);
        }}
      >
        {READY_BUTTON_TEXT}
      </button>
    </div>
  );
}
