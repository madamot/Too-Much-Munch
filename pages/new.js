import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Router from 'next/router';
import styled, { css } from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import WYSIWYGEditor from '../components/WYSIWYG/WYSIWYG';
import Layout from '../components/layout/layout'
import Button from '../components/Button/Button';
import Card from '../components/Card/Card';
import { useSession, signIn, signOut } from "next-auth/client"

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { graphQLClient } from '../utils/graphql-client';

import Cookie from "js-cookie";


const New = () => {
  const [session, loading] = useSession()

  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, register, errors, control } = useForm({
    mode: "onChange"
  });

  const id = session?.id


  const onSubmit = handleSubmit(async ({ name, description }) => {
    if (errorMessage) setErrorMessage('');



      const query = gql`
        mutation CreateARecipe($id: ID!, $name: String) {
          createRecipe(
            input: {
              data: {
                user: $id
                title: $name
              }
          }) {
            recipe {
              id
            }
          }
        }
      `;
      console.log('success');


    const variables = {
          id,
          name,
        };

    try {
      const data = await graphQLClient.request(query, variables);
      Router.push(`/${id}/${data.createRecipe.recipe.id}`);
    } catch (error) {
      console.log(error);
      console.log(errorMessage);
      setErrorMessage(error.message);
    }
  });

  return (
    <Layout dashboard>
      <Head>
        <title>New Recipe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>New Recipe +</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (null)}

      <div>
        {session ? (
          <div>
            <h3>Hello, {session.user.name}</h3>

            <form onSubmit={onSubmit}>
              <div>
                <label>Recipe name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. bolognese"
                  ref={register({ required: 'Name is required' })}
                />
 
  
                {errors.name &&  (
                  <span role="alert">
                    {errors.name.message}
                  </span>
                )}
                {errors.description &&  (
                  <span role="alert">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div>
                <Button type="submit" primary size="small" label="Create" />
                {/* <button type="submit">Create</button> */}
              </div>
            </form>

          </div>

        ) : (null)}


      </div>
    </Layout>

      );
    }

    export default New;
