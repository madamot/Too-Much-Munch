import React from 'react'
import styled, { css } from 'styled-components';
import { useForm, useFormContext, Controller, useFieldArray, useWatch } from "react-hook-form";
import WYSIWYGEditor from '../WYSIWYG/WYSIWYG';
import axios from 'axios';

const MethodText = styled.textarea`
    width: 100%;
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

     const uploadImage = async (files) => {
    
        const formData = new FormData()
    
        formData.append('files', files[0])
    
        axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/upload`, formData)
        .then((response)=>{
            changeRecipeImage(response.data[0].id)
            setUploaded(true)
            //after success
        }).catch((error)=>{
            //handle error
        })
    }


    return (
        <div>
            <h3>Method</h3>
            {methodFields.map((item, index) => {
            return (
                <div key={item.id}>
                    <Controller
                        as={<MethodText />}
                        {...register(`method.${index}.method`, { required: true })}
                        name={`method.${index}.method`}
                        control={control}
                        defaultValue={item?.method || ''} 
                    />
                    <input {...register(`method.${index}.image`)} onChange={(e) => uploadImage(e.target.files)} type="file" />
                    <button onClick={() => methodRemove(index)}>Delete</button>
                </div>
                
               
          );
          })}
          <section>
              <Add
                type="button"
                onClick={() => {
                    methodAppend({ });
                }}
              >
                &#x2795; Step
              </Add>
          </section> 
        </div>
    )
}

export default Method
