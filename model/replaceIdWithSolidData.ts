import { BranchNodeByD3, Edge, EdgeFromServer, PaperNodeType, TreeNode } from "./GraphDataModel";

export const replaceNodeIdWithSolidData = (treeNode:TreeNode, solidNodes:PaperNodeType[]):TreeNode | undefined => {
    if (!treeNode) return;
    const updatedChildren: PaperNodeType[] = [];
    
    treeNode.children?.forEach((child) => {
      if (child.typeNumber > 1){ //it is Paper (2) or PaperClone (3) in shape of BasicPaperType
        const solidNode = solidNodes.find(solidNode => solidNode.id === child.id);
        if (!child.typeNumber){
        //console.log('if (!child.typeNumber)');
        }
        if (!solidNode?.typeNumber){
        //console.log('if (!child.typeNumber)');
        }
        if (solidNode) {
          updatedChildren.push({...solidNode, value: child.value, typeNumber:child.typeNumber} as TreeNode);
        } else {
          console.error(`Paper node ${child} not found in all papers array`);
        }
      } else if (child.typeNumber === 1) { //Topic node
        updatedChildren.push(replaceNodeIdWithSolidData(child as TreeNode, solidNodes) as TreeNode);
      } else {
        console.error('Error >> unknown child.typeNumber:',child.typeNumber, 'child',child);
        
      }
    });
    
    return { ...treeNode, children: updatedChildren };
  }
  

  export const replaceEdgeIdWithSolidData = (edgesFromServer:EdgeFromServer[], solidNodes: BranchNodeByD3[]) => {
    const throwError = (msg:string) => {
      throw new Error('Error: no solid node ID matching edge.source!');
    }
    const solidNodesRefsByIndex = solidNodes.reduce((acc:Record<number, BranchNodeByD3>, solidNode:BranchNodeByD3)=>{
      acc[solidNode.data.id] = solidNode;
      return acc;
    },{});
    
    const edges:Edge[] = [];
    try {
      edgesFromServer.forEach((edgeFromServer, i) => {

        edges.push({
          id: edgeFromServer.id,
          type: edgeFromServer.type,
          source: solidNodesRefsByIndex[edgeFromServer.source as number] || throwError('Error: no solid node ID matching edge.source!'),
          target: solidNodesRefsByIndex[edgeFromServer.target as number] || throwError('Error: no solid node ID matching edge.target!'),
          value: edgeFromServer.value, // do we need this one?
          weight: edgeFromServer.weight,
        })
      });

    } catch (e) {
      console.error(e);
    }

    return edges;
  }