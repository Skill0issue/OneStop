import react from "react";
import { Route, Routes } from "react-router-dom";





//Components/Pages
import Home from "./pages/Home";
import Canvas from "./components/Canvas";



function App() {


  return (
    <>
      <Routes> 
        <Route path="/" element={<Home/>} />
        <Route path="/test" element={<Canvas/>} />
    </Routes>
    </>
  )
}

export default App
