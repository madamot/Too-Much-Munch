import React, { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image';
import { useRouter } from 'next/router';
import Router from 'next/router';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import styled, { css } from 'styled-components';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { convertFromHTML } from 'draft-convert';
import Layout from '../../components/layout/layout';
import Button from '../../components/Button/Button';
import EditForm from '../../components/EditForm/EditForm';
import ViewRecipe from '../../components/ViewRecipe/ViewRecipe';
import { useSession, signIn, signOut } from "next-auth/client"
import { Container, Row, Col } from 'react-grid-system';
import { StrapiGQLClient } from '../../utils/strapi-gql-client';
import { graphQLClient } from '../../utils/graphql-client';

const ImageContainer = styled.div`
  width: 100%;
  height: 25em;
  position: relative;
`;

const Recipe = () => {

  const [session, loading] = useSession()

  let you = session?.id;

  const router = useRouter();

  const { id, rid } = router.query;

  const fetcher = async (query) => await StrapiGQLClient({
    query: query,
    variables: {
      rid
    },
  });

  const query = gql`
    query FindARecipeByID($rid: ID!) {
      recipe(id: $rid) {
        title
        image {
          url
          width
          height
        }
        course {
          id
        }
        cuisine {
          id
        }
        meal {
          id
        }
        ingredients {
          ingredient
        }
        method {
            method
            image {
              url
            }
          }
      }
      courses {
        id
        uid
        name
      }
  		cuisines {
        id
        uid
        name
      }
  		meals {
        id
        uid
        name
      }
    }
  `;

  const { data, error } = useSWR(() => rid ? query : null, fetcher);

  // if (error) return <div>failed to load</div>;
  console.log(error);

  const deleteARecipe = async (id) => {
    const query = gql`
      mutation DeleteARecipe($rid: ID!) {
        deleteRecipe(
          input: {
            where: {
              id: $rid
            }
          }
        ) {
          recipe {
            id
          }
        }
      }
    `;

  try {
    await graphQLClient.request(query, { rid });
    Router.push('/');
  } catch (error) {
    console.error(error);
  }
};

  return (
    <Layout dashboard>
        {data && 
          <Head>
            <title>{data?.recipe?.title}</title>
            {/* <meta name='keywords' content={seo?.metaKeyword || 'Designlab, design agency, creative agency, digital agency, creative agency, branding, promotional materials, packaging, art direction, photography, video, website design, website development, ecommerce, app design, iconography, user experience, UX, social, email, SEO, search engine optimisation, digital marketing, strategy, copywriting, analytics, Google Analytics, Basingstoke, Hampshire, London, South East'} /> */}
            {/* <meta name='description' content={seo?.metaDescription || 'We are a passionate and experienced creative design agency based in Basingstoke, Hampshire. We combine design, digital and strategic thinking for some of the worlds most beautiful brands.'} /> */}
            <meta property='og:title' content={data?.recipe?.title} />
            <meta property='og:description' content={data?.recipe?.title} />
            <meta property="og:image" content='/image.png'/>
            {/* <meta property="og:image:width" content={data?.recipe?.image?.width} />
            <meta property="og:image:height" content={data?.recipe?.image?.height} /> */}
            <meta name='twitter:title' content={data?.recipe?.title} />
            <meta name='twitter:description' content={data?.recipe?.title} />
            <meta name="twitter:image" content='/image.png' />
            {/* <meta property="twitter:image:width" content={data?.recipe?.image?.width} />
            <meta property="twitter:image:height" content={data?.recipe?.image?.height} /> */}
          </Head>}
      {data ? (
        <Container>
          
          {you == id ?
            <div>
              {data?.recipe?.image?.url && <ImageContainer>
                <Image src={data?.recipe?.image?.url} layout='fill' objectFit='cover' />
              </ImageContainer>}
              <br />
              <EditForm defaultValues={data.recipe} id={rid} courses={data.courses} cuisines={data.cuisines} meals={data.meals} measurements={data.measurements} />
              <Button size="small" onClick={() => deleteARecipe(rid)} label="Delete" />
            </div>  
            : <ViewRecipe data={data} />
          }
        </Container>

      ) : (
        <div>loading...</div>
      )}


      {/* {data ? (
        <EditForm defaultValues={data.findRecipeByID} id={id} />
      ) : (
        <div>loading...</div>
      )} */}
    </Layout>
  );
};

export default Recipe;
