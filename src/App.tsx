import { Route, Routes } from "react-router-dom";

//Components/Pages
import Home from "./pages/Home";
import Canvas from "./components/Canvas";
import Test from "./pages/Test";
import Sidebar from "./components/sideBar";

function App() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canvas" element={<Canvas />} />
        <Route path="/test" element={<Test />} />
        <Route
          path="/*"
          element={
            <>
              Work in Progress Checkout my Github in the mean time
              <a href="https://github.com/Skill0issue"> Skill_Issue</a>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
