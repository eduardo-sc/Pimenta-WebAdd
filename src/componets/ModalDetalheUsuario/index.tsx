import Head from "next/head";
import ReactModal from "react-modal";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
type UserProps = {
  id: string;
  name: string;
  email: string;
  permission_id: string;
};
type PermissionProps = {
  id: string;
  description: string;
};
interface BaseProps {
  userData: UserProps | any;
  permissionListData: PermissionProps[];
  closeModal: () => void;
  isOpen?: Boolean | any;
}
export default function ModalDetalheUsuario({
  isOpen,
  closeModal,
  userData,
  permissionListData,
}: BaseProps) {
  const [itemUser, setItemUser] = useState<UserProps>(userData);
  const [visible, setVisible] = useState<boolean>(isOpen);
  const [permisson, setPermission] = useState<PermissionProps>();
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
  useEffect(() => {
    let permissao = permissionListData.filter((item: PermissionProps) => {
      return item.id === itemUser.permission_id;
    });
    setPermission(permissao[0]);
  }, []);
  return (
    <ReactModal isOpen={true} style={customStyles}>
      <div className={styles.AreaButtonFechar}>
        <h2>Detalhes do Usuário</h2>
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
        <div className={styles.containerItem}>
          <span>Nome :</span>
          <span>{itemUser.name}</span>
          <span>Email :</span>
          <span className={styles.email}> {itemUser.email}</span>
          <span>permissão : </span>
          <span className={styles.permisson}> {permisson?.description}</span>
        </div>
      </div>
    </ReactModal>
  );
}
