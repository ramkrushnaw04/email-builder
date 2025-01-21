
import EditingPage from "./pages/EditingPage"
import TemplateSelection from "./pages/templateSelection"
import { Routes, Route, Link } from 'react-router-dom';

function App() {

  return (

    <Routes>
        <Route path="/" element={<TemplateSelection/>} />
        <Route path="/:template" element={ <EditingPage />} />
      </Routes>

  )
}

export default App
