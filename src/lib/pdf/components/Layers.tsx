import { HTMLProps } from "react";
import { useCanvasLayer } from "../layers/canvas";
import { useTextLayer } from "../layers/text";

export const CanvasLayer = ({
  style,
  ...props
}: HTMLProps<HTMLCanvasElement>) => {
  const { canvasRef } = useCanvasLayer();

  return (
    <canvas
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
      }}
      {...props}
      ref={canvasRef}
    />
  );
};
export const TextLayer = ({
  className,
  style,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  const { textContainerRef } = useTextLayer();

  return (
    <div
      className={`textLayer className`}
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
      }}
      {...props}
      ref={textContainerRef}
    />
  );
};
