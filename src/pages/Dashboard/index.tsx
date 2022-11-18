import Head from "next/head";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import { Header } from "../../componets/Header";
import styles from "./styles.module.scss";
import React, { useEffect, useState } from "react";
import { FiArrowUpCircle, FiArrowDownCircle } from "react-icons/fi";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  Line,
  LineChart,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "moment/locale/pt-br";

import { api } from "../../services/apiClient";
import { setupAPICliet } from "../../services/api";
import moment from "moment";
type VendasProps = {
  id: string;
  name: string;
  price: string;
  amount: string;
  created_at: string;
  total_sale: number;
};
type arry = {
  name: string;
  valor: number;
  data: string;
};
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
  pagamentosNaoPagos: PropsPagamentos[];
  pagamentosPagos: VendasProps[];
}
export default function Dashboard({
  pagamentosNaoPagos,
  pagamentosPagos,
}: BaseProps) {
  const [listaPagamentos, setListaPagamento] = useState<PropsPagamentos[] | []>(
    pagamentosNaoPagos
  );
  const [valorTotalPedido, setValorTotalPedido] = useState("0");
  const [data, setData] = useState<arry[]>();
  const [valorTotalPedidoPagos, setValorTotalPedidoPagos] = useState("0");
  const mileStatics = [
    {
      name: "jan",
      mileStats: 0,
    },
    {
      name: "fev",
      mileStats: 5000,
    },
    {
      name: "mar",
      mileStats: 7000,
    },
    {
      name: "Abr",
      mileStats: "5780.07",
    },
    {
      name: "maio",
      mileStats: "1290.50",
    },
    {
      name: "jun",
      mileStats: "600",
    },
    {
      name: "jul",
      mileStats: 5490,
    },
    {
      name: "Ago",
      mileStats: 5490,
    },
    {
      name: "Set",
      mileStats: 5490,
    },
    {
      name: "Out",
      mileStats: 5490,
    },
    {
      name: "Nov",
      mileStats: 5490,
    },
    {
      name: "Dez",
      mileStats: 5490,
    },
  ];
  useEffect(() => {
    async function getPagamentos() {
      api.get<VendasProps[]>("/repor/sales").then((response) => {
        let teste: arry[] = [];
        response.data.map((element) => {
          var date = moment(element.created_at, "DD/MM/YYYY")
            .locale("pt-br")
            .format("MMM");
          var date2 = moment(element.created_at, "DD/MM/YYYY").add(1, "month");
          console.log(date2.month());
          let teste1: arry = {
            name: date,
            valor: element.total_sale,
            data: moment(`05/${date2.month()}/2022`, "DD/MM/YYYY").format(
              "DD/MM/YYYY"
            ),
          };
          teste.push(teste1);
        });

        let data = teste.reduce((q: arry[], c) => {
          let name = c.name;

          let repedido = q.find((Element) => Element.name === name);
          if (repedido) {
            repedido.valor += c.valor;
          } else {
            q.push(c);
          }

          return q;
        }, []);
        let teste2 = data.slice(0).sort((a, b) => {
          if (a.data >= b.data) return 1;
          if (a.data <= b.data) return -1;
          return 0;
        });

        setData(teste2);
      });
    }
    getPagamentos();
  }, []);
  useEffect(() => {
    let total = 0;
    let valorItemTotal = 0;
    if (listaPagamentos) {
      pagamentosNaoPagos.forEach((pedido) => {
        pedido.item.forEach((item) => {
          var valorItem =
            Number(item.amount) *
            parseFloat(item.product.price.toString().replace(",", "."));
          valorItemTotal += valorItem;
        });
        total += valorItemTotal;
      });
      setValorTotalPedido(total.toFixed(2).replace(".", ","));
    }
  }, []);
  useEffect(() => {
    let total = 0;
    if (pagamentosPagos.length) {
      pagamentosPagos.forEach((pedidos) => {
        let valoritem =
          Number(pedidos.amount) *
          parseFloat(pedidos.price.toString().replace(",", "."));
        total += valoritem;
      });
      setValorTotalPedidoPagos(total.toFixed(2).replace(".", ","));
    }
  });
  return (
    <>
      <Head>
        <title>Painel - Pimenta-Malagueta</title>
      </Head>
      <Header />
      <div className={styles.container}>
        <div className={styles.cantainerdespesas}>
          <div className={styles.pagas}>
            <span>Pagamentos do Dia</span>
            <div className={styles.valorImagemPagas}>
              <FiArrowUpCircle size={60} color={"#101026"} />
              <span>{valorTotalPedidoPagos}</span>
            </div>
          </div>
          <div className={styles.naoPagas}>
            <span>Nao Pagos</span>
            <div className={styles.valorImagemPagas}>
              <FiArrowDownCircle size={60} color={"#101026"} />
              <span>{valorTotalPedido}</span>
            </div>
          </div>
        </div>
        <div className={styles.containerchain}>
          <div className={styles.grafico1}>
            <ResponsiveContainer width={"90%"} height={400}>
              <BarChart width={600} height={600} data={data}>
                <Cell stroke="#3fffa3" />
                <XAxis dataKey="name" stroke="#3fffa3" />
                <Bar dataKey="valor" fill="#3fffa3" label />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.grafico2}>
            <ResponsiveContainer width={"90%"} height={400}>
              <LineChart width={600} height={500} data={data}>
                <XAxis dataKey="name" stroke="#8884d8" />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPICliet(ctx);
  const response = await apiClient.get("report/payment");
  const response2 = await apiClient.get("/repor/sales");
  console.log(response2.data);
  return {
    props: {
      pagamentosNaoPagos: response.data,
      pagamentosPagos: response2.data,
    },
  };
});
