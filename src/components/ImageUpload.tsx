import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useImageStore } from "../store/imageStore";
import { useNavigate } from "react-router-dom";

export function ImageUpload() {
  const { addImage } = useImageStore();
  const navigate = useNavigate();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Handle the uploaded files
      console.log("Accepted files:", acceptedFiles);

      const { name } = await addImage(acceptedFiles[0]);
      console.log("Image added");
      navigate(`/viewer/${name}`);
    },
    [addImage, navigate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className={`
    mt-8 p-8 border-2 border-dashed rounded-lg 
    cursor-pointer transition-colors duration-200
    flex flex-col items-center justify-center
    min-h-[300px]
    ${
      isDragActive
        ? "border-blue-500 bg-blue-50"
        : "border-gray-300 hover:border-blue-400"
    }
  `}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="text-blue-500 text-lg">Drop your image here...</p>
        ) : (
          <>
            <p className="text-gray-600 text-lg mb-2">
              Drag and drop your image here, or click to select
            </p>
            <p className="text-gray-500 text-sm">
              Supports JPEG, PNG, GIF and WebP
            </p>
          </>
        )}
      </div>
    </div>
  );
}
