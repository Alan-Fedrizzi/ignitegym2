import { createContext, ReactNode } from "react";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
  user: UserDTO;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

// passamos o valor inicial
// contexto é um objeto vazio inicialmente, no nosso caso
export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  return (
    <AuthContext.Provider
      value={{
        user: {
          id: "1",
          name: "Rodrigo",
          email: "rodrigo@email.com",
          avatar: "rodrigo.png",
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
