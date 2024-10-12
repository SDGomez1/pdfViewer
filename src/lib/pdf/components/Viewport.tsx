import { HTMLProps, useRef } from "react";
import { useViewportContainer } from "../viewport";

export const Viewport = ({ children, ...props }: HTMLProps<HTMLDivElement>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementWrapperRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useViewportContainer({
    elementRef: elementRef,
    elementWrapperRef: elementWrapperRef,
    containerRef: containerRef,
  });

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-screen justify-center overflow-auto"
    >
      <div ref={elementWrapperRef} className="w-max">
        <div
          ref={elementRef}
          className="absolute mx-auto my-0 flex w-max origin-[0_0] flex-col items-center"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
