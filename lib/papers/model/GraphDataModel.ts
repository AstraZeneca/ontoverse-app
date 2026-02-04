// DTO (Data Transfer Object) types for API responses
// These are the types returned from /api/papers endpoint

export interface OncoMapData{
  nodes: any[];
  links: any[];
}

export interface Size {
  w: number;
  h: number;
}

export interface EdgeType {
  id: number;
  type: string;
  source: number | {id: number, x: number, y: number};
  target: number | {id: number, x: number, y: number};
  value: number; // do we need this one?
  weight: number;
}

export interface PaperNodeTypeProps {
    doi: string;
    interface: string;
    journal: string;
    abstract: string;
    title: string;
    authors: string;
    all_authors: string[];
    meshTerms: string[];
    pubmedID: number; // Converted from LowHigh at DB boundary
    year: number; // Converted from LowHigh at DB boundary
    keywords: string[];
    similarPapers: string[];
  }

export interface PaperNodeType {
  typeNumber: number;
  id: number; 
  graphLevel: number;
  paperNode:boolean;//depricated
  topicNode: boolean;
  title:string;
  label: String;
  grouping:boolean;
  linkedNodeIds: string[];
  color: string;
  group: string;
  titleInLines:  string[] |  string;
  year: string;
  props:  PaperNodeTypeProps;
}

export interface TopicNodeType extends PaperNodeType{
  fx?: number,
  fy?: number,
}