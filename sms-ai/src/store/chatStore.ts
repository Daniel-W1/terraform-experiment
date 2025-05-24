import { create } from 'zustand';
import { ChatState, ChatMessage } from '../types';
import { sendMessage } from '../services/api';

interface ChatStore extends ChatState {
  addMessage: (message: ChatMessage) => void;
  sendMessage: (content: string) => Promise<void>;
  setScript: (script: ChatState['script']) => void;
  addCompanyData: (data: ChatState['companyData'][0]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  script: null,
  companyData: [],
  isLoading: false,
  error: null,

  addMessage: (message) => {
    console.log('Adding message:', message);
    set((state) => ({
      messages: [...state.messages, { ...message, id: message.id || Date.now().toString() }],
    }));
    console.log('Updated messages:', get().messages);
  },

  // addMessage: (message) => {
  //   console.log('Adding message:', message);
  //   set((state) => ({
  //     messages: [...state.messages, message],
  //   }));
  //   console.log('Updated messages:', get().messages);
  // },

  sendMessage: async (content) => {
    console.log('sendMessage called with content:', content);
    try {
      set({ isLoading: true, error: null });
      console.log('Loading state set to true');

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      
      console.log('Adding user message:', userMessage);
      get().addMessage(userMessage);
      
      

      // Send to backend and wait for response
      console.log('Sending message to backend...');
      const response = await sendMessage(content);
      const contents = response.response; // Retrieve the response field
      console.log('Received response from backend:', response);
      // var contents  = response.response; 
      console.log('Received contents from backend:', contents);

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: contents, 
        timestamp: new Date(),
      };
      get().addMessage(assistantMessage);
      console.log('Adding assistant message:', assistantMessage);
    } catch (error) {
      set({ error: 'Failed to send message. Please try again.' });
      console.error('Message sending error:', error);
    } finally {
      set({ isLoading: false });
      console.log('Loading state set to false');
    }
  },

  setScript: (script) => {
    console.log('Setting script:', script);
    set({ script });
  },
  
  addCompanyData: (data) => {
    console.log('Adding company data:', data);
    set((state) => ({
      companyData: [...state.companyData, data],
    }));
    console.log('Updated company data:', get().companyData);
  },
    
  setLoading: (isLoading) => {
    console.log('Setting loading state to:', isLoading);
    set({ isLoading });
  },
  
  setError: (error) => {
    console.log('Setting error state to:', error);
    set({ error });
  },
}));

export default useChatStore;


// import { create } from 'zustand';
// import { ChatState, ChatMessage } from '../types';
// import { sendMessage } from '../services/api';

// interface ChatStore extends ChatState {
//   addMessage: (message: ChatMessage) => void;
//   sendMessage: (content: string) => Promise<void>;
//   setScript: (script: ChatState['script']) => void;
//   addCompanyData: (data: ChatState['companyData'][0]) => void;
//   setLoading: (isLoading: boolean) => void;
//   setError: (error: string | null) => void;
// }

// const useChatStore = create<ChatStore>((set, get) => ({
//   messages: [],
//   script: null,
//   companyData: [],
//   isLoading: false,
//   error: null,

//   addMessage: (message) =>
//     set((state) => ({
//       messages: [...state.messages, message],
//     })),

//   sendMessage: async (content) => {
//     try {
//       set({ isLoading: true, error: null });
      
//       // Add user message immediately
//       const userMessage: ChatMessage = {
//         id: Date.now().toString(),
//         role: 'user',
//         content,
//         timestamp: new Date(),
//       };
//       get().addMessage(userMessage);

//       // Send to backend and wait for response
//       const response = await sendMessage(content);
      
//       // Add assistant response
//       get().addMessage({
//         ...response,
//         timestamp: new Date(),
//       });
//     } catch (error) {
//       set({ error: 'Failed to send message. Please try again.' });
//       console.error('Message sending error:', error);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   setScript: (script) => set({ script }),
  
//   addCompanyData: (data) =>
//     set((state) => ({
//       companyData: [...state.companyData, data],
//     })),
    
//   setLoading: (isLoading) => set({ isLoading }),
  
//   setError: (error) => set({ error }),
// }));

// export default useChatStore;