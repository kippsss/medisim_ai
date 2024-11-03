'use client';
import { Message } from './schema';

interface Props {
  messages: Message[];
}

export default function ChatConversation({ messages }: Props) {
  return (
    <>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`chat ${
            message.role === 'assistant' ? 'chat-start' : 'chat-end'
          } mb-5`}
        >
          <div
            className={`chat-bubble ${
              message.role === 'assistant' ? '' : 'chat-bubble-primary'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </>
  );
}
