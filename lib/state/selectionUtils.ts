import { BranchNodeByD3 } from "@/model/GraphDataModel";


// // props.itemID in clone is a strng withe pattern:
// // "itemID_graphLevel_cloneNumber"
// export const findCloneIdsFromOriginal = (originalNode:BranchNodeByD3, cloneNodes:BranchNodeByD3[]):BranchNodeByD3[] => {
//   return cloneNodes.filter(clone =>
//     (clone.data.props.itemID as string).includes(String(originalNode.data.id))
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
export const findCloneNodes = (targetNode:BranchNodeByD3, nodes:BranchNodeByD3[]):BranchNodeByD3[] => {
  const targetItemId = targetNode.data.props.itemID;
  if (!targetItemId) {
    return [];
  }

  return nodes.filter(({data:{props:{itemID}}})=> itemID === targetItemId);
}
