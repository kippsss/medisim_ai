'use client';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
interface Props {
  audioId: string;
}

export default function ChatAudioLegacy({ audioId }: Props) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = async () => {
    if (audioRef.current) {
      // Fetch the audio file Blob from the API route
      const response = await fetch(`/api/chat/tts-chat?audioId=${audioId}`, {
        method: 'GET',
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      } else {
        const responseJson = await response.json();
        console.error('Error fetching audio file:', responseJson.error);
      }
    }
  };

  const stopAudio = async () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setProgress(0);
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
      if (!isNaN(duration) && duration > 0) {
        const progress = (currentTime / duration) * 100;
        setProgress(progress);
      }
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('timeupdate', updateAudioProgress);
      audioElement.addEventListener('play', () => setPlaying(true));
      audioElement.addEventListener('pause', () => setPlaying(false));
      audioElement.addEventListener('ended', resetAudioProgress);

      playAudio();

      return () => {
        audioElement.removeEventListener('timeupdate', updateAudioProgress);
        audioElement.removeEventListener('play', () => setPlaying(true));
        audioElement.removeEventListener('pause', () => setPlaying(false));
        audioElement.removeEventListener('ended', resetAudioProgress);
      };
    }
  }, []);

  return (
    <div className="flex gap-4 items-center mt-4">
      <audio ref={audioRef} />
      {!playing ? (
        <button className="btn btn-circle" onClick={playAudio}>
          <Image src={'icons/play.svg'} alt={'Play'} width={24} height={24} />
        </button>
      ) : (
        <button className="btn btn-circle" onClick={stopAudio}>
          <Image src={'icons/stop.svg'} alt={'Stop'} width={24} height={24} />
        </button>
      )}
      <progress className="progress w-full" value={progress} max="100" />
    </div>
  );
}
