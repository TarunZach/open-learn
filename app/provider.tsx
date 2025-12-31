"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { ProviderProps, UserDetails } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Provider({ children }: ProviderProps) {
  const { user, isLoaded } = useUser();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const syncUserWithDB = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "POST",
        });

        if (!res.ok) {
          console.error("User API failed", res.status);
          return;
        }

        const data = await res.json();
        setUserDetails(data.user);
      } catch (error) {
        console.error("Error syncing user:", error);
      }
    };
    syncUserWithDB();
  }, [isLoaded, user]);

  return (
    <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserDetailContext.Provider>
  );
}
