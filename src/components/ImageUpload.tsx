import { useImageDrop } from "../hooks/useImageDrop";

export function ImageUpload() {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    titleText,
    activeText,
    supportsText,
  } = useImageDrop();

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
        ? isDragReject
          ? "border-red-500 bg-red-50"
          : "border-blue-500 bg-blue-50"
        : "border-gray-300 hover:border-blue-400"
    }
  `}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p
            className={`${
              isDragReject ? "text-red-500" : "text-blue-500"
            } text-lg`}
          >
            {activeText}
          </p>
        ) : (
          <>
            <p className="text-gray-600 text-lg mb-2">{titleText}</p>
            <p className="text-gray-500 text-sm">{supportsText}</p>
          </>
        )}
      </div>
    </div>
  );
}
