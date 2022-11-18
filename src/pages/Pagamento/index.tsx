import Head from "next/head";
import react, { useEffect, useState } from "react";
import { Header } from "../../componets/Header";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import styles from "./styles.module.scss";
import { setupAPICliet } from "../../services/api";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
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
  const [valorTotalPedido, setValorTotalPedido] = useState("0");

  function selectPgamentolist(item: PropsPagamentos) {
    setPagamentoClicado(item);
  }
  useEffect(() => {
    let total = 0;
    if (listaPagamentos) {
      pagamentoClicado?.item.forEach((item) => {
        let valor =
          Number(item.amount) *
          parseFloat(item.product.price.toString().replace(",", "."));
        total += valor;
        setValorTotalPedido(total.toFixed(2).replace(".", ","));
      });
    }
  }, [pagamentoClicado]);
  function somarValorItem(qtd: number, valor: string) {
    let total = qtd * parseFloat(valor.toString().replace(",", "."));
    return total.toFixed(2).replace(".", ",");
  }
  async function pagarMesa() {
    await api
      .put("/report", { order_id: pagamentoClicado?.id })
      .then((response) => {
        setListaPagamento(response.data);
        setPagamentoClicado(response.data[0]);
        toast.success("Pagamento Finalizado com Sucesso!");
      })
      .catch((erro) => {
        toast.error("Erro Finalizado Pagamento");
        console.log(erro);
      });
  }
  return (
    <>
      <Head>
        <title>Caixa - Pimenta Malagueta</title>
      </Head>
      <Header />

      <main className={styles.container}>
        <div className={styles.containerMesas}>
          {/* <h1>Mesas</h1> */}
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
            <div className={styles.cabecalhoItens}>
              <span>Descrição</span>
              <span>Quantidade</span>
              <span>Valor Und</span>
              <span>Total</span>
            </div>

            {pagamentoClicado &&
              pagamentoClicado?.item.map((item: any) => (
                <article className={styles.orderProduc} key={item.id}>
                  <section className={styles.orderitemProps} key={item.id}>
                    <span>{item.product.name}</span>
                    <span>{item.amount}</span>
                    <span>
                      R${" "}
                      {parseFloat(item.product.price)
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                    <span>
                      R$ {somarValorItem(item.amount, item.product.price)}
                    </span>
                  </section>
                </article>
              ))}
          </div>
          <div className={styles.subTotal}>
            <h1>Total R$: {valorTotalPedido}</h1>
          </div>

          <div className={styles.divButton}>
            <button className={styles.btnpagamento} onClick={pagarMesa}>
              Finalizar Venda
            </button>
            <button className={styles.btncancelamento}>Cancelar Venda</button>
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
