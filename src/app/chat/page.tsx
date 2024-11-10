'use client';
import ChatConversation from './components/ChatConversation';
import ChatInput from './components/ChatInput';
import { useEffect, useState } from 'react';
import { Message } from './schema';
import { SYSTEM_CONTENT, STARTING_USER_MESSAGE } from './constants';
import ChatDiagnoseModal from './components/ChatDiagnoseModal';
import { parsePossibleDiagnoses } from '../setup/utils';
import { PossibleDiagnoses } from '../schema';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [possibleDiagnoses, setPossibleDiagnoses] = useState<PossibleDiagnoses>(
    {},
  );

  // // For POC, we set modality to be text-to-text (ttt) only
  // const modality = 'ttt';

  useEffect(() => {
    const value = localStorage.getItem('possibleDiagnoses') || undefined;
    if (value) setPossibleDiagnoses(JSON.parse(value));
    else setPossibleDiagnoses(parsePossibleDiagnoses());
  }, []);

  useEffect(() => {
    if (
      messages.length !== 0 &&
      messages[messages.length - 1].role === 'user'
    ) {
      chatCompletion(messages);
    }
  }, [messages]);

  useEffect(() => {
    console.log('this use effect for possible diagnosis ran');
    console.log('possibleDiagnoses', possibleDiagnoses);
    startScenario();
  }, [possibleDiagnoses]);

  const startScenario = () => {
    const trueDiagnosis = localStorage.getItem('trueDiagnosis') || undefined;
    console.log(trueDiagnosis);
    if (!trueDiagnosis) return;

    const systemContent = SYSTEM_CONTENT + trueDiagnosis;
    setMessages([
      { role: 'system', content: systemContent },
      STARTING_USER_MESSAGE,
    ]);
  };

  const addMessage = (content: string) => {
    setMessages([...messages, { role: 'user', content }]);
  };

  const chatCompletion = async (messages: Message[]) => {
    setLoading(true);
    if (process.env.NEXT_PUBLIC_MOCK_OPENAI_API === 'true') {
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'This is a mocked response from the assistant',
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      return setLoading(false);
    }

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
    <div className="flex flex-col w-full px-40 py-20 min-h-screen justify-between">
      {/* CONVERSATION */}
      <ChatConversation messages={messages} loading={loading} />

      {/* TEXT INPUT AND ACTION BUTTONS */}
      <div className="flex flex-row gap-4">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          disabled={loading}
        />
        <ChatDiagnoseModal startScenario={startScenario} />
      </div>
    </div>
  );
}
