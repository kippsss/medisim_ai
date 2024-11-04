'use client';
import ChatAudio from './ChatAudio';
import { Message } from '../schema';

interface Props {
  messages: Message[];
  loading: boolean;
}

export default function ChatConversation({ messages, loading }: Props) {
  return (
    <div>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`chat ${
            message.role === 'assistant' ? 'chat-start' : 'chat-end'
          } mb-8`}
        >
          <div
            className={`${message.role === 'assistant' ? '' : 'chat-bubble'}`}
          >
            {message.content}
            {message.audioId && <ChatAudio audioId={message.audioId} />}
          </div>
        </div>
      ))}
      {loading && <span className="loading loading-dots loading-md"></span>}
    </div>
  );
}
