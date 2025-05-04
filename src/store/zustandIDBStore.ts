import { createStore, get, set, del, clear } from "idb-keyval";
import { StateStorage } from "zustand/middleware";

const DEBUG_ZUSTAND_IDB_STORAGE = false;

const zustandStore = createStore("zustand-db", "zustand-store");

const log = (message: string, ...args: unknown[]) => {
  if (!DEBUG_ZUSTAND_IDB_STORAGE) return;
  console.log("[zustandIDBStorage]", message, ...args);
};

export const zustandIDBStorage: StateStorage = {
  getItem: async (name: string) => {
    log("getItem", name);
    const result = await get<string>(name, zustandStore);
    log("getItem done", result);
    return result ?? null;
  },
  setItem: async (name: string, value: unknown) => {
    log("setItem", name, value);
    await set(name, value, zustandStore);
    log("setItem done");
  },
  removeItem: async (name: string) => {
    log("removeItem", name);
    await del(name, zustandStore);
    log("removeItem done");
  },
};

export async function clearZustandIDBStore() {
  log("clearZustandIDBStore");
  await clear(zustandStore);
  log("clearZustandIDBStore done");
}
