import React from 'react'
import { useForm, useFormContext, Controller, useFieldArray, useWatch } from "react-hook-form";
const Ingredients = () => {
    const { register, control } = useFormContext();

    const {
        fields: ingredientsFields,
        append: ingredientsAppend,
        remove: ingredientsRemove
    } = useFieldArray({ control, name: "item" });

    const methods = useFormContext();


    return (
        <div>
            Ingredients
            {ingredientsFields.map((item, index) => {
            return (
              <div key={item.id}>
                    <input
                    // defaultValue={`${item.ingredient}`}
                        {...methods.register(`item[${index}].ingredient`)}
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
              Add Another Investment
              </button>
          </section>
        </div>
    )
}

export default Ingredients
