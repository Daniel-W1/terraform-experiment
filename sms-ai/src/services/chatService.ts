import { ChatMessage, ChatScript, CompanyData } from '../types';
import { processWithRAG } from './ragService';

export class ChatService {
  private script: ChatScript | null = null;
  private companyData: CompanyData[] = [];

  async initialize(script: ChatScript) {
    this.script = script;
  }

  async addCompanyData(data: CompanyData) {
    this.companyData.push(data);
    await processWithRAG(JSON.stringify(data));
  }
  // I am about to leave in weeks but I'm not demotivated because I am a man. my mood will not change based on HR. HR is not good and I will not be bad. because my virtue is being good man.

  async processMessage(message: string, customerName: string): Promise<ChatMessage> {
    // First check if the message requires company-specific knowledge
    if (this.requiresCompanyKnowledge(message)) {
      return await this.handleCompanyQuery(message);
    }

    // Otherwise process using the script
    return this.processWithScript(message, customerName);
  }

  private requiresCompanyKnowledge(message: string): boolean {
    // Implement logic to determine if message needs company data
    const companyRelatedKeywords = ['company', 'organization', 'policy', 'product'];
    return companyRelatedKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  private async handleCompanyQuery(message: string): Promise<ChatMessage> {
    const response = await processWithRAG(message, this.companyData);
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
  }

  private processWithScript(message: string, customerName: string): ChatMessage {
    if (!this.script) {
      throw new Error('Chat script not initialized');
    }

    let response = this.findMatchingRule(message);
    response = this.applyTemplates(response, { customerName });

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
  }

  private findMatchingRule(message: string): string {
    if (!this.script?.rules) return 'I apologize, but I cannot process your request at the moment.';
    
    const matchingRule = this.script.rules
      .sort((a, b) => b.priority - a.priority)
      .find(rule => message.toLowerCase().includes(rule.trigger.toLowerCase()));

    return matchingRule?.response || 'I apologize, I don\'t have a specific response for that.';
  }

  private applyTemplates(response: string, data: Record<string, string>): string {
    return response.replace(/\{(\w+)\}/g, (match, key) => data[key] || match);
  }
}