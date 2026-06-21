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
  tag: string | null;
  published: boolean;
  published_at: string | null;
  author_id: string | null;
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
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
          tag?: string | null;
          published?: boolean;
          published_at?: string | null;
          author_id?: string | null;
        };
        Update: Partial<NewsArticleRow>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      lead_status: LeadStatus;
      insurance_type: InsuranceType;
    };
    CompositeTypes: Record<string, never>;
  };
};
