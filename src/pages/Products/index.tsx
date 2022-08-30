import { useState } from "react";
import ReactModal from "react-modal";
import { Header } from "../../componets/Header";
import ModalProduct from "../../componets/ModalProduct";
import { setupAPICliet } from "../../services/api";
import { canSSRAuth } from "../../Utils/canSSRAuth";

type ItensProps = {
  id: string;
  name: string;
};
interface CategoryListProps {
  CategoryProps: ItensProps[];
}
export default function Products({ categoryList }: CategoryListProps | any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState(categoryList || []);
  function abrirModal() {
    setModalVisible(true);
  }
  function fecharModal() {
    setModalVisible(false);
  }
  ReactModal.setAppElement("#__next");
  return (
    <>
      <Header />
      <button onClick={abrirModal}>novoProduto</button>
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

  return {
    props: {
      categoryList: response.data,
    },
  };
});
