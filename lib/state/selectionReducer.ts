import { BranchNodeByD3 } from "@/model/GraphDataModel";
import {
  getUniqueNodes,
  getUniqueNumbers,
  getUniqueStrings,
} from "../utils/arrayUtils";

export interface NodesSelection {
  lastSelectedNodeData: BranchNodeByD3 | undefined;
  lastSelectedNodeClones: BranchNodeByD3[];
  itemsSelectionIds: number[];
  clonesSelection: BranchNodeByD3[];
  selectionSource: SelectionSource;
}

export enum SelectionSource {
  FILTER_PANEL = "FILTER_PANEL",
  GRAPH = "GRAPH",
}

export enum SelectionActions {
  TOGGLE_ITEM_SELECTION = "TOGGLE_ITEM_SELECTION",
  TOGGLE_CLONE_SELECTION = "TOGGLE_CLONE_SELECTION",
  CLEAR_SELECTION = "CLEAR_SELECTION",
}

export type SelectionActionType = {
  type: SelectionActions;
  payload:
    | {
        targetNode: BranchNodeByD3;
        clones: BranchNodeByD3[];
        selectionSource: SelectionSource;
        multiSelect?: boolean;
      }
    | undefined;
};

export const selectionReducer = (
  state: NodesSelection,
  action: SelectionActionType
): NodesSelection => {
  const multiSelect = action.payload?.multiSelect || false;
  const targetNode = action.payload?.targetNode as BranchNodeByD3;
  const clones = action.payload?.clones as BranchNodeByD3[];
  const selectionSource = action.payload?.selectionSource as SelectionSource;
  const lastSelectedItemId: number =
    targetNode && targetNode.data.props.itemID;
  const lastSelectedNodeClones = targetNode ? [...clones] : [];
  // console.log(">>> selectionReducer > action", action);
  // console.log(">>> selectionReducer striped data: >", {
  //   targetNode,
  //   clones,
  //   selectionSource,
  //   lastSelectedItemId,
  //   lastSelectedNodeClones,
  // });

  switch (action.type) {
    /**
     * Filter Item selection
     */
    case SelectionActions.TOGGLE_ITEM_SELECTION:
      if (!action.payload) {
        return state;
      }
      const isItemAlreadySelected = state.itemsSelectionIds.some(
        (selectedItemId) => selectedItemId === lastSelectedItemId
      );

      if (isItemAlreadySelected) {
        //DESELECT
        return {
          lastSelectedNodeData: undefined,
          lastSelectedNodeClones: [],
          itemsSelectionIds: state.itemsSelectionIds.filter(
            (nodeId) => nodeId !== lastSelectedItemId
          ),
          clonesSelection: state.clonesSelection.filter(
            (clone) => clone.data.props.itemID !== lastSelectedItemId
          ),
          selectionSource,
        };
      }

      // SELECT
      return {
        lastSelectedNodeData: targetNode,
        lastSelectedNodeClones,
        itemsSelectionIds: [...state.itemsSelectionIds, lastSelectedItemId],
        clonesSelection: [
          // ...state.clonesSelection,
          ...lastSelectedNodeClones,
        ],
        selectionSource,
      };

    /**
     * A single graphs's Node selection
     */
    case SelectionActions.TOGGLE_CLONE_SELECTION:
      if (!action.payload) {
        return state;
      }
      // const { targetNode, clones, selectionSource } = action.payload;
      const targetCloneId: number = targetNode.data.id;
      const targetCloneItemId: number =
        action.payload.targetNode.data.props.itemID;
      const isCloneAlreadySelected = state.clonesSelection.some(
        (alredySelectedClone) => alredySelectedClone.data.id === targetCloneId
      );

      if (isCloneAlreadySelected) {
        //DESELECT
        const newClonesSelection = state.clonesSelection.filter(
          (clone) => clone.data.id !== targetCloneId
        );
        const newLastSelectedClone = newClonesSelection.find(
          (clone) => clone.data.props.itemID === targetCloneItemId
        );
        const newItemsSelectionIds = !newLastSelectedClone //if no more clones of that item then the item has to be removed from the selection list
          ? state.itemsSelectionIds.filter((id) => id !== targetCloneItemId)
          : [...state.itemsSelectionIds];
        return {
          lastSelectedNodeData: newLastSelectedClone,
          lastSelectedNodeClones,
          itemsSelectionIds: newItemsSelectionIds,
          clonesSelection: newClonesSelection,
          selectionSource,
        };
      }
      // SELECT
      const isCloneOfNewItem =
        !state.itemsSelectionIds.includes(targetCloneItemId);

      return {
        lastSelectedNodeData: targetNode,
        lastSelectedNodeClones,
        itemsSelectionIds: isCloneOfNewItem
          ? getUniqueNumbers([...state.itemsSelectionIds, targetCloneItemId])
          : [...state.itemsSelectionIds],
        clonesSelection: multiSelect
          ? getUniqueNodes([
              ...state.clonesSelection,
              ...lastSelectedNodeClones,
              targetNode,
            ])
          : [...lastSelectedNodeClones],
        selectionSource,
      };

    case SelectionActions.CLEAR_SELECTION:
      return {
        lastSelectedNodeData: undefined,
        lastSelectedNodeClones: [],
        itemsSelectionIds: [],
        clonesSelection: [],
        selectionSource: SelectionSource.FILTER_PANEL,
      };

    default:
      return state;
  }
};
