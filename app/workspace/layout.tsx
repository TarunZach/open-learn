import { ProviderProps } from "@/lib/types";
import WorkspaceProvider from "./provider";

export default function WorkspaceLayout({ children }: ProviderProps) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}
