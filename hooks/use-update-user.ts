"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useUpdateUser() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string | number;
      updates: Record<string, any>;
    }) => {
      // 1. Get the authenticated user ID
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) throw new Error("Authentication required");

      // 2. Fetch the current user's profile to check their role
      const { data: currentUserProfile, error: profileError } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", authUser.id)
        .single();

      if (profileError || !currentUserProfile) throw new Error("Could not verify permissions");

      // 3. Role Check: Only Admin or Staff can proceed
      const allowedRoles = ["Admin", "Staff"];
      if (!allowedRoles.includes(currentUserProfile.account_type)) {
        throw new Error("Unauthorized: Only Admins or Staff can update profiles");
      }

      // 4. Perform the update on the target user
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (updateError) throw updateError;
      
      return { userId };
    },
    onSuccess: (_, variables) => {
      toast.success("Profile updated successfully");
      // Invalidate the specific user and the general list
      queryClient.invalidateQueries({ queryKey: ["profile", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // Match the key used in your useUsers hook
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}