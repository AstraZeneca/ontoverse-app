import { create } from "zustand";
import { BranchNodeByD3 } from "../GraphDataModel";

export type SelectState = {
  selectedTopic: BranchNodeByD3 | null;
  selectedChipClone: BranchNodeByD3 | null;
  multiSelect: boolean;
  toggleChipCloneSelection: (selectedChip: BranchNodeByD3) => void;
  enableMultiSelect: () => void;
  disableMultiSelect: () => void;
};

export const useSelectStore = create<SelectState>((set, get) => ({
  selectedTopic: null,
  selectedChipClone: null,
  multiSelect: false,
  toggleChipCloneSelection: (selectedChip) =>
    set({
      selectedChipClone: selectedChip,
    }),
  enableMultiSelect: () => set({ multiSelect: true }),
  disableMultiSelect: () => set({ multiSelect: false }),
}));
