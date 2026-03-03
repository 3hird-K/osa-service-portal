"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useFavoritesList() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["favorites-list"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // We join the 'books' table
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          favorited,
          books:book_id (*) 
        `)
        .eq("user_id", user.id)
        .eq("favorited", true);

      if (error) throw error;

      /**
       * FIX: Supabase joins can sometimes return an array or an object 
       * depending on your FK configuration. We map and ensure we 
       * return the book object directly.
       */
      return data.map((fav: any) => {
        // If 'books' is an array, take the first item; otherwise take the object
        const bookData = Array.isArray(fav.books) ? fav.books[0] : fav.books;
        return bookData;
      }).filter(Boolean); // Remove any nulls
    },
  });
}