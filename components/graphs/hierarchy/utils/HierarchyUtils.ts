import { EdgeKind, Edge, PaperNodeType, BranchNodeByD3 } from "@/model/GraphDataModel";
import { ZoomStore, useZoomStore } from "@/model/store/zoomStore";
import { GRAPH_CONFIG } from "@/components/graphs/GraphConfig";

export const COLOR_LEVELS = [
  "black",
  "darkgrey", // Light Blue
  "#7FFFD4", // Aquamarine
  // "#ADFF2F", // Green Yellow
  "#FFFF00", // Green Yellow
  // "#FFB700", // Gold
  "#FF8500",  // Orange Red
  "#FF00FF",  // Orange Red
];

export function getCloneStrokeColor(d: BranchNodeByD3){
  return d.lastSelected ? '#8c0f61' 
    : d.selected ? '#00f'
    : 'black';//'none';
}
export function getCloneStrokeWidth(d: BranchNodeByD3) {
  const zoomLevel = (useZoomStore.getState() as ZoomStore).zoomLevel;
  return d.selected ?  GRAPH_CONFIG.nodeStrokeWidth/zoomLevel : 0.5/zoomLevel;
}
//Adjusted radius, to look like the strokes rendered outside the circle of the previous size.
export function getCloneRadius(d: BranchNodeByD3) {
  if (d.data.typeNumber === 1) {
    return d.r;
  }
  
  return 0.25*d.r + (d.selected ? getCloneStrokeWidth(d)*0.5 : 0); //taking into account the half of stroke width that overlaps the circle
}


// export function getNodeStrokeColor(d:BranchNodeByD3) {
//   return (d.data.typeNumber > 1 || d.data?.topicLeaf)
//     ? d.data.color
//     : COLOR_LEVELS[d.data?.graphLevel || 0];
// }

export function getLabelFontSize(graphLevel:number, zoomLevel:number) {
  const fontSize = graphLevel <= 0 ? 18 
                 : graphLevel === 1 ? 32: 22;

  return `${fontSize / zoomLevel}px`;
};

export function getLabelFontWeigh(graphLevel:number) {//400)
  return graphLevel <= 0 ? 400 : 600;
};

export function getLabelStrokeColor(graphLevel:number) {
  if (graphLevel <= 0) {//it's paper
    return 'none';
  }

  return '#f3dfec'; //graphLevel === 1 ? '#ffd049' : '#f3dfec';//level 1 is the topic
};

export const getLabelStrokeWidth = (graphLevel:number, graphMaxLevel:number, zoomLevel:number=1) => {
  let  w = (isNaN(graphLevel) || graphLevel<0) ? 0.3 
    : graphLevel===1 ? 6
    : graphLevel===2 ? 4
    : graphLevel===3 ? 2
    : graphLevel===4 ? 1
    : 0.5;
  
  return w/zoomLevel;
};

export function getLabelDisplayValue(graphLevel:number, graphMaxLevel:number, zoomLevel:number) {
  // const minZoom = paperNode ? GRAPH_CONFIG.showPaperNodeLabelAtZoomLevel.min : GRAPH_CONFIG.showGroupingNodeLabelAtZoomLevel.min;
  // const maxZoom = paperNode ? GRAPH_CONFIG.showPaperNodeLabelAtZoomLevel.max : GRAPH_CONFIG.showGroupingNodeLabelAtZoomLevel.max;

  // return (zoomLevel >= minZoom && zoomLevel <= maxZoom ) ? 'unset' : 'none';
  const { min, max }:{ min:number, max:number } = (graphLevel <= 0)
    ? GRAPH_CONFIG.showPaperNodeLabelAtZoomLevel
    : GRAPH_CONFIG.collectionZoom[graphMaxLevel][graphLevel] as { min:number, max:number };

  return (zoomLevel >= min && zoomLevel <= max) ? 'unset' : 'none';
};

export function getSubLabelDisplayValue(paperNode:boolean, zoomLevel:number) {
  if (!GRAPH_CONFIG.showGroupingConnections) {
    return 'none';
  }

  return (zoomLevel >= GRAPH_CONFIG.showPaperNodeSubLabelAtZoomLevel.min && zoomLevel <= GRAPH_CONFIG.showPaperNodeSubLabelAtZoomLevel.max) ? 'unset' : 'none';
};

export function getLinkOpacity(edge:Edge) {
  switch(edge.type){
    case EdgeKind.MATCHING_PAPER:
      return 1;

    case EdgeKind.SIMILAR_TO_BETWEEN_TOPIC:
      return 0.2;
    case EdgeKind.SIMILAR_TO_WITHIN_TOPIC:
      return 0.4;
  }
  
  return 1;
};

export function getLinkColour (edge:Edge) {
  switch(edge.type){
    case EdgeKind.MATCHING_PAPER:
      return 'black';

    case EdgeKind.SIMILAR_TO_BETWEEN_TOPIC:
      return 'lightgrey';
      case EdgeKind.SIMILAR_TO_WITHIN_TOPIC:
      return 'grey';
  }

  return 'black';
};

export function getLinkDisplayValue (edge:Edge) {
  switch(edge.type){
    case EdgeKind.MATCHING_PAPER:
    case EdgeKind.SIMILAR_TO_BETWEEN_TOPIC:
    case EdgeKind.SIMILAR_TO_WITHIN_TOPIC:
      return 'unset';
  }

  return 'none';
}
