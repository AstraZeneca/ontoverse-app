import { BranchNodeByD3, Edge, EdgeKind } from "@/model/GraphDataModel";

const EDGE_TYPE_NUMBER_MAP:Record<EdgeKind, number> = {
  [EdgeKind.MATCHING_PAPER]: 3,
  [EdgeKind.SIMILAR_TO_WITHIN_TOPIC]: 2,
  [EdgeKind.SIMILAR_TO_BETWEEN_TOPIC]: 1,
  [EdgeKind.MEMBER_OF]: 0,
  [EdgeKind.PARENT_OF]: 0,
};

function sortEdges(eA:Edge, eB:Edge):number {
  return EDGE_TYPE_NUMBER_MAP[eA.type] - EDGE_TYPE_NUMBER_MAP[eB.type];
}

export const getEgdesDataConnectedToNode = (targetNodeData:BranchNodeByD3, allEdges:Edge[]) => {
  const filteredLinkData = allEdges.filter((linkData:Edge) =>
    (linkData.source as BranchNodeByD3).data.id === targetNodeData.data.id ||
    (linkData.target as BranchNodeByD3).data.id === targetNodeData.data.id
  );
  return filteredLinkData.sort(sortEdges)//sort edges to have the blak on the top
};

// Generate all possible connections between the nodes
export const generateAllNodesConnections = (nodes:BranchNodeByD3[], connectionType:EdgeKind):Edge[] => {

  return nodes.reduce((acc, nodeA, indexA, allNodes) => {
      const remainingNodes= allNodes.slice(indexA + 1);
      const nodeAConnections:Edge[] = remainingNodes.map((nodeB, indexB) => ({
        id: -((indexA+1)*10e6+indexB),
        type: connectionType,
        source: nodeA,
        target: nodeB,
        value: 5,
        weight: 5,
      }));

      return [...acc, ...nodeAConnections];
  }, [] as Edge[]);
}

// Generate target-nodes connections between the nodes
export const generateTargetNodesConnections = (target:BranchNodeByD3,  nodes:BranchNodeByD3[], connectionType:EdgeKind):Edge[] => {
  return nodes.reduce((acc, nodeA, indexA, allNodes) => {
      const targetNodeAConnection:Edge = {
        id: -((indexA+1)*10e6+target.data.id),
        type: connectionType,
        source: nodeA,
        target,
        value: 5,
        weight: 5,
      };

      return [...acc, targetNodeAConnection];
  }, [] as Edge[]);
}
