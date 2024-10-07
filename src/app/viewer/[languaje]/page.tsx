"use client";

import { memo, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { pdfjs, Document, Page } from "react-pdf";
import { useGesture } from "@use-gesture/react";
import { onTouchMove, onTouchStart } from "@/utils/eventListeners";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

type PDFFile = string | File | null;

export default function HomePage() {
  const [numPages, setNumPages] = useState<number>();
  const [file, setFile] = useState<PDFFile>("./test.pdf");

  const [pdfView, setPdfView] = useState({ x: 0, y: 0, scale: 1 });
  const [pdfInitialSize, setPdfInitialSize] = useState<DOMRect | null>();
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }
  useEffect(() => {
    if (document) {
      if (pdfRef.current)
        setPdfInitialSize(pdfRef.current.getBoundingClientRect());
    }
  }, []);
  useGesture(
    {
      onDrag: ({ offset: [dx, dy], velocity }) => {
        setPdfView({ ...pdfView, x: dx, y: dy });
        if (pdfRef.current) {
          pdfRef.current.style.left = `${String(pdfView.x)}px`;
          pdfRef.current.style.top = `${String(pdfView.y)}px`;
        }
      },
      onPinch: ({ offset: [s], origin: [pOX, pOY], memo, first }) => {
        if (pdfRef.current && pdfInitialSize) {
          if (memo === undefined) {
            memo = {
              bounds: 1 + pOX,
            };
          }
          let transformOriginX = pdfInitialSize.x + pdfInitialSize.width / 2;
          let transformOriginY = pdfInitialSize.y + pdfInitialSize.height / 2;

          let displacementX = transformOriginX - pOX;
          let displacementY = transformOriginY - pOY;
          setPdfView({
            ...pdfView,
            scale: s,
          });
          pdfRef.current.style.scale = String(s);

          return memo;
        }
      },
      onDragEnd: () => {
        adjustPosition();
      },
      onPinchEnd: () => {
        // Set the --scale-factor property on the parent element
        // Set the --scale-factor property on the parent element
        /*   pdfRef.current.style.setProperty(
            "--scale-factor",
            String(pdfView.scale)
          );

          // Select all children with class 'react-pdf__Page' and update the same property
          const pages =
            pdfRef.current.querySelectorAll<HTMLDivElement>(".react-pdf__Page");
          pages.forEach((page) => {
            page.style.setProperty("--scale-factor", String(pdfView.scale));
          }); */
      },
    },
    {
      drag: {
        from: () => [pdfView.x, pdfView.y],
      },
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true },

      target: pdfRef,
      eventOptions: { passive: false },
    }
  );

  function adjustPosition() {
    if (pdfRef.current && pdfContainerRef.current) {
      let newPdfview = pdfView;
      let pdfBounds = pdfRef.current.getBoundingClientRect();
      let pdfContainerBounds = pdfContainerRef.current.getBoundingClientRect();

      let originalWidth = pdfRef.current.clientWidth;
      let withOverhang = (pdfBounds.width - originalWidth) / 2;
      let originalHeight = pdfRef.current.clientHeight;
      let heightOverhang = (pdfBounds.height - originalHeight) / 2;

      if (pdfBounds.left > pdfContainerBounds.left) {
        newPdfview.x = withOverhang;
      }
      if (pdfBounds.right < pdfContainerBounds.right) {
        newPdfview.x =
          -(pdfBounds.width - pdfContainerBounds.width) + withOverhang;
      }
      if (pdfBounds.top > pdfContainerBounds.top) {
        newPdfview.y = heightOverhang;
      }
      if (pdfBounds.bottom < pdfContainerBounds.bottom) {
        newPdfview.y =
          -(pdfBounds.height - pdfContainerBounds.height) + heightOverhang;
      }

      setPdfView(newPdfview);
      pdfRef.current.style.left = `${String(newPdfview.x)}px`;
      pdfRef.current.style.top = `${String(newPdfview.y)}px`;
    }
  }
  return (
    <>
      <div className="">
        <div className="relative h-[calc(100vh_-_4rem)] touch-none overflow-hidden ring-4 ring-blue-500 lg:w-[600px]">
          <div ref={pdfContainerRef}>
            <Document
              file={"./test.pdf"}
              onLoadSuccess={onDocumentLoadSuccess}
              inputRef={pdfRef}
              className={"absolute"}
              options={options}
            >
              {Array.from(new Array(numPages), (_el, index) => (
                <Page
                  className="relative"
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                />
              ))}
            </Document>
          </div>
        </div>
      </div>
    </>
  );
}
