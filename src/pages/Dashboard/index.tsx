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
  dateInt: number;
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
export default function Dashboard() {
 
  const [valorTotalPedidoNaoPagos, setValorTotalPedidoNaoPagos] = useState("0");
  const [data, setData] = useState<arry[]>();
  const [valorTotalPedidoPagos, setValorTotalPedidoPagos] = useState("0");
  
  useEffect(() => {
    async function getPagamentos() {
      api.get<VendasProps[]>("/repor/sales").then((response) => {
        let MesAdd: arry[] = [];
        response.data.map((element) => {
          var dateNomeMes = moment(element.created_at, "YYYY-MM-DD")
            .locale("pt-br")
            .format("MMM");

          var dateMesInte = moment(element.created_at, "YYYY-MM-DD").add(1, "month");
          
          let objetoMes: arry = {
            name: dateNomeMes,
            valor: element.total_sale,
            data: moment(`05/${dateMesInte.month()}/2022`, "YYYY-MM-DD").format(
              "YYYY-MM-DD"
            ),
            dateInt: dateMesInte.month(),
          };
          MesAdd.push(objetoMes);
        });

        //for
        
      

         

        let data = MesAdd.reduce((q: arry[], c) => {
          let name = c.name;

          let objetosRepedido = q.find((Element) => Element.name === name);
          if (objetosRepedido) {
            objetosRepedido.valor += c.valor;
          } else {
            q.push(c);
          }

          return q;
        }, []);
        

        let MesSeguencia = data.slice(0).sort((a, b) => {
          if (a.data >= b.data) return 1;
          if (a.data <= b.data) return -1;
          return 0;
        });

        
        setData(MesSeguencia);
      });
    }
    getPagamentos();
  }, []);
  useEffect(() => {
    
    async function pagos() {
       await api.get<VendasProps[]>("/repor/sales").then((response)=>{
        console.log(response.data)
        
    let total = 0;
    let valorItemTotal = 0;
    if (response.data.length) {
      let total=  response.data.reduce((q,r) => {
        return q+r.total_sale
        
      },0);
      setValorTotalPedidoPagos(total.toFixed(2).replace(".", ","));
    }

       });
      
    }
 
    
   pagos();
  }, []);
  // useEffect(() => {
  //   const response = await apiClient.get("report/payment");
  //   let total = 0;
  //   if (pagamentosPagos.length) {
  //     pagamentosPagos.forEach((pedidos) => {
  //       let valoritem =
  //         Number(pedidos.amount) *
  //         parseFloat(pedidos.price.toString().replace(",", "."));
  //       total += valoritem;
  //     });
  //     setValorTotalPedidoPagos(total.toFixed(2).replace(".", ","));
  //   }
  // });
  return (
    <>
      <Head>
        <title>Painel - Pimenta-Malagueta</title>
      </Head>
      <Header />
      <div className={styles.container}>
        <div className={styles.cantainerdespesas}>
          <div className={styles.pagas}>
            <span>Pagamentos</span>
            <div className={styles.valorImagemPagas}>
              <FiArrowUpCircle size={60} color={"#101026"} />
              <span>{valorTotalPedidoPagos}</span>
            </div>
          </div>
          <div className={styles.naoPagas}>
            <span>Nao Pagos</span>
            <div className={styles.valorImagemPagas}>
              <FiArrowDownCircle size={60} color={"#101026"} />
              <span>{valorTotalPedidoNaoPagos}</span>
            </div>
          </div>
        </div>
        <div className={styles.containerchain}>
          <div className={styles.grafico1}>
            <ResponsiveContainer width={"90%"} height={400}>
              <BarChart width={600} height={600} data={data} margin={{top:50,left:50,right:50,bottom:50}}>
                {/* <Cell stroke="#3fffa3" /> */}
                <XAxis dataKey="name" stroke="#3fffa3" />
                <Bar dataKey="valor" fill="#3fffa3"  style={{}}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.grafico2}>
            <ResponsiveContainer width={"90%"} height={400}>
              <LineChart width={600} height={500} data={data} margin={{top:50,left:50,right:50,bottom:50}}>
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
  
  return {
    props: {
      
    },
  };
});
