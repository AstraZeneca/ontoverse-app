import { BranchNodeByD3 } from "@/model/GraphDataModel";

const itemIdFromNode = (node: BranchNodeByD3): number | undefined =>
  (node.data.props as { itemID?: number }).itemID;



// // props.itemID in clone is a strng withe pattern:
// // "itemID_graphLevel_cloneNumber"
// export const findCloneIdsFromOriginal = (originalNode:BranchNodeByD3, cloneNodes:BranchNodeByD3[]):BranchNodeByD3[] => {
//   return cloneNodes.filter(clone =>
//     (itemIdFromNode(clone) as number as string).includes(String(originalNode.data.id))
//   );
//   return [];
// }


/**
 * Finds all the clone nodes based on matching Item IDs.
 *
 * @param {BranchNodeByD3} targetNode - Node to match against.
 * @param {BranchNodeByD3[]} nodes - The pool of nodes to search.
 * @returns {BranchNodeByD3[]} - Array of all the clone nodes, including the target one if exists in the pool.
 */
export const findCloneNodes = (targetNode: BranchNodeByD3, nodes: BranchNodeByD3[]): BranchNodeByD3[] => {
  const targetItemId = itemIdFromNode(targetNode);
  if (!targetItemId) {
    return [];
  }

  return nodes.filter((node) => itemIdFromNode(node) === targetItemId);
}
