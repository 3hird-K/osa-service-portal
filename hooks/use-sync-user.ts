"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook to automatically sync Clerk user to Neon DB
 * Runs when user logs in to ensure data is persisted in the database
 */
export function useSyncUser() {
  const { user, isLoaded } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    const syncUserToDatabase = async () => {
      if (!user?.id || !isLoaded) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${apiUrl}/sync-user/${user.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.warn(`Failed to sync user ${user.id}:`, response.statusText);
          return;
        }

        const data = await response.json();
        console.log(`✅ User synced to Neon DB:`, data);

        // Invalidate profile queries to refetch fresh data
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["profiles-here"] });
      } catch (error) {
        console.error("Error syncing user to Neon DB:", error);
      }
    };

    syncUserToDatabase();
  }, [user?.id, isLoaded, queryClient]);
}
