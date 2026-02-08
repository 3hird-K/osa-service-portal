"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useUpdateBook() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      bookId, 
      updates 
    }: { 
      bookId: string | number; 
      updates: Record<string, any> 
    }) => {
      const { error } = await supabase
        .from("books")
        .update(updates)
        .eq("id", bookId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Book updated successfully");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update book");
    },
  });
}