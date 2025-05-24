import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface SuccessPageProps {
  title: string;
  message: string;
  returnPath: string;
  returnText: string;
}

export default function SuccessPage({ title, message, returnPath, returnText }: SuccessPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        <button
          onClick={() => navigate(returnPath)}
          className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
        >
          {returnText}
        </button>
      </div>
    </div>
  );
} 