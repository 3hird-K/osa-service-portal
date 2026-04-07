"use client";

import { ReactNode } from "react";
import { useSyncUser } from "@/hooks/use-sync-user";

interface SyncUserProviderProps {
  children: ReactNode;
}

/**
 * Provider component that automatically syncs the Clerk user to Neon DB
 * This ensures user data is persisted in the database whenever they're authenticated
 */
export function SyncUserProvider({ children }: SyncUserProviderProps) {
  // This hook runs on authentication and syncs user to Neon DB
  useSyncUser();

  return <>{children}</>;
}
