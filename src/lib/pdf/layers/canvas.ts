import { useEffect, useRef, useState } from "react";
import { usePDFPage } from "../page";
import { useDevicePixelRatio, useViewport, useVisibility } from "../viewport";
import { useDebounce } from "@uidotdev/usehooks";

export const useCanvasLayer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialRendering, setInitialRendering] = useState(true);
  const [image, setImage] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const { pdfPageProxy } = usePDFPage();
  const dpr = useDevicePixelRatio();
  const { visible } = useVisibility({ elementRef: containerRef });
  const { zoom: bouncyZoom } = useViewport();
  const zoom = useDebounce(bouncyZoom, 1000);
  const debouncedVisibility = useDebounce(visible, 1000);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const viewport = pdfPageProxy.getViewport({ scale: 1 });
    const canvas = canvasRef.current;
    const scale = dpr * zoom;
    canvas.height = viewport.height * scale;
    canvas.width = viewport.width * scale;

    canvas.style.height = `${viewport.height}px`;
    canvas.style.width = `${viewport.width}px`;

    const canvasContext = canvas.getContext("2d");

    if (!canvasContext) {
      return;
    }
    canvasContext.scale(scale, scale);

    if (initialRendering) {
      const renderingTask = pdfPageProxy.render({
        canvasContext: canvasContext,
        viewport,
      });
      renderingTask.promise
        .then(() => {
          setImage(canvas.toDataURL("image/png"));
          setSize({ w: viewport.width, h: viewport.height });
          setInitialRendering(false);
        })

        .catch((error) => {
          if (error.name === "RenderingCancelledException") {
            return;
          }
          throw error;
        });
      return () => {
        void renderingTask.cancel();
      };
    }
    if (debouncedVisibility && !initialRendering) {
      const renderingTask = pdfPageProxy.render({
        canvasContext: canvasContext,
        viewport,
      });
      renderingTask.promise
        .then(() => {
          setImage(canvas.toDataURL("image/png"));
          setSize({ w: viewport.width, h: viewport.height });
        })

        .catch((error) => {
          if (error.name === "RenderingCancelledException") {
            return;
          }
          throw error;
        });

      return () => {
        void renderingTask.cancel();
      };
    }
  }, [pdfPageProxy, canvasRef.current, dpr, zoom, debouncedVisibility]);

  return {
    canvasRef,
    image,
    size,
    containerRef,
  };
};
