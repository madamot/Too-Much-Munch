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
import { graphQLClient } from '../../../utils/graphql-client';

import { withAuthenticationRequired } from '@auth0/auth0-react';

const Recipe = () => {


  const router = useRouter();
  const { id } = router.query;

  const fetcher = async (query) => await graphQLClient.request(query, { id });

  const query = gql`
    query FindARecipeByID($id: ID!) {
      findRecipeByID(id: $id) {
        name
        description
      }
    }
  `;

  const { data, error } = useSWR([query, id], fetcher);

  if (error) return <div>failed to load</div>;

  const deleteARecipe = async (id) => {
    const query = gql`
      mutation DeleteARecipe($id: ID!) {
        deleteRecipe(id: $id) {
          _id
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
      <h1>Edit Recipe</h1>

      {data ? (
        <>
          {/* <h2>{data.findRecipeByID.name}</h2>
          <br /> */}
          {/* <p>{data.findRecipeByID.description}</p> */}
          {/* <div dangerouslySetInnerHTML={{ __html: data.findRecipeByID.description }}></div> */}
          <Button size="small" onClick={() => deleteARecipe(id)} label="Delete" />
          {/* <EditForm defaultValues={data.findRecipeByID} id={id} /> */}
        </>

      ) : (
        <div>loading...</div>
      )}


      {data ? (
        <EditForm defaultValues={data.findRecipeByID} id={id} />
      ) : (
        <div>loading...</div>
      )}
    </Layout>
  );
};

export default withAuthenticationRequired(Recipe, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});
