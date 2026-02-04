import { BranchNodeByD3, Edge, EdgeKind } from "@/model/GraphDataModel";
import { getLinkColour, getLinkDisplayValue, getLinkOpacity } from "./HierarchyUtils";
import { GRAPH_CONFIG } from "@/components/graphs/GraphConfig";
import { ZoomStore, useZoomStore } from "@/model/store/zoomStore";
import { generateAllNodesConnections, generateTargetNodesConnections } from "./LineUtils";
import { SVGEdgesGroupSelection, SVGLineElementSelection } from "@/model/store/svgElemsStore";



export const removeAllEdgeLines = (linkSVGGroup: SVGEdgesGroupSelection) => {
  linkSVGGroup.selectAll('line').remove();
}

export const removeDirectEdgeLines = (linkSVGGroup: SVGEdgesGroupSelection) => {
  linkSVGGroup.selectAll('.directly-connected-line').remove();
}

export const removeSelectionEdgeLines = (linkSVGGroup: SVGEdgesGroupSelection) => {
  linkSVGGroup.selectAll('.selection-line').remove();
}

export const renderConnectedLines = (linkSVGGroup: SVGEdgesGroupSelection, directlyConnectedEgdesData:Edge[]): SVGLineElementSelection => {
  const currentZoomLevel = (useZoomStore.getState() as ZoomStore).zoomLevel;

  return linkSVGGroup.selectAll('.directly-connected-line')
    .data(directlyConnectedEgdesData)
    .enter()
    .append('line')
    .attr('class', 'directly-connected-line')
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
    .attr('display', d => getLinkDisplayValue(d))
    .attr('stroke', d => getLinkColour(d))
    .attr("stroke-opacity", d => getLinkOpacity(d))
    .attr('stroke-width', GRAPH_CONFIG.edgeStrokeWidth / currentZoomLevel);
}

export const renderLinesBetweenTargetAndClones = (linkSVGGroup: SVGEdgesGroupSelection, target:BranchNodeByD3, clonesSelection: BranchNodeByD3[], includeCloneCloneConnections:boolean):SVGLineElementSelection => {
  const currentZoomLevel = (useZoomStore.getState() as ZoomStore).zoomLevel;
  const allClonesEgdesData = includeCloneCloneConnections 
    ? generateAllNodesConnections(clonesSelection, EdgeKind.MATCHING_PAPER)
    : generateTargetNodesConnections(target, clonesSelection, EdgeKind.MATCHING_PAPER);
    
//console.log('renderLinesBetweenClones >>> clonesSelection', clonesSelection);
//console.log('renderLinesBetweenClones >>> linkSVGGroup', linkSVGGroup);
//console.log('renderLinesBetweenClones >>> allClonesEgdesData', allClonesEgdesData);
  
  return linkSVGGroup.selectAll('.selection-line')
    .data(allClonesEgdesData)
    .enter()
    .append('line')
    .attr('class', 'selection-line')
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
    .attr('display', d => getLinkDisplayValue(d))
    .attr('stroke', d => getLinkColour(d))
    .attr("stroke-opacity", d => getLinkOpacity(d))
    .attr('stroke-width', GRAPH_CONFIG.edgeStrokeWidth / currentZoomLevel);
}

export const udpateSelectionLinesAppearence = (linkSVGGroup: SVGEdgesGroupSelection, zoomLevel?:number) => {
  const currentZoomLevel = zoomLevel || (useZoomStore.getState() as ZoomStore).zoomLevel;

  linkSVGGroup.selectAll('.selection-line')
    .attr('display', d => getLinkDisplayValue(d as Edge))
    .attr('stroke', d => getLinkColour(d as Edge))
    .attr("stroke-opacity", d => getLinkOpacity(d as Edge))
    .attr('stroke-width', GRAPH_CONFIG.edgeStrokeWidth / currentZoomLevel);
}

