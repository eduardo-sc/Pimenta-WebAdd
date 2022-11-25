import Head from "next/head";
import { Header } from "../Header";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import { FiUpload } from "react-icons/fi";
import styles from "./styles.module.scss";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { setupAPICliet } from "../../services/api";
import { Button } from "../../componets/ui/Button";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { api } from "../../services/apiClient";
type ItensProdProps = {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string;
  category_id: string;
};
interface CategoryListProps {
  CategoryProps: ItensProdProps[];
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
      right: "50%",
      padding: "10px",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1d1d2e",
      width: "69%",
    },
  };

  const [name, setname] = useState("" || dataItemEdit.name);
  const [price, setPrice] = useState("" || dataItemEdit.price);
  const [description, setdescription] = useState(
    "" || dataItemEdit.description
  );

  const [imageUrl, setImageUrl] = useState(
    dataItemEdit.banner
      ? `http://localhost:3333/files/${dataItemEdit.banner}`
      : ""
  );
  const [imgCarregada, setimgCarregada] = useState<File | null>(null);
  const [categories, setCategories] = useState(category || []);
  const [categorySelected, setCategorySelected] = useState(0);
  const [itensProducts, setItensProducts] = useState<ItensProdProps[]>(data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(itensProducts);
    if (dataItemEdit) {
      let index = category.findIndex((itens: ItensProdProps) => {
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

        data.append("product_id", dataItemEdit.id);
        data.append("name", name);
        data.append("price", price);
        data.append("description", description);
        data.append("category_id", categories[categorySelected].id);
        data.append("file", imgCarregada);

        try {
          //update
          let response = await api.put("/product/update", data);
          let respostaAtualizada = itensProducts.filter(
            (item: ItensProdProps) => {
              return item.id !== dataItemEdit.id;
            }
          );
          setLoading(true);

          let data2 = {
            id: response.data.id as string,
            name: response.data.name as string,
            price: response.data.price as string,
            description: response.data.description as string,
            category_id: categories[categorySelected].id as string,
            banner: response.data.banner as string,
          };

          respostaAtualizada.unshift(data2);
          returnData(respostaAtualizada);
          respostaAtualizada = [];
          setItensProducts([]);

          closeModal();
        } catch (error) {
          console.log("erro : " + error);
        }
      }
      return;
    }

    try {
      //cadastrar produtos
      if (
        name === "" ||
        price === "" ||
        description === "" ||
        imgCarregada === null
      ) {
        toast.warning("Campos do Formulario esta vasio");
        return;
      }
      setLoading(true);
      const data = new FormData();
      data.append("name", name);
      data.append("price", price);
      data.append("description", description);
      data.append("category_id", categories[categorySelected].id);
      data.append("file", imgCarregada);

      //get api
      let response = await api.post("/product", data);

      let data2 = {
        id: response.data.id,
        name: response.data.name,
        price: response.data.price,
        description: response.data.description,
        category_id: categories[categorySelected].id,
        banner: response.data.banner,
      };

      itensProducts.unshift(data2);
      returnData(itensProducts);
      console.log("respostaAtualizada", itensProducts);
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
    setLoading(false);
    setItensProducts([]);
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
            <div className={styles.divEdit}>
              <select value={categorySelected} onChange={pegarCategoryselected}>
                {categories.map((item: ItensProdProps, index: any) => {
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

              <Button
                className={styles.buttonAdd}
                type={"submit"}
                loading={loading}
              >
                cadastrar
              </Button>
              <button
                className={styles.buttonClose}
                type={"button"}
                onClick={fecharModal}
              >
                Fechar
              </button>
            </div>
          </form>
        </main>
      </Modal>
    </>
  );
}
