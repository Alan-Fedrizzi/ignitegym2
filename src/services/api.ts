import { storageAuthTokenGet } from "@storage/storageAuthToken";
import { AppError } from "@utils/AppError";
import axios, { AxiosInstance } from "axios";

type SignOut = () => void;

// par não perder a tipagem do axios usamos o AxiosInstance
type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
  // é uma função que recebe outra função que retorna void
  // a primeira recebe o signout, e a segunda é o interceptor
};

const api = axios.create({
  baseURL: "http://192.168.1.42:3333",
}) as APIInstanceProps;

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
          requestError.reponse.data?.message === "token.expired" ||
          requestError.reponse.data?.message === "token.invalid"
        ) {
          // fluxo de novo token
          const { refresh_token } = await storageAuthTokenGet();

          if (!refresh_token) {
            signOut();
            return Promise.reject(requestError);
          }
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
