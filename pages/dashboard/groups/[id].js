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
import Layout from '../../../components/layout/layout';
import Button from '../../../components/Button/Button';
import Card from '../../../components/Card/Card';
import { graphQLClient } from '../../../utils/graphql-client';

import { useDisplay } from "../../../utils/hooks";

import { withAuthenticationRequired } from '@auth0/auth0-react';


const Grid = styled.div`
  ${'' /* display: flex; */}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  &:after {
  content: "";
  width: 250px;
  margin: 1rem;
}
`;


const Group = () => {

  const router = useRouter();
  const { id } = router.query;

  const [ display, setDisplay ] = useDisplay();

  console.log(id);

  const fetcher = async (query) => await graphQLClient.request(query, { id });

  const query = gql`
    query FindAGroupByID($id: ID!) {
      findGroupByID(id: $id) {
        _id
        name
        users {
          data {
            username
            id
          }
        }
      }
    }
  `;

  const { data, error } = useSWR([query, id], fetcher);

  if (error) return <div>failed to load</div>;


  return (
    <Layout dashboard>



      {data ? (
        <>
          <h1>{data.findGroupByID.name}</h1>
          <br />
          <div>
            <Button size='small' label='Card View' onClick={() => setDisplay('card')}/>
            <Button size='small' label='List View' onClick={() => setDisplay('list')}/>
          </div><br />
          <Grid>
            {data.findGroupByID.users.data.map((user, i, arr) => {
              if (arr.length - 1 === i) {
                return <>
                  <Link href={`/dashboard/groups/${id}/[uid]`} as={`/dashboard/groups/${id}/${user.id}`}>
                    <a>
                      <Card state='groups' display={display} key={user.id} id={user.id}>
                        {user.username}
                      </Card>
                      <Card state='add' display={display} />
                    </a>
                  </Link>
                </>
              } else {
                return <>
                  <Link href={`/dashboard/groups/${id}/[uid]`} as={`/dashboard/groups/${id}/${user.id}`}>
                    <a>
                      <Card state='groups' display={display} key={user.id} id={user.id}>
                        {user.username}
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


export default withAuthenticationRequired(Group, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});
