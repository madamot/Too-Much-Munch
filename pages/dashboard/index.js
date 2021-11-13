import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Head from 'next/head'
import Link from 'next/link';
import Layout from '../../components/layout/layout'
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
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
}
`;

const Dashboard = () => {
  const [session, loading] = useSession()


    const [ display, setDisplay ] = useDisplay('card');


    let id = session?.id;

  const fetcher = async (query) => await StrapiGQLClient({
    query: query,
    variables: {
        id
    },
  });
  const query = gql`
    query getRecipesByUser($id: ID!) {
      user(id: $id) {
        id
        recipes {
          id
          title
        }
      }
    }
  `;

  const { data, error } = useSWR(() => id ? query : null, fetcher);


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
        {session ? (
          <h1>Your recipes 🍳</h1>

        ) : (null)}

        <div>
          <Button size='small' label='Card View' onClick={() => setDisplay('card')}/>
          <Button size='small' label='List View' onClick={() => setDisplay('list')}/>
        </div><br />

        {data ? (

          

            <>
              <Grid display={display}>
              {data?.user?.recipes.map(recipe => (
                <div key={recipe.id}>
                <Link href={`/dashboard/recipe/[id]`} as={`/dashboard/recipe/${recipe.id}`}>
                  <a>
                    <Card state='recipe' display={display} key={recipe.id} id={recipe.id}>
                      {recipe.title}
                    </Card>
                  </a>
                </Link>
              </div>
              ))}

              </Grid>
              <Link href="/dashboard/new">
                        <a>
                          <Card state='add' display={display} />
                        </a>
                      </Link>
            </>

        ): (
          <div>loading...</div>
        )}
      </div>
    </Layout>

      );
    }

      export default Dashboard;
