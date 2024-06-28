import React, {
  createContext,
  useRef,
  useEffect,
  ReactNode,
  MutableRefObject,
} from "react";

type CanvasContextType = MutableRefObject<HTMLCanvasElement | null> | null;

const CanvasContext = createContext<CanvasContextType>(null);

interface CanvasProviderProps {
  children: ReactNode;
}

const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      // You can do initial drawing or setup here
    }
  }, []);

  return (
    <CanvasContext.Provider value={canvasRef}>
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasProvider, CanvasContext };
