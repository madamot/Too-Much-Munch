import React, { useState } from 'react';
import Head from 'next/head'
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';
import Layout from '../../components/layout/layout'
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { graphQLClient } from '../../utils/graphql-client';

import Cookie from "js-cookie";


const New = () => {
  const {
      isLoading,
      isAuthenticated,
      error,
      user,
      loginWithRedirect,
      logout,
    } = useAuth0();

  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, register, errors } = useForm();

  let FaunaID = Cookie.get('FaunaID');

  const onSubmit = handleSubmit(async ({ name, description }) => {
    if (errorMessage) setErrorMessage('');

    const query = gql`
      mutation CreateARecipe($FaunaID: ID, $name: String!, $description: String!) {
        createRecipe(data: {
          author: { connect: $FaunaID}
          name: $name
          description: $description
        }) {
          author {
            id
          }
          name
          description
        }
      }
    `;

    try {
      await graphQLClient.request(query, { FaunaID, name, description });
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    }
  });


  return (
    <Layout>
      <Head>
        <title>New Recipe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>New Recipe +</h1>
      <p>{FaunaID}</p>

      {isLoading ? (
        <div>Loading...</div>
      ) : (null)}

      {error ? (
        <div>Oops... {error.message}</div>
      ) : (null)}

      <div>
        {isAuthenticated ? (
          <div>
            <h3>Hello, {user.nickname}</h3>

            <form onSubmit={onSubmit}>
              <div>
                <label>Recipe name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. bolognese"
                  ref={register({ required: 'Name is required' })}
                />
                <label>Recipe description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="e.g. saucy"
                  ref={register({ required: 'Description is required' })}
                />
                {errors.name &&  (
                  <span role="alert">
                    {errors.name.message}
                  </span>
                )}
                {errors.description &&  (
                  <span role="alert">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div>
                <button type="submit">Create</button>
              </div>
            </form>
          </div>

        ) : (null)}

      </div>
    </Layout>

      );
    }

    New.getInitialProps = () => {

    }

    export default withAuthenticationRequired(New, {
      // Show a message while the user waits to be redirected to the login page.
      onRedirecting: () => <div>Redirecting you to the login page...</div>,
    });
