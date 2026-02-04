import { Selection } from "d3";
import { LowHigh } from "@/lib/neo4j/neo4j-types";

export interface OncoMapData{
  nodes: any[];
  links: any[];
}

export interface Size {
  w: number;
  h: number;
}

export interface EdgeFromServer {
  id: number;
  type: EdgeKind;
  source: number;
  target: number;
  value: number; // do we need this one?
  weight: number;
}

export interface Edge {
  id: number;
  type: EdgeKind;
  source: BranchNodeByD3;
  target: BranchNodeByD3;
  value: number; // do we need this one?
  weight: number;
}

export interface PaperNodeType {
  typeNumber: number;
  x: number;
  y: number;
  id: number;
  graphLevel: number;
  paperNode:boolean;//depricated
  topicLeaf:boolean;
  title:string;
  label: string;
  grouping:boolean;
  linkedNodeIds: string[];
  color: string;
  group: string;
  titleInLines:  string[] |  string;
  year: string;
  props: {
    doi: string;
    url: string;
    interface: string;
    journal: string;
    abstract: string;
    title: string;
    authors: string[];
    all_authors: string[];
    meshTerms: string[];
    pubmedID: number; // Converted from LowHigh at DB boundary
    year: number; // Converted from LowHigh at DB boundary
    keywords: string[];
    itemID: number; // Converted from LowHigh at DB boundary. An unique id that is different from the parent 'id' prop. It is the same for all the clones.
    nodeID: string; // F.e.: '10224_1_1' that decodes according to the pattern: 'itemID_graphLevel_cloneNumber'
  };
}

export interface TopicNodeType extends PaperNodeType{

}




// RawNode and RawRelationship moved to lib/neo4j/neo4j-types.ts


export type GraphData = {
  treeNode:TreeNode,
  nodes: (PaperNodeType)[];
  topicNodes: PaperNodeType[];
  paperNodes: PaperNodeType[];
  paperCloneNodes: PaperNodeType[];
  edges: Edge[];
};

export type RichGraphData = {
    nodes: BranchNodeByD3[],
    paperNodes: BranchNodeByD3[],
};


export interface LinkType {
  id: number,
  start: number,
  end: number,
  type: string,
  properties: any,
}


export interface TreeNode extends TopicNodeType {
  typeNumber: number;
  id: number;
  // graphLevel: number;
  topicLeaf: boolean;
  children?: (TreeNode | BasicPaperNode)[];
  value?:number;
};

export interface BasicPaperNode {
  typeNumber: number;
  id: number;
  value:number;
}


export interface NodeSelection {
  lastSelected:boolean;
  selected:boolean;
}
export interface BranchNodeByD3 extends NodeSelection {
  data: TopicNodeType;
  depth: number;
  height: number;
  parent: BranchNodeByD3;
  children: BranchNodeByD3[];
  r:number;
  value:number;
  x:number;
  y:number;
}

export interface EdgeByd3 {
  id: number;
  source: BranchNodeByD3;
  target: BranchNodeByD3;
  type: EdgeKind;
  value: number;
  weight: number;
}

export enum EdgeKind {
  SIMILAR_TO_BETWEEN_TOPIC = "SIMILAR_TO_BETWEEN_TOPIC",
  MEMBER_OF = "MEMBER_OF",
  SIMILAR_TO_WITHIN_TOPIC = "SIMILAR_TO_WITHIN_TOPIC",
  MATCHING_PAPER = "MATCHING_PAPER",
  PARENT_OF = "PARENT_OF",
}


export enum NodeKind {
  Collection = 1,
  Paper = 2,
  PaperClone = 3,
}

const getNodeKindByGroupName = (groupName: keyof typeof NodeKind): NodeKind => {
  if (groupName in NodeKind) {
    return  NodeKind[groupName];
  }

  console.warn('Invalid NodeKind key!');
  return -1 as NodeKind;
}


