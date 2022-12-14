import Link from "next/link";
import styles from "./styles.module.scss";
import logoImagem from "../../../public/logo.png";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../contexts/Authcontext";
import { useContext } from "react";

export function Header() {
  const { signOut } = useContext(AuthContext);
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="Dashboard">
          <Image src={logoImagem} width={200} height={70} />
        </Link>
        <nav className={styles.menuNav}>
        <Link href={"/"}>
            <a>Dashboard</a>
          </Link>
          <Link href={"/Category"}>
            <a>Categoria</a>
          </Link>

          <Link href={"/Products"}>
            <a>Produtos</a>
          </Link>
          <Link href={"/Pedidos"}>
            <a>Cozinha</a>
          </Link>
          <Link href={"/Usuario"}>
            <a>Usuarios</a>
          </Link>
          <Link href={"/Vendas"}>
            <a>Relatorio</a>
          </Link>
          <Link href={"/Pagamento"}>
            <a>Caixa</a>
          </Link>

          <button onClick={signOut}>
            <FiLogOut fontSize={23} color="#fff" />
          </button>
        </nav>
      </div>
    </header>
  );
}
