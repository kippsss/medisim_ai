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
  const [completionLoading, setCompletionLoading] = useState(false);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const [audioChunk, setAudioChunk] = useState<Blob | null>(null);
  const [recordingElapsedTime, setRecordingElapsedTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
        setTranscriptionLoading(true);
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        setInput(data.text);
        setTranscriptionLoading(false);
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
    setCompletionLoading(true);
    if (process.env.NEXT_PUBLIC_MOCK_OPENAI_API === 'true') {
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'This is a mocked response from the assistant',
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      return setCompletionLoading(false);
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
    setCompletionLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !(completionLoading || recordingElapsedTime !== 0) &&
      input.trim() !== ''
    ) {
      addMessage(input);
      setInput('');
    }
  };

  const startRecording = async () => {
    setInput('');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      setAudioChunk(event.data);
    };

    mediaRecorder.start();

    // Set a timeout to stop recording after 20 seconds
    recordingTimeoutRef.current = setTimeout(() => {
      stopRecording();
    }, 20000); // 20 seconds

    setRecordingElapsedTime(0.1); // Start from 0.1 to avoid 0 value so that icon button changes
    // Set an interval to update elapsed time every second
    intervalRef.current = setInterval(() => {
      setRecordingElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current?.stop();
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setRecordingElapsedTime(0);
    }
  };

  const toggleRecording = async () => {
    if (recordingElapsedTime !== 0) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getPlaceholderText = () => {
    if (transcriptionLoading) {
      return 'Transcribing audio ...';
    } else if (recordingElapsedTime !== 0) {
      return 'Recording audio ...';
    } else {
      return 'Message medisimAI';
    }
  };

  return (
    <DefaultPageContainer classes="justify-between h-screen overflow-y-hidden gap-10">
      {/* CONVERSATION */}
      <ChatConversation
        messages={messages}
        completionLoading={completionLoading}
      />
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
            placeholderText={getPlaceholderText()}
            transcriptionLoading={transcriptionLoading}
            disabled={completionLoading || recordingElapsedTime !== 0}
          />
          <ChatAudio
            recordingElapsedTime={recordingElapsedTime}
            toggleRecording={toggleRecording}
          />
        </div>
      </div>
    </DefaultPageContainer>
  );
}
