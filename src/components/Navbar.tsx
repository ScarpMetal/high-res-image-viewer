import { Link } from "react-router-dom";
import { useImageStore } from "../store/imageStore";
import { isDevelopment } from "../utils.ts/devUtils";

export default function Navbar() {
  const { clearStore } = useImageStore();
  const isDev = isDevelopment();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">
            Image Viewer
          </Link>
        </div>
        {isDev && (
          <button
            onClick={() => void clearStore()}
            className="text-sm font-bold"
          >
            Clear Store
          </button>
        )}
      </div>
    </nav>
  );
}
