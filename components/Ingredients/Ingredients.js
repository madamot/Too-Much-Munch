import React from 'react'
import { useForm, useFormContext, Controller, useFieldArray, useWatch } from "react-hook-form";
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
            Ingredients
            {ingredientsFields.map((item, index) => {
            return (
                <div key={item.id}>
                    <Controller
                        as={<input />}
                        name={`ingredients.${index}.ingredient`}
                        control={control}
                        defaultValue={item.ingredient} // make sure to set up defaultValue
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
