export interface ImageViewerData {
  id: string;
  src: string;
  name: string;
  width: number;
  height: number;
}

export interface ZoomValues {
  scale: number;
  center: { x: number; y: number };
  memo?: PinchMemo;
}

export interface PinchMemo {
  x: number;
  y: number;
  tx: number;
  ty: number;
}
