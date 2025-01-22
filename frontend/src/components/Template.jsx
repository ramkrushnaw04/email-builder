import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Template = ({ name }) => {
    const navigate = useNavigate()
    const [htmlContent, setHtmlContent] = useState("")

    // fetch template from backend
    useEffect(() => {

        axios.get(import.meta.env.VITE_BACKEND_URL + '/getEmailLayput', {
            params: {
                template: name
            }
        })
            .then(res => setHtmlContent(res.data))
            .catch(err => console.log(err))
    }, [])


    function navigateTo() {
        navigate('/' + name)
    }





    return (
        <button
            className="h-[400px] overflow-hidden w-[300px] m-auto bg-gray-100 hover:bg-gray-200 rounded-md shadow-md relative transition-all duration-300 ease-in-out border border-gray-300 group"
            onClick={navigateTo}
        >
            {/* Main Content */}
            <div
                className="flex items-center justify-center h-full w-full text-gray-700 text-lg font-medium pointer-events-none group-hover:opacity-50 transition-opacity duration-300"
            >
                {name}
            </div>

            {/* Poster */}
            <div className="absolute w-full h-full inset-0 hidden group-hover:flex flex-col justify-center items-center bg-gray-900 bg-opacity-80 text-white text-lg font-medium rounded-md">
                <span>{name}</span>
                <span className="text-sm">Start Editing...</span>
            </div>
        </button>
    )
}

export default Template
