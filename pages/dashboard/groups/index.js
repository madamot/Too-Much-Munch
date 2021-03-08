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


const Groups = () => {
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
      query getGroupsByUser($id: String!) {
        findUserByID(id: $id) {
          _id
          groups {
            data {
              _id
              name
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
        <title>Groups]</title>
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

        {data ? [
          (Object.keys(data.findUserByID.groups.data).length > 0 ?
            <>
              <Grid>
                {data.findUserByID.groups.data.map((group, i, arr) => {
                  if (arr.length - 1 === i) {
                    return <>
                      <Card state='recipe' display='card' key={group._id} id={group._id}>
                        {group.name} <br />
                        {group.description}
                      </Card>
                      <Card state='add' display='card' />
                    </>
                  } else {
                    return <Card state='recipe' display='card' key={group._id} id={group._id}>
                      {group.name} <br />
                      {group.description}
                    </Card>
                  }
                })}
              </Grid>
            </>
          : <><p>You have no recipes</p><Card state='add' display='card' /></>
          )
        ]: (
          <div>loading...</div>
        )}

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
