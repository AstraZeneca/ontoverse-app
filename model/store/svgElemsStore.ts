import { Selection } from "d3";
import { create } from "zustand";
import { BranchNodeByD3, Edge } from "../GraphDataModel";


export type SVGGraphGroupSelection = Selection<SVGGElement, unknown, SVGElement, BranchNodeByD3>;
export type SVGGraphBGGroupSelection = Selection<SVGGElement, unknown, HTMLElement, any>;

export type SVGNodesGroupSelection = Selection<SVGGElement, BranchNodeByD3, SVGElement, BranchNodeByD3>;
export type SVGEdgesGroupSelection = Selection<SVGGElement, Edge, SVGElement, Edge>;
                                  
export type SVGCircleElementSelection = Selection<SVGCircleElement, BranchNodeByD3, SVGElement, BranchNodeByD3>;
export type SVGLineElementSelection = Selection<SVGLineElement, Edge, SVGElement, Edge>;
export type SVGTextElementSelection = Selection<SVGTextElement, BranchNodeByD3, SVGElement, BranchNodeByD3>;
export type SVGTSpanElementSelection = Selection<SVGTSpanElement, BranchNodeByD3, SVGElement, BranchNodeByD3>;

export type SvgElemsStore = {
  svg:Selection<SVGSVGElement, unknown, HTMLElement, any> | null,
  //The main graph SVG group
  graphSVGGroup:SVGGraphGroupSelection | null,
  graphBgSVGGroup:SVGGraphBGGroupSelection | null,
  //NODE Circles refs
  nodesCirclesWithLabelSVGGroup:SVGNodesGroupSelection | null,
  nodesCirclesInFront:SVGCircleElementSelection | null,
  //EDGE Lines refs
  edgesSVGGroup:SVGEdgesGroupSelection | null,
  allEdgeLines:SVGLineElementSelection | null,
  edgeLinesOnNodeSelect:SVGLineElementSelection | null,
  edgeLinesOnNodeHover:SVGLineElementSelection | null,
  //LABELS refs
  nodesLabels:SVGTextElementSelection | null,
  nodesSubLabels1:SVGTSpanElementSelection | null,
  nodesSubLabels2:SVGTSpanElementSelection | null,
  nodesSubLabels3:SVGTSpanElementSelection | null,
}
export const useSvgElemsStore = create<SvgElemsStore>(() => ({
  svg:null,

  graphSVGGroup:null,
  graphBgSVGGroup:null,

  nodesCirclesWithLabelSVGGroup:null,
  nodesCirclesInFront:null,

  edgesSVGGroup:null,
  allEdgeLines:null,
  edgeLinesOnNodeSelect:null,
  edgeLinesOnNodeHover:null,

  nodesLabels:null,
  nodesSubLabels1:null,
  nodesSubLabels2:null,
  nodesSubLabels3:null,
}))