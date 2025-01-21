import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <App />
        <ToastContainer position='bottom-right' autoClose={1500} />
    </BrowserRouter>
  </StrictMode>,
)
