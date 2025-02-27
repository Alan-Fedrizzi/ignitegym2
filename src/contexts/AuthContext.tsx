import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";
import { storageUserSave, storageUserGet } from "@storage/storageUser";

export type AuthContextDataProps = {
  user: UserDTO;
  // como signIn puxa dados da api, é async, ou seja, retorna uma promisse
  signIn: (email: string, password: string) => Promise<void>;
  isLoadingUserStorage: boolean;
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
  // vamos armazenar o context em um estado
  // se mudar, muda em todo app
  // inicia como um objeto vazio
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  // isLoadingUserStorage começa com true pois inicia caregando os dados
  const [isLoadingUserStorage, setIsLoadingUserStorage] = useState(true);

  async function loadUserData() {
    try {
      const loggedUser = await storageUserGet();

      if (loggedUser) {
        setUser(loggedUser);
      }
    } catch (error) {
      // não queremos lidar com erro aqui, vamos lançar pra frente, para quem chamou essa function
      throw error;
    } finally {
      setIsLoadingUserStorage(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user) {
        setUser(data.user);
        storageUserSave(data.user);
      }
    } catch (error) {
      // não queremos lidar com erro aqui, vamos lançar pra frente, para quem chamou essa function
      throw error;
    }

    // setUser({
    //   id: "",
    //   name: "",
    //   email,
    //   avatar: "",
    // });
  }

  // para carregar usuário no carregamento inicial
  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, isLoadingUserStorage }}>
      {children}
    </AuthContext.Provider>
  );
}
