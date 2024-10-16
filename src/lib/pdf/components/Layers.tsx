import { HTMLProps } from "react";
import { useCanvasLayer } from "../layers/canvas";
import { useTextLayer } from "../layers/text";
import Image from "next/image";

export const CanvasLayer = ({
  style,
  ...props
}: HTMLProps<HTMLCanvasElement>) => {
  const { canvasRef, image, size, containerRef } = useCanvasLayer();

  return (
    <div ref={containerRef}>
      <canvas
        style={{
          ...style,
          top: 0,
          left: 0,
        }}
        className="hidden"
        {...props}
        ref={canvasRef}
      />
      {image !== "" && (
        <Image src={image} alt="" width={size.w} height={size.h}></Image>
      )}
    </div>
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
