import { Vector2 } from "@use-gesture/react";
import { PinchMemo, ZoomValues } from "../types/imageTypes";

export function getMinScale(
  image: { height: number },
  container: HTMLDivElement | EventTarget | null
) {
  if (!(container instanceof HTMLDivElement)) return 1;
  const rect = container.getBoundingClientRect();
  return Math.min((rect.height / image.height) * 0.75, 1);
}

export function getMaxScale() {
  return 10;
}

export function getInitialImageViewerState(
  image: { width: number; height: number },
  container: HTMLDivElement | null
) {
  if (!container) return { imageX: 0, imageY: 0, scale: 1 };

  const scale = getMinScale(image, container);
  const rect = container?.getBoundingClientRect();
  const imageWidth = image.width * scale;
  const imageHeight = image.height * scale;

  const imageX = rect.width / 2 - imageWidth / 2;
  const imageY = rect.height / 2 - imageHeight / 2;

  return { imageX, imageY, scale };
}

export function getWheelZoomValues(
  container: HTMLDivElement,
  event: WheelEvent,
  currentScale: number,
  minScale: number,
  maxScale: number
): ZoomValues {
  const { x, y } = container.getBoundingClientRect();
  const direction = event.deltaY > 0 ? -1 : 1;
  const logCurrent = Math.log(currentScale);
  const logMin = Math.log(minScale);
  const logMax = Math.log(maxScale);
  const logRange = logMax - logMin;
  const positionInRange = (logCurrent - logMin) / logRange;
  const zoomIntensity = Math.exp(logMin + positionInRange * logRange) * 0.1;
  return {
    scale: currentScale + zoomIntensity * direction,
    center: { x: event.x - x, y: event.y - y },
  };
}

export function getPinchZoomValues(
  container: HTMLDivElement,
  first: boolean,
  origin: Vector2,
  movement: Vector2,
  imagePos: Vector2,
  offset: Vector2,
  memo: PinchMemo | undefined
): ZoomValues | null {
  const [startX, startY] = imagePos;
  const [scale] = offset;
  const [ms] = movement;
  const [ox, oy] = origin;

  if (first) {
    const { width, height, x, y } = container.getBoundingClientRect();
    const tx = ox - (x + width / 2);
    const ty = oy - (y + height / 2);
    memo = { x: startX, y: startY, tx, ty };
  }

  if (!memo) return null;

  const x = memo.x - (ms - 1) * memo.tx;
  const y = memo.y - (ms - 1) * memo.ty;

  return { scale, center: { x, y }, memo };
}
