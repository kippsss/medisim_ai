'use client';
import { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
interface Props {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  placeholderText: string;
  transcriptionLoading: boolean;
  disabled: boolean;
}

export default function ChatInput({
  input,
  handleInputChange,
  handleFormSubmit,
  placeholderText,
  transcriptionLoading,
  disabled,
}: Props) {
  return (
    <form onSubmit={handleFormSubmit} className="w-full">
      <label className="input input-bordered flex items-center rounded-full pl-5 pr-3">
        <input
          type="text"
          placeholder={placeholderText}
          className="grow"
          value={input}
          onChange={handleInputChange}
          disabled={disabled || transcriptionLoading}
        />
        {/* Submit Button */}
        <button
          className={`btn btn-circle w-9 h-9 min-h-2 ${
            (disabled || input === '') && 'btn-disabled'
          }`}
          type="submit"
        >
          <Image
            src={'icons/arrowUp.svg'}
            alt={'Send'}
            width={33}
            height={33}
          />
        </button>
      </label>
    </form>
  );
}
