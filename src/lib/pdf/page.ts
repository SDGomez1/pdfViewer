import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePDFDocument } from "./document";
import { PDFPageProxy } from "pdfjs-dist/types/src/display/api";
import { cancellable } from "./utils";

export const usePDFPageContext = (pageNumber: number) => {
  const { pdfDocumentProxy } = usePDFDocument();
  const [ready, setReady] = useState(false);
  const page = useRef<PDFPageProxy | null>(null);
  useEffect(() => {
    setReady(false);
    if (!pdfDocumentProxy) {
      return;
    }

    const { promise: loadingTask, cancel } = cancellable(
      pdfDocumentProxy.getPage(pageNumber)
    );

    loadingTask.then(
      (pageProxy) => {
        page.current = pageProxy;
        setReady(true);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      cancel();
    };
  }, [pdfDocumentProxy]);
  const getPDFPageProxy = useCallback(() => {
    if (!page.current) {
      throw new Error("PDF page not loaded");
    }
    return page.current;
  }, [page.current]);

  return {
    context: {
      get pdfPageProxy() {
        return getPDFPageProxy();
      },
      pageNumber,
    } satisfies PDFPageContextType,
    ready,
    pdfPageProxy: page.current,
  };
};
export interface PDFPageContextType {
  pageNumber: number;
  pdfPageProxy: PDFPageProxy;
}

export const defaultPDFPageContext: PDFPageContextType = {
  get pdfPageProxy(): PDFPageProxy {
    throw new Error("PDF page not loaded");
  },
  pageNumber: 0,
} satisfies PDFPageContextType;

export const PDFPageContext = createContext(defaultPDFPageContext);

export const usePDFPage = () => {
  return useContext(PDFPageContext);
};
