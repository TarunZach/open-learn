import { ReactNode } from "react";

export interface ProviderProps {
  children: ReactNode;
}

export interface UserDetails {
  id: number;
  name: string;
  email: string;
}

export interface UserDetailContextType {
  userDetails: UserDetails | null;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
}
