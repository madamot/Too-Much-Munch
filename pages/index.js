import Head from 'next/head'
import Layout from '../components/layout/layout'
import Button from '../components/Button/Button';
import Link from 'next/link';
import styles from '../styles/Home.module.css'

import { request } from "../utils/datocms";
import { StructuredText } from "react-datocms";

import { useAuth0 } from '@auth0/auth0-react';

const HOMEPAGE_QUERY = `
  query MyQuery {
    homepage {
      title
    }
  }
`;
export async function getStaticProps() {
  const data = await request({
    query: HOMEPAGE_QUERY,
    variables: { limit: 10 }
  });
  return {
    props: { data }
  };
}

export default function Home({data}) {
    const {
      isLoading,
      isAuthenticated,
      error,
      user,
      loginWithRedirect,
      logout,
    } = useAuth0();

  return (
    <Layout>
      <Head>
        <title>Too Much Munch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* <StructuredText data={data.homepage} /> */}
        <h1>{data.homepage.title}</h1>
      </main>
    </Layout>
  )
}
