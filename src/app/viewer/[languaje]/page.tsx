"use client";

import { CanvasLayer, TextLayer } from "@/lib/pdf/components/Layers";
import { Page } from "@/lib/pdf/components/Page";
import { Pages } from "@/lib/pdf/components/Pages";
import { Root } from "@/lib/pdf/components/Root";
import { Viewport } from "@/lib/pdf/components/Viewport";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";

export default function homepage({ params }: { params: { languaje: string } }) {
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
      <Root fileUrl={file}>
        <Viewport>
          <Page pageNumber={1}>
            <CanvasLayer />
          </Page>
        </Viewport>
      </Root>
    );
  }
}
