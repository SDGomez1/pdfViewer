import { HTMLProps } from "react";
import {
  PDFDocumentContext,
  usePDfDocumentContext,
  usePDfDocumentContextProps,
} from "../document";
import { useViewPortContext, ViewportContext } from "../viewport";
export const Root = ({
  fileUrl,
  children,
}: HTMLProps<HTMLDivElement> & usePDfDocumentContextProps) => {
  const { ready, context, pdfDocumentProxy } = usePDfDocumentContext({
    fileUrl,
  });
  const viewportContext = useViewPortContext({});

  return (
    <div>
      {ready ? (
        <PDFDocumentContext.Provider value={context}>
          <ViewportContext.Provider value={viewportContext}>
            {children}
          </ViewportContext.Provider>
        </PDFDocumentContext.Provider>
      ) : (
        "loading"
      )}
    </div>
  );
};
