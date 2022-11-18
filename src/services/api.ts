import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";
import { signOut } from "../contexts/Authcontext";
import { GetServerSideProps } from "next";
export function setupAPICliet(ctx: undefined | any) {
  let { "@pimenta.token": tokem } = parseCookies(ctx);

  const api = axios.create({
    //baseURL: "https://malagueta.herokuapp.com/",
    baseURL: "https://teste-rs.herokuapp.com/",
    headers: {
      Authorization: `Bearer ${tokem}`,
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
