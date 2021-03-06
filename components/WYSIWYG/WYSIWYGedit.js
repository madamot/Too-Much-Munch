import React, { useState, useEffect } from 'react';

import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML } from 'draft-convert';
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)

const WYSIWYGEditor = props => {

  // useEffect(() => {
    // console.log(props.convo);
  //   const blocksFromHTML = convertFromHTML(
  //         props.convo
  //     ); // asynchronously reset your form values
  // }, [props.convo]);

    const blocksFromHTML = convertFromHTML(
          props.convo
      );


      const content = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
      );

      const [editorState, setEditorState] = useState(EditorState.createWithContent(content));

  const [convertedContent, setConvertedContent] = useState(null);

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  }

  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);

    console.log("PROPS ==> ", props);
    return props.onChange(
      convertedContent
    );
  }

    return (

      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
      />

    );
  }

  export default WYSIWYGEditor;
