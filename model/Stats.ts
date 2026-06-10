import { BranchNodeByD3, NodeKind } from "./GraphDataModel";

type TreeStats = {
  allItemsCount: number;
  itemCount: number;
  cloneCount: number;
  collectionLeafNodesCount: number;
  collectionCount: number;
};

export const getTreeStats = (
  tree: BranchNodeByD3<unknown, unknown>,
  stats: TreeStats = {
    allItemsCount: 0,
    itemCount: 0,
    cloneCount: 0,
    collectionLeafNodesCount: 0,
    collectionCount: 0,
  },
): TreeStats => {
  if (tree === null) return stats;

  const typeNumber = tree.data.typeNumber;

  if (typeNumber === NodeKind.Clone) {
    stats.cloneCount++;
    stats.allItemsCount++;
  } else if (typeNumber === NodeKind.Item) {
    stats.itemCount++;
    stats.allItemsCount++;
  } else if (typeNumber === NodeKind.Collection) {
    if (tree.data.collectionLeaf) {
      stats.collectionLeafNodesCount++;
    }
    stats.collectionCount++;
  }

  tree.children?.forEach((treeBranch) => {
    getTreeStats(treeBranch, stats);
  });

  return stats;
};
