import React, { useState } from 'react';
import Head from 'next/head'
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


const Group = () => {

  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  const fetcher = async (query) => await graphQLClient.request(query, { id });

  const query = gql`
    query FindAGroupByID($id: ID!) {
      findGroupByID(id: $id) {
        _id
        name
        users {
          data {
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
          <Grid>
            {data.findGroupByID.users.data.map((user, i, arr) => {
              if (arr.length - 1 === i) {
                return <>
                  <Card state='groups' display='card' key={user._id} id={user._id}>
                    {user.id}
                  </Card>
                  <Card state='add' display='card' />
                </>
              } else {
                return <Card state='groups' display='card' key={user._id} id={user._id}>
                  {user.id}
                </Card>
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

export default Group;
