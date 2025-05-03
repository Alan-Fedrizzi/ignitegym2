import axios, { AxiosInstance, AxiosError } from "axios";
import { AppError } from "@utils/AppError";
import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from "@storage/storageAuthToken";

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

// par não perder a tipagem do axios usamos o AxiosInstance
type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
  // é uma função que recebe outra função que retorna void
  // a primeira recebe o signout, e a segunda é o interceptor
};

const api = axios.create({
  baseURL: "http://192.168.1.42:3333",
}) as APIInstanceProps;

// fila de espera das requisições
let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = (signOut) => {
  // trazemos o nosso interceptador aqui para dentro
  // pq aqui prodemos dar um eject depois de usar
  // eject é a limpeza do interceptor
  const interceptTokenManager = api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (requestError) => {
      // anter de verificar erro na requisição, vamos ver se tem erro no token
      // status 401 é requisição não autorizada, pode ser relacionada ao token
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.message === "token.expired" ||
          requestError.response.data?.message === "token.invalid"
        ) {
          // fluxo de novo token
          const { refresh_token } = await storageAuthTokenGet();

          if (!refresh_token) {
            signOut();
            return Promise.reject(requestError);
          }

          const originalRequestConfig = requestError.config;

          // primeira requisição não entra nesse if
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequestConfig.headers = {
                    Authorization: `Bearer ${token}`,
                  };
                  resolve(api(originalRequestConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }

          isRefreshing = true;

          // buscar o token atualizado
          return new Promise(async (resolve, reject) => {
            try {
              // solicita novo token
              const { data } = await api.post("/sessions/refresh-token", {
                refresh_token,
              });

              // salva no dispositivo do usuário
              await storageAuthTokenSave({
                token: data.token,
                refresh_token: data.refresh_token,
              });

              if (originalRequestConfig.data) {
                originalRequestConfig.data = JSON.parse(
                  originalRequestConfig.data
                );
              }

              // atualizar o headers
              originalRequestConfig.headers = {
                Authorization: `Bearer ${data.token}`,
              };
              // atualizar api
              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.token}`;

              // reenviar as requisições
              failedQueue.forEach((request) => {
                request.onSuccess(data.token);
              });

              console.log("TOKEN ATUALIZADO");

              resolve(api(originalRequestConfig));
            } catch (error: any) {
              failedQueue.forEach((request) => {
                request.onFailure(error);
              });

              signOut();
              reject(error);
            } finally {
              isRefreshing = false;
              // limpa fila de requisições
              failedQueue = [];
            }
          });
        }

        // é não autorizado, mas não é relacionado ao token
        // deslogar
        signOut();
      }

      // erro na requisição.. não é token
      // if (error.response && error.response.data) {
      if (requestError.response?.data) {
        // se já vem uma resposta de erro do backend, mandamos ela para o AppError
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        // se não mandamos o próprio erro
        return Promise.reject(new AppError(requestError));
      }
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

/*
api.interceptors.response.use(
  (response) => {
    console.log("INT response", response);
    return response;
  },
  (error) => {
    console.log("INT error", error);
    return Promise.reject(error);
  }
);
*/

/*
api.interceptors.request.use(
  (config) => {
    // console.log(config);
    console.log("dado enviados", config.data);
    return config;
  },
  (error) => {
    // rejeita a requisição e retorna o erro para quem fez o request
    return Promise.reject(error);
  }
);
*/

export { api };
