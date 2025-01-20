import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, useParams } from 'react-router-dom';
import axios from "axios"

const EditingPage = () => {
    const {template} = useParams()
    const [htmlContent, setHtmlContent] = useState("")
    const [selectedElement, setSelectedElement] = useState(null)
    const inputRef = useRef(null)
    const linkRef = useRef(null)
    const [imageLink, setImageLink] = useState("")
    const [mobile, setMobile] = useState(true)

    // for additional settings menu
    const [isLink, setIsLink] = useState(false)
    const [isImage, setIsImage] = useState(false)
    const changes = useRef({})

    // fetch template from backend
    useEffect(() => {

        axios.get(import.meta.env.VITE_BACKEND_URL + '/getEmailLayput', {
            params: {
                template: template
            }
        })
            .then(res => setHtmlContent(res.data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (!selectedElement || !['P', 'BUTTON', 'A', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'IMG'].includes(selectedElement.tagName)) return
        inputRef.current.value = selectedElement.innerText
        selectedElement.style.border = "1px solid brown";
        selectedElement.style.borderRadius = "10px"

        if (['A'].includes(selectedElement.tagName)) setIsLink(true) 
        else setIsLink(false)

        if(selectedElement.tagName == 'IMG') {
            setIsImage(true)
            setImageLink(selectedElement.src)
        }
        else setIsImage(false)

    }, [selectedElement])

    useEffect(() => {
        if (!linkRef.current || !selectedElement) return
        if(!isLink) {
            linkRef.current.value = "";
            return
        }
        linkRef.current.value = selectedElement.href

    }, [isLink, selectedElement])


    function handleClick(e) {
        if (selectedElement) selectedElement.style.border = ""
        setSelectedElement(e.target)
    }

    function saveChanges() {

        // save current changes of corresponding ids
        selectedElement.innerText = inputRef.current.value
        changes.current[selectedElement.id] = { 
            ...changes.current[selectedElement.id],    
            innerText: selectedElement.innerText 
        }
        // inputRef.current.value = ""
        // selectedElement.style.border = ""
        // setSelectedElement(null)
    
        // update link
        if(linkRef.current) {
            selectedElement.href = linkRef.current.value
            changes.current[selectedElement.id] = { 
                    ...changes.current[selectedElement.id],    
                    href: selectedElement.href 
                }
            // linkRef.current.value = ""
            // selectedElement.style.border = ""
            // setSelectedElement(null)
        }

        // update image url
        if(selectedElement.tagName == 'IMG') {
            selectedElement.src = imageLink
            changes.current[selectedElement.id] = { 
                ...changes.current[selectedElement.id],    
                src: selectedElement.src 
            }
            // selectedElement.style.border = ""
            // setSelectedElement(null)
            // setImageLink("")
        }

        // console.log('chages: ', changes.current)
    }

    function downloadFile() {
        axios.post(import.meta.env.VITE_BACKEND_URL + '/renderAndDownloadTemplate', {
            changes: changes.current,
            template: template+'.html'
        })
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }

    return (
        <div className='w-screen h-screen flex  flex-col sm:flex-row '>

            
            {/* canvas */}
            <main className=' sm:h-full flex-1 relative bg-blue-400 flex justify-center items-center p-2'>

                {/* button to switch btwn mobile and desktop view */}
                <button
                    className='absolute top-0 left-0 px-2 py-1 bg-green-600 rounded-sm'
                    onClick={() => setMobile(state => !state)}
                >Switch</button>

                <section
                    className={`canvas rounded-xl ${mobile ? 'w-[380px]' : 'w-full'} h-full overflow-y-scroll`}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    onClick={handleClick}
                >
                </section>
            </main>




            {/* controls */}
            <aside className='h-[200px] sm:h-full w-screen sm:w-[400px] bg-red-500 relative'>

                <section className='w-full h-[50px] bg-gray-400 flex justify-center items-center gap-4'>
                    <button className='btn'>Save</button>
                    <button 
                        className='btn'
                        onClick={downloadFile}
                    >Download</button>
                </section>


                {isLink && <div className='w-full p-2 flex flow-row justify-between gap-2 items-center '>
                    <textarea ref={linkRef} type="text" placeholder='link'  className='flex-1' />
                </div>}

                <div className='w-full p-2 flex flow-row justify-between gap-2 items-center'>
                    <textarea ref={inputRef} type="text" placeholder='text' className='flex-1'/>
                </div>

                {isImage && <div className='w-full p-2 flex flex-col justify-between gap-2 items-center'>
                    <img className='w-full rounded-md' src={imageLink}
                        alt="image" 
                    />
                    <textarea 
                        className='w-full' placeholder='image url' value={imageLink} name="" id=""
                        onChange={(e) => setImageLink(e.target.value)}
                    ></textarea>
                </div>}

                <div className='w-full p-2 flex flow-row justify-center gap-2 items-center'>
                    <button
                        className='btn'
                        onClick={saveChanges}
                    >Done</button>
                </div>
                


            </aside>
            

        </div>
    )
}

export default EditingPage
