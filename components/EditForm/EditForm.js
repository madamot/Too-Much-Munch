import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { gql } from 'graphql-request';
import { useForm, useFieldArray, Controller, FormProvider, useFormContext } from 'react-hook-form';
import WYSIWYGEditor from '../../components/WYSIWYG/WYSIWYG';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import dynamic from 'next/dynamic';
import styled, { css } from 'styled-components';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Ingredients from '../Ingredients/Ingredients';
import Method from '../Method/Method';
import Button from '../../components/Button/Button';
import ImageUpload from '../ImageUpload/ImageUpload';
import { Container, Row, Col } from 'react-grid-system';
import { graphQLClient } from '../../utils/graphql-client';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)

const Name = styled.input`
  width: 100%;
  border: none;
  font-size: 2em;
`;

const EditForm = ({ defaultValues, id, courses, cuisines, meals, measurements }) => {
  console.log(defaultValues);

  const methods = useForm({
    defaultValues: {
      ...defaultValues,
      ingredients: defaultValues.ingredients,
      method: defaultValues.method
    },
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      ...defaultValues,
      ingredients: defaultValues?.ingredients,
      method: defaultValues?.method,
      course: defaultValues?.course?.id,
      cuisine: defaultValues?.cuisine?.id,
      meal: defaultValues?.meal?.id,
    });
  }, [reset, defaultValues]);

  const [errorMessage, setErrorMessage] = useState('');
  const [recipeImage, changeRecipeImage] = useState();


  const { register, control, handleSubmit, reset, formState, errors } = methods

  const onSubmit = handleSubmit(async ({ title, image, course, cuisine, meal, ingredients, method }, data) => {


    if (errorMessage) setErrorMessage('');

    const query = gql`
      mutation UpdateARecipe($id: ID!, $title: String, $recipeImage: ID, $course: ID!, $cuisine: ID!, $meal: ID!, $ingredients: [editComponentRecipeIngredientInput], $method: [editComponentRecipeMethodInput]) {
        updateRecipe(
          input: {
            where: { id: $id }
            data: {
              title: $title
              image: $recipeImage
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
      recipeImage,
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
      console.error('error', error);
      setErrorMessage(error.message);
    }
  });


  return (
    <Container>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
            <Row>
              <Col md={10}>
                <Name
                  type="text"
                  name="title"
                  placeholder="Recipe name"
                  ref={register({ required: 'Name is required' })}
                />
                <ImageUpload changeRecipeImage={changeRecipeImage} logo={defaultValues?.image?.url} />
                <Ingredients measurements={measurements} />
                <Method />
              </Col>
              <Col md={2}>
                <Controller
                  as={<select name="course" ref={register({ required: 'Name is required' })}>
                  {courses.map((course, index) => {
                    return (
                        <option key={course?.id} value={parseInt(course.id)}>{course?.name}</option>
                  );
                  })}
                  </select>}
                  name='course'
                  control={control}
                  defaultValue={parseInt(defaultValues?.course?.id)} // make sure to set up defaultValue
                />
                <Controller
                  as={<select name="cuisine" ref={register({ required: 'Name is required' })}>
                  {cuisines.map((cuisine, index) => {
                    return (
                      <option key={cuisine?.id} value={parseInt(cuisine.id)}>{cuisine?.name}</option>
                  );
                  })}
                  </select>}
                  name='cuisine'
                  control={control}
                  defaultValue={parseInt(defaultValues?.cuisine?.id)} // make sure to set up defaultValue
                />
                <Controller
                  as={<select name="meal" ref={register({ required: 'Name is required' })}>
                  {meals.map((meal, index) => {
                    return (
                      <option key={meal?.id} value={parseInt(meal.id)}>{meal?.name}</option>
                  );
                  })}
                  </select>}
                  name='meal'
                  control={control}
                  defaultValue={parseInt(defaultValues?.meal?.id)} // make sure to set up defaultValue
                />
              </Col>
            </Row>


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
            {errorMessage && 
              <p>{errorMessage}</p>
            }
          <div>
            <Button primary type="submit" size="small" label="Save" />
          </div>
        </form>
      </FormProvider>
    </Container>
  );
};

export default EditForm;
