import {
  createUseGesture,
  FullGestureState,
  pinchAction,
  wheelAction,
} from "@use-gesture/react";
import {
  BoundingBox,
  motion,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { constrain } from "../utils.ts/numberUtils";
import { ImageViewerData, PinchMemo } from "../types/imageTypes";
import {
  getInitialImageViewerState,
  getMaxScale,
  getMinScale,
  getPinchZoomValues,
  getWheelZoomValues,
} from "../utils.ts/imageUtils";

const useContainerGesture = createUseGesture([wheelAction, pinchAction]);

interface ImageViewerProps {
  image: ImageViewerData;
}

export function ImageViewer({ image }: ImageViewerProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [pinching, setPinching] = useState(false);
  const hasSetInitialScale = useRef(false);
  const dragControls = useDragControls();
  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);
  const scale = useMotionValue(1);

  const [dragConstraints, setDragConstraints] = useState<
    BoundingBox | undefined
  >(undefined);

  const updateDragConstraints = useCallback(() => {
    if (!container) return setDragConstraints(undefined);

    const currentScale = scale.get();
    const imageWidth = image.width * currentScale;
    const imageHeight = image.height * currentScale;
    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const edgeTop = 0;
    const edgeLeft = 0;
    const edgeBottom = containerHeight - imageHeight;
    const edgeRight = containerWidth - imageWidth;

    const halfImageTop = edgeTop - imageHeight / 2;
    const halfImageLeft = edgeLeft - imageWidth / 2;
    const halfImageBottom = edgeBottom + imageHeight / 2;
    const halfImageRight = edgeRight + imageWidth / 2;

    const halfContainerTop = edgeTop + containerHeight / 2 - imageHeight;
    const halfContainerLeft = edgeLeft + containerWidth / 2 - imageWidth;
    const halfContainerBottom = edgeBottom - containerHeight / 2 + imageHeight;
    const halfContainerRight = edgeRight - containerWidth / 2 + imageWidth;

    setDragConstraints({
      top: Math.min(halfContainerTop, halfImageTop),
      left: Math.min(halfContainerLeft, halfImageLeft),
      bottom: Math.max(halfContainerBottom, halfImageBottom),
      right: Math.max(halfContainerRight, halfImageRight),
    });
  }, [container, image, scale]);

  useMotionValueEvent(scale, "change", () => {
    updateDragConstraints();
  });

  useEffect(() => {
    updateDragConstraints();

    if (container) {
      const resizeObserver = new ResizeObserver(() => {
        updateDragConstraints();
      });
      resizeObserver.observe(container);
      return () => resizeObserver.disconnect();
    }
  }, [container, updateDragConstraints]);

  const handleZoom = useCallback(
    (
      container: HTMLDivElement,
      eventScale: number,
      center: { x: number; y: number }
    ) => {
      // Get scale and it's limits
      const currentScale = scale.get();
      const minScale = getMinScale(image, container);
      const maxScale = getMaxScale();
      const newScale = constrain(eventScale, minScale, maxScale);

      // Calculate image offset for new scale
      const x = imageX.get();
      const y = imageY.get();
      const imageMouseXDelta = x - center.x;
      const imageMouseYDelta = y - center.y;
      const scaleDelta = newScale - currentScale;
      const nextOffsetX = (imageMouseXDelta * scaleDelta) / currentScale;
      const nextOffsetY = (imageMouseYDelta * scaleDelta) / currentScale;

      imageX.jump(x + nextOffsetX);
      imageY.jump(y + nextOffsetY);
      scale.set(newScale);
    },
    [scale, image, imageX, imageY]
  );

  useContainerGesture(
    {
      onPointerDown: ({ event }) => {
        if (pinching) return;
        dragControls.start(event);
      },
      onWheel: (state) => {
        const { currentTarget } = state;

        if (!(currentTarget instanceof HTMLDivElement)) return;

        const wheelZoomValues = getWheelZoomValues(
          currentTarget,
          state.event,
          scale.get(),
          getMinScale(image, currentTarget),
          getMaxScale()
        );

        if (!wheelZoomValues) return;

        const { scale: newScale, center } = wheelZoomValues;
        handleZoom(currentTarget, newScale, center);
      },
      onPinchStart: () => {
        setPinching(true);
      },
      onPinchEnd: () => {
        setPinching(false);
      },
      onPinch: (state) => {
        const { currentTarget, first, origin, movement, offset, memo } =
          state as Omit<FullGestureState<"pinch">, "memo"> & {
            memo: PinchMemo | undefined;
          };

        if (!(currentTarget instanceof HTMLDivElement)) return;

        const pinchZoomValues = getPinchZoomValues(
          currentTarget,
          first,
          origin,
          movement,
          [imageX.get(), imageY.get()],
          offset,
          memo
        );

        if (!pinchZoomValues) return;

        const { scale: newScale, center, memo: newMemo } = pinchZoomValues;
        handleZoom(currentTarget, newScale, center);

        return newMemo;
      },
    },
    {
      target: { current: container },
      wheel: {
        preventDefault: true,
      },
      pinch: {
        preventDefault: true,
      },
    }
  );

  useEffect(() => {
    if (!hasSetInitialScale.current && container) {
      const {
        imageX: _imageX,
        imageY: _imageY,
        scale: _scale,
      } = getInitialImageViewerState(image, container);
      imageX.set(_imageX);
      imageY.set(_imageY);
      scale.set(_scale);
      hasSetInitialScale.current = true;
    }
  }, [scale, container, image, imageX, imageY]);

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing ${
        pinching ? "bg-amber-950" : ""
      }`}
      // TODO: Remove the amber background for debugging pinch gestures
      ref={setContainer}
      style={{
        touchAction: "none",
      }}
    >
      <motion.div
        style={{
          backgroundImage: `url('${image.src}')`,
          width: image.width,
          height: image.height,
          x: imageX,
          y: imageY,
          scale,
          originX: "left",
          originY: "top",
        }}
        drag={!pinching}
        dragConstraints={dragConstraints}
        dragControls={dragControls}
        dragListener={false}
        dragTransition={{
          power: 0.4,
        }}
        className="relative bg-cover rounded-[5px] shadow-[0px_10px_30px_-5px_rgba(0,0,0,0.3)] border-[10px] border-white cursor-grab active:cursor-grabbing select-none overflow-hidden flex flex-col justify-center items-center font-medium text-[22px] p-5 text-center text-white/70"
      />
    </div>
  );
}
