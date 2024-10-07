import {
  pdfViewUpdateCurrentScale,
  pdfViewUpdateScale,
  pdfViewUpdateTouchOrigin,
} from "@/lib/features/pdfView/pdfViewSlice";
import { store } from "@/lib/store";

const reduxStore = store;
let touchInfo: any = null;
let currentScale = 1;
function accumulateFactor(previousScale: number, factor: number) {
  if (factor === 1) {
    return 1;
  }
  // If the direction changed, reset the accumulated factor.

  const newFactor =
    Math.floor(previousScale * factor * 100) / (100 * previousScale);

  return newFactor;
}

function updateScale(scaleFactor: number) {
  if (scaleFactor > 0 && scaleFactor !== 1) {
    let newScale = Math.round(currentScale * scaleFactor * 100) / 100;
    currentScale = newScale;
    reduxStore.dispatch(pdfViewUpdateScale(newScale));
    return newScale;
  }
  return 1;
}

function onWheel(evt: WheelEvent) {
  if (evt.ctrlKey) {
    evt.preventDefault();
    /*    const deltaMode = evt.deltaMode;
    let factor = Math.exp(-evt.deltaY / 100);

    let newFactor = accumulateFactor(currentScale, factor);
    const newScale = updateScale(newFactor);
    reduxStore.dispatch(pdfViewUpdateCurrentScale(newScale)); */
  }
}

function onTouchStart(evt: TouchEvent) {
  evt.preventDefault();

  if (evt.touches.length !== 2) {
    return;
  }
  /*  let [touch0, touch1] = Array.from(evt.touches);
  if (touch0.identifier > touch1.identifier) {
    [touch0, touch1] = [touch1, touch0];
  }

  touchInfo = {
    touch0X: touch0.pageX,
    touch0Y: touch0.pageY,
    touch1X: touch1.pageX,
    touch1Y: touch1.pageY,
  };

  const midPointX = (touch0.clientX + touch1.clientX) / 2;
  const midPointY = (touch0.clientY + touch1.clientY) / 2;

  reduxStore.dispatch(pdfViewUpdateTouchOrigin({ x: midPointX, y: midPointY })); */
}

function onTouchMove(evt: TouchEvent) {
  evt.preventDefault();
  if (!touchInfo || evt.touches.length !== 2) {
    return;
  }
  /*   let [touch0, touch1] = Array.from(evt.touches);
  if (touch0.identifier > touch1.identifier) {
    [touch0, touch1] = [touch1, touch0];
  }
  const { pageX: page0X, pageY: page0Y } = touch0;
  const { pageX: page1X, pageY: page1Y } = touch1;
  const {
    touch0X: pTouch0X,
    touch0Y: pTouch0Y,
    touch1X: pTouch1X,
    touch1Y: pTouch1Y,
  } = touchInfo;
  if (
    Math.abs(pTouch0X - page0X) <= 1 &&
    Math.abs(pTouch0Y - page0Y) <= 1 &&
    Math.abs(pTouch1X - page1X) <= 1 &&
    Math.abs(pTouch1Y - page1Y) <= 1
  ) {
    // Touches are really too close and it's hard do some basic
    // geometry in order to guess something.
    return;
  }

  touchInfo.touch0X = page0X;
  touchInfo.touch0Y = page0Y;
  touchInfo.touch1X = page1X;
  touchInfo.touch1Y = page1Y;

  if (pTouch0X === page0X && pTouch0Y === page0Y) {
    // First touch is fixed, if the vectors are collinear then we've a pinch.
    const v1X = pTouch1X - page0X;
    const v1Y = pTouch1Y - page0Y;
    const v2X = page1X - page0X;
    const v2Y = page1Y - page0Y;
    const det = v1X * v2Y - v1Y * v2X;
    // 0.02 is approximatively sin(0.15deg).
    if (Math.abs(det) > 0.02 * Math.hypot(v1X, v1Y) * Math.hypot(v2X, v2Y)) {
      return;
    }
  } else if (pTouch1X === page1X && pTouch1Y === page1Y) {
    // Second touch is fixed, if the vectors are collinear then we've a pinch.
    const v1X = pTouch0X - page1X;
    const v1Y = pTouch0Y - page1Y;
    const v2X = page0X - page1X;
    const v2Y = page0Y - page1Y;
    const det = v1X * v2Y - v1Y * v2X;
    if (Math.abs(det) > 0.02 * Math.hypot(v1X, v1Y) * Math.hypot(v2X, v2Y)) {
      return;
    }
  } else {
    const diff0X = page0X - pTouch0X;
    const diff1X = page1X - pTouch1X;
    const diff0Y = page0Y - pTouch0Y;
    const diff1Y = page1Y - pTouch1Y;
    const dotProduct = diff0X * diff1X + diff0Y * diff1Y;
    if (dotProduct >= 0) {
      // The two touches go in almost the same direction.
      return;
    }
  } */

  evt.preventDefault();
  /*  const origin = [(page0X + page1X) / 2, (page0Y + page1Y) / 2];
  const distance = Math.hypot(page0X - page1X, page0Y - page1Y) || 1;
  const pDistance = Math.hypot(pTouch0X - pTouch1X, pTouch0Y - pTouch1Y) || 1;
  const factor = distance / pDistance;

  let newFactor = accumulateFactor(currentScale, factor);
  updateScale(newFactor); */
}

function onTouchEnd(evt: TouchEvent) {
  if (touchInfo) {
    /*     const storeState = reduxStore.getState().pdfView.currentScale;
    reduxStore.dispatch(pdfViewUpdateCurrentScale(storeState)); */
    return;
  }
  evt.preventDefault();
}
export { onWheel, onTouchStart, onTouchMove, onTouchEnd };
