import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { gql } from 'graphql-request';
import { useForm, useFieldArray, Controller, FormProvider, useFormContext } from 'react-hook-form';
import WYSIWYGEditor from '../../components/WYSIWYG/WYSIWYG';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import dynamic from 'next/dynamic';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Ingredients from '../Ingredients/Ingredients';
import Button from '../../components/Button/Button';
import { graphQLClient } from '../../utils/graphql-client';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)

const EditForm = ({ defaultValues, id }) => {

  const methods = useForm({
    defaultValues: {
      ...defaultValues,
      ingredients: defaultValues?.ingredients,
    },
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      ...defaultValues,
      ingredients: defaultValues?.ingredients,
    });
  }, [reset, defaultValues]);

  console.log('defaultValues', defaultValues?.ingredients);

  const [errorMessage, setErrorMessage] = useState('');

const { register, control, handleSubmit, reset, formState, errors } = methods

  const onSubmit = handleSubmit(async ({ title, ingredients }) => {

    // const ingredients = item

    if (errorMessage) setErrorMessage('');

    const query = gql`
      mutation UpdateARecipe($id: ID!, $title: String, $ingredients: [editComponentRecipeIngredientInput]) {
        updateRecipe(
          input: {
            where: { id: $id }
            data: {
              title: $title
              ingredients: $ingredients
            }
          }
        ) {
          recipe {
            id
          }
        }
      }
    `;

    const variables = {
      id,
      title,
      ingredients,
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
        <div>
          {/* <h3>Hello, {user.nickname}</h3> */}
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <div>
                <label>Recipe name</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. bolognese"
                  ref={register({ required: 'Name is required' })}
                />
                <label>Recipe description</label>

                <Ingredients/>


                {/* <Controller
                  as={<WYSIWYGEditor convo={defaultValues.description} />}
                  name="description"
                  control={control}
                /> */}


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
                <Button primary type="submit" size="small" label="Save" />
              </div>
            </form>
            </FormProvider>
        </div>
    </>
  );
};

export default EditForm;
