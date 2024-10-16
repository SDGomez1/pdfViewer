"use client";

import { Logo } from "@/assets/Logo";
import { CanvasLayer } from "@/lib/pdf/components/Layers";
import { Page } from "@/lib/pdf/components/Page";
import { Pages } from "@/lib/pdf/components/Pages";
import { Root } from "@/lib/pdf/components/Root";
import { Viewport } from "@/lib/pdf/components/Viewport";

export default function Viewer() {
  return (
    <div className="relative touch-none">
      <div className="fixed z-10 flex h-10 w-full items-center justify-center bg-[#0C3440]">
        <Logo className="scale-75" />
      </div>
      <Root fileUrl={"/test.pdf"}>
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
