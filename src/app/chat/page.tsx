'use client';
import ChatConversation from './components/ChatConversation';
import ChatInput from './components/ChatInput';
import { useEffect, useState } from 'react';
import { Message } from './schema';
import { SYSTEM_PROMPT, STARTING_USER_MESSAGE } from './constants';
import { useDiagnoses } from '../contexts/DiagnosesContext';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    SYSTEM_PROMPT,
    STARTING_USER_MESSAGE,
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // For POC, we set modality to be text-to-text (ttt) only
  const modality = 'ttt';

  const { diagnoses } = useDiagnoses();

  useEffect(() => {
    // This effect will run whenever the messages state changes
    if (
      messages.length !== 0 &&
      messages[messages.length - 1].role === 'user'
    ) {
      chatCompletion(messages);
    }
  }, [messages]);

  const addMessage = (content: string) => {
    setMessages([...messages, { role: 'user', content }]);
  };

  const chatCompletion = async (messages: Message[]) => {
    setLoading(true);
    const response = await fetch('/api/chat/ttt-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });
    const data = await response.json();
    if (response.ok) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() !== '') {
      addMessage(input);
      setInput('');
    }
    addMessage(input);
  };

  return (
    <div className="flex flex-col w-full p-40 min-h-screen justify-between">
      <ChatConversation messages={messages} loading={loading} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        disabled={loading}
      />
    </div>
  );
}
