import axios from 'axios';
import { config } from '../config/env';

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function sendMessage(message: string): Promise<{ session_id: string; response: string }> {
  const payload = {
    session_id: "13",
    message: message,
    user_id: "12"
  };

  const response = await api.post('/chat/chat2', payload);
  return response.data;
}
