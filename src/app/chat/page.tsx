'use client';
import ChatConversation from './components/ChatConversation';
import ChatInput from './components/ChatInput';
import { useEffect, useState } from 'react';
import { Message } from './schema';
import { SYSTEM_PROMPT, STARTING_USER_MESSAGE } from './constants';
import { useDiagnoses } from '../contexts/DiagnosesContext';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // For POC, we set modality to be text-to-text (ttt) only
  const modality = 'ttt';

  const { diagnoses } = useDiagnoses();

  useEffect(() => {
    const startChat = async () => {
      setMessages([STARTING_USER_MESSAGE]);
      await chatCompletion(STARTING_USER_MESSAGE.content);
    };
    startChat();
  }, []);

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

  const formatMessages = (messages: Message[], input: string) => {
    if (modality === 'ttt') {
      const chatHistory = messages.map((message) => {
        return { role: message.role, content: message.content };
      });

      const userInput = {
        role: 'user',
        content: input,
      };

      return [SYSTEM_PROMPT, ...chatHistory, userInput];
    } else {
      throw new Error(`Modality '${modality}' not supported`);
    }
    // } else {
    //   if (message.role === 'user') {
    //     return { role: 'user', content: message.content };
    //   } else {
    //     return { role: 'assistant', audio: { id: message.audioId } };
    //   }
    // }
  };

  const chatCompletion = async (input: string) => {
    setLoading(true);
    const formattedMessages = formatMessages(messages, input);
    try {
      let data;
      let response;
      let responseOk;
      if (
        process.env.NEXT_PUBLIC_MOCK_OPENAI_API == 'true' &&
        process.env.NEXT_PUBLIC_MOCK_OPENAI_RESPONSE
      ) {
        response = undefined;
        data = JSON.parse(process.env.NEXT_PUBLIC_MOCK_OPENAI_RESPONSE);
        responseOk = true;
      } else {
        response = await fetch('/api/chat/tts-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedMessages),
        });
        data = await response.json();
        responseOk = response.ok;
      }

      if (responseOk) {
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
