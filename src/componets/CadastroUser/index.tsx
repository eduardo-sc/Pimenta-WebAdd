import { FormEvent, useState, useContext, useEffect } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

import { toast } from "react-toastify";

import { api } from "../../services/apiClient";

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
  permissionList: PermissionProps[];
  dataItemEdit: UserProps | any;
  atualizarListaUser: (user: UserProps[]) => void;
  data: UserProps[];
  close: () => void;
}
export default function CadastroUser({
  close,
  permissionList,
  dataItemEdit,
  data,
  atualizarListaUser,
}: PermissonListProps) {
  const [dataUser, setdataUser] = useState<UserProps[]>(data);
  const [listPermisson, setListPermisson] =
    useState<PermissionProps[]>(permissionList);
  const [name, setName] = useState(dataItemEdit.name ? dataItemEdit.name : "");
  const [email, setEmail] = useState(
    dataItemEdit.email ? dataItemEdit.email : ""
  );
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectPermissonIndex, setSelectPermissonIndex] = useState(0);

  async function registerUser() {
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      selectPermissonIndex === null
    ) {
      toast.warning("Preenche os campos");
      return;
    }
    setLoading(true);

    await api
      .post("/users", {
        name,
        email,
        password,
        permission_id: listPermisson[selectPermissonIndex].id,
      })

      .then((res) => {
        console.log(res.data);
        let dataResponse = {
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          permission_id: res.data.permission.id,
        };
        console.log(dataResponse);
        let respostaAtualizada = dataUser;
        respostaAtualizada.unshift(dataResponse);
        atualizarListaUser(respostaAtualizada);
        setLoading(false);
        close();
        toast.success("Cadastrado com sucesso!");
        setEmail("");
        setName("");
        setPassword("");
        setSelectPermissonIndex(0);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
        setLoading(false);
      });
  }
  function pegarPermissionselected(event: any) {
    setSelectPermissonIndex(event.target.value);
  }
  async function atualizarCadastroUser() {
    if (name === "" || selectPermissonIndex === null) {
      toast.warning("Preenche os campos");
      return;
    }
    setLoading(true);
    let data2 = {
      user_id: dataItemEdit.id,
      name: name,
      permission_id: listPermisson[selectPermissonIndex].id,
    };

    await api
      .put("/user/update", data2)
      .then((res) => {
        toast.success("Atualizado");

        let respostaAtualizada = data.filter((item: UserProps) => {
          return item.id !== dataItemEdit.id;
        });
        let responseData = {
          id: dataItemEdit.id,
          name: res.data.name,
          email: res.data.email,
          permission_id: res.data.permission.id,
        };

        respostaAtualizada.unshift(responseData);
        atualizarListaUser(respostaAtualizada);

        setLoading(false);
        close();
      })

      .catch((err) => {
        setLoading(false);
        alert(err);
      });

    setEmail("");
    setName("");

    setPassword("");
    setSelectPermissonIndex(0);
  }
  useEffect(() => {
    console.log(dataItemEdit.permission_id);
    if (dataItemEdit.permission_id) {
      let index = listPermisson.findIndex((item: PermissionProps) => {
        return item.id === dataItemEdit.permission_id;
      });
      console.log(index);
      setSelectPermissonIndex(index);
    }
  }, []);
  return (
    <>
      <Head>
        <title>Cadastro de Usuarios - Pimemta Malagueta</title>
      </Head>

      <div className={styles.contarneCenter}>
        <div className={styles.login}>
          <h1>Usuarios</h1>
          <div className={styles.divEdits}>
            <Input
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {dataItemEdit.id ? (
              <></>
            ) : (
              <Input
                placeholder="Digite seu email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}

            <select
              value={selectPermissonIndex}
              onChange={pegarPermissionselected}
            >
              {listPermisson &&
                listPermisson.map((item: PermissionProps, index: any) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.description}
                    </option>
                  );
                })}
            </select>

            {dataItemEdit.id ? (
              <></>
            ) : (
              <Input
                placeholder="Digite sua senha"
                type={"password"}
                autoComplete={"off"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            {dataItemEdit.id ? (
              <Button onClick={atualizarCadastroUser} loading={loading}>
                atualizar
              </Button>
            ) : (
              <Button onClick={registerUser} loading={loading}>
                Cadastrar
              </Button>
            )}
            <Button onClick={close}>Voltar</Button>
          </div>
        </div>
      </div>
    </>
  );
}
