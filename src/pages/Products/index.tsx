import Head from "next/head";
import { useEffect, useState ,ChangeEvent} from "react";
import { FiRefreshCcw, FiEdit, FiCheck, FiTrash } from "react-icons/fi";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { Header } from "../../componets/Header";
import ModalProduct from "../../componets/ModalProduct";
import { setupAPICliet } from "../../services/api";
import { api } from "../../services/apiClient";
import { canSSRAuth } from "../../Utils/canSSRAuth";
import styles from "./styles.module.scss";
import ModalDescriptionProduct from "../../componets/ModalDescriptionProduct";
import { AxiosError } from "axios";
import { Toast } from "react-toastify/dist/components";
import nProgress from "nprogress";

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
  category_id: string;
};
export default function Products({
  categoryList,
  products,
}: CategoryListProps | any) {
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
  const [modalVisibleDescription, setModalVisibleDescription] = useState(false);
  const [categories, setCategories] = useState(categoryList || []);
  const [productsItens, setProductsItens] = useState(products || []);
  const [itenClicado, setItemClicado] = useState("");
  const [objetoAdicional, setObjetoAdicional] = useState<ItensProdProps>();
  const [pesquisaText, setPesquisaText] = useState("");
  const [produtosPesquisaItens, setProdutosPesquisaItens] = useState<
    ItensProdProps | any
  >(productsItens);
  const [loading, SetLoading] = useState(false);
  const [imgCarregada, setimgCarregada] = useState<File | null>(null);
  function abrirModal() {
    nProgress.start();
    setItemClicado("");
    setModalVisibleEdit(true);
    nProgress.done();
  }
  function fecharModal() {
    nProgress.start();
    setModalVisibleEdit(false);
    nProgress.done();
  }
  function pegarInformacaoDoProduto(id: string) {
   
    if (productsItens) {
      let item = productsItens.filter((item: ItensProdProps) => {
        return item.id === id;
      });
      

      setItemClicado(item[0]);
      setModalVisibleEdit(true);
    }
  }
  ReactModal.setAppElement("#__next");
  async function AtualizarProducts() {
    nProgress.start();
    SetLoading(true)
    setProdutosPesquisaItens([]);
    const response = await api.get("/product/list");
    setProdutosPesquisaItens(response.data);
    nProgress.done();
    SetLoading(false)
  }
  function retorno(data: ItensProdProps) {
    setProdutosPesquisaItens(data);
  }
  async function deleteIten(id: string) {
    await api
      .delete("/product/remove", {
        params: { product_id: id },
      })
      .then(() => {
        let arrayItens = produtosPesquisaItens.filter(
          (item: ItensProdProps) => {
            return item.id !== id;
          }
        );

        setProdutosPesquisaItens(arrayItens);
        toast.success("Excluido com sucesso!");
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 400) {
          toast.error("Produto n??o pode ser exclu??do ");
          return;
        }
       
      });
  }
  function AbrirModalAdicional(item: ItensProdProps) {
    setObjetoAdicional(item);
    setModalVisibleDescription(true);
  }
  function fecharModalDesc() {
    setModalVisibleDescription(false);
  }

  useEffect(() => {
    function pesquisaProduto() {
      if (pesquisaText) {
        let itensPesquisados = productsItens.filter((item: ItensProdProps) => {
          return item.name.toLowerCase().match(pesquisaText.toLowerCase());
        });

        setProdutosPesquisaItens(itensPesquisados);
      }
      if (!pesquisaText) {
        setProdutosPesquisaItens(productsItens);
      }
    }
    pesquisaProduto();
  }, [pesquisaText]);
useEffect(()=>{
 async function get(){
  
      await api.get("/product/list").then((responseProducts)=>{
        
        setProductsItens(responseProducts.data)
     }).catch(erro=>{
      console.log(erro)
     });
    
  }
  get();
},[productsItens])
function carregarImage(event: ChangeEvent<HTMLInputElement>) {
  if (!event.target.files) {
    return;
  }
  const image = event.target.files[0];
  if (!image) {
    return;
  }
  if (image.type === "image/png" || image.type === "image/jpeg"||image.type==="application/pdf") {
    setimgCarregada(image);
   // setImageUrl(URL.createObjectURL(event.target.files[0]));
  }
}
async function enviarPfd(){
  nProgress.start();
  if(imgCarregada){
const data =new  FormData()
data.append("file",imgCarregada);
await api.put('/menu/upload',data).then(response=>{
  nProgress.done();
  toast.success('Enviado com sucesso')
  setimgCarregada(null)
  return
}).catch(err=>{
  nProgress.done();
  toast.error('erro')
})
  }else{
    nProgress.done();
    return;
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
          <div className={styles.containerHeader}>
            <h1>Produtos</h1>

            <button
              className={styles.buttonAtualizar}
              onClick={AtualizarProducts}
              disabled={loading}
            >
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
            <button className={styles.buttonNovo} onClick={abrirModal}>
              Novo
            </button>
            {
              imgCarregada===null ?
              (
              <label className={styles.label} >
              Upload cardapio
              <input
                type={"file"}
                accept={"image/pnd , image/jpeg,application/pdf "}
                onChange={carregarImage}
              />
            </label>
              ):(
            <button className={styles.buttonNovo} onClick={enviarPfd} >
              Enviar Cardapio
            </button>
              )
            }
            
          </div>
            <div className={styles.scroll}>
          {produtosPesquisaItens.map((iten: ItensProdProps) => (
            <article className={styles.listOrder} key={iten.id}>
              <section className={styles.orderItem} key={iten.id}>
                <button onClick={() => AbrirModalAdicional(iten)}>
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
                  <button onClick={() => deleteIten(iten.id)}>
                    <FiTrash size={25} color={"#ff3f4b"} />
                  </button>
                </div>
              </section>
            </article>
          ))}
          </div>
        </main>
      </div>

      {modalVisibleEdit && (
        <ModalProduct
          category={categories}
          dataItemEdit={itenClicado}
          isOpen={modalVisibleEdit}
          closeModal={fecharModal}
          data={productsItens}
          returnData={retorno}
        />
      )}
      {modalVisibleDescription && (
        <ModalDescriptionProduct
          isOpen={modalVisibleDescription}
          closeModal={fecharModalDesc}
          data={objetoAdicional}
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
