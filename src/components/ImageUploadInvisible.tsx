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
  const { getRootProps, getInputProps, isDragActive } = useImageDrop({
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
          <div className="absolute inset-4 flex flex-col items-center justify-center border-2 border-dashed border-white p-8 rounded-lg">
            <p className="text-white text-2xl font-bold">
              Drop your image here
            </p>
            <p className="text-white text-sm mt-2">
              This will replace the current image
            </p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
