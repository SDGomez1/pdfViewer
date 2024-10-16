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
    <div className="touch-none bg-neutral-500">
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
