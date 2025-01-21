import React, { useState, useEffect } from 'react'
import Template from '../components/Template'
import axios from 'axios'

const TemplateSelection = () => {
    const [templates, setTemplates] = useState([])

    // fetch template names
    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_URL + '/getTemplates')
            .then(res => {
                setTemplates(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <body className=" bg-orange-200 min-h-screen">
            <main className="flex flex-col items-center justify-center p-6 min-h-screen">
                {/* Header */}
                <h1 className="text-3xl font-bold text-gray-800 mb-8 py-6">
                    Select Templates
                </h1>

                {/* Template Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl px-4"> {
                    templates.map(item => {
                        return  <Template key={item} name={item} />
                    })
                } </section>


            </main>
        </body>
    )
}

export default TemplateSelection
