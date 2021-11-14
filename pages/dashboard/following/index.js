import React, { useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import Router from 'next/router';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';
import Layout from '../../../components/layout/layout'
import Button from '../../../components/Button/Button';
import Card from '../../../components/Card/Card';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

import { useSession, signIn, signOut } from "next-auth/client"

import { useDisplay } from "../../../utils/hooks";

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { StrapiGQLClient } from '../../../utils/strapi-gql-client';
import { graphQLClient } from '../../../utils/graphql-client';

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


const Following = () => {
    const [session, loading] = useSession()

    const [ display, setDisplay ] = useDisplay();

    let id = session?.id;
    // id = id.substring(6);

    const fetcher = async (query) => await graphQLClient.request(query, { id });

    const query = gql`
      query Following($id: ID!) {
        user(id: $id) {
          following {
            id
            username
            email
            recipes {
              id
              title
            }
          }
        }
      }
    `;

    const { data, error } = useSWR(() => id ? query : null, fetcher);

    if (error) return <div>{`failed to load: ${error}`}</div>;

    //  if (data) {
    //    if (data.findUserByID) {
    //      Cookie.set("FaunaID", data.findUserByID._id)
    //      console.log(data.findUserByID._id);
    //    }
    //  }

  return (
    <Layout dashboard>
      <Head>
        <title>Following</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Following 🥰</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (null)}

      <div>

        <div>
          <Button size='small' label='Card View' onClick={() => setDisplay('card')}/>
          <Button size='small' label='List View' onClick={() => setDisplay('list')}/>
        </div><br />

        {data ? [
          (Object.keys(data.user.following).length > 0 ?
            <>
              <Grid>
                {data.user.following.map((following, i, arr) => {
                  if (arr.length - 1 === i) {
                    return <div key={following.id}>
                      <Link href={`/dashboard/following/[id]`} as={`/dashboard/following/${following.id}`}>
                        <a>
                          <Card state='groups' display={display} key={following.id} id={following.id}>
                            {following.username}
                          </Card>
                        </a>
                      </Link>
                      <br />
                      <br />
                      <Link href="/dashboard/groups/new">
                        <a>
                          <Button primary size='medium' label='Create a Group +' />
                        </a>
                      </Link>
                      <Link href="/dashboard/groups/join">
                        <a>
                          <Button primary size='medium' label='Join a Group +' />
                        </a>
                      </Link>
                      <br />
                      <br />
                    </div>
                  } else {
                    return <div key={following.id}>
                      <Link href={`/dashboard/following/[id]`} as={`/dashboard/following/${following.id}`}>
                        <a>
                          <Card state='groups' display={display} key={following.id} id={following.id}>
                            {following.username}
                          </Card>
                        </a>
                      </Link>
                    </div>
                  }
                })}
              </Grid>
            </>
          : <>
            <p>You aren't following anyone</p>
            <Link href="/dashboard/groups/new">
              <a>
                <Button primary size='medium' label='Create a Group +' />
              </a>
            </Link>
            <Link href="/dashboard/groups/join">
              <a>
                <Button primary size='medium' label='Join a Group +' />
              </a>
            </Link>
          </>
          )
        ]: (
          <div>loading...</div>
        )}

      </div>
    </Layout>

      );
    }


    export default Following