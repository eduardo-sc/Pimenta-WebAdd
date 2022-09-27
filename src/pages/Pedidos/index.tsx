import Head from "next/head";
import { Header } from "../../componets/Header";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import { FiRefreshCcw } from "react-icons/fi";
import styles from "./styles.module.scss";
import { setupAPICliet } from "../../services/api";
import { useEffect, useState } from "react";
// import DetalhePedidos from "../../componets/DetalhePedidos";
export type PedidoProps = {
  id: string;
  table: string;
  status: string;
  draft: string;
  created_at: string;
  itens: [
    {
      product: {
        id: string;
        name: string;
        price: string;
        description: string;
        banner: string;
        category_id: string;
      };
      amount: string;
    }
  ];
};

interface BaseProps {
  pedido: PedidoProps[];
}
export default function Pedidos({ pedido }: BaseProps) {
  const [pedidos, setPedido] = useState<PedidoProps[]>(pedido);
  const [abrir, setAbrir] = useState(false);
  const [pedidoClicado, setPedidoClicado] = useState<PedidoProps | any>(
    pedido[0]
  );
  function selectItemPedidos(item: PedidoProps) {
    setPedidoClicado(item);
  }

  return (
    <>
      <Head>
        <title>Pedidos Pimenta-Malagueta</title>
      </Head>

      <Header />
      <div className={styles.containerHeader}>
        <h1>Ultimos Pedidos</h1>
        <button>
          <FiRefreshCcw size={25} color={"#3fffa3"} />
        </button>
      </div>
      <main className={styles.container}>
        <div className={styles.item1}>
          {pedidos &&
            pedido.map((item: PedidoProps) => (
              <article className={styles.listOrder} key={item.id}>
                <section className={styles.orderItem} key={item.id}>
                  <button onClick={() => selectItemPedidos(item)}>
                    <div className={styles.tag}></div>
                    <span>Mesa {item.table}</span>
                  </button>
                </section>
              </article>
            ))}
        </div>
        <div className={styles.item2}>
          <h1>Mesa {pedidoClicado.table}</h1>
          {pedidoClicado?.itens.map((item: any) => (
            <div className={styles.listOrdem}>
              <div className={styles.orderItemProd}>
                <span>Produto: {item.product.name}</span>
                <span>Valor: {item.product.price}</span>
                <span>Descrição: {item.product.description}</span>
                <span> quantidade: {item.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiCliete = setupAPICliet(ctx);
  const response = await apiCliete.get<PedidoProps[]>("order/listall");
  console.log(response.data);
  return {
    props: {
      pedido: response.data,
    },
  };
});
