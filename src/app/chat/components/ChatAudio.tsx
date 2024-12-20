'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
interface Props {
  recording: boolean;
  toggleRecording: () => void;
  recordingElapsedTime: number;
}

export default function ChatAudio({
  recording,
  toggleRecording,
  recordingElapsedTime,
}: Props) {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div
      className="radial-progress after:content-none"
      style={
        {
          '--value': recordingElapsedTime * 5,
          '--size': '3rem',
          '--thickness': '8%',
        } as React.CSSProperties
      }
      role="progressbar"
    >
      <button
        className={`btn btn-circle w-9 h-9 min-h-2 z-10`}
        onClick={toggleRecording}
      >
        <Image
          src={!recording ? 'icons/microphone.svg' : 'icons/stopRounded.svg'}
          alt={'Record'}
          width={28}
          height={28}
        />
      </button>
    </div>
  );
}
