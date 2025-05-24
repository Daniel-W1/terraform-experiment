import React, { useState } from 'react';
import { api } from '../services/api';

export default function AgentCreationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    personality: '',
    companyName: '',
    companyAddress: '',
    department: '',
    industry: '',
    yearEstablished: '',
    companyEmail: '',
    phoneNumber: '',
    companyWebsite: '',
    jobDescription: '',
    priorities: '',
    opinions: '',
    aiCreativity: 5,
  });

  const [chatbotScriptId, setChatbotScriptId] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/chat/upload_chatbot_script/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setChatbotScriptId(response.data.id);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    }
  };

  const handleCreateAgent = async () => {
    const payload = {
      name: `${formData.firstName} ${formData.lastName}`,
      chatbot_script_id: chatbotScriptId,
      lead_information_list_ids: [],
      first_name: formData.firstName,
      last_name: formData.lastName,
      job_title: formData.jobTitle,
      personality: formData.personality,
      company_name: formData.companyName,
      company_address: formData.companyAddress,
      department: formData.department,
      industry: formData.industry,
      year_established: parseInt(formData.yearEstablished, 10),
      company_email: formData.companyEmail,
      phone_number: formData.phoneNumber,
      company_website: formData.companyWebsite,
      job_description: formData.jobDescription,
      priorities: formData.priorities.split(',').map((p) => p.trim()),
      opinions: formData.opinions.split(',').map((o) => o.trim()),
      ai_creativity: formData.aiCreativity,
    };

    try {
      const response = await api.post('/chat/create-chatbot4', payload);
      alert('Agent created successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Failed to create agent.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Create Agent</h1>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <div className="flex items-center justify-center bg-gray-200 rounded-full h-40 w-40 mx-auto">
              <span className="text-xl"><img 
  src="https://randomuser.me/api/portraits/lego/1.jpg" 
  alt={ "Chatbot"} 
  className="rounded-full mx-auto mb-2" 
/>
</span>
            </div>
          </div>
          <div className="col-span-1">
            <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="firstName" placeholder="First Name" className="border p-2 rounded" onChange={handleInputChange} />
              <input type="text" name="lastName" placeholder="Last Name" className="border p-2 rounded" onChange={handleInputChange} />
              <input type="text" name="personality" placeholder="Personality" className="border p-2 rounded" onChange={handleInputChange} />
              {/* <select name="personality" className="border p-2 rounded" onChange={handleInputChange}>
                <option>Choose personality...</option>
              </select> */}
              <input type="text" name="jobTitle" placeholder="Job Title" className="border p-2 rounded" onChange={handleInputChange} />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Company and Role Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="companyName" placeholder="Company Name" className="border p-2 rounded" onChange={handleInputChange} />
            <input type="text" name="companyAddress" placeholder="Company Address" className="border p-2 rounded" onChange={handleInputChange} />
            <input type="text" name="personality" placeholder="Personality" className="border p-2 rounded" onChange={handleInputChange} />
            <input type="text" name="industry" placeholder="industry" className="border p-2 rounded" onChange={handleInputChange} />

            {/* <select name="department" className="border p-2 rounded" onChange={handleInputChange}>
              <option>Choose department...</option>
            </select> */}
            {/* <select name="industry" className="border p-2 rounded" onChange={handleInputChange}>
              <option>Choose industry...</option>
            </select> */}
            <input type="text" name="yearEstablished" placeholder="Year Established" className="border p-2 rounded" onChange={handleInputChange} />
            <input type="text" name="companyEmail" placeholder="Company Email" className="border p-2 rounded" onChange={handleInputChange} />
            <input type="text" name="phoneNumber" placeholder="Phone Number" className="border p-2 rounded" onChange={handleInputChange} />
            <input type="text" name="companyWebsite" placeholder="Company Website" className="border p-2 rounded" onChange={handleInputChange} />
            <textarea name="jobDescription" placeholder="Job Description" className="border p-2 rounded col-span-2" onChange={handleInputChange}></textarea>
            <textarea name="priorities" placeholder="Priorities" className="border p-2 rounded col-span-2" onChange={handleInputChange}></textarea>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div className="w-full mr-2">
            <h2 className="text-xl font-semibold mb-4">Opinions</h2>
            <input type="text" name="opinions" placeholder="Add Opinion" className="border p-2 rounded w-full" onChange={handleInputChange} />
          </div>
          <div className="w-full ml-2">
            <h2 className="text-xl font-semibold mb-4">AI Creativity</h2>
            <input type="range" name="aiCreativity" min="1" max="10" className="w-full" onChange={handleInputChange} />
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div className="w-full ml-2">
            <h2 className="text-xl font-semibold mb-4">Upload Script</h2>
            <input type="file" className="w-full" onChange={handleFileUpload} />
          </div>
        </div>

        <button onClick={handleCreateAgent} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
          Create Agent
        </button>
      </div>
    </div>
  );
}