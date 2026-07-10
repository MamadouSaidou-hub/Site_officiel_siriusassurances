/**
 * Database types — hand-maintained.
 * To regenerate: `npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts`
 */

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export type InsuranceType =
  | "auto_habitation"
  | "sante_vie"
  | "multirisque_pro"
  | "construction"
  | "autre";

type LeadRow = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string | null;
  insurance_type: InsuranceType | null;
  message: string;
  status: LeadStatus;
  notes: string | null;
  ip_address: string | null;
  user_agent: string | null;
};

type NewsletterRow = {
  id: string;
  created_at: string;
  email: string;
  status: "active" | "unsubscribed";
  unsubscribed_at: string | null;
  unsubscribe_token: string;
};

type NewsArticleRow = {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  video_embed_url: string | null;
  video_url: string | null;
  tag: string | null;
  published: boolean;
  published_at: string | null;
  author_id: string | null;
};

type PartnerRow = {
  id: string;
  created_at: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  sort_order: number;
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  is_superadmin: boolean;
  created_at: string;
};

type ChatLogRow = {
  id: string;
  created_at: string;
  session_id: string | null;
  question: string;
  answer: string | null;
  model: string | null;
  flagged: boolean;
};

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          email: string;
          phone?: string | null;
          insurance_type?: InsuranceType | null;
          message: string;
          status?: LeadStatus;
          notes?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: Partial<LeadRow>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: NewsletterRow;
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          status?: "active" | "unsubscribed";
          unsubscribed_at?: string | null;
          unsubscribe_token?: string;
        };
        Update: Partial<NewsletterRow>;
        Relationships: [];
      };
      news_articles: {
        Row: NewsArticleRow;
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          cover_url?: string | null;
          video_embed_url?: string | null;
          video_url?: string | null;
          tag?: string | null;
          published?: boolean;
          published_at?: string | null;
          author_id?: string | null;
        };
        Update: Partial<NewsArticleRow>;
        Relationships: [];
      };
      partners: {
        Row: PartnerRow;
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          logo_url?: string | null;
          website?: string | null;
          sort_order?: number;
        };
        Update: Partial<PartnerRow>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          is_admin?: boolean;
          is_superadmin?: boolean;
          created_at?: string;
        };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      chat_logs: {
        Row: ChatLogRow;
        Insert: {
          id?: string;
          created_at?: string;
          session_id?: string | null;
          question: string;
          answer?: string | null;
          model?: string | null;
          flagged?: boolean;
        };
        Update: Partial<ChatLogRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_superadmin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      lead_status: LeadStatus;
      insurance_type: InsuranceType;
    };
    CompositeTypes: Record<string, never>;
  };
};
