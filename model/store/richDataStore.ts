import { create } from "zustand";
import { BranchNodeByD3, NodeKind } from "../GraphDataModel";

export type RichDataStore = {
  nodes:BranchNodeByD3[],
  paperNodes:BranchNodeByD3[],
  cloneNodes:BranchNodeByD3[],
  topicNodes:BranchNodeByD3[],
  setRichData: (allNodeList:BranchNodeByD3[])  => void;
}
export const useRichDataStore = create<RichDataStore>((set) => ({
  nodes:[],
  paperNodes:[],
  cloneNodes:[],
  topicNodes:[],
    setRichData: (allNodeList:BranchNodeByD3[]) => set(() => {
    const cloneNodes = allNodeList.filter(n => n.data.typeNumber !== NodeKind.Collection);
     // Only include nodes with unique itemID
    const seen = new Set<number>();
    const paperNodes = cloneNodes.filter(n => {
      const id = n.data.props.itemID;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    // console.log('RichDataStore.setRichData > allNodeList:', {
    //   allNodeList,
    //   cloneNodes,
    //   paperNodes
    // });
    return {
      nodes: allNodeList,
      paperNodes,
      cloneNodes,
      topicNodes: allNodeList.filter(n => n.data.typeNumber === NodeKind.Collection),
    };
  }),
}))