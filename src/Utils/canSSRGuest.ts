//controle de acesso se tiver cookies
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";

import { parseCookies } from "nookies";

export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    //se tiver cookies sera redirecionado para dela dashboard
    if (cookies["@pimenta.token"]) {
      return {
        redirect: {
          destination: "/Dashboard",
          permanent: false,
        },
      };
    }
    return await fn(ctx);
  };
}
