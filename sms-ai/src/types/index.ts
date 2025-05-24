export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatScript {
  id: string;
  content: string;
  templates: Record<string, string>;
  rules: ScriptRule[];
}

export interface ScriptRule {
  trigger: string;
  response: string;
  priority: number;
}

export interface CompanyData {
  id: string;
  content: string;
  type: 'pdf' | 'text';
  metadata: Record<string, any>;
}

export interface ChatState {
  messages: ChatMessage[];
  script: ChatScript | null;
  companyData: CompanyData[];
  isLoading: boolean;
  error: string | null;
}