import React from 'react'
import styled, { css } from 'styled-components';
import { useForm, useFormContext, Controller, useFieldArray, useWatch } from "react-hook-form";

const Value = styled.input`
    /* position: relative;
    width: 5em;
    font-size: 1.5em; */
`;

const Ingredients = () => {
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
                <div key={item.id}>
                    <>{`${index + 1}. `}</>
                    <Controller
                        as={<Value type="number" step="any" placeholder="3" />}
                        name={`ingredients.[${index}].quantity`}
                        {...register(`ingredients.[${index}].quantity`, { 
                            valueAsNumber: true })}
                        control={control}
                        defaultValue={item.quantity || ""} // make sure to set up defaultValue
                    />
                    <Controller
                        as={<select name="measurement" id="measurement">
                        <option value="quantity">quantity</option>
                        <option value="ml">ml</option>
                        <option value="g">g</option>
                        <option value="tablespoon">tablespoon</option>
                        <option value="teaspoon">teaspoon</option>
                        <option value="pinch">pinch</option>
                        <option value="dash">dash</option>
                        <option value="cup">cup</option>
                        <option value="pint">pint</option>
                        <option value="gallon">gallon</option>
                        <option value="oz">oz</option>
                      </select>}
                        name={`ingredients.[${index}].measurement`}
                        control={control}
                        defaultValue={item.measurement || "quantity"} // make sure to set up defaultValue
                    />
                    <Controller
                        as={<input placeholder="Onions" />}
                        {...register(`ingredients.[${index}].ingredient`)}
                        name={`ingredients.[${index}].ingredient`}
                        control={control}
                        defaultValue={item.ingredient || ""} // make sure to set up defaultValue
                    />
                    <button onClick={() => ingredientsRemove(index)}>Delete</button>
                </div>
               
          );
          })}
          <section>
              <button
              type="button"
              onClick={() => {
                ingredientsAppend({ });
              }}
              >
              Add Another ingredient
              </button>
          </section>
        </div>
    )
}

export default Ingredients
