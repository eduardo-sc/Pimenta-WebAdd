import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";

import { Header } from "../../componets/Header";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import { setupAPICliet } from "../../services/api";
import { FiEdit, FiRefreshCcw, FiTrash } from "react-icons/fi";

import CadastroUser from "../../componets/CadastroUser";
import { api } from "../../services/apiClient";
import ReactModal from "react-modal";
import ModalDetalheUsuario from "../../componets/ModalDetalheUsuario";
import nProgress from "nprogress";

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
interface PermissonListProps {
  user: UserProps[];
  permissionListData: PermissionProps[];
}
export default function Usuario({
  user,
  permissionListData,
}: PermissonListProps) {
  const [userProps, setUserProps] = useState<UserProps[]>(user);
  const [userlist, setUserList] = useState<UserProps[]>([]);
  const [abrir, setAbrir] = useState(false);
  const [itenClicado, setItemClicado] = useState<UserProps>();
  const [pesquisaText, setPesquisaText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [itemSelect, setItemSelect] = useState<UserProps>();

  function closeTela() {
    setAbrir(false);

    let data = {
      id: "",
      name: "",
      email: "",
      permission_id: "",
    };
    setItemClicado(data);
  }
  function abrirTela() {
    nProgress.start();

    let data = {
      id: "",
      name: "",
      email: "",
      permission_id: "",
    };
    setItemClicado(data);
    setAbrir(true);
    nProgress.done();

  }
  async function buscarUsuario() {
    nProgress.start();

    setUserList([]);
    const { data } = await api.get("user/list");
    setUserList(data);
    setPesquisaText("");
    nProgress.done();

  }
  async function ExcluirUsuario(id: string) {}
  function alterarCadastro(item: UserProps) {
    setItemClicado(item);
    setAbrir(true);
  }
  useEffect(() => {
    setUserList(userProps);
  }, [userProps]);
  function atualizarlistaUsuario(item: UserProps[]) {
    setUserList(item);
    setUserProps(item);
  }
  function AbrirModalDetalhes(item: UserProps) {
    setModalVisible(true);
    setItemSelect(item);
  }
  useEffect(() => {
    function pesquisaProduto() {
      if (pesquisaText) {
        let itensPesquisados = userProps.filter((item: UserProps) => {
          return item.name.toLowerCase().match(pesquisaText.toLowerCase());
        });

        setUserList(itensPesquisados);
      }
      if (!pesquisaText) {
        setUserList(userProps);
      }
    }
    pesquisaProduto();
  }, [pesquisaText]);

  ReactModal.setAppElement("#__next");
  return (
    <>
      <Head>
        <title>Cadastro de Usuarios - Pimemta Malagueta</title>
      </Head>
      <div>
        <Header />
      </div>
      {abrir ? (
        <CadastroUser
          permissionList={permissionListData}
          close={closeTela}
          dataItemEdit={itenClicado}
          data={userlist}
          atualizarListaUser={atualizarlistaUsuario}
        />
      ) : (
        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1> Usuarios</h1>

            <button className={styles.buttonAtualizar} onClick={buscarUsuario}>
              <FiRefreshCcw size={25} color={"#3fffa3"} />
            </button>
          </div>
          <div className={styles.containerButton}>
            <input
              type={"text"}
              value={pesquisaText}
              placeholder={"Pesquisar"}
              onChange={(e) => setPesquisaText(e.target.value)}
            />
            <button className={styles.buttonNovo} onClick={abrirTela}>
              Novo
            </button>
          </div>
          {userlist.map((item: UserProps) => (
            <article className={styles.listOrder} key={item.id}>
              <section className={styles.orderItem} key={item.id}>
                <button onClick={() => AbrirModalDetalhes(item)}>
                  <div className={styles.tag}></div>
                  <span>{item.name}</span>
                </button>
                <div className={styles.optionButton}>
                  <button className={""} onClick={() => alterarCadastro(item)}>
                    <FiEdit size={25} color={"#fff"} />
                  </button>
                  {/* <button
                    className={""}
                    onClick={() => ExcluirUsuario(item.id)}
                  >
                    <FiTrash size={25} color={"#ff3f4b"} />
                  </button> */}
                </div>
              </section>
            </article>
          ))}
        </main>
      )}
      {modalVisible && (
        <ModalDetalheUsuario
          isOpen={modalVisible}
          closeModal={() => setModalVisible(false)}
          userData={itemSelect}
          permissionListData={permissionListData}
        />
      )}
    </>
  );
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apliClient = setupAPICliet(ctx);

  const respostaUser = await apliClient.get<UserProps[]>("user/list");
  const response = await apliClient.get<PermissionProps[]>("/permission/list");
  console.log(respostaUser.data);
  return {
    props: {
      user: respostaUser.data,
      permissionListData: response.data,
    },
  };
});
