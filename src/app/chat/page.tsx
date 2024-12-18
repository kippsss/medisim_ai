'use client';
import ChatConversation from './components/ChatConversation';
import ChatInput from './components/ChatInput';
import { useEffect, useRef, useState } from 'react';
import { Message } from './schema';
import Image from 'next/image';

import {
  SYSTEM_PROMPT_PERSONA,
  SYSTEM_PROMPT_INSTRUCTIONS,
  SYSTEM_PROMPT_DIAGNOSES,
  STARTING_USER_MESSAGE,
} from './constants';
import ChatDiagnoseModal from './components/ChatDiagnoseModal';
import { DefaultPageContainer } from '../components/DefaultPageContainer';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioChunk, setAudioChunk] = useState<Blob | null>(null);

  // // For POC, we set modality to be text-to-text (ttt) only
  // const modality = 'ttt';

  useEffect(() => {
    startScenario();
  }, []);

  useEffect(() => {
    if (
      messages.length !== 0 &&
      messages[messages.length - 1].role === 'user'
    ) {
      chatCompletion(messages);
    }
  }, [messages]);

  const startScenario = () => {
    const trueDiagnosis = localStorage.getItem('trueDiagnosis') || undefined;
    console.log(trueDiagnosis);
    if (!trueDiagnosis) return;

    const systemPrompt = `${SYSTEM_PROMPT_PERSONA}${SYSTEM_PROMPT_INSTRUCTIONS}${SYSTEM_PROMPT_DIAGNOSES}${trueDiagnosis}`;
    setMessages([
      { role: 'system', content: systemPrompt },
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
    if (!(loading || recording) && input.trim() !== '') {
      addMessage(input);
      setInput('');
    }
  };

  useEffect(() => {
    if (audioChunk) {
      const audioBlob = new Blob([audioChunk], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  }, [audioChunk]);

  const toggleRecording = async () => {
    console.log('Recording:', recording);
    if (recording) {
      console.log('Stopping recording:', recording);
      // Stop recording
      mediaRecorderRef.current?.stop();
      setRecording(false);
    } else {
      console.log('starting recording:', recording);
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        setAudioChunk(event.data);
      };

      mediaRecorder.start();
      setRecording(true);
    }
  };

  return (
    <DefaultPageContainer classes="justify-between h-screen overflow-y-hidden gap-10">
      {/* CONVERSATION */}
      <ChatConversation messages={messages} loading={loading} />
      {/* TEXT INPUT AND ACTION BUTTONS */}
      <div className="flex flex-col gap-2 sm:gap-4">
        <div className="flex justify-end">
          <ChatDiagnoseModal startScenario={startScenario} />
        </div>
        <div className="flex items-center gap-2">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
            disabled={loading || recording}
          />
          {/* Record Button */}
          <button
            className={`btn btn-circle w-9 h-9 min-h-2`}
            onClick={toggleRecording}
          >
            <Image
              src={
                !recording ? 'icons/microphone.svg' : 'icons/stopRounded.svg'
              }
              alt={'Record'}
              width={33}
              height={33}
            />
          </button>
        </div>
      </div>
    </DefaultPageContainer>
  );
}
