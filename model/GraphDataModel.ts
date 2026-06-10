import { Selection } from "d3";

export interface OncoMapData {
  nodes: unknown[];
  links: unknown[];
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
  value: number;
  weight: number;
}

export interface Edge {
  id: number;
  type: EdgeKind;
  source: BranchNodeByD3<unknown, unknown>;
  target: BranchNodeByD3<unknown, unknown>;
  value: number;
  weight: number;
}

export interface GraphNodeType<TProps = unknown> {
  typeNumber: NodeKind;
  id: number;
  graphLevel: number;
  group: string;
  color: string;
  linkedNodeIds: string[];
  title: string;
  label: string;
  titleInLines: string[] | string;
  year?: string;
  props: TProps;
  collectionLeaf?: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface CollectionNodeType<TCollectionProps = unknown>
  extends GraphNodeType<TCollectionProps> {
  collectionLeaf?: boolean;
  fx?: number;
  fy?: number;
}

export type GraphData<
  TItemProps = unknown,
  TCollectionProps = unknown,
> = {
  treeNode: TreeNode<TItemProps, TCollectionProps> | undefined;
  nodes: GraphNodeType<TItemProps | TCollectionProps>[];
  collectionNodes: CollectionNodeType<TCollectionProps>[];
  itemNodes: GraphNodeType<TItemProps>[];
  cloneNodes: GraphNodeType<TItemProps>[];
  edges: Array<EdgeFromServer | Edge>;
  edgesToSend: EdgeFromServer[];
};

export type RichGraphData<
  TItemProps = unknown,
  TCollectionProps = unknown,
> = {
  nodes: BranchNodeByD3<TItemProps, TCollectionProps>[];
  itemNodes: BranchNodeByD3<TItemProps, TCollectionProps>[];
};

export interface LinkType {
  id: number;
  start: number;
  end: number;
  type: string;
  properties: unknown;
}

export interface TreeNode<
  TItemProps = unknown,
  TCollectionProps = unknown,
> extends CollectionNodeType<TCollectionProps> {
  typeNumber: number;
  id: number;
  collectionLeaf: boolean;
  children?: (TreeNode<TItemProps, TCollectionProps> | BasicItemNode)[];
  value?: number;
}

export interface BasicItemNode {
  typeNumber: number;
  id: number;
  value: number;
}

export interface NodeSelection {
  lastSelected: boolean;
  selected: boolean;
}

export interface BranchNodeByD3<
  TItemProps = unknown,
  TCollectionProps = unknown,
> extends NodeSelection {
  data: GraphNodeType<TItemProps | TCollectionProps>;
  depth: number;
  height: number;
  parent: BranchNodeByD3<TItemProps, TCollectionProps>;
  children: BranchNodeByD3<TItemProps, TCollectionProps>[];
  r: number;
  value: number;
  x: number;
  y: number;
}

export interface EdgeByd3 {
  id: number;
  source: BranchNodeByD3<unknown, unknown>;
  target: BranchNodeByD3<unknown, unknown>;
  type: EdgeKind;
  value: number;
  weight: number;
}

export enum EdgeKind {
  SIMILAR_TO_BETWEEN_TOPIC = "SIMILAR_TO_BETWEEN_TOPIC",
  MEMBER_OF = "MEMBER_OF",
  SIMILAR_TO_WITHIN_TOPIC = "SIMILAR_TO_WITHIN_TOPIC",
  MATCHING_ITEM = "MATCHING_PAPER",
  PARENT_OF = "PARENT_OF",
}

export enum NodeKind {
  Collection = 1,
  Item = 2,
  Clone = 3,
}

/** Neo4j label strings — DB schema, not renamed in Cypher */
export const DB_LABEL = {
  Collection: "Collection",
  Item: "Paper",
  Clone: "PaperClone",
} as const;

export const APP_GROUP = {
  Collection: "Collection",
  Item: "Item",
  Clone: "Clone",
} as const;

export const DB_LABEL_TO_NODE_KIND: Record<
  (typeof DB_LABEL)[keyof typeof DB_LABEL],
  NodeKind
> = {
  [DB_LABEL.Collection]: NodeKind.Collection,
  [DB_LABEL.Item]: NodeKind.Item,
  [DB_LABEL.Clone]: NodeKind.Clone,
};
