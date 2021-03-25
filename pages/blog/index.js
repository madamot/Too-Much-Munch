import Head from 'next/head'
import Layout from '../../components/layout/layout'
import Button from '../../components/Button/Button';
import Link from 'next/link';
import styled, { css } from 'styled-components';
// import styles from '../styles/Home.module.css'

import { request } from "../../utils/datocms";
import { StructuredText } from "react-datocms";

import { useAuth0 } from '@auth0/auth0-react';

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
}
`;

const Title = styled.h1`
  line-height: 0.9;
  text-align: center;
  font-size: 4.5rem;
  color: #0d1c72;
  font-family: Bebas Neue;
}
`;

const Subtitle = styled.h5`
  font-family: Roboto;
  font-weight: 300;
  color: #0d1c72;
  font-size: 2rem;
}
`;

const Subsubtitle = styled.h5`
  font-family: Roboto;
  font-weight: 100;
  font-size: 1.5rem;
  margin: 0;
}
`;

const Grid = styled.div`
  ${'' /* display: flex; */}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const BLOGPAGE_QUERY = `
  query MyQuery {
    blogPage {
      id
      blogPageTitle
    }
    allBlogs {
      title
      createdAt
      id
    }
  }
`;
export async function getStaticProps(context) {
  const data = await request({
    query: BLOGPAGE_QUERY,
    variables: { limit: 10 },
    preview: context.preview
  });
  return {
    props: { data }
  };
}


export default function Blog({data}) {


  console.log(data.allBlogs);

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
        <title>Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero>
        {/* <StructuredText data={data.homepage} /> */}
        <Title>{data.blogPage.blogPageTitle}</Title>
        {/* <Subtitle></Subtitle> */}
      </Hero>
      <Main>
        <Grid>

          {data.allBlogs.map(blog => {
            return (
              <div key={blog.id}>
                <Link href={`/blog/[id]`} as={`/blog/${blog.id}`}>
                  <a>
                    <h1>{blog.title}</h1>
                  </a>
                </Link>
              </div>
            );
          })}
        </Grid>

      </Main>
    </Layout>
  )
}
