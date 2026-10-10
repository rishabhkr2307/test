import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Workspace from "./components/Workspace";

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to='/workspace/UKWEMB'/>}/>
      <Route path="/workspace/:roomId" element={<Workspace/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;