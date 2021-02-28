import { useState, useEffect } from 'react';
import Router from 'next/router';
import { gql } from 'graphql-request';
import { useForm } from 'react-hook-form';
import { graphQLClient } from '../../utils/graphql-client';

import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const EditForm = ({ defaultValues, id }) => {

  const {
      isLoading,
      isAuthenticated,
      error,
      user,
      loginWithRedirect,
      logout,
    } = useAuth0();

  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, register, reset, errors } = useForm({
    defaultValues: {
      ...defaultValues,
    },
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

  useEffect(() => {
    reset(defaultValues); // asynchronously reset your form values
  }, [reset, defaultValues]);

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
              <input
                type="text"
                name="description"
                placeholder="e.g. saucy"
                ref={register({ required: 'Description is required' })}
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
              <button type="submit">Create</button>
            </div>
          </form>
        </div>

      ) : (null)}
    </>
  );
};

export default EditForm;
