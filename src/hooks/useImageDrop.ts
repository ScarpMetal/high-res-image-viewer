import { DragEventHandler, useCallback, useMemo, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { useImageStore } from "../store/imageStore";
import { useNavigate } from "react-router-dom";

export interface UseImageDropProps {
  onDrop?: (
    acceptedFiles: File[],
    rejectedFiles?: FileRejection[]
  ) => void | Promise<void>;
  noClick?: boolean;
}

export function useImageDrop({
  onDrop,
  noClick = false,
}: UseImageDropProps = {}) {
  const { addImage } = useImageStore();
  const navigate = useNavigate();
  const [activeItems, setActiveItems] = useState<DataTransferItem[]>([]);

  const onDropDefault = useCallback(
    async (acceptedFiles: File[], rejectedFiles?: FileRejection[]) => {
      if (acceptedFiles.length === 0 || (rejectedFiles?.length ?? 0) > 0)
        return;
      const { name } = await addImage(acceptedFiles[0]);
      void navigate(`/viewer/${name}`);
    },
    [addImage, navigate]
  );

  const handleDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles?: FileRejection[]) => {
      if (onDrop) {
        await onDrop(acceptedFiles, rejectedFiles);
      } else {
        await onDropDefault(acceptedFiles, rejectedFiles);
      }
    },
    [onDrop, onDropDefault]
  );

  const handleDragEnter: DragEventHandler<HTMLElement> = useCallback(
    (event) => {
      setActiveItems([...event.dataTransfer.items]);
    },
    []
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) =>
      void handleDrop(acceptedFiles, rejectedFiles),
    onDragEnter: handleDragEnter,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    noClick,
    maxFiles: 1,
  });

  const activeText = useMemo<string>(() => {
    if (activeItems.length > 1) {
      return "Only a single image is allowed";
    }
    if (isDragReject) {
      return "File type not accepted";
    }
    return "Drop your image here...";
  }, [activeItems.length, isDragReject]);

  const titleText = useMemo<string>(() => {
    if (noClick) {
      return "Drag and drop your image here";
    }
    return `Drag and drop your image here, or click to select`;
  }, [noClick]);

  const supportsText = useMemo<string>(() => {
    return "Supports JPEG, JPG, PNG, GIF and WebP";
  }, []);

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
    activeText,
    titleText,
    supportsText,
  };
}
