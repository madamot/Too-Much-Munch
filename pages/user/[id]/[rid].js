import React, { useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import Image from 'next/image';
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

const ImageContainer = styled.div`
  width: 100%;
  height: 25em;
  position: relative;
`;


const UserRecipe = () => {

  const router = useRouter();
  const { uid, id, rid } = router.query;

  const fetcher = async (query) => await graphQLClient.request(query, { rid });

  const query = gql`
    query FindARecipeByID($rid: ID!) {
      recipe(id: $rid) {
        title
        image {
          url
        }
        course {
          id
          name
        }
        cuisine {
          id
          name
        }
        meal {
          id
          name
        }
        ingredients {
          ingredient
          quantity
          measurement
        }
        method {
            method
          }
      }
    }
  `;

  const { data, error } = useSWR([query, rid], fetcher);

  if (error) return <div>{`failed to load: ${error}`}</div>;

  return (
    <Layout dashboard>
      <Head>
        {data ? <title>{data.recipe.title}</title> : <title>Recipe</title>}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {data ? (
        <>
          <h1>{data.recipe.title}</h1>
          <br />
          {data?.recipe?.image?.url && <ImageContainer>
            <Image src={data?.recipe?.image?.url} layout='fill' objectFit='cover' />
          </ImageContainer>}
          <br />
          <p>{data?.recipe?.meal?.name} | {data?.recipe?.course?.name} | {data?.recipe?.cuisine?.name}</p>
          <br />
          <h3>Ingredients</h3>
          {data.recipe.ingredients.map((ingredient, index) => (
            <div>
              {index + 1}. {ingredient.quantity}{ingredient.measurement === 'quantity' ? null : ingredient.measurement} {ingredient.ingredient}
            </div>
          ))}
          <h3>Method</h3>
          {data.recipe.method.map(({method}, index) => (
            <div>{index + 1}. {method}</div>
          ))}
          <br />
        </>

      ) : (
        <div>loading...</div>
      )}



    </Layout>
  );
};


export default UserRecipe