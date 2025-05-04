import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useImageStore } from "../store/imageStore";
import { useNavigate } from "react-router-dom";

export interface UseImageDropProps {
  onDrop?: (acceptedFiles: File[]) => void | Promise<void>;
  noClick?: boolean;
}

export function useImageDrop({
  onDrop,
  noClick = false,
}: UseImageDropProps = {}) {
  const { addImage } = useImageStore();
  const navigate = useNavigate();

  const onDropDefault = useCallback(
    async (acceptedFiles: File[]) => {
      const { name } = await addImage(acceptedFiles[0]);
      void navigate(`/viewer/${name}`);
    },
    [addImage, navigate]
  );

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (onDrop) {
        await onDrop(acceptedFiles);
      } else {
        await onDropDefault(acceptedFiles);
      }
    },
    [onDrop, onDropDefault]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => void handleDrop(acceptedFiles),
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    noClick,
  });

  return { getRootProps, getInputProps, isDragActive };
}
