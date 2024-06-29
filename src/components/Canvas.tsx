import { useContext, useEffect, useLayoutEffect, useState } from "react";
import useCanvas from "../hooks/useCanvas";
import rough from "roughjs/bundled/rough.esm";
import { RoughCanvas } from "roughjs/bin/canvas";
import { ThemeContext } from "../context/theme";

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
    const canvas: HTMLElement|null = document.getElementById("canvas");
    if (dottedCanvas) {
      if (theme) {
        canvas?.classList.remove("dotted-canvas-white");
        canvas?.classList.add("dotted-canvas-dark");
      } else {
        canvas?.classList.remove("dotted-canvas-dark");
        canvas?.classList.add("dotted-canvas-white");
      }
    }
    else {
      canvas?.classList.remove("dotted-canvas-white");
      canvas?.classList.remove("dotted-canvas-dark");
    }
  },[dottedCanvas,theme])

  useEffect(() => {
          if ((action === "drawing" || action ==="moving") && window.location.pathname === "/canvas") {
            document.getElementById("sidebar")?.classList.add("hidden");
  } else {
            document.getElementById("sidebar")?.classList.remove("hidden")
          }
  },[action])



  // States for elements
  const [elements, setElements] = useState<element[]>([]);
  const [selectedElement, setSelectedElement] = useState<element | null>(null);
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
  };

  const distance = (
    a: { x: number; y: number },
    b: { x: number; y: number }
  ): number => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    if (toolType === "select") {
      const currentElement: element | undefined = elements.find((el) => {
        const { toolType } = el;
        if (toolType === "line") {
          const a = { x: el.x1, y: el.y1 };
          const b = { x: el.x2, y: el.y2 };
          const c = { x: clientX, y: clientY };
          const offset = distance(a, b) - (distance(a, c) + distance(b, c));
          return Math.abs(offset) < 1;
        }
        if (toolType === "rectangle") {
          const minX = Math.min(el.x1, el.x2);
          const minY = Math.min(el.y1, el.y2);
          const maxX = Math.max(el.x1, el.x2);
          const maxY = Math.max(el.y1, el.y2);

          return (
            clientX <= maxX &&
            clientY <= maxY &&
            clientX >= minX &&
            clientY >= minY
          );
        }
        return false;
      });
      if (currentElement) {
        setAction("moving");
        setSelectedElement(currentElement);
        setSelectedElementOffset({
          offsetX: clientX - currentElement.x1,
          offsetY: clientY - currentElement.y1,
        });
      }
    } else {
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

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    if (action === "moving" && selectedElement) {
      (event.target as HTMLCanvasElement).style.cursor = "move";
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
      setElements((prev) => {
        const index = prev.findIndex((el) => el.id === selectedElement.id);
        const updatedElements = [...prev];
        updatedElements[index] = updatedElement;
        return updatedElements;
      });
    }
    if (action === "drawing") {
      setElements((prev) => {
        const updatedElements = [...prev];
        const length = updatedElements.length;
        if (length > 0) {
          updatedElements[length - 1] = {
            ...updatedElements[length - 1],
            x2: clientX,
            y2: clientY,
          };
        }
        return updatedElements;
      });
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setAction("none");
    setSelectedElement(null);
    (event.target as HTMLCanvasElement).style.cursor = "default";
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
            if (elem.elementType === "normal") {
              context.strokeStyle = theme ? "black" : "white";
              context.lineWidth = 2;
              context.beginPath();
              context.moveTo(elem.x1, elem.y1);
              context.lineTo(elem.x2, elem.y2);
              context.stroke();
            }
            if (elem.elementType === "rough") {
              const line = generator.line(elem.x1, elem.y1, elem.x2, elem.y2);
              roughCanvas.draw(line);
            }
            break;
          case "rectangle":
            if (elem.elementType === "rough") {
              const rect = generator.rectangle(
                elem.x1,
                elem.y1,
                elem.x2 - elem.x1,
                elem.y2 - elem.y1
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
  }, [canvasRef, elements,theme]);

  return (
    <>
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
    </>
  );
};

export default Canvas;
