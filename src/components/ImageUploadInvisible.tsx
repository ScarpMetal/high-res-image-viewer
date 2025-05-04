import { useMemo } from "react";
import { useImageDrop } from "../hooks/useImageDrop";
import { cx } from "../utils.ts/stringUtils";

interface ImageUploadInvisibleProps {
  children: React.ReactNode | React.ReactNode[];
  containerMethod?: "absolute" | "relative";
}

export function ImageUploadInvisible({
  children,
  containerMethod = "absolute",
}: ImageUploadInvisibleProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    activeText,
  } = useImageDrop({
    noClick: true,
  });

  const rootProps = useMemo(() => {
    const imageDropProps = getRootProps();
    const absoluteClass = "absolute inset-0";
    const relativeClass = "relative w-full h-full";
    return {
      ...imageDropProps,
      className: cx(
        imageDropProps?.className,
        containerMethod === "absolute" ? absoluteClass : relativeClass
      ),
    };
  }, [getRootProps, containerMethod]);

  return (
    <div {...rootProps}>
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-100">
          <div
            className={`absolute inset-4 flex flex-col items-center justify-center border-2 border-dashed p-8 rounded-lg ${
              isDragReject ? "border-red-500" : "border-white"
            }`}
          >
            <p
              className={`${
                isDragReject ? "text-red-500" : "text-white"
              } text-2xl font-bold`}
            >
              {activeText}
            </p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
