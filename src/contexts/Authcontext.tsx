import { createContext, ReactNode, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import Router from "next/router";
import { api } from "../services/apiClient";
type AuthContextData = {
  user: userProps | any;
  isAuthenticated: boolean;
  signIn: (credenciais: signinProps) => Promise<void>;

  signOut: () => void;
};

type userProps = {
  id: string;
  name: string;
  email: string;
};
type signinProps = {
  email: string;
  password: string;
};
type AuthProviderProps = {
  children: ReactNode;
};
export const AuthContext = createContext({} as AuthContextData);
export function signOut() {
  try {
    destroyCookie(undefined, "@pimenta.token");
  } catch {
    console.log("erro ao deslogar");
  }
}
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<userProps>();
  const isAuthenticated = !!user;
  async function signIn({ email, password }: signinProps) {
    try {
      const response = await api.post("/session", {
        email,
        password,
      });
      const { id, name, tokem } = response.data;
      setCookie(undefined, "@pimenta.token", tokem, {
        maxAge: 60 * 60 * 24 * 30,
        part: "/",
      });
      setUser({ id, name, email });
      //passar para proximas requisicao o nosso token
      api.defaults.headers.common["Authorizatiom"] = `Bearer${tokem}`;
      Router.push("Dashboard");
    } catch (error) {
      console.log("Erro de Acesso " + error);
    }
  }
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
