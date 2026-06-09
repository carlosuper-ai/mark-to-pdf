import { create } from "zustand";

type Tab = "content" | "customize";

interface UIState {
  tab: Tab;
  setTab: (tab: Tab) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  tab: "content",
  setTab: (tab) => set({ tab }),
}));
