import Head from "next/head";
import { Header } from "../../componets/Header";
import PagamentosPdf from "../../componets/PagamentosPdf";
import "moment/locale/pt-br";
import { FaRegFilePdf } from "react-icons/fa";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import nProgress from "nprogress";
import Datetime from "react-datetime";
import moment from "moment";
import test from "node:test";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";

type VendasProps = {
  id: string;
  name: string;
  price: string;
  amount: string;
  created_at: string;
  total_sale: number;
};
interface VendasListProps {
  vendas: VendasProps[];
}
export default function Vendas() {
  const [total, setTotal] = useState(0);
  const [vendasDate, setVendasDate] = useState<VendasProps[]>([]);
  const [dateInicial, setDateInicial] = useState(moment(new Date())); //yyyy-MM-dd
  const [dateFinal, setDateFinal] = useState(moment(new Date()));

  async function buscar() {
    if (
      moment(dateInicial, "DD/MM/YYYY").format("YYYY-MM-DD") >
      moment(dateFinal, "DD/MM/YYYY").format("YYYY-MM-DD")
    ) {
      toast.error("Data Inicial Maior que Data Final");
      setVendasDate([])
      return;
      
    }

    nProgress.start();
    await api
      .get<VendasProps[]>("/repor/sales")
      .then((response) => {
        setVendasDate([])
        let objeto: VendasProps[] = [];

        response.data.map((elementVendas) => {
          if (
            moment(elementVendas.created_at, "YYYY-MM-DD").format(
              "YYYY-MM-DD"
            ) >= moment(dateInicial, "DD/MM/YYYY").format("YYYY-MM-DD") &&
            moment(elementVendas.created_at, "YYYY-MM-DD").format(
              "YYYY-MM-DD"
            ) <= moment(dateFinal, "DD/MM/YYYY").format("YYYY-MM-DD")
          ) {
            let objet = {
              id: elementVendas.id,
              name: elementVendas.name,
              price: elementVendas.price,
              amount: elementVendas.amount,
              total_sale: Number(elementVendas.total_sale),
              created_at: moment(elementVendas.created_at, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              ),
            };

            objeto.push(objet);
            nProgress.done();
          }
        });
        if (!objeto.length) {
          toast.error("Lista Vazia");
          objeto = [];
          nProgress.done();

          return;
        }

        setVendasDate(objeto);
      })
      .catch((erro) => {
        nProgress.done();
      });
  }
  useEffect(() => {
    let totalPro = vendasDate.reduce((q, m) => {
      return (q += m.total_sale);
    }, 0);
    setTotal(totalPro);
  }, [vendasDate]);
  return (
    <>
      <Head>
        <title>Caixa - Pimenta Malagueta</title>
      </Head>
      <Header />
      <div className={styles.container}>
        <div className={styles.areaImput}>
          <Datetime
            className={styles.teste}
            timeFormat={false}
            dateFormat={"DD/MM/YYYY"}
            locale={"pt-br"}
            inputProps={{ placeholder: "Data Inicial" }}
            onChange={(e) => {
              setDateInicial(e);
            }}
            value={dateInicial}
            closeOnSelect
          />
          <Datetime
            className={styles.teste}
            timeFormat={false}
            dateFormat={"DD/MM/YYYY"}
            locale={"pt-br"}
            inputProps={{ placeholder: "Data Final" }}
            onChange={(e) => {
              setDateFinal(e);
            }}
            value={dateFinal}
            closeOnSelect
          />
          <button className={styles.buttonNovo} onClick={(e) => buscar()}>
            Buscar
          </button>
        </div>
        <div className={styles.scroll}>
          {vendasDate &&
            vendasDate.map((iten: VendasProps) => (
              <article className={styles.listOrder}>
                <section className={styles.orderItem}>
                  <div className={styles.tagNameDate}>
                    <span>Produto: {iten?.name}</span>
                    <span> Data: {iten?.created_at}</span>
                  </div>

                  <div className={styles.tagNameDate}>
                    <span>Valor: {iten?.price}</span>
                    <span>Quantidade: {iten?.amount}</span>
                  </div>
                  <div className={styles.tagNameDate1}>
                    <span></span>
                    <span>
                      Total: {iten?.total_sale.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </section>
              </article>
            ))}
        </div>
        <div className={styles.divTotal}>
        
          
            <button
            className={styles.buttonNovo}
            onClick={(e) => {
              
              PagamentosPdf({
                vendaslistDate: vendasDate,
                Periodo: {
                  DataInicial: moment(dateInicial, "DD/MM/YYYY").format(
                    "DD/MM/YYYY"
                  ),
                  DataFinal: moment(dateFinal, "DD/MM/YYYY").format(
                    "DD/MM/YYYY"
                  ),
                },
              });
            }}
          >
            <FaRegFilePdf color="#fff" size={25} />
            Gerar Pdf
          </button>
          
        
          
          <span>Total R$: {total.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>
    </>
  );
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
