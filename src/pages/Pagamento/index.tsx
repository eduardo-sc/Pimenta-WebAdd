import Head from "next/head";
import react, { useState } from "react";
import { Header } from "../../componets/Header";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import styles from "./styles.module.scss";
import { setupAPICliet } from "../../services/api";
type PropsPagamentos = {
  id: string;
  table: string;
  item: [
    {
      amount: number;
      product: {
        id: string;
        name: string;
        price: string;
      };
    }
  ];
};
interface BaseProps {
  pagamentos: PropsPagamentos[];
}
export default function Pagamento({ pagamentos }: BaseProps) {
  const [listaPagamentos, setListaPagamento] = useState<PropsPagamentos[] | []>(
    pagamentos || []
  );
  const [pagamentoClicado, setPagamentoClicado] = useState<PropsPagamentos>(
    pagamentos[0]
  );

  function selectPgamentolist(item: PropsPagamentos) {
    setPagamentoClicado(item);
    console.log(item);
  }
  return (
    <>
      <Head>
        <title>Caixa - Pimenta Malagueta</title>
      </Head>
      <Header />

      <main className={styles.container}>
        <div className={styles.containerMesas}>
          <h1>Mesas</h1>
          {listaPagamentos &&
            listaPagamentos.map((item: PropsPagamentos) => (
              <article className={styles.listOrder} key={item.id}>
                <section className={styles.orderItem} key={item.id}>
                  <button onClick={() => selectPgamentolist(item)}>
                    <div className={styles.tag}></div>
                    <span>Mesa {item.table}</span>
                  </button>
                </section>
              </article>
            ))}
        </div>

        <div className={styles.containerItens}>
          <div className={styles.itens}>
            <h1>pagamento</h1>
            <div className={styles.cabecalhoItens}>
              <span>Descrição</span>
              <span>quantidade</span>
              <span>valor Und</span>
              <span>Total</span>
            </div>

            {pagamentoClicado &&
              pagamentoClicado?.item.map((item: any) => (
                <article className={styles.orderProduc} key={item.id}>
                  <section className={styles.orderitemProps} key={item.id}>
                    <span>{item.product.name}</span>
                    <span>{item.amount}</span>
                    <span>{item.product.price}</span>
                    <span>Total</span>
                  </section>
                </article>
              ))}
          </div>
          <div className={styles.subTotal}>
            <h1>Total R$:1000.00</h1>
          </div>

          <div className={styles.divButton}>
            <button>finalizar venda</button>
            <button>finalizar venda</button>
            <button>finalizar venda</button>
          </div>
        </div>
      </main>
    </>
  );
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPICliet(ctx);
  const response = await apiClient.get("report/payment");
  console.log(response.data);
  return {
    props: {
      pagamentos: response.data,
    },
  };
});
