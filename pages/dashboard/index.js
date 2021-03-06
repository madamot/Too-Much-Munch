import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Head from 'next/head'
import Link from 'next/link';
import Layout from '../../components/layout/layout'
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { graphQLClient } from '../../utils/graphql-client';

import Cookie from "js-cookie";

const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  &:after {
  content: "";
  width: 250px;
  margin: 1rem;
}
`;

const Dashboard = () => {
  const {
      isLoading,
      isAuthenticated,
      error,
      user,
      loginWithRedirect,
      logout,
    } = useAuth0();


  let id = user.sub;
  id = id.substring(6);

  console.log(id);

  const fetcher = async (query) => await graphQLClient.request(query, { id });

  const query = gql`
    query getRecipesByUser($id: String!) {
      findUserByID(id: $id) {
        _id
        recipes {
          data {
            _id
            name
            description
          }
        }
      }
    }
  `;

  const { data, faunaerror } = useSWR([query, id], fetcher);

   if (faunaerror) return <div>failed to load</div>;

   console.log(data);



   if (data) {
     if (data.findUserByID) {
       Cookie.set("FaunaID", data.findUserByID._id)
       console.log(data.findUserByID._id);
     }
   }




  return (
    <Layout dashboard>
      <Head>
        <title>Too Much Munch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      {isLoading ? (
        <div>Loading...</div>
      ) : (null)}

      {error ? (
        <div>Oops... {error.message}</div>
      ) : (null)}

      <div>
        {isAuthenticated ? (
          <h1>Hello {user.nickname}, your recipes</h1>

        ) : (null)}

        {data ? [
          (Object.keys(data.findUserByID.recipes.data).length > 0 ?
            <>
              <Grid>
                {data.findUserByID.recipes.data.map((recipe, i, arr) => {
                  if (arr.length - 1 === i) {
                    return <>
                      <Card recipe key={recipe._id} id={recipe._id}>
                        {recipe.name} <br />
                        {recipe.description}
                      </Card>
                      <Card add />
                    </>
                  } else {
                    return <Card recipe key={recipe._id} id={recipe._id}>
                      {recipe.name} <br />
                      {recipe.description}
                    </Card>
                  }
                })}
              </Grid>
            </>
          : <><p>You have no recipes</p><Card add /></>
          )
        ]: (
          <div>loading...</div>
        )}
      </div>
    </Layout>

      );
    }

      export default withAuthenticationRequired(Dashboard, {
        // Show a message while the user waits to be redirected to the login page.
        onRedirecting: () => <div>Redirecting you to the login page...</div>,
      });
