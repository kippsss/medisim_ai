'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
interface Props {
  toggleRecording: () => void;
  recordingElapsedTime: number;
}

export default function ChatAudio({
  toggleRecording,
  recordingElapsedTime,
}: Props) {
  return (
    <div
      className={`radial-progress after:content-none ${
        recordingElapsedTime === 0 ? 'before:content-none' : ''
      }`}
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
        className="btn btn-circle w-9 h-9 min-h-2 z-10"
        onClick={toggleRecording}
      >
        <Image
          src={
            recordingElapsedTime === 0
              ? 'icons/microphone.svg'
              : 'icons/stopRounded.svg'
          }
          alt={'Record'}
          width={28}
          height={28}
        />
      </button>
    </div>
  );
}
