import { MutableRefObject } from "react";
type CanvasContextType = MutableRefObject<HTMLCanvasElement | null> | null;
declare const useCanvas: () => CanvasContextType;
export default useCanvas;
