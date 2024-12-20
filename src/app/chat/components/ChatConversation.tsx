'use client';
import { Message } from '../schema';

interface Props {
  messages: Message[];
  loading: boolean;
}

export default function ChatConversation({ messages, loading }: Props) {
  return (
    <div className="flex flex-col gap-8 overflow-y-auto">
      {messages.map((message, index) => {
        if (message.role === 'system') {
          return null; // Skip rendering if the role is 'system'
        }

        return (
          // SPEECH ROW
          <div
            key={index}
            className={`chat ${
              message.role === 'assistant' ? 'chat-start' : 'chat-end'
            }`}
          >
            {/* SPEECH BUBBLE */}
            <div
              className={`${message.role === 'assistant' ? '' : 'chat-bubble'}`}
            >
              {message.content}
            </div>
          </div>
        );
      })}
      {loading && <span className="loading loading-dots loading-md"></span>}
    </div>
  );
}
