import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const ImageUploader = styled.input`
  display: none;
`;

const ImageUploaderLabel = styled.label`
    border: 1px solid #ccc;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
`;

const ImageUpload = ({ changeRecipeImage, logo }) => {

    const [files, setFiles] = useState()
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (files) {
            uploadImage()
        }
    }, [logo, files]);

    const uploadImage = async () => {
        setUploading(true)
        const formData = new FormData()
    
        formData.append('files', files[0])
    
        axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/upload`, formData)

        .then((response)=>{
            changeRecipeImage(response.data[0].id)
            setUploaded(true)
            setUploading(false)
            //after success
        }).catch((error)=>{
            //handle error
            setError(true)
        })
    }


    return (
        <div>
            <ImageUploaderLabel htmlFor="file-upload">
                Upload recipe image
            </ImageUploaderLabel>
            <ImageUploader
                id="file-upload"
                type="file"
                name="files"
                onChange={(e) => setFiles(e.target.files)}
                alt="image"
            />

            <br />
            {logo && <img src={logo} width="100" />}
            {uploaded && <p>Uploaded!</p>}
            {uploading && <p>Uploading...</p>}
            {error && <p>An error occured, please try again</p>}
        </div>
    )
}

export default ImageUpload
