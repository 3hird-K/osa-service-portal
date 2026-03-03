import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface ProfileWithEmail extends Profile {
  email: string | undefined;
}

export async function getProfile(): Promise<ProfileWithEmail> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return { ...data, email: user.email };
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}