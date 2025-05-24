import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-800'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}