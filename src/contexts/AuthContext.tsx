import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";
import {
  storageUserSave,
  storageUserGet,
  storageUserRemove,
} from "@storage/storageUser";
import {
  storageAuthTokenSave,
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from "@storage/storageAuthToken";

export type AuthContextDataProps = {
  user: UserDTO;
  // como signIn puxa dados da api, é async, ou seja, retorna uma promisse
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
  updateUserProfile: (updatedUser: UserDTO) => Promise<void>;
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
  // isLoadingUserStorageData começa com true pois inicia caregando os dados
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser(userData);
  }

  async function storageUserAndTokenSave(
    userData: UserDTO,
    token: string,
    refresh_token: string
  ) {
    try {
      setIsLoadingUserStorageData(true);

      await storageUserSave(userData);
      await storageAuthTokenSave({ token, refresh_token });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);

      const loggedUser = await storageUserGet();
      const { token } = await storageAuthTokenGet();

      if (token && loggedUser) {
        userAndTokenUpdate(loggedUser, token);
      }
    } catch (error) {
      // não queremos lidar com erro aqui, vamos lançar pra frente, para quem chamou essa function
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user && data.token && data.refresh_token) {
        await storageUserAndTokenSave(
          data.user,
          data.token,
          data.refresh_token
        );
        userAndTokenUpdate(data.user, data.token);
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

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);

      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateUserProfile(updatedUser: UserDTO) {
    try {
      setUser(updatedUser);
      await storageUserSave(updatedUser);
    } catch (error) {
      throw error;
    }
  }

  // para carregar usuário no carregamento inicial
  useEffect(() => {
    loadUserData();
  }, []);

  // ele prefere separar em mais de um useEffect
  // dentro do contexto temos o método de signOut
  // e temos que passar para a nossa api
  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);
    // boa prática: o retorno do useEffect é uma function de limpeza da memória
    return () => subscribe();
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoadingUserStorageData,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
