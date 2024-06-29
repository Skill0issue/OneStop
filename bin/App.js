import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
//Components/Pages
import Home from "./pages/Home";
import Canvas from "./components/Canvas";
import Test from "./pages/Test";
function App() {
    return (_jsx(_Fragment, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/canvas", element: _jsx(Canvas, {}) }), _jsx(Route, { path: "/test", element: _jsx(Test, {}) })] }) }));
}
export default App;
