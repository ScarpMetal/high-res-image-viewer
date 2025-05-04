import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ImageViewerData } from "../types/imageTypes";
import { zustandIDBStorage } from "./zustandIDBStore";

const DEBUG_IMAGE_STORE = false;

const log = (message: string, ...args: unknown[]) => {
  if (!DEBUG_IMAGE_STORE) return;
  console.log("[imageStore]", message, ...args);
};

export interface ImageViewerStore {
  images: ImageViewerData[];
  addImage: (file: File) => Promise<ImageViewerData>;
  getImageByFilename: (filename: string) => ImageViewerData | null;
  clearStore: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useImageStore = create<ImageViewerStore>()(
  persist(
    (set, get) => ({
      images: [],

      addImage: async (file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const src = e.target?.result as string;
            const img = new Image();
            img.src = src;
            await new Promise((resolve) => {
              img.onload = resolve;
            });
            const newImage: ImageViewerData = {
              id: `user-${Date.now()}`,
              src,
              name: file.name,
              width: img.width,
              height: img.height,
            };
            try {
              set((state) => {
                const images = [...state.images];
                const existingImageIndex = images.findIndex(
                  (img) => img.name === newImage.name
                );
                if (existingImageIndex !== -1) {
                  images.splice(existingImageIndex, 1);
                }
                images.push(newImage);
                return { images };
              });
              resolve(newImage);
            } catch (error) {
              console.error("Error adding image:", error);
              console.error(newImage);
              const storageEstimate = await navigator.storage.estimate();
              console.error("Navigator storage estimate", storageEstimate);
              reject(error);
            }
          };

          try {
            reader.readAsDataURL(file);
          } catch (error) {
            console.error("Error reading file:", error);
            reject(error);
          }
        });
      },

      getImageByFilename: (filename: string) => {
        return get().images.find((img) => img.name === filename) || null;
      },

      clearStore: () => {
        set({ images: [] });
        localStorage.clear();
        zustandIDBStorage.clear();
      },

      _hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: "image-storage",
      partialize: (state) => ({ images: state.images }),
      storage: createJSONStorage(() => zustandIDBStorage),
      onRehydrateStorage: (initialState) => {
        log("onRehydrateStorage start", initialState);

        return (state, error) => {
          if (error) {
            console.error("onRehydrateStorage error", error);
          }
          state?.setHasHydrated(true);
          log("onRehydrateStorage end", state);
        };
      },
    }
  )
);
