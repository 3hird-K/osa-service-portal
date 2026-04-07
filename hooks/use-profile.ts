import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

export interface ProfileWithEmail {
  id: string;
  firstname: string | null;
  lastname: string | null;
  account_type: string | null;
  avatar_url: string | null;
  email: string | undefined;
}

export function useProfile() {
  const { user, isLoaded } = useUser();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async (): Promise<ProfileWithEmail> => {
      if (!user) throw new Error("Not authenticated");
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/profiles/${user.id}`);
        if (!res.ok) {
          if (res.status === 404) {
            // If FastAPI hasn't synced from webhook yet, gracefully return a default mapping
            return {
              id: user.id,
              firstname: user.firstName,
              lastname: user.lastName,
              account_type: "student",
              avatar_url: user.imageUrl,
              email: user.primaryEmailAddress?.emailAddress
            };
          }
          throw new Error("Failed to fetch profile");
        }
        
        const data = await res.json();
        return { ...data, email: user.primaryEmailAddress?.emailAddress };
      } catch (error) {
        // Fallback to Clerk user data if API is unavailable
        return {
          id: user.id,
          firstname: user.firstName,
          lastname: user.lastName,
          account_type: "student",
          avatar_url: user.imageUrl,
          email: user.primaryEmailAddress?.emailAddress
        };
      }
    },
    enabled: !!user?.id && isLoaded,
  });
}