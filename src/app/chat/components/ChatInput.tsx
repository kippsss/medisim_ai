'use client';
import { ChangeEvent, FormEvent } from 'react';

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
      <input
        type="text"
        placeholder="Message medisimAI"
        className="input w-full input-bordered input-accent"
        value={input}
        onChange={handleInputChange}
        disabled={disabled}
      />
    </form>
  );
}
