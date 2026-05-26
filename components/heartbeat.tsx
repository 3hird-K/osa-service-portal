"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

/**
 * Heartbeat Component
 * Sends a "ping" to the backend every 30 seconds to let the system 
 * know the user is currently active/online.
 */
export function Heartbeat() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://server-osa-service.onrender.com";
    
    // Function to send the heartbeat
    const sendPing = async () => {
      try {
        await fetch(`${baseUrl}/users/${user.id}/heartbeat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // We can send empty body or metadata if needed
          body: JSON.stringify({ last_active: new Date().toISOString() }),
        });
      } catch (error) {
        // Silently fail to not disturb the user experience
        console.debug("Heartbeat failed (backend might not have /heartbeat endpoint yet)");
      }
    };

    // Initial ping
    sendPing();

    // Set up interval for every 30 seconds
    const interval = setInterval(sendPing, 30000);

    return () => clearInterval(interval);
  }, [user?.id, isLoaded]);

  return null; // This component doesn't render anything
}
