import { AppError } from "@utils/AppError";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.42:3333",
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if (error.response && error.response.data) {
    if (error.response?.data) {
      // se já vem uma resposta de erro do backend, mandamos ela para o AppError
      return Promise.reject(new AppError(error.response.data.message));
    } else {
      // se não mandamos o próprio erro
      return Promise.reject(new AppError(error));
    }
  }
);

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
