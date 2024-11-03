"use client";
import { useState } from "react";
import { Message } from "./schema";
import ChatConversation from "./ChatConversation";
import ChatInput from "./ChatInput";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() !== "") {
      addMessage(input);
      setInput("");
    }
  };

  const addMessage = (text: string) => {
    setMessages([...messages, { role: "user", text }]);
  };

  return (
    <div className="flex flex-col">
      <ChatConversation messages={messages} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
    </div>
  );
}
