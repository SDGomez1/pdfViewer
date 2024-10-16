"use client";

import { CanvasLayer, TextLayer } from "@/lib/pdf/components/Layers";
import { Page } from "@/lib/pdf/components/Page";
import { Pages } from "@/lib/pdf/components/Pages";
import { Root } from "@/lib/pdf/components/Root";
import { Viewport } from "@/lib/pdf/components/Viewport";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Logo } from "@/assets/Logo";

export default function Viewer({ params }: { params: { languaje: string } }) {
  const [file, setFile] = useState<string | null>(null);
  const pdfUrl = useQuery(api.pdfFiles.getpdfFile, {
    languaje: params.languaje,
  });
  if (!file) {
    if (typeof pdfUrl === "string") {
      setFile(pdfUrl);
    }
  }

  if (!file) {
    return <>cargando datos</>;
  } else {
    return (
      <div className="relative touch-none">
        <div className="fixed z-10 flex h-10 w-full items-center justify-center bg-[#0C3440]">
          <Logo className="scale-75" />
        </div>
        <Root fileUrl={file}>
          <Viewport>
            <Pages>
              <Page pageNumber={1}>
                <CanvasLayer />
              </Page>
            </Pages>
          </Viewport>
        </Root>
      </div>
    );
  }
}
