import React, { useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import Router from 'next/router';
import styled, { css } from 'styled-components';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { gql } from 'graphql-request';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { convertFromHTML } from 'draft-convert';
import Layout from '../../../components/layout/layout';
import Button from '../../../components/Button/Button';
import Card from '../../../components/Card/Card';
import GroupEditForm from '../../../components/GroupEditForm/GroupEditForm';
import { graphQLClient } from '../../../utils/graphql-client';

import { useDisplay } from "../../../utils/hooks";
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

import { useSession, signIn, signOut } from "next-auth/client"

import Cookie from "js-cookie";


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

  // let faunaID = Cookie.get('FaunaID');

  const [session, loading] = useSession()

  const router = useRouter();
  const { id } = router.query;

  const [ display, setDisplay ] = useDisplay();

  const { handleSubmit, errors } = useForm();


  const fetcher = async (query) => await graphQLClient.request(query, { id });

  const query = gql`
    query getRecipesByUser($id: ID!) {
      user(id: $id) {
        id
        username
        recipes {
          id
          title
        }
      }
    }
  `;

  const { data, error } = useSWR([query, id], fetcher);

  if (error) return <div>failed to load</div>;

  const deleteAGroup = async (id) => {
      const query = gql`
        mutation DeleteAGroup($id: ID!, $faunaID: [ID]) {
          partialUpdateGroup(id: $id, data: {
            users: { disconnect: $faunaID}
          }) {
            _id
          }
        }
      `;

    try {
      await graphQLClient.request(query, { id });
      Router.push('/dashboard/groups');
    } catch (error) {
      console.error(error);
    }
  };

  const leaveAGroup = async (id) => {
      const query = gql`
        mutation LeaveGroup($id: ID!, $faunaID: [ID]) {
          partialUpdateGroup(id: $id, data: {
            users: { disconnect: $faunaID}
          }) {
            _id
          }
        }
      `;

    try {
      await graphQLClient.request(query, { id });
      Router.push('/dashboard/groups');
    } catch (error) {
      console.error(error);
    }
  };




  return (
    <Layout dashboard>
      <Head>
        {data ? <title>{data.user.username}</title> : <title>Group Recipes</title>}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {data ? (
        <>
          {/* <div>
            {data.findGroupByID.admin.email == user.email ? (
              <GroupEditForm defaultValues={data.findGroupByID} id={data.findGroupByID._id} />
            ) : ( <h1>{data.findGroupByID.name}</h1>
            )}
            <h2>{`Code: ${data.findGroupByID._id}`}</h2>
            <h3>Invite your friends or family to the group to share your recipes with eachother!</h3>
            <h5>{`Admin: ${data.findGroupByID.admin.username}`}</h5>
          </div> */}
          <br />
          <div>
            <Button size='small' label='Card View' onClick={() => setDisplay('card')}/>
            <Button size='small' label='List View' onClick={() => setDisplay('list')}/>
          </div><br />
          <Grid>
            {data.user.recipes.map((recipe, i, arr) => {
              if (arr.length - 1 === i) {
                return <>
                  <Link href={`/dashboard/following/${id}/[rid]`} as={`/dashboard/following/${id}/${recipe.id}`}>
                    <a>
                      <Card state='groups' display={display} key={recipe.id} id={recipe.id}>
                        {recipe.title}
                      </Card>
                    </a>
                  </Link>
                </>
              } else {
                return <>
                  <Link href={`/dashboard/following/${id}/[rid]`} as={`/dashboard/following/${id}/${recipe.id}`}>
                    <a>
                      <Card state='groups' display={display} key={recipe.id} id={recipe.id}>
                        {recipe.title}
                      </Card>
                    </a>
                  </Link>
                </>
              }
            })}
          </Grid>
          <br />
          {/* {data.findGroupByID.admin.email === user.email ? (
          null ) : (
            <Button size='small' label='Leave group' onClick={() => leaveAGroup(data.findGroupByID._id)}/>
          )} */}
          <br />
          <br />
        </>

      ) : (
        <div>loading...</div>
      )}

    </Layout>
  );
};


export default Group