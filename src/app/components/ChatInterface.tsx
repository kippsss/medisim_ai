"use client";
import { useState } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { role: "user", text: "Hello there!" },
    { role: "assistant", text: "General Kenobi!" },
  ]);

  return (
    <div className="flex flex-col">
      {/* Chat Messages */}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`chat ${
            message.role === "assistant" ? "chat-start" : "chat-end"
          } mb-5`}
        >
          <div
            className={`chat-bubble ${
              message.role === "assistant" ? "" : "chat-bubble-primary"
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}

      {/* Chat Input */}
      <input
        type="text"
        placeholder="Type here"
        className="input w-full max-w-xs"
      />
    </div>
  );
}
