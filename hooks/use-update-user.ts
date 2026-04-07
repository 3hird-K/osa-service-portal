"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export function useUpdateUser() {
  const { user: authUser } = useUser();
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
      if (!authUser) throw new Error("Authentication required");

      // 2. Fetch the current user's profile to check their role
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://server-osa-service.onrender.com';
      const profileRes = await fetch(`${apiUrl}/profiles/${authUser.id}`);
      
      if (!profileRes.ok) throw new Error("Could not verify permissions");
      
      const currentUserProfile = await profileRes.json();

      // 3. Role Check: Only Admin or Staff can proceed
      const allowedRoles = ["admin", "staff", "Admin", "Staff"];
      if (!allowedRoles.includes(currentUserProfile.account_type)) {
        throw new Error("Unauthorized: Only Admins or Staff can update profiles");
      }

      // 4. Perform the update on the target user
      const updateRes = await fetch(`${apiUrl}/profiles/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!updateRes.ok) {
        const error = await updateRes.json();
        throw new Error(error.detail || "Failed to update profile");
      }
      
      return { userId };
    },
    onSuccess: (_, variables) => {
      toast.success("Profile updated successfully");
      // Invalidate the specific user and the general list
      queryClient.invalidateQueries({ queryKey: ["profile", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // Match the key used in your useUsers hook
      queryClient.invalidateQueries({ queryKey: ["profiles-here"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}