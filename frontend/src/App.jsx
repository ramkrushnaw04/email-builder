
import EditingPage from "./pages/EditingPage"
import TemplateSelection from "./pages/TemplateSelection"
import { Routes, Route } from 'react-router-dom';

function App() {

  return (

    <Routes>
        <Route path="/" element={<TemplateSelection/>} />
        <Route path="/:template" element={ <EditingPage />} />
      </Routes>

  )
}

export default App
