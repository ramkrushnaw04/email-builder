import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useParams } from 'react-router-dom';
import axios from "axios"


function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}


const ImageSelectComponent = ({ setImageLink }) => {
    const [images, setImages] = useState([]);
    const { template } = useParams()
    const [uploading, setUploading] = useState(false)

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            convertImageToBase64(file)
                .then(base64 => {
                    setImages((prevImages) => [...prevImages, base64]);

                    axios.post(import.meta.env.VITE_BACKEND_URL + '/uploadImage', {
                        template,
                        image: base64
                    })
                        .then(res => {
                            // console.log(res.status)
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    };


    // fetch images of template
    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_URL + '/getImagesOfTemplate', {
            params: {
                template: template
            }
        })
            .then(res => {
                setImages(res.data)
            })
            .catch(err => console.log(err))
    }, [])


    function handleDeleteImage(index) {
        axios.post(import.meta.env.VITE_BACKEND_URL + '/deleteImage', {
            image: images[index]
        })
            .then(() => {
                setImages(pre => {
                    return pre.filter((_, i) => i !== index)
                })
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            {/* <h6 className='text-sm font-bold text-gray-900 ml-1'>Select Images</h6> */}
            <div className="w-full max-h-[320px] overflow-y-scroll grid grid-cols-3 gap-5 p-5 bg-white rounded-md border border-gray-300 ">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative group h-20 w-20"
                    >
                        <img
                            src={image}
                            alt={`Uploaded ${index}`}
                            className="h-full w-full object-cover rounded"
                            onClick={() => setImageLink(image)}
                        />
                        <img
                            src="/icons/trash-bin.png"
                            alt="Delete"
                            className="absolute top-1 bg-white rounded-sm right-1 w-4 h-4 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteImage(index)}
                        />
                    </div>
                ))}
                <label
                    className="w-20 h-20 bg-gray-200 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-400"
                >
                    +
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </label>
            </div>
        </>
    );
};

export default ImageSelectComponent;
