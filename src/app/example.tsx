"use client";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  onTouchEnd,
  onTouchMove,
  onTouchStart,
  onWheel,
} from "@/utils/eventListeners";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "./Sample.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function Sample() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);

  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const pageContainer = useRef<HTMLDivElement>(null);

  const currentScale = useSelector(
    (state: RootState) => state.pdfView.currentScale
  );
  const currentRealScale = useSelector(
    (state: RootState) => state.pdfView.currentRealScale
  );

  const touchOrigin = useSelector(
    (state: RootState) => state.pdfView.touchOrigin
  );

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

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
  }, []);

  useEffect(() => {
    const pdfPages = document.querySelectorAll(".react-pdf__Page");
    const documentPdf = document.querySelectorAll(".react-pdf__Document");
    documentPdf.forEach((page) => {
      (page as HTMLElement).style.setProperty(
        "--scale-factor",
        String(currentScale)
      );
    });
    pdfPages.forEach((page) => {
      (page as HTMLElement).style.setProperty(
        "--scale-factor",
        String(currentScale)
      );
    });
  }, [currentScale]);

  const isLoading = renderedScale !== currentScale;
  let originX = 1;
  let originY = 1;
  if (pageContainer.current) {
    const boundingRect = pageContainer.current?.getBoundingClientRect();
    if (boundingRect) {
      originX =
        ((touchOrigin.x - boundingRect.left) / boundingRect.width) * 100;
      originY =
        ((touchOrigin.y - boundingRect.right) / boundingRect.height) * 100;
    }
  }

  return (
    <div className="absolute flex min-w-[350px] flex-col">
      <div className="flex h-8 w-screen items-center justify-center bg-neutral-200">
        Toolbar {currentScale} {originX} {originY}
      </div>
      <div className="inset-y-8 flex items-center justify-center bg-neutral-500 py-10 outline-none">
        <div
          className="relative flex size-40 justify-center bg-white"
          ref={pageContainer}
          style={{
            scale: currentScale,
            transformOrigin: `${originX}% ${originY}%`,
          }}
        >
          <div className="size-5 bg-red-500"> </div>
          {/*  <Document file={"./test.pdf"} onLoadSuccess={onDocumentLoadSuccess}>
            {isLoading && renderedScale ? (
              <div style={{ scale: String(currentScale) }}>
                <Page
                  key={renderedScale}
                  scale={renderedScale}
                  width={400}
                  pageNumber={1}
                />
              </div>
            ) : null}
            <Page
              key={currentScale}
              onRenderSuccess={() => setRenderedScale(currentRealScale)}
              scale={currentRealScale}
              width={400}
              pageNumber={1}
              className={isLoading ? "hidden" : ""}
            />
          </Document> */}
        </div>
      </div>
    </div>
  );
}
