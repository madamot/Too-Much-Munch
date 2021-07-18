import React, { useState, useEffect } from 'react';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import dynamic from 'next/dynamic';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import {stateFromHTML} from 'draft-js-import-html';
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)


const WYSIWYGEditor = props => {

if (props.convo) {
  useEffect(() => {
    // const blocksFromHTML = convertFromHTML(
    //       props.convo
    //   );

      const contentBlock = htmlToDraft(props.convo);
      if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
          }

      // const content = ContentState.createFromBlockArray(
      //     blocksFromHTML.contentBlocks,
      //     blocksFromHTML.entityMap
      // );

      // setEditorState(EditorState.createWithContent(blocksFromHTML));
  }, [props.convo]);
}


  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const [convertedContent, setConvertedContent] = useState(null);

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  }

  const convertContentToHTML = () => {
    // let currentContentAsHTML = convertToHTML({
    //   blockToHTML: (block) => {
    //     const type = block.type
    //     if (type === 'atomic') {
    //       console.log(block.data);
    //       let url = block.data.src
    //       return { start: `<img src='${url}'`, end: "</img>" }
    //     }
    //     if (type === 'unstyled') {
    //       return <p />
    //     }
    //   },

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
// })(editorState.getCurrentContent());

let currentContentAsHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    setConvertedContent(currentContentAsHTML);
    console.log("PROPS ==> ", props);
    return props.onChange(
      convertedContent
    );
  }


function uploadImageCallBack(file) {
        return new Promise(
        (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.cloudinary.com/v1_1/madamot/image/upload');
            // xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "toomuchmunch");
            data.append("cloud_name", "madamot");
            xhr.send(data);
            xhr.addEventListener('load', () => {

                var data = JSON.parse(xhr.responseText);

                // Magic Happens Here

                var response = {data:  {link: data.secure_url} }
                // console.log(response)

            resolve (response);
            // console.log(response);
            });
            xhr.addEventListener('error', () => {
            const error = JSON.parse(xhr.responseText);
            reject(error);
            });
        }
        );
    }

    const uploadImage = () => {
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "toomuchmunch")
    data.append("cloud_name","madamot")
    fetch("https://api.cloudinary.com/v1_1/madamot/image/upload",{
    method:"post",
    body: data
    })
    .then(resp => resp.json())
    .then(data => {
    // setUrl(data.url)
    })
    .catch(err => console.log(err))
    }


    return (
      <>

        <Editor
          toolbar={{
            // options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'emoji', 'remove', 'history'],
            image: {
              urlEnabled: true,
              uploadEnabled: true,
              previewImage: true,
              uploadCallback: uploadImageCallBack,
            }
          }}
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
        />

        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </>
    );
  }

  export default WYSIWYGEditor;
