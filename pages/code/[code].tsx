import { IUrlRes } from "@/app/components/screens/Home/HomeForm/types";
import axios from "@/app/helpers/axios";
import { GetServerSideProps, NextPage } from "next";
import { NextRouter } from "next/router";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ErrorPage from "next/error";

export interface IUrlPageServerSideProps {
  url: string | null;
  notFound: boolean;
}

const UrlPage: NextPage<IUrlPageServerSideProps> = ({ url, notFound }) => {
  const router: NextRouter = useRouter();
  useEffect(() => {
    if (!notFound) {
      router.push(url!);
    }
  }, [router.isReady]);
  return <>{notFound && <ErrorPage statusCode={404} />}</>;
};
export default UrlPage;
export const getServerSideProps: GetServerSideProps<
  IUrlPageServerSideProps
> = async (ctx) => {
  try {
    const url = await axios.get<IUrlRes>(`/urls/${ctx.params!.code}`);
    return { props: { url: url.data.url, notFound: false } };
  } catch (error: any) {
    console.log(error.response.status);
    if (error.response.status === 404) {
      return { props: { url: null, notFound: true } };
    }
    return { props: { url: null, notFound: false } };
  }
};