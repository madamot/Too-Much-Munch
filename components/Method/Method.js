import React from 'react'
import { useForm, useFormContext, Controller, useFieldArray, useWatch } from "react-hook-form";
import WYSIWYGEditor from '../WYSIWYG/WYSIWYG';

const Method = () => {
    const { register, control } = useFormContext();

    const {
        fields: methodFields,
        append: methodAppend,
        remove: methodRemove
    } = useFieldArray({ 
        control, 
        name: "method"
     });


    return (
        <div>
            Method
            {methodFields.map((item, index) => {
            return (
                <div key={item?.id}>
                    <Controller
                        as={<textarea />}
                        {...register(`method.${index}.method`, { required: true })}
                        name={`method.${index}.method`}
                        control={control}
                        defaultValue={item?.method || ' '} 
                    />
                    <button onClick={() => methodRemove(index)}>Delete</button>
                </div>
                
               
          );
          })}
          <section>
              <button
              type="button"
              onClick={() => {
                methodAppend({ });
              }}
              >
              Add Another Step
              </button>
          </section> 
        </div>
    )
}

export default Method
