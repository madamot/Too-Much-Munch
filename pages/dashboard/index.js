import React from 'react';
import Head from 'next/head'
import Layout from '../../components/layout/layout'
import Button from '../../components/Button/Button';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { graphQLClient } from '../../utils/graphql-client';

const fetcher = async (query) => await graphQLClient.request(query);

const Dashboard = () => {
  const {
      isLoading,
      isAuthenticated,
      error,
      user,
      loginWithRedirect,
      logout,
    } = useAuth0();

    const { data, faunaerror } = useSWR(
    gql`
      {
        allRecipes {
          data {
            _id
            user
            name
            description
          }
        }
      }
    `,
    fetcher
  );

   if (faunaerror) return <div>failed to load</div>;

    console.log(user);

  return (
    <Layout>
      <Head>
        <title>Too Much Munch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* {isLoading ? (
        <div>Loading...</div>
        ) : (null)}

        {error ? (
        <div>Oops... {error.message}</div>
      ) : (null)} */}

      <div>
        {/* <h1>Dashboard</h1>
          <p>This is the Dashboard page.</p>
          {isAuthenticated ? (
          <p>Hello, {user.nickname}</p>
        ) : (null)} */}
        {data ? (
          <ul>
            {data.allRecipes.data.map((recipe) => (
              <li key={recipe._id}>
                <span>{recipe.name}</span>
              </li>
            ))}
          </ul>
        ) : (
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
