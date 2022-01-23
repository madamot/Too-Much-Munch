import React from 'react'
import styled, { css } from 'styled-components';
import Select from "react-select";
import { useForm, useFormContext, Controller, useFieldArray, useWatch } from "react-hook-form";

const Value = styled.input`
    /* position: relative;
    width: 5em;
    font-size: 1.5em; */
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

     console.log('ingredientsFields', ingredientsFields);


    return (
        <div>
            <h3>Ingredients</h3>
            {ingredientsFields.map((item, index) => {
                console.log('item', item);
            return (
                <div key={item.id}>
                    <>{`${index + 1}. `}</>
                    {/* <Controller
                        as={<Value type="number" step="any" placeholder="3" />}
                        name={`ingredients.[${index}].quantity`}
                        {...register(`ingredients.[${index}].quantity`, { 
                            valueAsNumber: true })}
                        control={control}
                        defaultValue={item.quantity || ""} // make sure to set up defaultValue
                    />
                    <Controller
                        as={<select name="measurement" id="measurement">
                        {measurements.map((measurement, index) => {
                        return (
                            <option key={measurement?.id} value={measurement?.id}>{measurement?.name} ({measurement?.unit})</option>
                        );
                        })}
                      </select>}
                        name={`ingredients.[${index}].measurement`}
                        {...register(`ingredients.[${index}].measurement`)}
                        control={control}
                        defaultValue={item?.measurement.id} // make sure to set up defaultValue
                    /> */}

                    {/* for some reason i think the register in the controller above passes the measurement if in an object. The gql query doesnt accept this and it is therefore breaking  */}
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
