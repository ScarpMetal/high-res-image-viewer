export function getMinScale(
  image: { height: number },
  container: HTMLDivElement | null
) {
  if (!container) return 1;
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
