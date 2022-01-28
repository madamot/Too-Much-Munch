import Head from 'next/head'
import Layout from '../components/layout/layout'
import Button from '../components/Button/Button';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import styles from '../styles/Home.module.css'

import { request } from "../utils/datocms";
// import { StructuredText } from "react-datocms";

import { useAuth0 } from '@auth0/auth0-react';

import { useSession, signIn, signOut } from "next-auth/client"


const Hero = styled.div`
  font-family: Bebas Neue;
  padding: 5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  color: #0d1c72;
  width: 100vw;
  position: relative;
  margin-left: -50vw;
  height: auto;
  left: 50%;
  padding-top: 5rem;
}
`;

const Main = styled.div`
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  line-height: 0.9;
  text-align: center;
  font-size: 4.5rem;
  color: #0d1c72;
  font-family: Bebas Neue;
`;

const Munch = styled.span`
  text-align: center;
  font-size: 6.4rem;
  display: block;
`;

const Subtitle = styled.h5`
  font-family: Roboto;
  font-weight: 300;
  color: #0d1c72;
  font-size: 2rem;
`;

const Subsubtitle = styled.h5`
  font-family: Roboto;
  font-weight: 100;
  font-size: 1.5rem;
  margin: 0;
`;



const HOMEPAGE_QUERY = `
query MyQuery {
  homepage {
    title
    heroDescription
    featuretitle
    featuresubtitle
    featureImage {
      url
    }
    homepageBody {
      value
      blocks {
        __typename
        ... on ImageRecord {
          id
          image {
            url
          }
        }
        __typename
        ... on VideoRecord {
          id
          video {
            url
          }
        }
      }
      links {
        __typename
        ... on BlogPageRecord {
          id
          blogPageTitle
        }
        __typename
        ... on BlogRecord {
          id
          slug
          title
        }
      }
    }
  }
}
`;
export async function getStaticProps(context) {
  const data = await request({
    query: HOMEPAGE_QUERY,
    variables: { limit: 10 },
    preview: context.preview
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

      <Hero>
        <Title>Too Much <Munch>Munch</Munch></Title>
        {/* <p>{data.homepage.heroDescription}</p> */}
      </Hero>
      <Main>
        
        {/* <Subtitle>{data.homepage.featuretitle}</Subtitle>
        <Subsubtitle>{data.homepage.featuresubtitle}</Subsubtitle>
        <img width='100%' src={data.homepage.featureImage.url} />
        <StructuredText
          data={data.homepage.homepageBody}
          renderInlineRecord={({ record }) => {
            switch (record.__typename) {
              case "BlogRecord":
                return <a target="_blank" href={`/blog/${record.id}`}>{record.title}</a>;
              default:
                return null;
            }
          }}
          renderLinkToRecord={({ record, children }) => {
            switch (record.__typename) {
              case "BlogRecord":
                return <a style={{color: "#848484", borderBottom: ".05em solid #848484", cursor: "pointer"}} target="_blank" href={`/blog/${record.slug}`}>{children}</a>;
              default:
                return null;
            }
          }}
          renderBlock={({ record }) => {
            switch (record.__typename) {
              case "ImageRecord":
                return <img width='100%' src={record.image.url} alt={record.image.alt} />;
              default:
                return null;
            }
          }}
        /> */}

      </Main>
    </Layout>
  )
}
