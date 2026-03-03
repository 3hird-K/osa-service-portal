"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useDeleteBook() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookId: string) => {
      const { error } = await supabase.from("books").delete().eq("id", bookId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Book removed from library");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error: any) => toast.error(error.message),
  });
}