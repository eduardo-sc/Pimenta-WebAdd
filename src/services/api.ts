import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";
import { signOut } from "../contexts/Authcontext";

export function setupAPICliet(ctx= undefined) {
  let cookies= parseCookies(ctx);
 
  const api = axios.create({
    baseURL: "https://teste-rs.herokuapp.com/",
    //baseURL: "http://DESKTOP-AAVN6MN:3333/",
    timeout:1000,
    headers: {
      Authorization: "Bearer "+cookies['@pimenta.token'],
    },
  });
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        //qual quer erro 401(nao autorizado)devemos devemos deslogar o usuario
        signOut();
        if (typeof window !== undefined) {
          //chamar function para deslogar
          signOut();
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }
      return Promise.reject(error);
    }
  );
  return api;
}
