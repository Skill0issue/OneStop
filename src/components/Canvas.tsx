import {
  ElementType,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import useCanvas from "../hooks/useCanvas";
import rough from "roughjs/bundled/rough.esm";
import { RoughCanvas } from "roughjs/bin/canvas";
import { ThemeContext } from "../context/theme";

// icons

//rectangle
import { PiRectangleDashed } from "react-icons/pi";
import { PiRectangle } from "react-icons/pi";
import { PiRectangleDashedDuotone } from "react-icons/pi";
import { PiRectangleDuotone } from "react-icons/pi";

//line
import { GoDash } from "react-icons/go";
import { AiOutlineDash } from "react-icons/ai";

// //circle
// import { FaRegCircle } from "react-icons/fa";
// import { FaCircle } from "react-icons/fa";
// import { PiCircleDashedThin } from "react-icons/pi";
// import { PiCircleDashedDuotone } from "react-icons/pi"; //fill
// import Navbar from './../../../tedblog/src/pages/Navbar';
import { set } from 'firebase/database';

// <FaCircle />;
// <FaRegCircle />;
// <PiCircleDashedDuotone />;
// <PiCircleDashedThin />;

<PiRectangleDashedDuotone />;
<PiRectangleDuotone />;

const Canvas: React.FC = () => {
  // Canvas context
  const canvasRef = useCanvas();
  const generator = rough.generator();
  const { theme, setTheme } = useContext(ThemeContext);

  // States for canvas and pens
  const [toolType, setToolType] = useState<string>("rectangle");
  const [elementType, setElementType] = useState<string>("normal");
  const [action, setAction] = useState<string>("none");
  const [dottedLine, setDottedLine] = useState(false);
  const [dotLineSize, setDotLineSize] = useState(5);
  const [dottedCanvas, setDottedCanvas] = useState(true);

  useEffect(() => {
    const canvas: HTMLElement | null = document.getElementById(
      String(canvasRef?.current?.id)
    ); // changed it from "canvas" bcz i want to add multiple canvas to a user
    if (dottedCanvas) {
      if (theme) {
        canvas?.classList.remove("dotted-canvas-white");
        canvas?.classList.add("dotted-canvas-dark");
      } else {
        canvas?.classList.remove("dotted-canvas-dark");
        canvas?.classList.add("dotted-canvas-white");
      }
    } else {
      canvas?.classList.remove("dotted-canvas-white");
      canvas?.classList.remove("dotted-canvas-dark");
    }
  }, [dottedCanvas, theme]);

  useEffect(() => {
    if (
      (action === "drawing" || action === "moving") &&
      window.location.pathname === "/canvas"
    ) {
      document.getElementById("sidebar")?.classList.add("hidden");
    } else {
      document.getElementById("sidebar")?.classList.remove("hidden");
    }
  }, [action]);

  // States for elements
  const [elements, setElements] = useState<element[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<Positionelement | null>(null);
  const [selectedElementOffset, setSelectedElementOffset] = useState<{
    offsetX: number;
    offsetY: number;
  }>({ offsetX: 0, offsetY: 0 });

  type element = {
    toolType: string;
    elementType: string;
    id: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    dotLinesize: number;
    position?: string;
  };
  interface Positionelement {
    position: string | null;
    toolType: string;
    elementType: string;
    id: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    dotLinesize: number;
  }

  const getIcon = (props: string, type: number) => {
    switch (props) {
      case "line":
        if (type == 0) {
          return <GoDash />;
        } else {
          return <AiOutlineDash />;
        }
      case "rectangle":
        if (type == 0) {
          return <PiRectangle />;
        } else {
          return <PiRectangleDashed />;
        }
      default:
        return null;
    }
  };

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    toolType: string,
    elementType: string,
    dotLinesize: number
  ) => {
    const updatedElements = elements.map((el) =>
      el.id === id
        ? { ...el, x1, y1, x2, y2, toolType, elementType, dotLinesize }
        : el
    );
    setElements(updatedElements);
  };

  const closestPoint = (
    x: number,
    y: number,
    x1: number,
    y1: number,
    name: string
  ): string | null => {
    return Math.abs(x - x1) < 20 && Math.abs(y - y1) < 20 ? name : null;
  };

  const distance = (
    a: { x: number; y: number },
    b: { x: number; y: number }
  ): number => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  };

  const PositionWithinElement = (x: number, y: number, element: element) => {
    const { x1, x2, y1, y2, toolType } = element;
    if (toolType === "line") {
      const a = { x: x1, y: y1 };
      const b = { x: x2, y: y2 };
      const c = { x: x, y: y };
      const offset = distance(a, b) - (distance(a, c) + distance(b, c));
      const start = closestPoint(x, y, x1, y1, "start");
      const end = closestPoint(x, y, x2, y2, "end");
      const inside = Math.abs(offset) < 1 ? "inside" : null;
      return start || end || inside;
    }
    if (toolType === "rectangle") {
      const TopLeft = closestPoint(x, y, x1, y1, "tl");
      const TopRight = closestPoint(x, y, x2, y1, "tr");
      const BottomLeft = closestPoint(x, y, x1, y2, "bl");
      const BottomRight = closestPoint(x, y, x2, y2, "br");
      const inside = x <= x2 && y <= y2 && x >= x1 && y >= y1 ? "inside" : null;
      return TopLeft || TopRight || BottomLeft || BottomRight || inside;
    }
    return null;
  };

  const getElementAtPosition = (
    x: number,
    y: number,
    elements: element[]
  ): Positionelement | null => {
    return (
      elements
        .map((el) => ({ ...el, position: PositionWithinElement(x, y, el) }))
        .find((el) => el.position != null) || null
    );
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    if (toolType === "select") {
      const currentElement = getElementAtPosition(clientX, clientY, elements);
      if (currentElement) {
        if (currentElement.position === "inside") { 
          setAction("moving");
          setSelectedElementOffset({
            offsetX: clientX - currentElement.x1,
            offsetY: clientY - currentElement.y1,
          });
        } else {
          setAction("resize");
          setSelectedElementOffset({ offsetX: 0, offsetY: 0 });
        }
        setSelectedElement(currentElement);
      }
    } if(toolType === "line" || toolType === "rectangle") {
      // @TODO : need to change this when adding resize and other options :(
      setElements((prev) => [
        ...prev,
        {
          toolType: toolType,
          elementType: elementType,
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          id: elements.length,
          dotLinesize: dottedLine ? dotLineSize : 0,
        },
      ]);
      setAction("drawing");
    }
  };

   
  const CursorIcon = (pos: string | null): string => {
    switch (pos) {
      case "tl":
        return "nw-resize";
      case "bl":
        return "sw-resize"
      case "start":
      case "end":
        return "nwse-resize";
      case "tr":
        return "ne-resize";
      case "br":
        return "nw-resize";
      default:
        return "move"
    }
  };

const ResizeElement = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  position: string,
  clientX: number,
  clientY: number
) => {
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "bl":
      return { x1:clientX, y1, x2, y2: clientY };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return { x1, y1, x2, y2 };
  }
};

