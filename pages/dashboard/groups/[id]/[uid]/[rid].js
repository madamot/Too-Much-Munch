import React, { useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import Router from 'next/router';
import styled, { css } from 'styled-components';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { convertFromHTML } from 'draft-convert';
import Layout from '../../../../../components/layout/layout';
import Button from '../../../../../components/Button/Button';
import Card from '../../../../../components/Card/Card';
import { graphQLClient } from '../../../../../utils/graphql-client';

import { withAuthenticationRequired } from '@auth0/auth0-react';


const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
`;


const UserRecipe = () => {

  const router = useRouter();
  const { uid, id, rid } = router.query;

  console.log(rid);

  const fetcher = async (query) => await graphQLClient.request(query, { rid });

  const query = gql`
    query FindARecipeByID($rid: ID!) {
      findRecipeByID(id: $rid) {
        name
        description
      }
    }
  `;

  const { data, error } = useSWR([query, rid], fetcher);

  // if (error) return console.log(error);
  console.log(data);


  return (
    <Layout dashboard>
      
      {data ? (
        <>
          <h1>{data.findRecipeByID.name}</h1>
          <br />
          <div dangerouslySetInnerHTML={{ __html: data.findRecipeByID.description }}></div>


        </>

      ) : (
        <div>loading...</div>
      )}



    </Layout>
  );
};


export default withAuthenticationRequired(UserRecipe, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});