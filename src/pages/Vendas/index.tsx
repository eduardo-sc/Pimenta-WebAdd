import Head from "next/head";
import { Header } from "../../componets/Header";

import "moment/locale/pt-br";

import { setupAPICliet } from "../../services/api";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";

import Datetime from "react-datetime";
import moment from "moment";
import test from "node:test";
import { api } from "../../services/apiClient";
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
  const [vendasList, setVendasList] = useState<VendasProps[]>();
  const [vendasDate, setVendasDate] = useState<VendasProps[] | any>([]);
  const [dateInicial, setDateInicial] = useState(moment(new Date())); //yyyy-MM-dd
  const [dateFinal, setDateFinal] = useState(moment(new Date()));

  async function buscar() {
    await api
      .get<VendasProps[]>("/repor/sales")
      .then((response) => {
        setVendasList([]);
        setVendasList(response.data);

        let vendas = vendasList?.filter((item: VendasProps) => {
          return (
            String(moment(dateInicial).format("DD/MM/YYYY")) <=
              item.created_at &&
            String(moment(dateFinal).format("DD/MM/YYYY")) >= item.created_at
          );
        });
        setVendasDate(vendas);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }
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
            //value={dateInicial}
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
            //value={dateFinal}
            closeOnSelect
          />
          <button className={styles.buttonNovo} onClick={buscar}>
            Buscar
          </button>
        </div>
        {vendasDate &&
          vendasDate.map((iten: VendasProps) => (
            <article className={styles.listOrder}>
              <section className={styles.orderItem}>
                <div className={styles.tagNameDate}>
                  <span>Produto: {iten.name}</span>
                  <span> Data: {iten.created_at}</span>
                </div>

                <div className={styles.tagNameDate}>
                  <span>Valor: {iten.price}</span>
                  <span>Quantidade: {iten.amount}</span>
                </div>
                <div className={styles.tagNameDate1}>
                  <span></span>
                  <span>
                    total: {iten.total_sale.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </section>
            </article>
          ))}
      </div>
    </>
  );
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
