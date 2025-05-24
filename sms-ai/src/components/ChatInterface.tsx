import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import useChatStore from '../store/chatStore';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isLoading, error } = useChatStore();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    onDrop: (acceptedFiles) => {
      // Handle file upload
      console.log(acceptedFiles);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <LoadingIndicator />}
        {error && (
          <div className="text-red-500 text-center p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-white p-4">
        <div
          {...getRootProps()}
          className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
        >
          <input {...getInputProps()} />
          <p className="text-gray-500">
            Drag & drop PDF files here, or click to select files
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}