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
import Layout from '../../../../components/layout/layout';
import Button from '../../../../components/Button/Button';
import Card from '../../../../components/Card/Card';
import { graphQLClient } from '../../../../utils/graphql-client';

import { useDisplay } from "../../../../utils/hooks";

import { withAuthenticationRequired } from '@auth0/auth0-react';


const Grid = styled.div`
  ${'' /* display: flex; */}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
`;


const User = () => {

  const router = useRouter();
  const { uid, id } = router.query;

  const [ display, setDisplay ] = useDisplay();

  console.log(uid);

  const fetcher = async (query) => await graphQLClient.request(query, { uid });

  const query = gql`
    query getRecipesByUser($uid: String!) {
      findUserByID(id: $uid) {
        _id
        username
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

  const { data, error } = useSWR([query, uid], fetcher);

  // if (error) return console.log(error);
  console.log(error);


  return (
    <Layout dashboard>


      {data ? (
        <>

          <h1>{data.findUserByID.username}'s recipes</h1>
          <br />

          <div>
            <Button size='small' label='Card View' onClick={() => setDisplay('card')}/>
            <Button size='small' label='List View' onClick={() => setDisplay('list')}/>
          </div><br />

          <Grid>
            {data.findUserByID.recipes.data.map((recipe, i, arr) => {
              if (arr.length - 1 === i) {
                return <>
                  <Link href={`/dashboard/groups/[id]/[uid]/[rid]`} as={`/dashboard/groups/${id}/${uid}/${recipe._id}`}>
                    <a>
                      <Card state='recipe' display={display} key={recipe._id} id={recipe._id}>
                        {recipe.name}
                      </Card>
                    </a>
                  </Link>
                </>
              } else {
                return <>
                  <Link href={`/dashboard/groups/[id]/[uid]/[rid]`} as={`/dashboard/groups/${id}/${uid}/${recipe._id}`}>
                    <a>
                      <Card state='recipe' display={display} key={recipe._id} id={recipe._id}>
                        {recipe.name}
                      </Card>
                    </a>
                  </Link>
                </>
              }
            })}
          </Grid>
        </>

      ) : (
        <div>loading...</div>
      )}



    </Layout>
  );
};


export default withAuthenticationRequired(User, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});
