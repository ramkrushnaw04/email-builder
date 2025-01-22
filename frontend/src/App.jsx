
import EditingPage from "./pages/EditingPage"
import TemplateSelection from "./pages/TemplateSelection"
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios'

function App() {

    const [isAppActive, setIsAppActive] = useState(false)

    useEffect(() => {
        // show app only after getting response from backend
        const BACKEND_URL = process.env.VITE_BACKEND_URL
        axios.get(BACKEND_URL + '/test')
            .then(() => {
                console.log('yes')
                setIsAppActive(true)
            })
    }, []);

    return (

        <Routes>
            <Route path="/" element={<TemplateSelection />} />
            <Route path="/:template" element={<EditingPage />} />
        </Routes> 

    )
}

export default App
