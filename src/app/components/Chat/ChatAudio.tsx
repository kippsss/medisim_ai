'use client';
import { useRef } from 'react';

interface Props {
  audioId: string;
}

export default function ChatAudio({ audioId }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="my-2">
      <audio ref={audioRef} src={`audio/${audioId}.wav`} />
      <button className="btn btn-circle" onClick={handlePlayAudio}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
