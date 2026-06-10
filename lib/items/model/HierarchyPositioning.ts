import { Record, Relationship, isRelationship } from "neo4j-driver";
import { GraphData } from "./dataAdapter";
import {
  BasicItemNode,
  CollectionNodeType,
  GraphNodeType,
  NodeKind,
} from "@/model/GraphDataModel";
import { ItemProps, CollectionProps } from "./domain-types";
import { getTreeStats } from "./Stats";

export interface LinkType {
  id: number;
  start: number;
  end: number;
  type: string;
  count: number;
  properties: { edgeWeight?: number };
}

export type TreeNode = CollectionNodeType<CollectionProps> & {
  collectionLeaf: boolean;
  children?: (TreeNode | BasicItemNode)[];
};

export type { BasicItemNode };

const isCollection = (n: GraphNodeType<unknown>): n is CollectionNodeType<CollectionProps> =>
  n.typeNumber === NodeKind.Collection;

const isItemOrClone = (n: GraphNodeType<unknown>): n is GraphNodeType<ItemProps> =>
  n.typeNumber === NodeKind.Item || n.typeNumber === NodeKind.Clone;

export const createHierarchyData = (
  records: Record[],
  graphData: GraphData<ItemProps, CollectionProps>,
): TreeNode | undefined => {
  const links: LinkType[] = [];

  records.forEach((record) => {
    const result = record.get("result");

    if (isRelationship(result)) {
      const { identity, start, end, type, properties: props } = result as Relationship;
      const properties: { edgeWeight?: number } = {};

      if (props?.edgeWeight) {
        properties.edgeWeight = props.edgeWeight.low;
      }
      links.push({
        id: identity.low,
        start: start.low,
        end: end.low,
        type,
        count: 1,
        properties,
      });
    }
  });

  const { nodes } = graphData;
  console.log("all nodes length: ", nodes.length);
  console.log(
    "item/clone nodes length: ",
    nodes.filter((n) => isItemOrClone(n)).length,
  );

  const tree = constructTree(nodes as TreeNode[], links);

  console.log("links", tree);
  return tree;
};

function constructTree(
  nodes: TreeNode[],
  relationships: LinkType[],
): TreeNode | undefined {
  nodes.forEach((node) => {
    node.children = [];
  });

  console.log(
    "\n all count",
    nodes.length,
    "\n all edges count",
    relationships.length,
    "\n MEMBER_OF & PARENT_OF:",
    relationships.filter(
      (r) => r.type === "MEMBER_OF" || r.type === "PARENT_OF",
    ).length,
    "\n MEMBER_OF: ",
    relationships.filter((r) => r.type === "MEMBER_OF").length,
    "\n PARENT_OF:",
    relationships.filter((r) => r.type === "PARENT_OF").length,
    "\n SIMILAR_TO_BETWEEN_TOPIC:",
    relationships.filter((r) => r.type === "SIMILAR_TO_BETWEEN_TOPIC").length,
    "\n SIMILAR_TO_WITHIN_TOPIC:",
    relationships.filter((r) => r.type === "SIMILAR_TO_WITHIN_TOPIC").length,
    "\n MATCHING_PAPER:",
    relationships.filter((r) => r.type === "MATCHING_PAPER").length,
  );

  const parentOfRelationships = relationships.filter(
    (r) => r.type === "PARENT_OF",
  );

  parentOfRelationships.forEach((rel) => {
    const parentNode = nodes.find((node) => node.id === rel.start);
    const childNode = nodes.find((node) => node.id === rel.end);
    if (parentNode && childNode) {
      (parentNode.children as TreeNode[]).push(childNode);
    }
  });

  nodes.forEach((node) => {
    if (!isCollection(node)) return;
    const collectionLeaf =
      node.typeNumber === NodeKind.Collection && node.children!.length === 0;
    node.collectionLeaf = collectionLeaf;
    if (collectionLeaf) {
      node.color = "#00BB00";
    }
  });

  const memberOfRelationships = relationships.filter(
    (r) => r.type === "MEMBER_OF",
  );
  console.log("memberOfRelationships.length", memberOfRelationships.length);

  memberOfRelationships.forEach((rel) => {
    const parentNode = nodes.find((node) => node.id === rel.start);
    const childNode = nodes.find((node) => node.id === rel.end);

    if (parentNode === undefined || childNode === undefined) {
      console.error(
        'ERROR: The "MEMBER_OF" relationship points to nonexistent node',
        { rel, start: parentNode?.id, end: childNode?.id },
      );
      return;
    }

    if (isItemOrClone(parentNode) && isCollection(childNode)) {
      const itemProps = parentNode.props;
      const stub: BasicItemNode = {
        typeNumber: parentNode.typeNumber,
        id: parentNode.id,
        value: 10 * (itemProps.similarItems?.length || 1),
      };
      (childNode.children as BasicItemNode[]).push(stub);
    }
  });

  const rootNode = nodes.find((node) => node.graphLevel === 0);
  (rootNode?.children as TreeNode[])?.map((topCollection) => {
    if (isNaN(topCollection.title[0] as unknown as number)) {
      return topCollection;
    }
    topCollection.title = topCollection.title.substring(3);
    return topCollection;
  });

  if (rootNode) {
    console.log("tree stats:", getTreeStats(rootNode, nodes));
    console.log("all nodes.length: ", nodes.length);
  }

  return rootNode;
}
