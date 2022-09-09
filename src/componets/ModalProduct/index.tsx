import Head from "next/head";
import { Header } from "../Header";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import { FiUpload } from "react-icons/fi";
import styles from "./styles.module.scss";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { setupAPICliet } from "../../services/api";

import { toast } from "react-toastify";
import Modal from "react-modal";
import { api } from "../../services/apiClient";
type ItensProps = {
  id: string;
  name: string;
};
interface CategoryListProps {
  CategoryProps: ItensProps[];
}
export default function ModalProduct({
  category,
  data,
  isOpen,
  closeModal,
  dataItemEdit,
  returnData,
}: CategoryListProps | any) {
  const customStyles = {
    content: {
      top: "50%",
      bottom: "auto",
      left: "50%",
      right: "auto",
      padding: "15px",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1d1d2e",
      width: "70%",
    },
  };
  const [itensAtualizado, setItensAtualizado] = useState<ItensProps[]>(
    [] || data
  );
  const [name, setname] = useState("" || dataItemEdit.name);
  const [price, setPrice] = useState("" || dataItemEdit.price);
  const [description, setdescription] = useState(
    "" || dataItemEdit.description
  );
  const [imageUrl, setImageUrl] = useState("");
  const [imgCarregada, setimgCarregada] = useState<File | null>(null);
  const [categories, setCategories] = useState(category || []);
  const [categorySelected, setCategorySelected] = useState(0);
  const [itensProducts, setItensProducts] = useState(data || []);

  useEffect(() => {
    if (dataItemEdit) {
      let index = category.findIndex((itens: ItensProps) => {
        //pegando index da categoria para fixa na tela de edit
        return itens.id === dataItemEdit.category_id;
      });

      setCategorySelected(index);
    }
  }, []);
  function carregarImage(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }
    const image = event.target.files[0];
    if (!image) {
      return;
    }
    if (image.type === "image/png" || image.type === "image/jpeg") {
      setimgCarregada(image);
      setImageUrl(URL.createObjectURL(event.target.files[0]));
    }
  }
  function pegarCategoryselected(event: any) {
    setCategorySelected(event.target.value);
  }
  async function registerProduct(event: FormEvent) {
    event.preventDefault();
    if (dataItemEdit) {
      let itemExiste = data.filter((item: any) => {
        return item.id === dataItemEdit.id;
      });
      if (itemExiste.length) {
        const data = new FormData();
        //
        data.append("product_id", dataItemEdit.id);
        data.append("name", name);
        data.append("price", price);
        data.append("description", description);
        data.append("category_id", categories[categorySelected].id);
        data.append("file", imgCarregada);

        try {
          let response = await api.put("/product/update", data);
          let respostaAtualizada = itensProducts.filter((item: ItensProps) => {
            return item.id !== dataItemEdit.id;
          });

          let data2 = {
            id: response.data.id,
            name: response.data.name,
            price: response.data.price,
            description: response.data.description,
            category_id: categories[categorySelected].id,
            banner: response.data.banner,
          };
          respostaAtualizada.unshift(data2);
          returnData(respostaAtualizada);
          closeModal();
        } catch (error) {
          console.log("erro : " + error);
        }
      }
      return;
    }

    try {
      console.log("entrou aqui");
      if (
        name === "" ||
        price === "" ||
        description === "" ||
        imgCarregada === null
      ) {
        toast.warning("Campos do Formulario esta vasio");
        return;
      }
      const data = new FormData();
      data.append("name", name);
      data.append("price", price);
      data.append("description", description);
      data.append("category_id", categories[categorySelected].id);
      data.append("file", imgCarregada);

      const api = setupAPICliet("");
      let response = await api.post("/product", data);
      let data2 = {
        id: response.data.id,
        name: response.data.name,
        price: response.data.price,
        description: response.data.description,
        category_id: categories[categorySelected].id,
        banner: response.data.banner,
      };

      let respostaAtualizada = itensProducts;
      respostaAtualizada.unshift(data2);
      returnData(respostaAtualizada);
      toast.success("Gravado com Sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar produto");
      console.log(error);
    }
    setname("");
    setPrice("");
    setdescription("");
    setImageUrl("");
    setimgCarregada(null);
    fecharModal();
  }
  function fecharModal() {
    setname(" ");
    setPrice("");
    setdescription("");
    setImageUrl("");
    setimgCarregada(null);

    closeModal();
  }
  return (
    <>
      <Head>
        <title>Novo Produtos Pimenta-Malagueta</title>
      </Head>

      <div>
        <Modal isOpen={isOpen} style={customStyles}>
          <main className={styles.container}>
            <h1>Novo Produto</h1>
            <form className={styles.form} onSubmit={registerProduct}>
              <label className={styles.label}>
                <span>
                  <FiUpload size={25} color={"#fff"} />
                </span>
                {imageUrl && (
                  <img
                    className={styles.preview}
                    width={250}
                    height={250}
                    src={imageUrl}
                    alt="foto selecionada"
                  />
                )}
                <input
                  type={"file"}
                  accept={"image/pnd , image/jpeg"}
                  onChange={carregarImage}
                />
              </label>
              <select value={categorySelected} onChange={pegarCategoryselected}>
                {categories.map((item: ItensProps, index: any) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <input
                type="text"
                placeholder="Digite nome do Produto"
                className={styles.input}
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
              <input
                type="text"
                placeholder="Valor do Produto"
                className={styles.input}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <textarea
                placeholder="Descreva seu Produto"
                className={styles.input}
                value={description}
                onChange={(e) => setdescription(e.target.value)}
              />
              <button className={styles.buttonAdd} type={"submit"}>
                cadastrar
              </button>
              <button
                className={styles.buttonClose}
                type={"button"}
                onClick={fecharModal}
              >
                Fechar
              </button>
            </form>
          </main>
        </Modal>
      </div>
    </>
  );
}
