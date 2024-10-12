import { HTMLProps, ReactNode, useRef } from "react";
import { PDFPageContext, usePDFPageContext } from "../page";
import { usePageViewport } from "../viewport";

export const Page = ({
  children,
  pageNumber = 1,
  style,
  ...props
}: HTMLProps<HTMLDivElement> & {
  children: ReactNode;
  pageNumber: number;
}) => {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const { ready, context } = usePDFPageContext(pageNumber);
  usePageViewport({ pageContainerRef, pageNumber });
  return (
    <PDFPageContext.Provider value={context}>
      <div
        ref={pageContainerRef}
        style={{ display: ready ? "block" : "hidden" }}
      >
        {ready && (
          <div
            style={
              {
                ...style,
                "--scale-factor": 1,
                position: "relative",
                width: `${context.pdfPageProxy.view[2] - context.pdfPageProxy.view[0]}px`,
                height: `${context.pdfPageProxy.view[3] - context.pdfPageProxy.view[1]}px`,
              } as React.CSSProperties
            }
            {...props}
          >
            {children}
          </div>
        )}
      </div>
    </PDFPageContext.Provider>
  );
};
