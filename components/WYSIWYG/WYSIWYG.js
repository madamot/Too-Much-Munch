import React, { useState, useEffect } from 'react';

import { EditorState, ContentState } from 'draft-js';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import {stateFromHTML} from 'draft-js-import-html';
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)
const draftToMarkdown = dynamic(
  () => import('draftjs-to-markdown'),
  { ssr: false }
)


const WYSIWYGEditor = props => {

if (props.convo) {
  useEffect(() => {
    const blocksFromHTML = convertFromHTML(
          props.convo
      );


      // const content = ContentState.createFromBlockArray(
      //     blocksFromHTML.contentBlocks,
      //     blocksFromHTML.entityMap
      // );

      setEditorState(EditorState.createWithContent(blocksFromHTML));
  }, [props.convo]);
}


  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const [convertedContent, setConvertedContent] = useState(null);

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
    // setConvertedContent(state)
  }

  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML({
      blockToHTML: (block) => {
        const type = block.type
        console.log(block);
        if (type === 'atomic') {
          let url = block.data.url
          return { start: "<img src='" + (url) + "'", end: "</img>" }
        }
        if (type === 'unstyled') {
          return <p />
        }
      },

     //  blockToHTML: (block) => {
     //   const type = block.type
     //   if (type === 'atomic') {
     //     let url = block.data.src
     //     return <img src={url} />
     //   }
     //   if (type === 'unstyled') {
     //     return <p />
     //   }
     // },
})(editorState.getCurrentContent());
    setConvertedContent(editorState);
    console.log("PROPS ==> ", props);
    return props.onChange(
      convertedContent
    );
  }

  const uploadCallback = (file) => {
  return new Promise(
    (resolve, reject) => {
      resolve({ data: { link: "http://dummy_image_src.com" } });
    }
  );
}

    return (

      <Editor
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'emoji', 'remove', 'history'],
        }}
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
      />

    );
  }

  export default WYSIWYGEditor;
