import Head from "next/head";
import react, { useEffect, useState } from "react";
import { Header } from "../../componets/Header";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import styles from "./styles.module.scss";
import { setupAPICliet } from "../../services/api";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { FiRefreshCcw } from "react-icons/fi";
import nProgress from "nprogress";
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
  const [loading, SetLoading] = useState(false);
  useEffect(() => {
    let total = 0;
    if (listaPagamentos) {
      pagamentoClicado?.item.forEach((item) => {
        let valor =
          Number(item.amount) *
          parseFloat(item.product.price);
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
    nProgress.start();
    await api
      .put("/report", { order_id: pagamentoClicado?.id })
      .then((response) => {
        setListaPagamento(response.data);
        setPagamentoClicado(response.data[0]);
        nProgress.done();
        toast.success("Pagamento Finalizado com Sucesso!");
      })
      .catch((erro: AxiosError) => {
        
        toast.error("Erro Finalizado Pagamento");
        console.log(erro.message);
        nProgress.done();
      });
  }
  useEffect(() => {
    let time = setTimeout(async () => {
      nProgress.start();
      await api.get("/report/payment").then((response) => {
        nProgress.done();
        setListaPagamento(response.data);
        nProgress.done();
      }).catch(erro=>{
        nProgress.done();
      });
    }, 10000);
    return () => {
      clearTimeout(time);
    };
  }, [listaPagamentos]);
async function cancelarPedido(){
  nProgress.start();
  await api.put('/repor/cancel',{ order_id: pagamentoClicado?.id }).then(response=>{
    console.log(response.data)
     setListaPagamento(response.data);
     setPagamentoClicado(response.data[0]);
     nProgress.done();
    toast.success("Pagamento cancelado com Sucesso!");
  }).catch((erro)=>{
    nProgress.done();
    toast.error("Erro Pagamento");
        console.log(erro.message);
  })
}
async function atualizar() {
  nProgress.start();
  SetLoading(true);
   await api.get("/report/payment").then((response) => {
    setListaPagamento([])
    setListaPagamento(response.data);
    SetLoading(false);
    nProgress.done();
  }).catch((erro) => {
      console.log(erro);
      SetLoading(false);
      nProgress.done();
    });
}
  return (
    <>
      <Head>
        <title>Caixa - Pimenta Malagueta</title>
      </Head>
      <Header />
      <div className={styles.containerHeader}>
        <h1>Caixa</h1>
        <button
          onClick={atualizar}
          className={styles.buttonAtualizar}
          disabled={loading}
        >
          <FiRefreshCcw size={25} color={"#3fffa3"} />
        </button>
      </div>
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
            <button className={styles.btncancelamento} onClick={cancelarPedido}>Cancelar Venda</button>
          </div>
        </div>
      </main>
    </>
  );
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPICliet(ctx);
  const response = await apiClient.get("report/payment");
  
  return {
    props: {
      pagamentos: response.data,
    },
  };
});
