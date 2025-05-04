import { useImageStore } from "../store/imageStore";
import { ImageViewer } from "../components/ImageViewer";
import { Loading } from "../components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ImageViewerData } from "../types/imageTypes";
import { ImageUploadInvisible } from "../components/ImageUploadInvisible";

export default function ViewerPage() {
  const navigate = useNavigate();
  const { filename } = useParams<{ filename: string }>();
  const { _hasHydrated, getImageByFilename } = useImageStore();
  const [currentImage, setCurrentImage] = useState<ImageViewerData | null>(
    null
  );

  useEffect(() => {
    if (!filename) {
      void navigate("/");
      return;
    }
    const image = getImageByFilename(filename);
    if (image) {
      setCurrentImage(image);
    } else if (_hasHydrated) {
      void navigate("/");
      return;
    }
  }, [_hasHydrated, filename, getImageByFilename, navigate]);

  if (!currentImage) {
    return <Loading />;
  }

  return (
    <ImageUploadInvisible>
      <ImageViewer key={currentImage.name} image={currentImage} />
    </ImageUploadInvisible>
  );
}
