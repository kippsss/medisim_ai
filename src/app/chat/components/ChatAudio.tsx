'use client';
import Image from 'next/image';
interface Props {
  toggleRecording: () => void;
  transcriptionLoading: boolean;
  recordingElapsedTime: number;
}

export default function ChatAudio({
  toggleRecording,
  transcriptionLoading,
  recordingElapsedTime,
}: Props) {
  const recording = recordingElapsedTime !== 0;
  return (
    <div
      className={`radial-progress after:content-none ${
        recording ? '' : 'before:content-none'
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
        {transcriptionLoading ? (
          <span className="loading loading-ring loading-xs"></span>
        ) : (
          <Image
            src={recording ? 'icons/stopRounded.svg' : 'icons/microphone.svg'}
            alt={'Record'}
            width={28}
            height={28}
          />
        )}
      </button>
    </div>
  );
}
