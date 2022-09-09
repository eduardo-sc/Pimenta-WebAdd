import Head from "next/head";
import ReactModal from "react-modal";
import { useState } from "react";
import { FiX } from "react-icons/fi";
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
  categry_id: string;
};
export default function ModalDescriptionProduct({
  isOpen,
  closeModal,
  data,
}: any) {
  const [item, setItem] = useState<ItensProdProps>(data);
  const customStyles = {
    content: {
      top: "50%",
      bottom: "auto",
      left: "50%",
      right: "auto",
      padding: "30px",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1d1d2e",
    },
  };
  function fecharModal() {
    closeModal();
  }
  return (
    <ReactModal isOpen={isOpen} style={customStyles}>
      <div className={styles.AreaButtonFechar}>
        <h2>Detalhes do Produto</h2>
        <button
          type="button"
          onClick={fecharModal}
          className="react-modal-close"
          style={{ background: "transparent", border: 0 }}
        >
          <FiX size={45} color="#f34748" />
        </button>
      </div>
      <div className={styles.container}>
        <span>Nome:</span>
        <div className={styles.containerItem}>
          <span>{item.name}</span>
          <span className={styles.valor}>R$ {item.price}</span>
        </div>
        <div className={styles.containerDescricao}>
          <span>Descrição </span>
          <span className={styles.descricao}>{item.description}</span>
        </div>
      </div>
    </ReactModal>
  );
}
