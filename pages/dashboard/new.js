import React, { useState } from 'react';
import Head from 'next/head'
import Router from 'next/router';
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

  let faunaID = Cookie.get('FaunaID');

  let sub = user.sub;

  const onSubmit = handleSubmit(async ({ name, description }) => {
    if (errorMessage) setErrorMessage('');
    console.log(faunaID);



      const query = gql`
        mutation CreateARecipe($faunaID: ID, $name: String!, $description: String!) {
          createRecipe(data: {
            author: { connect: $faunaID}
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
      console.log('success');


    const variables = {
          faunaID,
          sub,
          name,
          description,
        };

    try {
      await graphQLClient.request(query, variables);
      Router.push('/dashboard');
    } catch (error) {
      console.log(error);
      console.log(errorMessage);
      setErrorMessage(error.message);
    }
  });


  return (
    <Layout dashboard>
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
                <Button type="submit" primary size="small" label="Create" />
                {/* <button type="submit">Create</button> */}
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
