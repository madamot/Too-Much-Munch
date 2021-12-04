import React, { useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import Layout from '../../components/layout/layout';
import { useSession, signIn, signOut } from "next-auth/client"
import { graphQLClient } from '../../utils/graphql-client';

import { useDisplay } from '../../utils/hooks';


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

const User = () => {
  const [session, loading] = useSession()
  const [ display, setDisplay ] = useDisplay();

    const router = useRouter();
    const { id } = router.query;
    let you = session?.id;

    const fetcher = async (query) => await graphQLClient.request(query, {id});

    const query = gql`
        query getRecipesByUser($id: ID!) {
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
        }
    `;
  
  const { data, error } = useSWR(() => id ? query : null, fetcher);

  console.log(error);




    return (
        <Layout dashboard>
        <Head>
          {data ? <title>{id}</title> : <title>User Recipes</title>}
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <FollowHandler
          client={graphQLClient}
          you={you}
          id={id}
        />
        
        
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
            <h2>{data.user.username}</h2>
            <br />
            <Grid display={display}>
              {data?.user?.recipes.map(recipe => (
                <div key={recipe.id}>
                <Link href={`/user/${id}/[rid]`} as={`/user/${id}/${recipe.id}`}>
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
    )
}

const FollowHandler = ({ client, you, id }) => {

  const fetcher = async (query) => await client.request(query, {you});

  const query = gql`
    query getUserFollowing($you: ID!) {
            UserFollowing: user(id: $you) {
                following {
                  id
                }
            }
        }
  `;

const { data, error } = useSWR(() => you ? query : null, fetcher);

  if (error) {
    console.log(error)
    return null
  }

  console.log('call', data);

  const following = data?.UserFollowing?.following.map(function (obj) {
    return parseInt(obj.id);
  });

  console.log(following);

  const FollowUser = async (id, you, following) => {
    const newFollow = [
      ...following,
      id,
    ];
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
    console.log('you', you);
  } catch (error) {
    console.error(error);
  }
};

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
  console.log('you', you);
} catch (error) {
  console.error(error);
}
};

  return (
    <>
        {data?.UserFollowing?.following.some(person => person.id == id) ? (
          <Button size='small' label='Following' onClick={() => UnFollowUser(id, you, following)} />
        ) : (
          <Button size='small' label='+ Follow' onClick={() => you ? FollowUser(id, you, following) : signIn() } />
        )}
    </>
  )
}

export default User
