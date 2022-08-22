import Head from "next/head";
import Image from "next/image";
import logoImagem from "../../../public/logo.bmp";
import styles from "../../../styles/home.module.scss";
import { Input } from "../../componets/ui/Input";
import { Button } from "../../componets/ui/Button";
import Link from "next/link";
export default function Cadastro() {
  return (
    <>
      <Head>
        <title>Crie sua conta - Pimemta Malagueta</title>
      </Head>
      <div className={styles.contarneCenter}>
        <Image src={logoImagem} width={425} height={155} />
        <div className={styles.login}>
          <h1>Cria sua conta</h1>
          <form>
            <Input placeholder="Digite seu nome" type="text" />
            <Input placeholder="Digite seu email" type="text" />
            <Input placeholder="Digite sua senha" type={"password"} />
            <Button type={"submit"} loading={false}>
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
