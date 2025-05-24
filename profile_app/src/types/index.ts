export interface PortfolioItem {
    title: string;
    description: string | null;
    mediaUrl: string | null;
    mediaType: string; 
  }
  
  export interface Portfolio {
    title: string;
    description: string | null;
    items: PortfolioItem[];
  }
  
  export interface Profile {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
    bio: string | null;
    portfolio: Portfolio | null;
    createdAt?: string;
  }
  
  export interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }