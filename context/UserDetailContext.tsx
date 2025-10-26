"use client";
import { createContext } from "react";
import { UserDetailContextType } from "@/lib/types";

export const UserDetailContext = createContext<UserDetailContextType>({
  userDetails: null,
  setUserDetails: () => {},
});
