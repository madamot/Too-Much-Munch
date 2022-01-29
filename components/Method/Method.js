import React from 'react'
import styled, { css } from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import { useForm, useFormContext, Controller, useFieldArray, useWatch } from "react-hook-form";
import WYSIWYGEditor from '../WYSIWYG/WYSIWYG';
import axios from 'axios';

const MethodContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const MethodText = styled(TextareaAutosize)`
    width: 100%;
    border: none;
    font-size: 1.25em;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    resize: none;
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
                    <MethodContainer>
                        <Controller
                            as={<MethodText />}
                            {...register(`method.${index}.method`, { required: true })}
                            name={`method.${index}.method`}
                            control={control}
                            defaultValue={item?.method || ''} 
                        />
                        <div>
                            <button onClick={() => methodRemove(index)}>&#x1F5D1;</button>
                        </div>
                    </MethodContainer>
                    <input {...register(`method.${index}.image`)} onChange={(e) => uploadImage(e.target.files)} type="file" />
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
