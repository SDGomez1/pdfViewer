"use client";

import { memo, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { pdfjs, Document, Page } from "react-pdf";
import { useGesture } from "@use-gesture/react";
import { onTouchMove, onTouchStart } from "@/utils/eventListeners";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function HomePage() {
  const [numPages, setNumPages] = useState<number>();

  const [pdfView, setPdfView] = useState({ x: 0, y: 0, scale: 1 });

  const pdfRef = useRef<HTMLDivElement | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        setPdfView({ ...pdfView, x: dx, y: dy });
        if (pdfRef.current) {
          pdfRef.current.style.left = `${String(pdfView.x)}px`;
          pdfRef.current.style.top = `${String(pdfView.y)}px`;
        }
      },
      onPinch: ({ offset: [s], origin: [pOX, pOY], memo }) => {
        if (pdfRef.current) {
          memo ??= {
            bounds: pdfRef.current.getBoundingClientRect(),
          };
          let transformOriginX = memo.bounds.x + memo.bounds.width / 2;
          let transformOriginY = memo.bounds.y + memo.bounds.height / 2;

          let displacementX = transformOriginX - pOX;
          let displacementY = transformOriginY - pOY;
          setPdfView({
            ...pdfView,
            scale: s,
            x: displacementX * s,
            y: displacementY * s,
          });
          pdfRef.current.style.scale = String(s);
        }
      },
      onDragEnd: () => {
        adjustScaleBounds();
      },
      onPinchEnd: () => {
        adjustScaleBounds();
        if (pdfRef.current) {
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
        }
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

  function adjustScaleBounds() {
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
      <p> pdfViewer</p>
      <div className="p-8">
        <div className="relative h-80 w-64 touch-none overflow-hidden ring-4 ring-blue-500">
          <div ref={pdfContainerRef}>
            <Document
              file={"./test.pdf"}
              onLoadSuccess={onDocumentLoadSuccess}
              inputRef={pdfRef}
              className={"absolute"}
            >
              <Page pageNumber={1} />
            </Document>
          </div>
        </div>
      </div>
    </>
  );
}
