import Head from "next/head";
import { Header } from "../../componets/Header";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import { FiUpload } from "react-icons/fi";
import styles from "./styles.module.scss";
import { ChangeEvent, FormEvent, useState } from "react";
import { setupAPICliet } from "../../services/api";

import { parseCookies } from "nookies";
import { toast } from "react-toastify";
type ItensProps = {
  id: string;
  name: string;
};
interface CategoryListProps {
  CategoryProps: ItensProps[];
}
export default function Products({ categoryList }: CategoryListProps | any) {
  const [name, setname] = useState("");
  const [price, setPrice] = useState("");
  const [description, setdescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgCarregada, setimgCarregada] = useState<File | null>(null);
  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState(0);

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

    try {
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
      console.log(data.get);
      const api = setupAPICliet("");
      await api.post("/product", data);
      toast.success("Gravado com Sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar produto");
      console.log(error);
    }
  }
  return (
    <>
      <Head>
        <title>Produtos Pimenta-Malagueta</title>
      </Head>

      <div>
        <Header />
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
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const cookies = parseCookies(ctx);

  const apliClient = setupAPICliet(ctx);

  const response = await apliClient.get("/categorys/list");

  return {
    props: {
      categoryList: response.data,
    },
  };
});
