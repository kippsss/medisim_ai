'use client';
import ChatConversation from './ChatConversation';
import ChatInput from './ChatInput';
import ChatInitialSelection from './ChatInitialSelection';
import { useState } from 'react';
import { Message } from './schema';
import { SYSTEM_PROMPT, STARTING_USER_MESSAGE } from './constants';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(false);

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

  const startScenario = async () => {
    setStart(true);
    setMessages([STARTING_USER_MESSAGE]);
    await chatCompletion(STARTING_USER_MESSAGE.content);
  };

  const formatMessages = (messages: Message[], input: string) => {
    const chatHistory = messages.map((message) => {
      if (message.role === 'user') {
        return { role: 'user', content: message.content };
      } else {
        return { role: 'assistant', audio: { id: message.audioId } };
      }
    });
    const userInput = {
      role: 'user',
      content: input,
    };
    return [SYSTEM_PROMPT, ...chatHistory, userInput];
  };

  const chatCompletion = async (input: string) => {
    setLoading(true);
    const formattedMessages = formatMessages(messages, input);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedMessages),
      });

      const data = await response.json();
      if (response.ok) {
        const assistantResponse: Message = {
          role: 'assistant',
          content: data.message,
          audioId: data.audioId,
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
    <div
      className={`flex flex-col w-full p-40 min-h-screen ${
        start ? 'justify-between' : 'justify-center'
      }`}
    >
      {!start ? (
        <ChatInitialSelection startScenario={startScenario} />
      ) : (
        <>
          <ChatConversation messages={messages} />
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
            disabled={loading}
          />
        </>
      )}
    </div>
  );
}
