import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { api } from '../services/api';

export default function CreateLeadsList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/chat/create-leads-list?name=${encodeURIComponent(name)}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/leads-success');
    } catch (error) {
      console.error('Error creating leads list:', error);
      alert('Failed to create leads list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create Leads List</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              List Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Leads File
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {file ? file.name : 'Drag & drop your file here, or click to select'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supports Excel (.xlsx, .xls) and CSV files
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file || !name}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors 
                disabled:bg-blue-400 flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              Create List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 