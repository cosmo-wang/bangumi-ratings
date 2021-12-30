import { useContext, createContext } from "react";

export const AuthenticationContext = createContext(null);

export function useAuthenticationContext() {
  return useContext(AuthenticationContext);
}