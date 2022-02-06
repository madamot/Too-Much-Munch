import React from 'react'
import Image from 'next/image';
import styled, { css } from 'styled-components';

const ImageContainer = styled.div`
  width: 100%;
  height: 25em;
  position: relative;
`;

const ViewRecipe = ({data}) => {
    return (
        <div>
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
              {index + 1}. {ingredient.ingredient}
            </div>
          ))}
          <h3>Method</h3>
          {data.recipe.method.map(({method}, index) => (
            <div>{index + 1}. {method}</div>
          ))}
          <br />
        </div>
    )
}

export default ViewRecipe
