import React, {
  createContext,
  useRef,
  useEffect,
  ReactNode,
  MutableRefObject,
} from "react";

// Define the type for the context value
type CanvasContextType = MutableRefObject<HTMLCanvasElement | null> | null;

// Create the context with initial value null
const CanvasContext = createContext<CanvasContextType>(null);

// Define props for the CanvasProvider component
interface CanvasProviderProps {
  children: ReactNode;
}

// CanvasProvider component
const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  // Ref to hold the canvas element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
  return (
    <CanvasContext.Provider value={canvasRef}>
      {children}
    </CanvasContext.Provider>
  );
};

// Export the CanvasProvider and CanvasContext
export { CanvasProvider, CanvasContext };
