"use client";

import {
  onWheel,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
} from "@/utils/eventListeners";
import { useGesture, usePinch, useWheel } from "@use-gesture/react";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const [isPinching, setIsPinching] = useState<boolean | undefined>(false);
  const [pinchData, setPinchData] = useState(1);
  const [origin, setOrigin] = useState<number[] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window) {
      return;
    }
    window.addEventListener("wheel", onWheel, {
      passive: false,
    });
    window.addEventListener("touchstart", onTouchStart, {
      passive: false,
    });

    window.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    window.addEventListener("touchend", onTouchEnd, {
      passive: false,
    });
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("wheel", () => {});
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);
  usePinch(
    ({
      event,
      memo,
      pinching,
      origin: [ox, oy],
      offset: [s, a],
      movement: [mv],
      first,
    }) => {
      event.preventDefault();
      setIsPinching(pinching);
      if (first) {
        const { width, height, x, y } =
          containerRef.current!.getBoundingClientRect();
        const tx = ox - (x + width / 2);
        const ty = oy - (y + height / 2);
        memo = [tx, ty];
      }

      setOrigin([memo[0], memo[1]]);
    },
    {
      target: containerRef,
    }
  );

  return (
    <div className="absolute flex min-w-[350px] flex-col overflow-hidden">
      <div className="flex h-8 w-screen items-center justify-center bg-neutral-200">
        Toolbar {origin ? origin[0].toFixed(2) : ""} {pinchData.toFixed(2)}
      </div>
      <div className="inset-y-8 flex items-center justify-center outline-none">
        <div className="relative flex w-screen justify-center overflow-hidden">
          <div
            ref={containerRef}
            className="flex min-h-screen min-w-full items-center justify-center bg-green-200"
            style={{
              transformOrigin: origin
                ? `${origin[0]}px ${origin[1]}px`
                : "center center",
              scale: pinchData,
            }}
          >
            <div className="size-40 bg-blue-400" style={{}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
