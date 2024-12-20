'use client';
import ChatConversation from './components/ChatConversation';
import ChatInput from './components/ChatInput';
import { useEffect, useRef, useState } from 'react';
import { Message } from './schema';

import {
  SYSTEM_PROMPT_PERSONA,
  SYSTEM_PROMPT_INSTRUCTIONS,
  SYSTEM_PROMPT_DIAGNOSES,
  STARTING_USER_MESSAGE,
} from './constants';
import ChatDiagnoseModal from './components/ChatDiagnoseModal';
import { DefaultPageContainer } from '../components/DefaultPageContainer';
import ChatAudio from './components/ChatAudio';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioChunk, setAudioChunk] = useState<Blob | null>(null);
  const [recordingElapsedTime, setRecordingElapsedTime] = useState(5);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Start role play scenario as soon as user navigates to the page
  useEffect(() => {
    startScenario();
  }, []);

  // Send conversation to the assistant when the user sends a message
  useEffect(() => {
    if (
      messages.length !== 0 &&
      messages[messages.length - 1].role === 'user'
    ) {
      chatCompletion(messages);
    }
  }, [messages]);

  // Transribe audio when user stops recording audio
  useEffect(() => {
    const transcribeAudio = async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');

      try {
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        setInput(data.text);
      } catch (error) {
        console.error('Error transcribing audio:', error);
        setInput('Error transcribing audio');
      }
    };

    if (audioChunk) {
      const audioBlob = new Blob([audioChunk], { type: 'audio/wav' });
      transcribeAudio(audioBlob);
    }
  }, [audioChunk]);

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

  const toggleRecording = async () => {
    if (recording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setRecording(false);
    } else {
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
          <ChatAudio
            recordingElapsedTime={recordingElapsedTime}
            recording={recording}
            toggleRecording={toggleRecording}
          />
        </div>
      </div>
    </DefaultPageContainer>
  );
}
