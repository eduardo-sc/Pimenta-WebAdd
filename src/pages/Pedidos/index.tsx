import Head from "next/head";
import { Header } from "../../componets/Header";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import { FiRefreshCcw } from "react-icons/fi";
import styles from "./styles.module.scss";
import { setupAPICliet } from "../../services/api";
import { useState } from "react";
import { api } from "../../services/apiClient";

import { toast } from "react-toastify";

export type PedidoProps = {
  id: string;
  table: string;
  item: [
    {
      id: string;
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
  const [pedidos, setPedido] = useState<PedidoProps[] | []>(pedido || []);
  const [pedidoClicado, setPedidoClicado] = useState<PedidoProps>(pedido[0]);
  const [loading, SetLoading] = useState(false);

  function selectItemPedidos(item: PedidoProps, index: number) {
    setPedidoClicado(item);
  }
  async function selectItemEnviar(item: PedidoProps) {
    //fazendo a base do produto ja finalizado

    let enviarItem = {
      order_id: pedidoClicado?.id,
      item_id: item,
    };

    await api
      .put<PedidoProps[]>("order/finish", enviarItem)
      .then((response) => {
        SetLoading(true);
        setPedido([]);
        setPedido(response.data);
        setPedidoClicado(response.data[0]);

        toast.success("Finalizado Com Sucesso!");
        SetLoading(false);
      })
      .catch((erro) => {
        toast.error("Erro ao Finalizar Item do Pedido!");
        console.log(erro);
        SetLoading(false);
      });
  }
  async function atualizar() {
    SetLoading(true);
    await api
      .get("order/listall")
      .then((response) => {
        setPedido([]);
        setPedido(response.data);
        setPedidoClicado(response.data[0]);
        SetLoading(false);
      })
      .catch((erro) => {
        console.log(erro);
        SetLoading(false);
      });
  }
  return (
    <>
      <Head>
        <title>Pedidos Pimenta-Malagueta</title>
      </Head>

      <Header />
      <link rel="stylesheet" type="text/css" href="" />
      <div className={styles.containerHeader}>
        <h1>Ultimos Pedidos</h1>
        <button
          onClick={atualizar}
          className={styles.buttonAtualizar}
          disabled={loading}
        >
          <FiRefreshCcw size={25} color={"#3fffa3"} />
        </button>
      </div>
      <main className={styles.container}>
        <div className={styles.item1}>
          {pedidos &&
            pedidos.map((item: PedidoProps, index) => (
              <article className={styles.listOrder} key={item.id}>
                <section className={styles.orderItem} key={item.id}>
                  <button onClick={() => selectItemPedidos(item, index)}>
                    <div className={styles.tag}></div>
                    <span>Mesa {item.table}</span>
                  </button>
                </section>
              </article>
            ))}
        </div>
        <div className={styles.item2}>
          <h1>Mesa {pedidoClicado?.table}</h1>
          {pedidoClicado &&
            pedidoClicado?.item.map((item: any) => (
              <article className={styles.listOrdem} key={item.id}>
                <section className={styles.orderItemProd} key={item.id}>
                  <span>Produto: {item.product.name}</span>
                  <span>Descrição: {item.product.description}</span>
                  <span> quantidade: {item.amount}</span>
                  <span>R$: {item.product.price}</span>
                  <div className={styles.optionButton}>
                    <button
                      className={""}
                      onClick={() => selectItemEnviar(item.id)}
                    >
                      <a>Enviar</a>
                    </button>
                  </div>
                </section>
              </article>
            ))}
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiCliete = setupAPICliet(ctx);
  const response = await apiCliete.get("order/listall");
  console.log(response.data);
  return {
    props: {
      pedido: response.data,
    },
  };
});
