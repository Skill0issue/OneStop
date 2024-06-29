import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useRef, useEffect, } from "react";
// Create the context with initial value null
const CanvasContext = createContext(null);
// CanvasProvider component
const CanvasProvider = ({ children }) => {
    // Ref to hold the canvas element
    const canvasRef = useRef(null);
    // Perform setup or initial drawing when component mounts
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            // Example: getContext and initial setup
            // const context = canvas.getContext("2d");
            // Perform any initial drawing or setup here
        }
    }, []);
    // Provide the canvasRef through CanvasContext.Provider
    return (_jsx(CanvasContext.Provider, { value: canvasRef, children: children }));
};
// Export the CanvasProvider and CanvasContext
export { CanvasProvider, CanvasContext };
