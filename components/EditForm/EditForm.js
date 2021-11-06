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
import Method from '../Method/Method';
import Button from '../../components/Button/Button';
import Select from 'react-select';
import { graphQLClient } from '../../utils/graphql-client';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)

const EditForm = ({ defaultValues, id, courses, cuisines, meals }) => {

  const methods = useForm({
    defaultValues: {
      ...defaultValues,
      ingredients: defaultValues?.ingredients,
      method: defaultValues?.method
    },
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      ...defaultValues,
      ingredients: defaultValues?.ingredients,
      method: defaultValues?.method
    });
  }, [reset, defaultValues]);

  const [errorMessage, setErrorMessage] = useState('');

const { register, control, handleSubmit, reset, formState, errors } = methods

  const onSubmit = handleSubmit(async ({ title, course, cuisine, meal, ingredients, method }) => {

    console.log(course);

    // const ingredients = item

    if (errorMessage) setErrorMessage('');

    const query = gql`
      mutation UpdateARecipe($id: ID!, $title: String, $course: ID!, $cuisine: ID!, $meal: ID!, $ingredients: [editComponentRecipeIngredientInput], $method: [editComponentRecipeMethodInput]) {
        updateRecipe(
          input: {
            where: { id: $id }
            data: {
              title: $title
              course: $course
              cuisine: $cuisine
              meal: $meal
              ingredients: $ingredients
              method: $method
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
      course,
      cuisine,
      meal,
      ingredients,
      method
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

                <select name="course" defaultValue={defaultValues.course.id} ref={register({ required: 'Name is required' })}>
                {courses.map((course, index) => {
                  console.log('yes', defaultValues.course.id);
                  console.log('no', course.id);
                  return (
                    <>
                    {/* {defaultValues.course.id === course.id ? (
                      <option value={parseInt(course.id)} selected>{course.name}</option>
                     ) : (
                      <option value={parseInt(course.id)}>{course.name}</option>
                     )} */}
                     <option value={parseInt(course.id)}>{course.name}</option>
                     </>
                );
                })}
                </select>

                {/* <Controller
                        as={<Select
                          value={defaultValues.course.id}
                          options={courses}
                        />}
                        name="course"
                        control={control}
                    /> */}

                <select name="cuisine" ref={register({ required: 'Name is required' })}>
                {cuisines.map((course, index) => {
                  return (
                    <option value={parseInt(course.id)}>{course.name}</option>
                );
                })}
                </select>

                <select name="meal" ref={register({ required: 'Name is required' })}>
                {meals.map((course, index) => {
                  return (
                    <option value={parseInt(course.id)}>{course.name}</option>
                );
                })}
                </select>

                <Ingredients/>

                <Method />

                {/* <Controller
                  as={<WYSIWYGEditor convo={defaultValues.method} />}
                  name="method"
                  control={control}
                  defaultValue={defaultValues.method} 
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
