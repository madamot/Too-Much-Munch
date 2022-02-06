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
      <Head>
        {data ? <title>{data?.recipe?.title}</title> : <title>Recipe</title>}
      </Head>
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
