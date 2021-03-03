import React, { useState } from 'react';
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


const Groups = () => {
  const {
      isLoading,
      isAuthenticated,
      error,
      user,
      loginWithRedirect,
      logout,
    } = useAuth0();


  return (
    <Layout dashboard>
      <Head>
        <title>Grou[s]</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Groups</h1>

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

          </div>

        ) : (<p>Loading</p>)}

      </div>
    </Layout>

      );
    }

    Groups.getInitialProps = () => {

    }

    export default withAuthenticationRequired(Groups, {
      // Show a message while the user waits to be redirected to the login page.
      onRedirecting: () => <div>Redirecting you to the login page...</div>,
    });
