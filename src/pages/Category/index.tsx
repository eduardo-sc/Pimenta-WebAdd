import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "../../componets/Header";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../services/apiClient";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import nProgress from "nprogress";
export default function Category() {
  const [name, setName] = useState("");

  async function Register(event: FormEvent) {
    nProgress.start();
    event.preventDefault();
    if (name === "") {
      toast.warning("Preenche compo categoria");
      nProgress.done();
      return;
    }
    try {
      await api.post("/category", { name }).then(() => {
        nProgress.done();
        toast.success("Salvo com sucesso");
        setName("");
      });
    } catch (error) {
      nProgress.done();
      toast.error("Nao registrado");
    }
  }
  //criar lista de itens cadastrado
  return (
    <>
      <Head>
        <title>Nova categoria Pimenta-Malagueta</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <h1>Cadastrar categoria</h1>
          <form className={styles.form} onSubmit={Register}>
            <input
              type={"text"}
              placeholder={"Digite o nome da categoria"}
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className={styles.addButton} type={"submit"}>
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
