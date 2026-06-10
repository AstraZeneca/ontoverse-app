import { NodeKind } from "@/model/GraphDataModel";
import { TreeNode } from "./HierarchyPositioning";

interface StatsType {
  [key: string]:
    | string
    | ((id: string) => void)
    | ((id: string, key: string) => (id: string) => void);
  init: (id: string) => void;
  track: (id: string, key: string) => (id: string) => void;
  raport: (id: string) => (id: string) => void;
}

interface StatsRecord {
  id: string;
  key: string;
  time: number;
}

interface StatsRecords {
  [key: string]: StatsRecord[];
}

const statsRecords: StatsRecords = {};

const formatTime = (ms: number): string => {
  const t = new Date(ms);

  return t.getSeconds() < 10
    ? `${t.getSeconds()}s${t.getMilliseconds()}ms`
    : `${t.getMinutes()}m${t.getSeconds()}s`;
};

const init = (id: string) => {
  statsRecords[id] = [
    {
      id,
      key: "start recording",
      time: Date.now(),
    },
  ];
};

const track = (id: string, key: string) => {
  statsRecords[id].push({
    id,
    key,
    time: Date.now(),
  });
};

const raport = (id: string) => {
  const startTime = statsRecords[id][0].time;
  let prevTime = -1;
  const r = `===> START of the Stats Raport on ${id}
    ${statsRecords[id]
      .map(({ key, time }: StatsRecord) => {
        const line = `
        	 ${key}: TIME, from the beginning:${formatTime(time - startTime)}; from previous record: ${prevTime > 0 ? formatTime(time - prevTime) : " - "};
      `;
        prevTime = time;
        return line;
      })
      .join("")}
    <=== END of the Stats Raport on ${id}`;
  console.log(r);
  return r;
};

export const Stats = {
  init,
  track,
  raport,
  GET_ITEMS: "getItems",
};

type TreeStats = {
  allItemsCount: number;
  itemCount: number;
  cloneCount: number;
  collectionLeafNodesCount: number;
  collectionCount: number;
};

export const getTreeStats = (
  tree: TreeNode,
  allNodes: TreeNode[],
  stats: TreeStats = {
    allItemsCount: 0,
    itemCount: 0,
    cloneCount: 0,
    collectionLeafNodesCount: 0,
    collectionCount: 0,
  },
): TreeStats => {
  if (tree === null) return stats;

  const solidNode = allNodes.find((solidNode) => solidNode.id === tree.id);

  if (!solidNode) return stats;

  if (solidNode.typeNumber === NodeKind.Clone) {
    stats.cloneCount++;
    stats.allItemsCount++;
  } else if (solidNode.typeNumber === NodeKind.Item) {
    stats.itemCount++;
    stats.allItemsCount++;
  } else if (solidNode.typeNumber === NodeKind.Collection) {
    if (solidNode.collectionLeaf) {
      stats.collectionLeafNodesCount++;
    }
    stats.collectionCount++;
  }

  (tree.children as TreeNode[])?.forEach((treeBranch) => {
    getTreeStats(treeBranch, allNodes, stats);
  });

  return stats;
};
