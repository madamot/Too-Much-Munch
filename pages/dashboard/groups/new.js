import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Router from 'next/router';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';
import Layout from '../../../components/layout/layout'
import Button from '../../../components/Button/Button';
import Card from '../../../components/Card/Card';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { graphQLClient } from '../../../utils/graphql-client';

import Cookie from "js-cookie";


const NewGroup = () => {
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

  let adminID = Cookie.get('FaunaID');

  let sub = user.sub;

  const onSubmit = handleSubmit(async ({ name }) => {
    if (errorMessage) setErrorMessage('');
    console.log(faunaID);

      const query = gql`
        mutation CreateAGroup($faunaID: [ID], $adminID: ID, $name: String!) {
          createGroup(data: {
            name: $name,
            users: { connect: $faunaID, }
            admin: { connect: $adminID, }
          }) {
            name
          }
        }
      `;
      console.log('success');


    const variables = {
          faunaID,
          adminID,
          sub,
          name,
        };

    try {
      await graphQLClient.request(query, variables);
      Router.push('/dashboard/groups');
    } catch (error) {
      console.log(error);
      console.log(errorMessage);
      setErrorMessage(error.message);
    }
  });


  return (
    <Layout dashboard>
      <Head>
        <title>New Group</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Create a new Group 👨‍👩‍👧‍👦 +</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : (null)}

      {error ? (
        <div>Oops... {error.message}</div>
      ) : (null)}

      <div>
        {isAuthenticated ? (
          <div>
            <form onSubmit={onSubmit}>
              <div>
                <label>Group name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. bolognese"
                  ref={register({ required: 'Name is required' })}
                />
                {errors.name &&  (
                  <span role="alert">
                    {errors.name.message}
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

    NewGroup.getInitialProps = () => {

    }

    export default withAuthenticationRequired(NewGroup, {
      // Show a message while the user waits to be redirected to the login page.
      onRedirecting: () => <div>Redirecting you to the login page...</div>,
    });
