"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useFavoriteStatus(bookId: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data: isFavorite, isLoading } = useQuery({
    queryKey: ["favorite", bookId],
    queryFn: async () => {
      if (!bookId) return false;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from("favorites")
        .select("favorited")
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .maybeSingle();

      return !!data?.favorited;
    },
    enabled: !!bookId,
  });

  const mutation = useMutation({
    mutationFn: async (nextState: boolean) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Auth required");

      const { error } = await supabase
        .from("favorites")
        .upsert({
          book_id: bookId,
          user_id: user.id,
          favorited: nextState,
        }, {
          onConflict: 'book_id, user_id' 
        });

      if (error) throw error;
      return nextState;
    },
    onMutate: async (nextState) => {
      await queryClient.cancelQueries({ queryKey: ["favorite", bookId] });
      const previousState = queryClient.getQueryData(["favorite", bookId]);
      queryClient.setQueryData(["favorite", bookId], nextState);
      return { previousState };
    },
    onError: (err, nextState, context) => {
      queryClient.setQueryData(["favorite", bookId], context?.previousState);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite", bookId] });
      queryClient.invalidateQueries({ queryKey: ["favorites-list"] });
    },
  });

  return {
    isFavorite: !!isFavorite,
    isLoading,
    isUpdating: mutation.isPending,
    // This wrapper allows you to call toggleFavorite() with zero arguments
    toggleFavorite: () => mutation.mutate(!isFavorite),
  };
}