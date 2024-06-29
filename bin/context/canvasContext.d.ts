import React, { ReactNode, MutableRefObject } from "react";
type CanvasContextType = MutableRefObject<HTMLCanvasElement | null> | null;
declare const CanvasContext: React.Context<CanvasContextType>;
interface CanvasProviderProps {
    children: ReactNode;
}
declare const CanvasProvider: React.FC<CanvasProviderProps>;
export { CanvasProvider, CanvasContext };
