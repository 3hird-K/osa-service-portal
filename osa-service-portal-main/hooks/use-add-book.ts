"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Database } from "@/database.types";

// Using the exact row type from your database definitions
type Books = Database["public"]["Tables"]["books"]["Row"];

interface AddBookVariables {
  title: string;
  author: string;
  genre?: string;
  imageFile: File | null;
}

export function useAddBook() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, author, genre, imageFile }: AddBookVariables) => {
      // 1. Get User Session
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Authentication required to add books.");

      let publicImageUrl = null;

      // 2. Handle Image Upload to "books" bucket
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        // Organization: userId/timestamp-filename.ext
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("books")
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("books")
          .getPublicUrl(fileName);
        
        publicImageUrl = publicUrl;
      }

      // 3. Insert into "books" table
      // Aligned with your Books type: author, genre, image, title, user_id
      const { error: insertError } = await supabase.from("books").insert([
        {
          title,
          author,
          genre,
          image: publicImageUrl, // Matches your type definition 'image'
          user_id: user.id,
          // created_at is usually handled by Supabase default (now())
        },
      ]);

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      toast.success("Book added to your shelf!");
      // This will trigger a re-fetch of any component using useQuery(["books"])
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error: Error) => {
      console.error("Add Book Error:", error.message);
      toast.error(error.message || "Failed to add book. Please try again.");
    },
  });
}