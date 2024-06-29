import { useContext } from "react";
import { CanvasContext } from "../context/canvasContext";
const useCanvas = () => {
    return useContext(CanvasContext);
};
export default useCanvas;
