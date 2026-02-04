
import { BranchNodeByD3, Edge, EdgeKind } from "@/model/GraphDataModel";
import { NodesSelection } from "@/lib/state/selectionReducer";
import { SVGCircleElementSelection } from "@/model/store/svgElemsStore";


export const getCloneNodesFromEdges = (
  allNodesCirclesInFront: SVGCircleElementSelection,
  allEgdesDataConnectedToNode: Edge[],
  targetNodeDatum: BranchNodeByD3,
) : SVGCircleElementSelection => {
  const cloneEdgesData = allEgdesDataConnectedToNode.filter((edgeD)=> edgeD.type === EdgeKind.MATCHING_PAPER);
  
  if (cloneEdgesData.length === 0){
    return allNodesCirclesInFront.filter(node => targetNodeDatum.data.id ===(node as BranchNodeByD3).data.id);
  }

  return allNodesCirclesInFront.filter(node => {
    const nodeData = (node as BranchNodeByD3).data;
    return cloneEdgesData.some((cloneConnectedEdge) => {
      return cloneConnectedEdge.source.data.id === nodeData.id || cloneConnectedEdge.target.data.id === nodeData.id;
    });
  });
}

export const markSelectionInNodesDatum = (nodesCirclesInFront:SVGCircleElementSelection, {lastSelectedNodeData, clonesSelection }:NodesSelection) => {
//console.log('markSelectionInNodesDatum > selection count:',clonesSelection.map(c => c.data.id) );
  
  nodesCirclesInFront.each((d, i, nodes) =>  {
    d.lastSelected = !!lastSelectedNodeData
      && lastSelectedNodeData.data.id === d.data.id;
    d.selected = d.lastSelected
      || clonesSelection.some(clone => clone.data.id === d.data.id);
  });
}

      