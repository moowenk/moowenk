import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type DbUser = {
  id: string;
  email: string;
  display_name: string | null;
  home_comarca: string | null;
  subscription_status: "trial" | "active" | "inactive";
  subscription_end_date: string | null;
  phone: string | null;
  created_at: string;
};

export type DbListing = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  comarca: string;
  village: string;
  status: "active" | "sold" | "paused_by_expiration" | "deleted";
  photo_url: string;
  category: string;
  created_at: string;
  updated_at: string;
  sold_at: string | null;
};
