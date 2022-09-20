import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import Router from "next/router";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";
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
type registerUserProps = {
  name: string;
  email: string;
  password: string;
  permission_id: string;
};
type AuthProviderProps = {
  children: ReactNode;
};
export function signOut() {
  try {
    destroyCookie(undefined, "@pimenta.token");
    api.defaults.headers.common["Authorization"] = " ";
    Router.push("/");
  } catch {
    toast.error("Erro ao sair");
  }
}
export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<userProps>();
  const isAuthenticated = !!user;
  async function signIn({ email, password }: signinProps) {
    try {
      const response = await api
        .post("/session/", {
          email,
          password,
        })
        .then((response) => {
          const { id, name, tokem } = response.data;
          setCookie(undefined, "@pimenta.token", tokem, {
            maxAge: 60 * 60 * 24 * 30,
            part: "/",
          });
          api.defaults.headers.common["Authorization"] = "Bearer :" + tokem;
          setUser({ id, name, email });
          //passar para proximas requisicao o nosso token

          Router.push("Dashboard");
          toast.success("Bem Vindo " + name);
        });
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }

  useEffect(() => {
    async function getDetailUser() {
      const { "@pimenta.token": tokem } = parseCookies();

      if (tokem) {
        let config = {
          headers: {
            Authorization: "Bearer " + tokem,
          },
        };
        await api
          .get("/detail")
          .then((response) => {
            const { id, name, email } = response.data;

            setUser({
              id,
              name,
              email,
            });
          })
          .catch((erro) => {
            alert(erro);
            signOut();
          });
      }
    }

    getDetailUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
