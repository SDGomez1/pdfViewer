import { useEffect, useRef } from "react";
import { usePDFPage } from "../page";
import { renderTextLayer } from "pdfjs-dist";

import * as pdfjs from "pdfjs-dist";
export const useTextLayer = () => {
  const textContainerRef = useRef<HTMLDivElement>(null);
  const { pdfPageProxy } = usePDFPage();

  useEffect(() => {
    if (!textContainerRef.current) {
      return;
    }
    const layerText = renderTextLayer({
      textContentSource: pdfPageProxy.streamTextContent(),
      container: textContainerRef.current,
      viewport: pdfPageProxy.getViewport({ scale: 1 }),
    });

    void layerText;

    return () => {
      layerText.cancel();
    };
  }, [pdfPageProxy, textContainerRef.current]);
  return {
    textContainerRef,
  };
};
