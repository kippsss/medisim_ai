'use client';
import { useRef, useState, useEffect } from 'react';
interface Props {
  audioId: string;
}

export default function ChatAudio({ audioId }: Props) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playOrStopAudio = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setProgress(0);
      } else {
        audioRef.current.play();
      }
    }
  };

  const resetAudioProgress = () => {
    setPlaying(false);
    setProgress(0);
  };

  const updateAudioProgress = () => {
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
      audioElement.addEventListener('timeupdate', updateAudioProgress);
      audioElement.addEventListener('play', () => setPlaying(true));
      audioElement.addEventListener('pause', () => setPlaying(false));
      audioElement.addEventListener('ended', resetAudioProgress);
      return () => {
        audioElement.removeEventListener('timeupdate', updateAudioProgress);
        audioElement.removeEventListener('play', () => setPlaying(true));
        audioElement.removeEventListener('pause', () => setPlaying(false));
        audioElement.removeEventListener('ended', resetAudioProgress);
      };
    }
  }, []);

  return (
    <div className="flex gap-4 items-center my-2">
      <audio ref={audioRef} src={`audio/${audioId}.wav`} />
      <button className="btn btn-circle" onClick={playOrStopAudio}>
        <img
          src={`/icons/${playing ? 'stop' : 'play'}.svg`}
          alt={playing ? 'Stop' : 'Play'}
          className="h-6 w-6"
        />
      </button>
      <progress
        className="progress progress-accent w-56"
        value={progress}
        max="100"
      ></progress>
    </div>
  );
}
