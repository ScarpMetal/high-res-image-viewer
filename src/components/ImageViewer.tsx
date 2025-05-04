import { createUseGesture, pinchAction, wheelAction } from "@use-gesture/react";
import { motion, useDragControls, useMotionValue } from "motion/react";
import { PointerEventHandler, useEffect, useRef, useState } from "react";
import { constrain } from "../utils.ts/numberUtils";
import { ImageViewerData } from "../types/imageTypes";
import {
  getInitialImageViewerState,
  getMaxScale,
  getMinScale,
} from "../utils.ts/imageUtils";

const useGesture = createUseGesture([pinchAction, wheelAction]);

interface ImageViewerProps {
  image: ImageViewerData;
}

export function ImageViewer({ image }: ImageViewerProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const hasSetInitialScale = useRef(false);
  const dragControls = useDragControls();
  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const scale = useMotionValue(1);

  useGesture(
    {
      onWheel: ({ direction: [_, direction], currentTarget, event }) => {
        if (!(currentTarget instanceof HTMLDivElement)) return;

        // Calculate mouse position relative to container
        const rect = currentTarget.getBoundingClientRect();
        const mouseX = event.x - rect.left;
        const mouseY = event.y - rect.top;

        // Calculate scale in logarithmic range
        const currentScale = scale.get();
        const minScale = getMinScale(image, currentTarget);
        const maxScale = getMaxScale();
        const logCurrent = Math.log(currentScale);
        const logMin = Math.log(minScale);
        const logMax = Math.log(maxScale);
        const logRange = logMax - logMin;
        const positionInRange = (logCurrent - logMin) / logRange;
        const zoomIntensity =
          Math.exp(logMin + positionInRange * logRange) * 0.1;
        const newScale = constrain(
          currentScale + zoomIntensity * -direction,
          minScale,
          maxScale
        );

        // Calculate image offset for new scale
        const x = imageX.get();
        const y = imageY.get();
        const imageMouseXDelta = x - mouseX;
        const imageMouseYDelta = y - mouseY;
        const scaleDelta = newScale - currentScale;
        const nextOffsetX = (imageMouseXDelta * scaleDelta) / currentScale;
        const nextOffsetY = (imageMouseYDelta * scaleDelta) / currentScale;

        imageX.jump(x + nextOffsetX);
        imageY.jump(y + nextOffsetY);
        scale.set(newScale);
      },
    },
    {
      target: { current: container },
      wheel: {
        preventDefault: true,
      },
    }
  );

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    dragControls.start(event);
  };

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

  return (
    <div
      className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
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
          translateX: offsetX,
          translateY: offsetY,
          scale,
          originX: "left",
          originY: "top",
        }}
        drag
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
