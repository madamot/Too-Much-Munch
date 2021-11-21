import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const ImageUpload = ({ changeRecipeImage, logo }) => {

    const [files, setFiles] = useState()

    useEffect(() => {


        if (files) {
            uploadImage()
        }
    }, [logo, files]);

    console.log(files);

    const uploadImage = async () => {
    
        const formData = new FormData()
    
        formData.append('files', files[0])
    
        axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/upload`, formData)
        .then((response)=>{
            changeRecipeImage(response.data[0].id)
            //after success
        }).catch((error)=>{
            //handle error
        })
    }


    return (
        <div>
            ImageUpload
            <input
            type="file"
            name="files"
            onChange={(e)=>setFiles(e.target.files)}
            alt="image"
            />
            <br />
            {logo && <img src={logo} width="100" />}
        </div>
    )
}

export default ImageUpload
