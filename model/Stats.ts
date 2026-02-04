import { BranchNodeByD3, NodeKind } from "./GraphDataModel";



type TreeStats = {
    allPapersCount:number,
    paperCount:number,
    paperCloneCount:number,
    topicLeafNodesCount:number,
    allTopic:number,
  }
  export const getTreeStats = (tree:BranchNodeByD3, stats={allPapersCount:0, paperCount:0, paperCloneCount:0, topicLeafNodesCount:0, allTopic:0} ):TreeStats => {
    if (tree===null) return stats;
    
    const typeNumber = tree.data.typeNumber;
    
    
    if ( typeNumber === NodeKind.PaperClone) {
      stats.paperCloneCount++;
      stats.allPapersCount++;
    } else  if (typeNumber === NodeKind.Paper){
      stats.paperCount++;
      stats.allPapersCount++;
    } else  if (typeNumber === NodeKind.Collection){
      if ((tree as BranchNodeByD3).data.topicLeaf) {
        stats.topicLeafNodesCount++;
      }
      stats.allTopic++;
    }
  
    tree.children?.forEach((treeBranch) =>{
      getTreeStats(treeBranch, stats)
    });
  
    return stats;
  }



//   const getStats = (tree:TreeNode, stats={allPapersCount:0, paperCount:0, paperCloneCount:0, leafNodesCount:0} ):TreeStats => {
//     if (tree===null) return stats;
    
//     (tree.children as BranchNodeByD3[])?.forEach((treeBranch) => {
//       if (treeBranch.data.topicLeaf) {
//         stats.leafNodesCount++;
//         (treeBranch.children)?.forEach( node => {
//           if ((node as BranchNodeByD3).data.group === 'PaperClone') {
//             stats.paperCloneCount++;
//           } else {
//             stats.paperCount++;
//           }
//           stats.allPapersCount++;
//         });
//       } else {
//         getStats(treeBranch, stats);
//       }
//     });
  
//     return stats;
//   }