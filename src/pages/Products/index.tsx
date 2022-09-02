import Head from "next/head";
import { useState } from "react";
import { FiRefreshCcw, FiEdit, FiCheck } from "react-icons/fi";
import ReactModal from "react-modal";
import { Header } from "../../componets/Header";
import ModalProduct from "../../componets/ModalProduct";
import { setupAPICliet } from "../../services/api";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import styles from "./styles.module.scss";

type ItensProps = {
  id: string;
  name: string;
};
interface CategoryListProps {
  CategoryProps: ItensProps[];
  Produtos: ItensProdProps[];
}
type ItensProdProps = {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string;
};
export default function Products({
  categoryList,
  products,
}: CategoryListProps | any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState(categoryList || []);
  const [productsItens, setProductsItens] = useState(products || []);
  const [itenClicado, setItemClicado] = useState("");

  function abrirModal() {
    setItemClicado("");
    setModalVisible(true);
  }
  function fecharModal() {
    setModalVisible(false);
  }
  function pegarInformacaoDoProduto(id: string) {
    if (productsItens) {
      let item = productsItens.filter((item: ItensProdProps) => {
        return item.id === id;
      });
      console.log(item[0]);
      setItemClicado(item[0]);
      setModalVisible(true);
    }
  }
  ReactModal.setAppElement("#__next");
  return (
    <>
      <Head>
        <title>Produtos Pimenta-Malagueta</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Produtos</h1>

            <button className={styles.buttonAtualizar}>
              <FiRefreshCcw size={25} color={"#3fffa3"} />
            </button>
          </div>
          <div className={styles.containerButton}>
            <button className={styles.buttonNovo} onClick={abrirModal}>
              Novo
            </button>
          </div>
          {productsItens &&
            productsItens.map((iten: ItensProdProps) => (
              <article className={styles.listOrder}>
                <section className={styles.orderItem} key={iten.id}>
                  <button>
                    <div className={styles.tag}></div>
                    <span>{iten.name}</span>
                  </button>
                  <div className={styles.optionButton}>
                    <button
                      className={""}
                      onClick={() => pegarInformacaoDoProduto(iten.id)}
                    >
                      <FiEdit size={25} color={"#fff"} />
                    </button>
                    <button className={""}>
                      <FiCheck size={25} color={"#3fffa3"} />
                    </button>
                  </div>
                </section>
              </article>
            ))}
        </main>
      </div>

      {modalVisible && (
        <ModalProduct
          data={categories}
          dataItemEdit={itenClicado}
          isOpen={modalVisible}
          closeModal={fecharModal}
        />
      )}
    </>
  );
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apliClient = setupAPICliet(ctx);

  const response = await apliClient.get("/categorys/list");
  const responseProducts = await apliClient.get("/product/list");

  return {
    props: {
      categoryList: response.data,
      products: responseProducts.data,
    },
  };
});
