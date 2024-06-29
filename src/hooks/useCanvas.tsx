import { MutableRefObject, useContext } from "react";
import { CanvasContext } from "../context/canvasContext";



type CanvasContextType = MutableRefObject<HTMLCanvasElement | null> | null;



const useCanvas = (): CanvasContextType => {
  return useContext(CanvasContext);
};



export default useCanvas;
