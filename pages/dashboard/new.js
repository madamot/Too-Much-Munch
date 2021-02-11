import React from 'react';
import styled, { css } from 'styled-components';
import Head from 'next/head'
import Layout from '../../components/layout/layout'
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { graphQLClient } from '../../utils/graphql-client';


const New = () => {
  const {
      isLoading,
      isAuthenticated,
      error,
      user,
      loginWithRedirect,
      logout,
    } = useAuth0();


  let id = user.sub;


  const fetcher = async (query) => await graphQLClient.request(query, { id });

  const query = gql`
    query getRecipesByUser($id: String!) {
      findUserByID(id: $id) {
        recipes {
          data {
            name
            description
          }
        }
      }
    }
  `;

  const { data, faunaerror } = useSWR([query, id], fetcher);

   if (faunaerror) return <div>failed to load</div>;

  return (
    <Layout>
      <Head>
        <title>New Recipe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>New Recipe +</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : (null)}

      {error ? (
        <div>Oops... {error.message}</div>
      ) : (null)}

      <div>
        {isAuthenticated ? (
          <h3>Hello, {user.nickname}</h3>

        ) : (null)}

      </div>
    </Layout>

      );
    }

      export default withAuthenticationRequired(New, {
        // Show a message while the user waits to be redirected to the login page.
        onRedirecting: () => <div>Redirecting you to the login page...</div>,
      });
