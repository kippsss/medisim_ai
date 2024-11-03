'use client';
import { useRef, useState, useEffect } from 'react';
interface Props {
  audioId: string;
}

export default function ChatAudio({ audioId }: Props) {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const progress = (currentTime / duration) * 100;
      setProgress(progress);
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  return (
    <div className="flex gap-4 items-center my-2">
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
      <progress
        className="progress progress-accent w-56"
        value={progress}
        max="100"
      ></progress>
    </div>
  );
}
