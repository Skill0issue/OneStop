import React, { useLayoutEffect, useState } from "react";
import useCanvas from "../hooks/useCanvas";
import rough from "roughjs/bundled/rough.esm";
import { RoughCanvas } from "roughjs/bin/canvas";

const Canvas: React.FC = () => {
  const canvasRef = useCanvas();
  const generator = rough.generator();

  const [drawType, setDrawType] = useState("rectangle"); // Default to rectangle drawing
  const [drawing, setDrawing] = useState(false);
  const [elements, setElements] = useState<any[]>([]);
  const [elementType, setElementType] = useState("normal"); // rough or normal

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const { clientX, clientY } = event;

    // Create an element with the draw type
    setElements((prev) => [
      ...prev,
      {
        drawType: drawType,
        elementType: elementType,
        x1: clientX,
        y1: clientY,
        x2: clientX,
        y2: clientY,
      },
    ]);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    if (!drawing) {
      return;
    }

    // Update the elements
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
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const draw = (
    roughCanvas: RoughCanvas,
    context: CanvasRenderingContext2D | null
  ) => {
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clear canvas before drawing

      elements.forEach((elem) => {
        switch (elem.drawType) {
          case "line":
            if (elem.elementType === "normal") {
              context.strokeStyle = "black";
              context.lineWidth = 1;
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
              context.strokeStyle = "black";
              context.lineWidth = 1;
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
  }, [canvasRef, elements]); // Redraw when canvasRef or elements change

  return (
    <>
      <div className="fixed w-screen h-12 flex justify-center items-center">
        <select
          name="ElementType"
          defaultValue={elementType}
          id="elementType"
          onChange={(event) => {
            setElementType(event.target.value);
          }}
        >
          <option value="normal">Normal</option>
          <option value="rough">Rough</option>
        </select>
        <input
          type="radio"
          name="drawType"
          id="line"
          checked={drawType === "line"}
          onChange={() => setDrawType("line")}
        />
        <label htmlFor="line">Line</label>

        <input
          type="radio"
          name="drawType"
          id="rectangle"
          checked={drawType === "rectangle"}
          onChange={() => setDrawType("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle</label>
      </div>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        className=""
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
};

export default Canvas;
