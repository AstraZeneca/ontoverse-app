import {
  BranchNodeByD3,
  Edge,
  EdgeFromServer,
  GraphNodeType,
  NodeKind,
  TreeNode,
} from "./GraphDataModel";

export const replaceNodeIdWithSolidData = <
  TItemProps,
  TCollectionProps,
>(
  treeNode: TreeNode<TItemProps, TCollectionProps> | undefined,
  solidNodes: GraphNodeType<TItemProps | TCollectionProps>[],
): TreeNode<TItemProps, TCollectionProps> | undefined => {
  if (!treeNode) return;
  const updatedChildren: (
    | TreeNode<TItemProps, TCollectionProps>
    | GraphNodeType<TItemProps>
  )[] = [];

  treeNode.children?.forEach((child) => {
    if (child.typeNumber > NodeKind.Collection) {
      const solidNode = solidNodes.find((solidNode) => solidNode.id === child.id);
      if (solidNode) {
        updatedChildren.push({
          ...solidNode,
          value: child.value,
          typeNumber: child.typeNumber,
        } as TreeNode<TItemProps, TCollectionProps>);
      } else {
        console.error(`Item node ${child.id} not found in all items array`);
      }
    } else if (child.typeNumber === NodeKind.Collection) {
      updatedChildren.push(
        replaceNodeIdWithSolidData(
          child as TreeNode<TItemProps, TCollectionProps>,
          solidNodes,
        ) as TreeNode<TItemProps, TCollectionProps>,
      );
    } else {
      console.error(
        "Error >> unknown child.typeNumber:",
        child.typeNumber,
        "child",
        child,
      );
    }
  });

  return { ...treeNode, children: updatedChildren as TreeNode<TItemProps, TCollectionProps>['children'] };
};

export const replaceEdgeIdWithSolidData = (
  edgesFromServer: EdgeFromServer[],
  solidNodes: BranchNodeByD3<unknown, unknown>[],
) => {
  const throwError = (msg: string) => {
    throw new Error(msg);
  };
  const solidNodesRefsByIndex = solidNodes.reduce(
    (acc: Record<number, BranchNodeByD3<unknown, unknown>>, solidNode) => {
      acc[solidNode.data.id] = solidNode;
      return acc;
    },
    {},
  );

  const edges: Edge[] = [];
  try {
    edgesFromServer.forEach((edgeFromServer) => {
      edges.push({
        id: edgeFromServer.id,
        type: edgeFromServer.type,
        source:
          solidNodesRefsByIndex[edgeFromServer.source as number] ||
          throwError("Error: no solid node ID matching edge.source!"),
        target:
          solidNodesRefsByIndex[edgeFromServer.target as number] ||
          throwError("Error: no solid node ID matching edge.target!"),
        value: edgeFromServer.value,
        weight: edgeFromServer.weight,
      });
    });
  } catch (e) {
    console.error(e);
  }

  return edges;
};
