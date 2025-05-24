export interface LeadsList {
  id: string;
  name: string;
  lead_information_ids: string[];
  created_at: string;
  updated_at: string;
  leads: Lead[];
}

export interface Lead {
  phone_number: string;
  name: string;
  email: string;
  detail: string | null;
  chatbot_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  chatbot_id: string;
  leads_list_id: string;
  status: 'active' | 'completed' | 'failed';
  created_at: string;
}

export interface DashboardMetrics {
  total_campaigns: number;
  active_campaigns: number;
  total_leads: number;
  success_rate: number;
  monthly_messages: number;
}
