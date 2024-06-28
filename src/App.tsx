import react from "react";
import { Route, Routes } from "react-router-dom";





//Components/Pages
import Home from "./pages/Home";
import Canvas from "./components/Canvas";
import Test from "./pages/Test";



function App() {


  return (
    <>
      <Routes> 
        <Route path="/" element={<Home/>} />
        <Route path="/canvas" element={<Canvas/>} />
        <Route path="/test" element={<Test/>} />
    </Routes>
    </>
  )
}

export default App
