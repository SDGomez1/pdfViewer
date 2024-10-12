import { useEffect, useRef } from "react";
import { usePDFPage } from "../page";
import { useDevicePixelRatio, useViewport, useVisibility } from "../viewport";
import { useDebounce } from "@uidotdev/usehooks";

export const useCanvasLayer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pdfPageProxy } = usePDFPage();
  const dpr = useDevicePixelRatio();
  const { visible } = useVisibility({ elementRef: canvasRef });
  const { zoom: bouncyZoom } = useViewport();
  const zoom = useDebounce(bouncyZoom, 1000);
  const debouncedVisible = useDebounce(visible, 1000);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const viewport = pdfPageProxy.getViewport({ scale: 1 });
    const canvas = canvasRef.current;
    const scale = debouncedVisible ? dpr * zoom : 0.5;
    canvas.height = viewport.height * scale;
    canvas.width = viewport.width * scale;

    canvas.style.height = `${viewport.height}px`;
    canvas.style.width = `${viewport.width}px`;

    const canvasContext = canvas.getContext("2d");

    if (!canvasContext) {
      return;
    }
    canvasContext.scale(scale, scale);

    const renderingTask = pdfPageProxy.render({
      canvasContext: canvasContext,
      viewport,
    });

    renderingTask.promise.catch((error) => {
      if (error.name === "RenderingCancelledException") {
        return;
      }
      throw error;
    });

    return () => {
      void renderingTask.cancel();
    };
  }, [pdfPageProxy, canvasRef.current, dpr, debouncedVisible, zoom]);
  return {
    canvasRef,
  };
};
