import {
  getDocument,
  GlobalWorkerOptions,
  OnProgressParameters,
  PDFDocumentProxy,
} from "pdfjs-dist";
import { RefProxy } from "pdfjs-dist/types/src/display/api";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export interface usePDfDocumentContextProps {
  fileUrl: string;
}
export const usePDfDocumentContext = ({
  fileUrl,
}: usePDfDocumentContextProps) => {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const pdfProxy = useRef<PDFDocumentProxy | null>(null);

  useEffect(() => {
    setReady(false);
    setProgress(0);
    const loading = getDocument(fileUrl);
    loading.onProgress = (event: OnProgressParameters) => {
      if (event.loaded === event.total) {
        return;
      }
      setProgress(event.loaded / event.total);
    };

    loading.promise.then(
      (proxy) => {
        pdfProxy.current = proxy;
        setProgress(1);
        setReady(true);
      },
      (error) => {
        console.log("error loading:", error);
      }
    );
    return () => {
      void loading.destroy();
    };
  }, [fileUrl]);

  const getDocumentProxy = useCallback(() => {
    if (!pdfProxy.current) {
      throw new Error("not loaded");
    }
    return pdfProxy.current;
  }, [pdfProxy.current]);

  return {
    context: {
      get pdfDocumentProxy() {
        return getDocumentProxy();
      },
      async getDestinationPage(
        destination: string | unknown[] | Promise<unknown[]>
      ) {
        let explicitDestination: unknown[] | null;
        if (typeof destination === "string") {
          explicitDestination =
            await getDocumentProxy().getDestination(destination);
        } else if (Array.isArray(destination)) {
          explicitDestination = destination;
        } else {
          explicitDestination = await destination;
        }
        if (!explicitDestination) {
          return;
        }
        const explicitRef = explicitDestination[0] as RefProxy;
        const page = await getDocumentProxy().getPageIndex(explicitRef);
        return page;
      },
      ready,
    } satisfies PDFDocumentContextType,
    ready,
    progress,
    pdfDocumentProxy: pdfProxy.current,
  };
};

export interface PDFDocumentContextType {
  pdfDocumentProxy: PDFDocumentProxy;
  getDestinationPage: (
    destination: string | unknown[] | Promise<unknown[]>
  ) => Promise<number | undefined>;
  ready: boolean;
}

export const defaultPDFDocumentContext: PDFDocumentContextType = {
  get pdfDocumentProxy(): PDFDocumentProxy {
    throw new Error("PDF document not loaded");
  },
  getDestinationPage: async () => {
    throw new Error("PDF document not loaded");
  },
  ready: false,
} satisfies PDFDocumentContextType;

export const PDFDocumentContext = createContext(defaultPDFDocumentContext);

export const usePDFDocument = () => {
  return useContext(PDFDocumentContext);
};
