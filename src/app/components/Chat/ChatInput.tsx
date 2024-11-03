"use client";
import { ChangeEvent, FormEvent } from "react";

interface Props {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({
  input,
  handleInputChange,
  handleFormSubmit,
}: Props) {
  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        placeholder="Message medisimAI"
        className="input w-full max-w-xs input-bordered input-accent"
        value={input}
        onChange={handleInputChange}
      />
    </form>
  );
}
