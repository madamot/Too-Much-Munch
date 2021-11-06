import React, { useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import Router from 'next/router';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { convertFromHTML } from 'draft-convert';
import Layout from '../../../components/layout/layout';
import Button from '../../../components/Button/Button';
import EditForm from '../../../components/EditForm/EditForm';
import Ingredients from '../../../components/Ingredients/Ingredients';
import { StrapiGQLClient } from '../../../utils/strapi-gql-client';
import { graphQLClient } from '../../../utils/graphql-client';

const Recipe = () => {


  const router = useRouter();
  const { id } = router.query;

  const fetcher = async (query) => await StrapiGQLClient({
    query: query,
    variables: {
        id
    },
  });

  const query = gql`
    query FindARecipeByID($id: ID!) {
      recipe(id: $id) {
        title
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
          quantity
          measurement
        }
        method {
            method
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

  const { data, error } = useSWR(() => id ? query : null, fetcher);

  if (error) return <div>failed to load</div>;

  const deleteARecipe = async (id) => {
    const query = gql`
      mutation DeleteARecipe($id: ID!) {
        deleteRecipe(
          input: {
            where: {
              id: $id
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
    await graphQLClient.request(query, { id });
    Router.push('/dashboard');
  } catch (error) {
    console.error(error);
  }
};

  return (
    <Layout dashboard>
      <Head>
        {data ? <title>{data.recipe.title}</title> : <title>Recipe</title>}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Edit Recipe</h1>

      {data ? (
        <>
          <h2>{data.recipe.title}</h2>
          <br />
          {/* <p>{data.findRecipeByID.description}</p> */}
          {/* <div dangerouslySetInnerHTML={{ __html: data.findRecipeByID.description }}></div> */}
          <EditForm defaultValues={data.recipe} id={id} courses={data.courses} cuisines={data.cuisines} meals={data.meals} />
          <Button size="small" onClick={() => deleteARecipe(id)} label="Delete" />
        </>

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
