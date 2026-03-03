"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

// hooks/use-users.ts
export function useUsers() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["profiles-here"], 
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`*`)
        .order("updated_at", { ascending: false })

      if (error) throw error;
      
      // FIX: Ensure it returns [] if data is null
      return data ?? []; 
    },
    // FIX: Provide initial empty array for the first render
    initialData: [], 
  });
}