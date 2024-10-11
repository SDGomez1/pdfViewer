"use client";

import { CanvasLayer, TextLayer } from "@/lib/pdf/components/Layers";
import { Page } from "@/lib/pdf/components/Page";
import { Pages } from "@/lib/pdf/components/Pages";
import { Root } from "@/lib/pdf/components/Root";
import { Viewport } from "@/lib/pdf/components/Viewport";

export default function homepage() {
  return (
    <Root fileUrl="/test.pdf">
      <Viewport>
        <Pages>
          <Page pageNumber={1}>
            <CanvasLayer />
          </Page>
        </Pages>
      </Viewport>
    </Root>
  );
}
