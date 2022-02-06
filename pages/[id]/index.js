import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Head from 'next/head'
import Link from 'next/link';
import Layout from '../../components/layout/layout'
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/client"

import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

import { useDisplay } from "../../utils/hooks";

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { StrapiGQLClient } from '../../utils/strapi-gql-client';
import { graphQLClient } from '../../utils/graphql-client';


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
  @media (max-width: 850px) {
        border-radius: 0;
        margin: 0;
        /* height: 25rem; */
        width: 45vw;
        /* max-width: 200px;
        min-width: 200px; */
      }
      @media (max-width: 588px) {
        border-radius: 0;
        margin: 1rem;
        height: 25rem;
        width: 100vw;
        /* max-width: 200px;
        min-width: 200px; */
      }
}
`;

const Dashboard = () => {
  const [session, loading] = useSession()

  const router = useRouter();

    const [ display, setDisplay ] = useDisplay('card');

    let id = router.query.id;

    let you = session?.id;

  const fetcher = async (query) => await StrapiGQLClient({
    query: query,
    variables: {
        id,
        you
    },
  });
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

    const following = data?.UserFollowing?.following.map(function (obj) {
      return parseInt(obj.id);
    });

   if (error) return <div>{`failed to load: ${error}`}</div>;


  return (
    <Layout dashboard>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      {loading ? (
        <div>Loading...</div>
      ) : (null)}

      <div>
        {you == id ? (
          <h1>Your recipes 🍳</h1>
        ) : (<h1>{data?.user?.username}</h1>)}

        <div>
          <Button size='small' label='Card View' onClick={() => setDisplay('card')}/>
          <Button size='small' label='List View' onClick={() => setDisplay('list')}/>
        </div><br />
        {you != id && <div>
          <FollowHandler
            client={graphQLClient}
            you={you}
            id={id}
          />
        </div>}

        {data ? (
            <>
              <Grid display={display}>
                {data?.user?.recipes.map(recipe => (
                  <div key={recipe.id}>
                  <Link href={`/[id]/[rid]`} as={`/${id}/${recipe.id}`}>
                    <a>
                      <Card state='recipe' display={display} key={recipe.id} id={recipe.id} imagesrc={recipe?.image?.url}>
                        {recipe.title}
                      </Card>
                    </a>
                  </Link>
                </div>
                ))}
              </Grid>
              {session?.id == router.query.id && <div style={{ margin: 0,
                        top: 'auto',
                        right: '5em',
                        bottom: 25.5,
                        left: 'auto',
                        position: 'fixed', }}>
                <Link href="/new">
                  <a>
                    <Button size='large' primary label='+ New recipe' />
                  </a>
                </Link>
              </div>}
            </>

        ): (
          <div>loading...</div>
        )}
      </div>
    </Layout>

      );
    }




    const FollowHandler = ({ client, you, id }) => {

      const router = useRouter();

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
        router.push(`/following`)
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
      router.push(`/following`)
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

      export default Dashboard;
