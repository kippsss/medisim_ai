'use client';
import { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
interface Props {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
}

export default function ChatInput({
  input,
  handleInputChange,
  handleFormSubmit,
  disabled = false,
}: Props) {
  return (
    <form onSubmit={handleFormSubmit} className="w-full">
      <label className="input input-bordered flex items-center rounded-full pl-5 pr-3">
        <input
          type="text"
          placeholder="Message medisimAI"
          className="grow"
          value={input}
          onChange={handleInputChange}
        />
        <button
          className={`btn btn-circle w-9 h-9 min-h-2 ${
            (disabled || input === '') && 'btn-disabled'
          }`}
          onClick={() => handleFormSubmit}
        >
          <Image
            src={!disabled ? 'icons/arrowUp.svg' : 'icons/stopRounded.svg'}
            alt={'Send'}
            width={33}
            height={33}
          />
        </button>
      </label>
    </form>
  );
}
