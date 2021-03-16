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

  let faunaID = Cookie.get('FaunaID');

  const { user } = useAuth0();

  const router = useRouter();
  const { id } = router.query;

  const [ display, setDisplay ] = useDisplay();

  const { handleSubmit, errors } = useForm();

  console.log(id);

  const fetcher = async (query) => await graphQLClient.request(query, { id });

  const query = gql`
    query FindAGroupByID($id: ID!) {
      findGroupByID(id: $id) {
        _id
        name
        admin {
          username
          id
        }
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
        mutation LeaveGroup($id: ID!, $faunaID: ID!) {
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

      {data ? (
        <>
          <div>
            {data.findGroupByID.admin.id = user.sub ? (
              <GroupEditForm defaultValues={data.findGroupByID} id={data.findGroupByID._id} />
            ) : ( <h1>{data.findGroupByID.name}</h1>
            )}
            <h2>{`Code: ${data.findGroupByID._id}`}</h2>
            <h3>Invite your friends or family to the group to share your recipes with eachother!</h3>
            <h5>{`Admin: ${data.findGroupByID.admin.username}`}</h5>
          </div>
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
          <br />
          {data.findGroupByID.admin.id = user.sub ? (
          null ) : (
            <Button size='small' label='Leave group' onClick={() => leaveAGroup(data.findGroupByID._id)}/>
          )}
          <br />
          <br />
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