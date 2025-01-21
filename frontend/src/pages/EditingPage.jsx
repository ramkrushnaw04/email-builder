import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, useParams } from 'react-router-dom';
import axios from "axios"

const EditingPage = () => {
    const { template } = useParams()
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

    // fetch saved changes from db
    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_URL + '/getSavedChanges', {
            params: {
                template: template+'.html'
            }
        })
            .then(res => {
                changes.current = res.data.changes
            })
            .catch(err => console.log(err))
    }, [])

    // handle chanegs when selected element changes
    useEffect(() => {
        if (!selectedElement || !['P', 'BUTTON', 'A', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'IMG'].includes(selectedElement.tagName)) {
            setSelectedElement(null)
            return
        }
        inputRef.current.value = selectedElement.innerText
        selectedElement.style.border = "1px solid brown";
        selectedElement.style.borderRadius = "10px"

        if (['A'].includes(selectedElement.tagName)) setIsLink(true)
        else setIsLink(false)

        if (selectedElement.tagName === 'IMG') {
            setIsImage(true)
            setImageLink(selectedElement.src)
        } else setIsImage(false)

    }, [selectedElement])

    useEffect(() => {
        if (!linkRef.current || !selectedElement) return
        if (!isLink) {
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
        selectedElement.innerText = inputRef.current.value
        changes.current[selectedElement.id] = {
            ...changes.current[selectedElement.id],
            innerText: selectedElement.innerText
        }

        if (linkRef.current) {
            selectedElement.href = linkRef.current.value
            changes.current[selectedElement.id] = {
                ...changes.current[selectedElement.id],
                href: selectedElement.href
            }
        }

        if (selectedElement.tagName === 'IMG') {
            selectedElement.src = imageLink
            changes.current[selectedElement.id] = {
                ...changes.current[selectedElement.id],
                src: selectedElement.src
            }
        }
    }

    function downloadFile() {
        axios.post(import.meta.env.VITE_BACKEND_URL + '/renderAndDownloadTemplate', {
            changes: changes.current,
            template: template + '.html'
        })
            .then(res => {
                const updatedHtml = res.data
                const blob = new Blob([updatedHtml], { type: 'text/html' })
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = template+'.html';
                link.click();
                URL.revokeObjectURL(url);
            })
            .catch(err => console.log(err))
    }


    function saveChangesToDB() {
        axios.post(import.meta.env.VITE_BACKEND_URL + '/uploadEmailConfig', {
            changes: changes.current,
            template: template + '.html'
        })
            .then(res => console.log(res.status))
            .catch(err => console.log(err))
    }

    function loadChanges() {
        axios.get(import.meta.env.VITE_BACKEND_URL + '/loadTemplateWithChanges', {
            params: {
                template: template+'.html'
            }
        })
            .then(res => {
                setHtmlContent(res.data.updatedTemplateText)
                changes.current = res.data.changes
            })
            .catch(err => console.log(err))
    }

    function resetTemplate() {
        axios.get(import.meta.env.VITE_BACKEND_URL + '/getEmailLayput', {
            params: {
                template: template
            }
        })
            .then(res => {
                setHtmlContent(res.data)
                changes.current = {}
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="w-screen h-screen flex flex-col sm:flex-row bg-gray-50">

            {/* canvas */}
            <main className="sm:h-full flex-1 relative bg-white flex justify-center items-center p-4 border-r border-gray-300 shadow-md">

                {/* button to switch between mobile and desktop view */}
                <button
                    className="absolute top-3 left-3 px-3 py-2 bg-gray-200 hover:bg-gray-300 transition-colors rounded-sm shadow-sm"
                    onClick={() => setMobile((state) => !state)}
                >
                    {mobile ? (
                        <img className="w-5 h-5" src="/icons/smartphone.png" alt="Mobile View" />
                    ) : (
                        <img className="w-5 h-5" src="/icons/desktop.png" alt="Desktop View" />
                    )}
                </button>

                <section
                    className={`canvas rounded-lg shadow-lg ${mobile ? 'w-[380px]' : 'w-full'} h-full overflow-y-scroll `}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    onClick={handleClick}
                ></section>
            </main>

            {/* controls or placeholder */}
            <aside className="h-[200px] sm:h-full w-screen sm:w-[400px] bg-gray-100 sm:shadow-lg sm:border-l sm:border-gray-300 flex flex-col ">

                {/* Top control bar */}
                <section className="w-full h-[70px] bg-gray-200 flex justify-center items-center gap-2 shadow-sm mb-3">
                    <button 
                        className="flex group items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 shadow-md transition-all duration-300"
                        onClick={saveChangesToDB}
                    >
                        <img className="w-4 h-4 invert " src="/icons/save2.png" alt="Download Icon" />
                        <span className="text-sm font-medium">Save</span>
                    </button>

                    <button
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 shadow-md transition-all duration-300"
                        onClick={loadChanges}
                    >
                        <img className="w-4 h-4 invert" src="/icons/cloud2.png" alt="Download Icon" />
                        <span className="text-sm font-medium">Load</span>
                    </button>

                    <button
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 shadow-md transition-all duration-300"
                        onClick={resetTemplate}
                    >
                        <img className="w-4 h-4 invert" src="/icons/undo.png" alt="Download Icon" />
                        <span className="text-sm font-medium">Reset</span>
                    </button>

                    <button
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 shadow-md transition-all duration-300"
                        onClick={downloadFile}
                    >
                        <img className="w-4 h-4 invert" src="/icons/download.png" alt="Download Icon" />
                        <span className="text-sm font-medium">Download</span>
                    </button>

                </section>


                {selectedElement ? (
                    <>
                        {/* Link textarea */}
                        {isLink && (
                            <div className="w-full px-4 py-2 flex flex-col gap-1 ">
                                <h6 className='text-sm font-bold text-gray-900 ml-1'>Link</h6>
                                <textarea
                                    ref={linkRef}
                                    type="text"
                                    className="flex-1 height-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-gray-300"
                                />
                            </div>
                        )}

                        {/* Text input */}
                        <div className="w-full px-4 py-2 flex flex-col gap-1">
                            <h6 className='text-sm font-bold text-gray-900 ml-1'>Text</h6>
                            <textarea
                                ref={inputRef}
                                type="text"
                                className="flex-1 height-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-gray-300"
                            />
                        </div>

                        {/* Image preview and URL */}
                        {isImage && (
                            <div className="w-full px-4 py-2 flex flex-col justify-between gap-2 items-center">
                                <img
                                    className="w-full rounded-md border border-gray-300 shadow-sm"
                                    src={imageLink}
                                    alt="Preview"
                                />
                                <textarea
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                                    placeholder="Image URL"
                                    value={imageLink}
                                    onChange={(e) => setImageLink(e.target.value)}
                                ></textarea>
                            </div>
                        )}

                        {/* Done button */}
                        <div className="w-full px-4 py-2 flex flex-row justify-center gap-4 items-center">
                            <button
                                className=" bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors shadow-sm"
                                onClick={saveChanges}
                            >
                                Done
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col justify-center items-center text-gray-600 bg-gray-100">
                        <p className="text-2xl font-semibold text-gray-700 mb-4">No Component Selected</p>
                        <p className="text-lg text-gray-500 text-center">
                            Click on a component in the canvas to start editing.
                        </p>

                    </div>
                )}
            </aside>
        </div>
    )
}

export default EditingPage