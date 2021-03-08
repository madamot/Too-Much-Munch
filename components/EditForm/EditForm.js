import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { gql } from 'graphql-request';
import { useForm, Controller } from 'react-hook-form';
import WYSIWYGEditor from '../../components/WYSIWYG/WYSIWYG';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import dynamic from 'next/dynamic';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Button from '../../components/Button/Button';
import { graphQLClient } from '../../utils/graphql-client';

import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)

const EditForm = ({ defaultValues, id }) => {

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const [errorMessage, setErrorMessage] = useState('');

  const {
      isLoading,
      isAuthenticated,
      error,
      user,
      loginWithRedirect,
      logout,
    } = useAuth0();


  const { handleSubmit, register, reset, errors, control, setValue } = useForm({
    defaultValues: {
      ...defaultValues,
    },
    mode: "onChange",
  });


  const onSubmit = handleSubmit(async ({ name, description }) => {
    if (errorMessage) setErrorMessage('');

    const query = gql`
      mutation UpdateARecipe($id: ID!, $name: String!, $description: String!) {
        updateRecipe(id: $id, data: {
          name: $name,
          description: $description,
        }) {
          name
          description
        }
      }
    `;

    const variables = {
      id,
      name,
      description,
    };

    try {
      await graphQLClient.request(query, variables);
      Router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  });


  return (
    <>
      {isAuthenticated ? (
        <div>
          <h3>Hello, {user.nickname}</h3>

          <form onSubmit={onSubmit}>
            <div>
              <label>Recipe name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. bolognese"
                ref={register({ required: 'Name is required' })}
              />
              <label>Recipe description</label>


              <Controller
                as={<WYSIWYGEditor convo={defaultValues.description} />}
                name="description"
                control={control}
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
              <Button primary type="submit" size="small" label="Update" />
            </div>
          </form>

        </div>

      ) : (null)}
    </>
  );
};

export default EditForm;
