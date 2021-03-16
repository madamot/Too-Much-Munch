import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { gql } from 'graphql-request';
import { useForm, Controller } from 'react-hook-form';

import Button from '../../components/Button/Button';
import { graphQLClient } from '../../utils/graphql-client';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';


const GroupEditForm = ({ defaultValues, id }) => {

  console.log(defaultValues);

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
      name: defaultValues
    }
  });


  const onSubmit = handleSubmit(async ({ name }) => {
    if (errorMessage) setErrorMessage('');

      const query = gql`
        mutation ChangeNameOfGroup($id: ID!, $name: String!) {
          partialUpdateGroup(id: $id, data: {
            name: $name
          }) {
            name
          }
        }
      `;
      console.log('success');


    const variables = {
          id,
          name,
        };

    try {
      await graphQLClient.request(query, variables);
      Router.push('/dashboard/groups');
    } catch (error) {
      console.log(error);
      console.log(errorMessage);
      setErrorMessage(error.message);
    }
  });


  return (
    <>
      {isAuthenticated ? (
        <form onSubmit={onSubmit}>
          <div>
            <label>Group name</label>
            <input
              type="text"
              name="name"
              ref={register({ required: 'Name is required' })}
            />


            {errors.name &&  (
              <span role="alert">
                {errors.name.message}
              </span>
            )}

          </div>
          <div>
            <Button primary type="submit" size="small" label="Update" />
          </div>
        </form>
      ) : (null)}

    </>
  );
};

export default GroupEditForm;
