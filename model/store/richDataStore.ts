import { create } from "zustand";
import { BranchNodeByD3, NodeKind } from "../GraphDataModel";

export type RichDataStore<TItemProps = unknown, TCollectionProps = unknown> = {
  nodes: BranchNodeByD3<TItemProps, TCollectionProps>[];
  itemNodes: BranchNodeByD3<TItemProps, TCollectionProps>[];
  cloneNodes: BranchNodeByD3<TItemProps, TCollectionProps>[];
  collectionNodes: BranchNodeByD3<TItemProps, TCollectionProps>[];
  setRichData: (
    allNodeList: BranchNodeByD3<TItemProps, TCollectionProps>[],
  ) => void;
};

export function createRichDataStore<TItemProps, TCollectionProps>() {
  return create<RichDataStore<TItemProps, TCollectionProps>>((set) => ({
    nodes: [],
    itemNodes: [],
    cloneNodes: [],
    collectionNodes: [],
    setRichData: (allNodeList) =>
      set(() => {
        const cloneNodes = allNodeList.filter(
          (n) => n.data.typeNumber !== NodeKind.Collection,
        );
        const seen = new Set<number>();
        const itemNodes = cloneNodes.filter((n) => {
          const props = n.data.props as { itemID?: number };
          const id =
            props.itemID != null && props.itemID !== 0
              ? props.itemID
              : n.data.id;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        return {
          nodes: allNodeList,
          itemNodes,
          cloneNodes,
          collectionNodes: allNodeList.filter(
            (n) => n.data.typeNumber === NodeKind.Collection,
          ),
        };
      }),
  }));
}
