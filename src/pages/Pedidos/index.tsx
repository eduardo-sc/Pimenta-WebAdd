import Head from "next/head";
import { Header } from "../../componets/Header";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import { FiRefreshCcw } from "react-icons/fi";
import styles from "./styles.module.scss";

export default function Pedidos() {
  return (
    <>
      <Head>
        <title>Pedidos Pimenta-Malagueta</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Ultimos Pedidos</h1>
            <button>
              <FiRefreshCcw size={25} color={"#3fffa3"} />
            </button>
          </div>
          <article className={styles.listOrder}>
            <section className={styles.orderItem}>
              <button>
                <div className={styles.tag}></div>
                <span>Mesa 30</span>
              </button>
            </section>
          </article>
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
