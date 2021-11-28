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
  display: ${props => props.display == 'card' ? "flex" : "block"}; 
  grid-template-columns: auto auto auto;
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
  let you = session?.id;

  const [ display, setDisplay ] = useDisplay();

  const { handleSubmit, errors } = useForm();


  const fetcher = async (query) => await graphQLClient.request(query, { id, you });

  const query = gql`
    query getRecipesByUser($id: ID!, $you: ID!) {
      user(id: $id) {
        id
        username
        recipes {
          id
          title
          image {
            url
          }
        }
      }
      UserFollowing: user(id: $you) {
          following {
            id
          }
      }
    }
  `;

  const { data, error } = useSWR(() => you ? query : null, fetcher);

  const following = data?.UserFollowing?.following.map(function (obj) {
    return parseInt(obj.id);
  });

  if (error) return <div>failed to load</div>;


  const UnFollowUser = async (id, you, following) => {
    const newFollow = following.filter(num => num != id);
    console.log('newFollow', newFollow);
    const query = gql`
      mutation FollowUser($you: ID!, $newFollow: [ID]) {
        updateUser(
          input: {
            where: {
              id: $you
            }
            data: {
              following: $newFollow
            }
          }
        ) {
          user {
            id
          }
        }
      }
    `;
  
  try {
    await graphQLClient.request(query, {you,  newFollow});
    Router.push(`/dashboard/following`);
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
          {data && <h2>{data.user.username}</h2>}
          <br />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <div>
              <Button size='small' label='Card View' onClick={() => setDisplay('card')}/>
              <Button size='small' label='List View' onClick={() => setDisplay('list')}/>
            </div>
            <div>
              <Button size='small' label='Unfollow' onClick={() => UnFollowUser(id, you, following)} />
            </div>
          </div><br />
          <Grid display={display}>
          {data?.user?.recipes.map(recipe => (
            <div key={recipe.id}>
            <Link href={`/dashboard/following/${id}/[rid]`} as={`/dashboard/following/${id}/${recipe.id}`}>
              <a>
                <Card state='recipe' display={display} key={recipe.id} id={recipe.id} imagesrc={recipe?.image?.url}>
                  {recipe.title}
                </Card>
              </a>
            </Link>
          </div>
          ))}
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