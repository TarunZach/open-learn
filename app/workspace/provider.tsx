"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProviderProps } from "@/lib/types";
import { AppSidebar } from "./components/AppSIdeBar";

export default function WorkspaceProvider({ children }: ProviderProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div>{children}</div>
    </SidebarProvider>
  );
}
