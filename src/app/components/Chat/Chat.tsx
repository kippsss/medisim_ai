'use client';
import ChatConversation from './ChatConversation';
import ChatInput from './ChatInput';
import { useState } from 'react';
import { Message } from './schema';
import OpenAI from 'openai';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() !== '') {
      addMessage(input);
      setInput('');
    }
    await chatCompletion(input);
  };

  const chatCompletion = async (input: string) => {
    setLoading(true);
    const payload = [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...messages,
      { role: 'user', content: input },
    ];
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        const assistantResponse: Message = {
          role: 'assistant',
          content: data.message,
        };
        setMessages((prevMessages) => [...prevMessages, assistantResponse]);
      } else {
        console.error('Error fetching chat completion:', data.error);
      }
    } catch (error) {
      console.error('Error fetching chat completion:', error);
    }
    setLoading(false);
  };

  const addMessage = (content: string) => {
    setMessages([...messages, { role: 'user', content }]);
  };

  return (
    <div className="flex flex-col">
      <ChatConversation messages={messages} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        disabled={loading}
      />
    </div>
  );
}
