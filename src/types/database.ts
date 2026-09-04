export type PoemFormType = 'luc_bat' | 'song_that_luc_bat' | 'that_ngon' | 'tu_do';
export type PoemStatus = 'draft' | 'published' | 'archived';

export interface Author {
  id: string;
  name: string;
  pen_name: string | null;
  slug: string;
  period: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Computed / joined fields
  poems_count?: number;
  poems?: Poem[];
}

export interface Poem {
  id: string;
  title: string;
  slug: string;
  form_type: PoemFormType;
  excerpt: string | null;
  content_json: any; // TipTap AST JSON structure
  content_html: string;
  raw_text: string;
  author_id: string | null;
  show_author_info: boolean;
  category_id: string;
  cover_image_url: string | null;
  audio_url: string | null;
  status: PoemStatus;
  is_featured: boolean;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: Author | null;
  category?: Category | null;
  annotations?: Annotation[];
}

export interface CollectionPoem {
  collection_id: string;
  poem_id: string;
  sort_order: number;
}

export interface Annotation {
  id: string;
  poem_id: string;
  term: string;
  explanation: string;
  order_index: number;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name?: string | null;
  diff_json: any;
  ip_address: string;
  created_at: string;
}

export interface SavedPoem {
  id: string;
  poem_id: string;
  user_id?: string | null;
  device_fingerprint?: string | null;
  created_at: string;
}

export interface PoemComment {
  id: string;
  poem_id: string;
  author_name: string;
  author_email?: string | null;
  content: string;
  is_approved: boolean;
  created_at: string;
}
