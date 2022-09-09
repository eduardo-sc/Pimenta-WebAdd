import { useContext, FormEvent, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/home.module.scss";
import { Input } from "../componets/ui/Input";
import logoImagem from "../../public/logo.bmp";
import { Button } from "../componets/ui/Button";
import Link from "next/link";
import { AuthContext } from "../contexts/Authcontext";
import { toast } from "react-toastify";

import { canSSRGuest } from "../Utils/canSSRGuest";
export default function Home() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("eduardo@gmail.com");
  const [password, setpassword] = useState("111111");
  const [loading, setLoading] = useState(false);
  async function handlerLogin(event: FormEvent) {
    event.preventDefault();

    if (email === "" || password === "") {
      toast.warning("Preenche os campos");
      return;
    }
    setLoading(true);
    let data = {
      email,
      password,
    };
    await signIn(data);
    setLoading(false);
  }
  return (
    <>
      <Head>
        <title>Pimenta Malagueta - faça seu Login</title>
      </Head>
      <div className={styles.contarneCenter}>
        <Image src={logoImagem} width={425} height={155} />
        <div className={styles.login}>
          <form onSubmit={handlerLogin}>
            <Input
              placeholder="Digite seu email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Digite sua password"
              type={"password"}
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <Button type={"submit"} loading={loading}>
              acessar
            </Button>
          </form>
          {
            //<Link href={"/Cadastrar"}>
            //<a className={styles.text}>Nao tem uma conta ? cadastre-se</a>
            //</Link>
          }
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
