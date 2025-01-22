
import EditingPage from "./pages/EditingPage"
import TemplateSelection from "./pages/TemplateSelection"
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios'

function App() {

    const [isAppActive, setIsAppActive] = useState(false)

    useEffect(() => {
        // show app only after getting response from backend
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
        axios.get(BACKEND_URL + '/test')
            .then(() => {
                setIsAppActive(true)
            })
    }, []);

    return (

        isAppActive ? <Routes>
            <Route path="/" element={<TemplateSelection />} />
            <Route path="/:template" element={<EditingPage />} />
        </Routes> :
            <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
                <div className="flex items-center justify-center gap-2">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-lg font-semibold text-gray-600 ">Connecting to the server...</p>
                </div>
            </div>

    )
}

export default App
