import { createContext } from "react";
import type { WorkspaceState } from "./workspace";
// Keep the context identity stable when the provider is hot-reloaded.
export const Context = createContext<WorkspaceState | null>(null);
