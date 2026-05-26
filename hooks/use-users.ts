"use client";

import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  account_type: string | null;
  avatar_url: string | null;
  updated_at: string;
}

// Fetch users from backend API
export function useUsers() {
  return useQuery({
    queryKey: ["profiles-here"],
    queryFn: async (): Promise<User[]> => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://server-osa-service.onrender.com';
      const response = await fetch(`${apiUrl}/profiles`, {
        cache: 'no-store',
      });
      console.log("useUsers - Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("useUsers - Data Received:", data);

      // Ensure it returns [] if data is null
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}