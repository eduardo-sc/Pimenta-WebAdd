import { canSSRAuth } from "../../Utils/canSSRAuth";
export default function Dashboard() {
  return;
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
