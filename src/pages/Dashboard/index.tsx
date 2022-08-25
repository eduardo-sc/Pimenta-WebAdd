import Head from "next/head";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import { Header } from "../../componets/Header";
export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Painel - Pimenta-Malagueta</title>
      </Head>
      <div>
        <Header />
        <h1>painel</h1>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
