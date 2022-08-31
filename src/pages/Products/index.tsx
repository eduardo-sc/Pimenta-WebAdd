import Head from "next/head";
import { useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
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

  function abrirModal() {
    setModalVisible(true);
  }
  function fecharModal() {
    setModalVisible(false);
  }
  ReactModal.setAppElement("#__next");
  return (
    <>
      <button onClick={abrirModal}>novoProduto</button>

      <Head>
        <title>Pedidos Pimenta-Malagueta</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Ultimos Pedidos</h1>

            <button className={styles.buttonAtualizar}>
              <FiRefreshCcw size={25} color={"#3fffa3"} />
            </button>
            <button className={styles.buttonNovo} onClick={abrirModal}>
              Novo
            </button>
          </div>
          {productsItens &&
            productsItens.map((iten: ItensProdProps) => (
              <article className={styles.listOrder}>
                <section className={styles.orderItem}>
                  <button>
                    <div className={styles.tag}></div>
                    <span>{iten.name}</span>
                  </button>
                </section>
              </article>
            ))}
        </main>
      </div>

      {modalVisible && (
        <ModalProduct
          data={categories}
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
  const responseProducts = await apliClient.get("/category/products");

  return {
    props: {
      categoryList: response.data,
      products: responseProducts.data,
    },
  };
});
