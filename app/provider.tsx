"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { ProviderProps, UserDetails } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Provider({ children }: ProviderProps) {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const CreateNewUser = async () => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      const data = await res.json();
      console.log("User API Response:", data);
      setUserDetails(data.user);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const create = async () => {
      await CreateNewUser();
    };

    create();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
}
