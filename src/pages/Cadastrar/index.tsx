import { FormEvent, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import logoImagem from "../../../public/logo.bmp";
import styles from "../../../styles/home.module.scss";
import { Input } from "../../componets/ui/Input";
import { Button } from "../../componets/ui/Button";
import Link from "next/link";
import { AuthContext } from "../../contexts/Authcontext";
export default function Cadastro() {
  const { registerUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  async function headleRegister(event: FormEvent) {
    event.preventDefault();
    if (name === "" || email === "" || password === "") {
      return;
    }
    setLoading(true);
    let data = {
      name,
      email,
      password,
    };
    registerUser(data);
    setLoading(false);
  }
  return (
    <>
      <Head>
        <title>Crie sua conta - Pimemta Malagueta</title>
      </Head>
      <div className={styles.contarneCenter}>
        <Image src={logoImagem} width={425} height={155} />
        <div className={styles.login}>
          <h1>Cria sua conta</h1>
          <form onSubmit={headleRegister}>
            <Input
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Digite seu email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Digite sua senha"
              type={"password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type={"submit"} loading={loading}>
              Cadastrar
            </Button>
          </form>
          <Link href={"/"}>
            <a className={styles.text}>Ja tem cadastro? faça login</a>
          </Link>
        </div>
      </div>
    </>
  );
}
