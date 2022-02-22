import { useContext, createContext } from "react";

export const WindowSizeContext = createContext(null);

export function useWindowSizeContext() {
  return useContext(WindowSizeContext);
}