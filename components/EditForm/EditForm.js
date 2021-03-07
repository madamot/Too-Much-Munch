import React, { useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import { gql } from 'graphql-request';
import { useForm, Controller } from 'react-hook-form';
import WYSIWYGEditor from '../../components/WYSIWYG/WYSIWYGedit';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import dynamic from 'next/dynamic';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import WYSIWYGEditor from '../../components/WYSIWYG/WYSIWYG';

import Button from '../../components/Button/Button';
import { graphQLClient } from '../../utils/graphql-client';

import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)

const EditForm = ({ defaultValues, id }) => {

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  useEffect(() => {
    if (defaultValues) {
        setValue("description", editorState);
      }
}, [defaultValues])




  const [errorMessage, setErrorMessage] = useState('');

  const blocksFromHTML = convertFromHTML(
        defaultValues.description
    );


    const content = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
    );

    const [editorState, setEditorState] = useState(EditorState.createWithContent(content));

    const [convertedContent, setConvertedContent] = useState(null);

    // const onChange = editorState => {
    //       setEditorState(editorState);
    //     }

    const handleEditorChange = (state) => {
      setEditorState(state);
      // console.log(editorState);
      convertContentToHTML();
    }

    const convertContentToHTML = () => {
      let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
      setConvertedContent(currentContentAsHTML);
      console.log(convertedContent);
      // setValue("description", convertedContent);
      return convertedContent
    }


  const {
      isLoading,
      isAuthenticated,
      error,
      user,
      loginWithRedirect,
      logout,
    } = useAuth0();


  const { handleSubmit, register, reset, errors, control, setValue } = useForm({
    defaultValues: {
      ...defaultValues,
    },
    mode: "onChange",
  });

  const description = useRef();

  const onSubmit = handleSubmit(async ({ name, description }) => {
    if (errorMessage) setErrorMessage('');
    // console.log(description);

    const query = gql`
      mutation UpdateARecipe($id: ID!, $name: String!, $description: String!) {
        updateRecipe(id: $id, data: {
          name: $name,
          description: $description,
        }) {
          name
          description
        }
      }
    `;

    const variables = {
      id,
      name,
      description,
    };

    try {
      await graphQLClient.request(query, variables);
      Router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  });


  return (
    <>
      {isAuthenticated ? (
        <div>
          <h3>Hello, {user.nickname}</h3>

          <form onSubmit={onSubmit}>
            <div>
              <label>Recipe name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. bolognese"
                ref={register({ required: 'Name is required' })}
              />
              <label>Recipe description</label>

              {content ? (
                <>
                  <Controller
                    as={<WYSIWYGEditor convo={defaultValues.description} />}
                    name="description"
                    control={control}
                    ref={(e) => {
                      register(e)
                      description.current = e // you can still assign to ref
                    }}
                    ref={register({ required: 'Description is required' })}
                  />
                </>
              ) : (
                <div>loading...</div>
              )}
              {/* {content &&  (
                <Controller
                  as={<WYSIWYGEditor convo={content} />}
                  name="description"
                  control={control}
                  ref={register}
                />
              )} */}


              {/* <Controller
                name="description"
                control={control}
                render={({ editorState, handleEditorChange }) => (
                  <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                  />
                )}

              /> */}

              {/* <Editor
                editorState={editorState}
                name="description"
                onEditorStateChange={handleEditorChange}
                defaultValue={editorState}
                value={editorState}
              /> */}
              {/* <p>{description}</p> */}
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
            </div>
            <div>
              <Button type="submit" size="small" label="Update" />
            </div>
          </form>

        </div>

      ) : (null)}
    </>
  );
};

export default EditForm;
