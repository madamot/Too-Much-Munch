import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML } from 'draft-convert';
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)

const WYSIWYGEditor = props => {

  useEffect(() => {
    const blocksFromHTML = convertFromHTML(
          props.convo
      );


      const content = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
      );

      setEditorState(EditorState.createWithContent(content));
  }, [props.convo]);



      const [editorState, setEditorState] = useState(
      () => EditorState.createEmpty(),);

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
