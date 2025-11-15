"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProviderProps } from "@/lib/types";
import { AppSidebar } from "./components/AppSIdeBar";
import AppHeader from "./components/AppHeader";

export default function WorkspaceProvider({ children }: ProviderProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <AppHeader />
        {children}
      </div>
    </SidebarProvider>
  );
}
