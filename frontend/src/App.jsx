import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Workspace from "./components/Workspace";

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to='/workspace/test-rom-123'/>}/>
      <Route path="/workspace/:roomId" element={<Workspace/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;