"use client";

import {
  onWheel,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
} from "@/utils/eventListeners";
import { useGesture, usePinch, useWheel } from "@use-gesture/react";
import { useEffect, useRef, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import type { PDFDocumentProxy } from "pdfjs-dist";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function HomePage() {
  const [state, setState] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);

  const [renderedScale, setRenderedScale] = useState<number | null>(null);
  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  const pageContainer = useRef<HTMLDivElement>(null);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window) {
      return;
    }
    window.addEventListener("wheel", onWheel, {
      passive: false,
    });
    window.addEventListener("touchstart", onTouchStart, {
      passive: false,
    });

    window.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    window.addEventListener("touchend", onTouchEnd, {
      passive: false,
    });
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("wheel", () => {});
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);
  useGesture(
    {
      onDrag: ({
        movement: [mx, my],
        memo = { x: state.x, y: state.y },
        last,
      }) => {
        const newX = memo.x + mx / scale;
        const newY = memo.y + my / scale;

        if (last) {
          setState((prevState) => ({ ...prevState, x: newX, y: newY }));
        }
        return memo;
      },
      onWheel: ({ event, memo = { x: state.x, y: state.y }, last }) => {
        const newX = memo.x + event.deltaX / scale;
        const newY = memo.y + event.deltaY / scale;

        if (last) {
          setState((prevState) => ({ ...prevState, x: newX, y: newY }));
        }
        return memo;
      },
      onPinch: ({
        origin: [ox, oy],
        first,
        movement: [ms],
        offset: [s, a],
        memo,
      }) => {
        if (first) {
          if (ref.current) {
            const { width, height, x, y } = ref.current.getBoundingClientRect();
            const tx = ox - (x + width / 2);
            const ty = oy - (y + height / 2);
            memo = { x: state.x, y: state.y, tx, ty };
          }
        }

        const x = memo.x - (ms - 1) * memo.tx;
        const y = memo.y - (ms - 1) * memo.ty;

        setState((prev) => ({
          ...prev,
          scale: s,
          x,
          y,
        }));

        return memo;
      },
    },
    {
      target: ref,
      drag: { from: () => [state.x, state.y] },
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true },
    }
  );

  const { x, y, scale } = state;

  const style = {
    transform: `translate(${x}px, ${y}px)  scale(${scale})`,
  };
  const contentStyle = {
    transform: `translate(${x}px, ${y}px) `,
  };

  return (
    <div className="absolute flex min-w-[350px] flex-col overflow-hidden">
      <div className="flex h-8 w-screen items-center justify-center bg-neutral-200">
        Toolbar {state.scale}
      </div>
      <div className="h-svh w-screen overflow-hidden" ref={ref}>
        <div style={style}>
          <Document
            file={"./test.pdf"}
            onLoadSuccess={onDocumentLoadSuccess}
            className={"h-auto overflow-scroll"}
          >
            {/*  {isLoading && renderedScale ? (
      <div style={{ scale: String(currentScale) }}>
      <Pag e
      key={renderedScale}
      scale={renderedScale}
      width={400}
      pageNumber={1}
      
      </div>
      ) : null} */}
            <Page pageNumber={1} className={"overflow-scroll"} />
          </Document>
        </div>
      </div>
    </div>
  );
}