const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
  const { clientX, clientY } = event;
  
  if (action === "moving" && selectedElement) {
    const { offsetX, offsetY } = selectedElementOffset;
    const width = selectedElement.x2 - selectedElement.x1;
    const height = selectedElement.y2 - selectedElement.y1;
    
    const newX1 = clientX - offsetX;
    const newY1 = clientY - offsetY;
    
    const updatedElement = {
      ...selectedElement,
      x1: newX1,
      y1: newY1,
      x2: newX1 + width,
      y2: newY1 + height,
    };
    
    setSelectedElement(updatedElement);
    updateElement(
      selectedElement.id,
      newX1,
      newY1,
      newX1 + width,
      newY1 + height,
      selectedElement.toolType,
      selectedElement.elementType,
      selectedElement.dotLinesize
    );
  }
  
    if (toolType === "select") {
      const element = getElementAtPosition(clientX, clientY, elements);
      (event.target as HTMLCanvasElement).style.cursor = element
        ? CursorIcon(element.position)
        : "default";
    }
  
  if (action === "resize" && selectedElement) {
    const { x1, y1, x2, y2 } = ResizeElement(
      selectedElement.x1,
      selectedElement.y1,
      selectedElement.x2,
      selectedElement.y2,
      selectedElement.position,
      clientX,
      clientY
    );
    updateElement(
      selectedElement.id,
      x1,
      y1,
      x2,
      y2,
      selectedElement.toolType,
      selectedElement.elementType,
      selectedElement.dotLinesize
    );
  }

  if (action === "drawing") {
    setElements((prev) => {
      const updatedElements = [...prev];
      const length = updatedElements.length;
      if (length > 0) {
        const element = updatedElements[length - 1];
        updateElement(
          element.id,
          element.x1,
          element.y1,
          clientX,
          clientY,
          element.toolType,
          element.elementType,
          element.dotLinesize
        );
      }
      return updatedElements;
    });
  }
};



  const adjustElementCoordinates = (el: element) => {
    const { x1, y1, x2, y2, toolType } = el;
    if (toolType === "rectangle") {
      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const maxX = Math.max(x1, x2);
      const maxY = Math.max(y1, y2);

      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    }
    if (toolType === "line") {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
    return null;
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    (event.target as HTMLCanvasElement).style.cursor = "default";
    const index = elements.length - 1;
    if (action === "drawing") {
      const element = elements[index];
      const adjustedCoordinates = adjustElementCoordinates(element);
      if (adjustedCoordinates) {
        const { x1, y1, x2, y2 } = adjustedCoordinates;
        updateElement(
          element.id,
          x1,
          y1,
          x2,
          y2,
          element.toolType,
          element.elementType,
          element.dotLinesize
        );
      }
    }
    setAction("none");
    setSelectedElement(null);
  };

  const draw = (
    roughCanvas: RoughCanvas,
    context: CanvasRenderingContext2D | null
  ) => {
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      elements.forEach((elem) => {
        context.setLineDash([elem.dotLinesize]);
        switch (elem.toolType) {
          case "line":
            context.strokeStyle = theme ? "black" : "white";
            if (elem.elementType === "normal") {
              context.lineWidth = 2;
              context.beginPath();
              context.moveTo(elem.x1, elem.y1);
              context.lineTo(elem.x2, elem.y2);
              context.stroke();
            }
            if (elem.elementType === "rough") {
              const line = generator.line(elem.x1, elem.y1, elem.x2, elem.y2, {
                stroke: theme ? "black" : "white",
              });
              roughCanvas.draw(line);
            }
            break;
          case "rectangle":
            if (elem.elementType === "rough") {
              const rect = generator.rectangle(
                elem.x1,
                elem.y1,
                elem.x2 - elem.x1,
                elem.y2 - elem.y1,
                { stroke: theme ? "black" : "white" }
              );
              roughCanvas.draw(rect);
            }
            if (elem.elementType === "normal") {
              context.fillStyle = "none";
              context.strokeStyle = theme ? "black" : "white";
              context.lineWidth = 2;
              context.strokeRect(
                elem.x1,
                elem.y1,
                elem.x2 - elem.x1,
                elem.y2 - elem.y1
              );
            }
            break;
          default:
            break;
        }
      });
    }
  };

  useLayoutEffect(() => {
    const canvas = canvasRef?.current;
    if (canvas) {
      const roughCanvas = rough.canvas(canvas);
      const context = canvas.getContext("2d");
      if (context) {
        draw(roughCanvas, context);
      }
    }
  }, [canvasRef, elements, theme]);

  return (
    <>
      <div className="relative w-screen h-screen">
        <div
          className={`fixed w-screen h-12 flex gap-4 text-center justify-center items-center noselect ${
            theme ? "text-dark" : "text-white"
          }`}
        >
          <div>
            <select
              name="ElementType"
              defaultValue={elementType}
              id="elementType"
              className="text-dark"
              onChange={(event) => {
                setElementType(event.target.value);
              }}
            >
              <option value="normal">Normal</option>
              <option value="rough">Rough</option>
            </select>
          </div>
          <div className="gap-1 flex ">
            <input
              type="radio"
              name="toolType"
              id="line"
              checked={toolType === "line"}
              onChange={() => setToolType("line")}
            />
            <label htmlFor="line">Line</label>
          </div>
          <div className="gap-1 flex ">
            <input
              type="radio"
              name="toolType"
              id="select"
              checked={toolType === "select"}
              onChange={() => setToolType("select")}
            />
            <label htmlFor="select">Select</label>
          </div>
          <div className="gap-1 flex ">
            <input
              type="radio"
              name="toolType"
              id="rectangle"
              checked={toolType === "rectangle"}
              onChange={() => setToolType("rectangle")}
            />
            <label htmlFor="rectangle">Rectangle</label>
          </div>
          <div
            onChange={() => {
              setDottedLine(!dottedLine);
            }}
            className="gap-1 flex "
          >
            <input
              type="checkbox"
              name="dotted"
              id="dotted"
              checked={dottedLine}
            />
            <label htmlFor="dottedLine">Dotted Line</label>
          </div>
          <div className="gap-1 flex ">
            <input
              type="range"
              name="dotLinesize"
              id="dotLinesize"
              min={5}
              max={20}
              defaultValue={dotLineSize}
              onChange={(event) => setDotLineSize(Number(event.target.value))}
            />
            <label htmlFor="dotLinesize">Dot Line Size</label>
          </div>
          <div className="flex gap-1">
            <input
              type="checkbox"
              name="theme"
              id="theme"
              checked={theme}
              onChange={() => {
                setTheme(!theme);
              }}
            />
            <label htmlFor="theme">Theme</label>
          </div>
          <div className="flex gap-1">
            <input
              type="checkbox"
              name="dottedCanvas"
              id="dottedCanvas"
              checked={dottedCanvas}
              onChange={() => {
                setDottedCanvas(!dottedCanvas);
              }}
            />
            <label htmlFor="dottedCanvas">Dotted Canvas</label>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          id="canvas"
          width={window.innerWidth}
          height={window.innerHeight}
          className={``}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        <div className="absolute w-64 h-[90vh] flex justify-start gap-3 items-center flex-col shadow-xl rounded-xl right-[40px] top-[5%] bg-white">
          <ul>
            {elements.map((element) => (
              <li key={element.id}>
                <div className="flex items-center" onClick={(event) => {

                  //TODO: add layers and remove this shit code

                  const pos = PositionWithinElement(
                    event.clientX,
                    event.clientY,
                    element
                  );
                  const posElement = { ...element, position: pos };
                  setToolType("select");
                  setSelectedElement(posElement);
                  setSelectedElementOffset({offsetX:0,offsetY:0})
                  setAction("moving");
                }}>
                  {getIcon(element.toolType, element.dotLinesize)} &nbsp;{" "}
                  {element.elementType} &nbsp;
                  {element.toolType} &nbsp; {element.id + 1}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Canvas;
