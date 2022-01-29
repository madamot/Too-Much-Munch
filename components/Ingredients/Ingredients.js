import React from 'react'
import styled, { css } from 'styled-components';
import Select from "react-select";
import { useForm, useFormContext, Controller, useFieldArray, useWatch } from "react-hook-form";

const IngredientContainer = styled.div`
    display: flex;
    padding: .5em 0;
`;

const Number = styled.div`
  font-size: 1.25em;

`;

const Ingredient = styled.input`
  width: 100%;
  border: none;
  font-size: 1.25em;
`;

const Add = styled.button`
  padding: .5em;
  font-size: 1em;
  background-color: transparent;
    background-repeat: no-repeat;
    border: none;
    cursor: pointer;
    overflow: hidden;
    outline: none;
`;

const Ingredients = ({ measurements }) => {
    const { register, control } = useFormContext();

    const {
        fields: ingredientsFields,
        append: ingredientsAppend,
        remove: ingredientsRemove
    } = useFieldArray({ 
        control, 
        name: "ingredients"
     });


    return (
        <div>
            <h3>Ingredients</h3>
            {ingredientsFields.map((item, index) => {
            return (
                <IngredientContainer key={item.id}>
                    <Number>{`${index + 1}. `}</Number>
                    <Controller
                        as={<Ingredient placeholder="Onions" />}
                        {...register(`ingredients.[${index}].ingredient`)}
                        name={`ingredients.[${index}].ingredient`}
                        control={control}
                        defaultValue={item.ingredient || ""} // make sure to set up defaultValue
                    />
                    <button onClick={() => ingredientsRemove(index)}>&#x1F5D1;</button>
                </IngredientContainer>
               
          );
          })}
          <section>
              <Add
                type="button"
                onClick={() => {
                    ingredientsAppend({ });
                }}
              >
                &#x2795; ingredient
              </Add>
          </section>
        </div>
    )
}

export default Ingredients
