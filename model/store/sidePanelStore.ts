import { create } from "zustand";

export type SidePanelStore = {
    showSelectedOnly: boolean,
    toggleShowSelectedOnly: () => void,
    setShowSelectedOnly: (selectedOnly:boolean) => void,
}

export const useSidePanelStore = create<SidePanelStore>((set, get) => ({
    showSelectedOnly: false,
    toggleShowSelectedOnly: () => set((state) => ({ showSelectedOnly: !state.showSelectedOnly })),
    setShowSelectedOnly: (selectedOnly:boolean) => set({ showSelectedOnly: selectedOnly }),
}));