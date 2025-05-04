import { ImageUpload } from "../components/ImageUpload";
import { useImageStore } from "../store/imageStore";

export default function HomePage() {
  const store = useImageStore();
  console.log(store);
  return (
    <div className="px-8 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Image Viewer</h1>
      <div className="container mx-auto">
        <ImageUpload />
      </div>
    </div>
  );
}
