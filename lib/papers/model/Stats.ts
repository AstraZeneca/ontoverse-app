import { PaperNodeType, TopicNodeType } from "./GraphDataModel";
import { TreeNode } from "./HierarchyPositioning";
import { GROUP_CODE_MAP } from "./dataAdapter";

interface StatsType {
    [key: string]: string | ((id: string) => void) | ((id: string, key: string) => (id: string) => void);
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

const statsRecords: StatsRecords = {}

const formatTime = (ms: number): string => {
  const t = new Date(ms);

  return (t.getSeconds() < 10)
    ? `${t.getSeconds()}s${t.getMilliseconds()}ms`
    : `${t.getMinutes()}m${t.getSeconds()}s`;
}

const init = (id:string) => {
  statsRecords[id] = [{
    id,
    key: 'start recording',
    time: Date.now(),
  }]; 
}

const track = (id:string, key: string) => {
  statsRecords[id].push({
    id,
    key,
    time: Date.now(),
  }); 
}

const raport = (id: string) => {
  const startTime = statsRecords[id][0].time;
  let prevTime = -1
  const r =  `===> START of the Stats Raport on ${id}
    ${statsRecords[id].map( ({key, time}:StatsRecord) => {
      const line = `
        \t ${key}: TIME, from the beginning:${formatTime(time-startTime)}; from previous record: ${(prevTime > 0) ? formatTime(time-prevTime) : ' - '};
      `
      prevTime = time;
      return line;
    })}
    <=== END of the Stats Raport on ${id}`;
  console.log(r);
  return r
  
};

export const Stats = {
    init,
    track,
    raport,
    GET_PAPERS: 'getPapers',
};




type TreeStats = {
  allPapersCount:number,
  paperCount:number,
  paperCloneCount:number,
  topicLeafNodesCount:number,
  allTopic:number,
}
export const getTreeStats = (tree:TreeNode, allNodes: TreeNode[],
  stats={allPapersCount:0, paperCount:0, paperCloneCount:0, topicLeafNodesCount:0, allTopic:0} ):TreeStats => {
  if (tree===null) return stats;
  
  const solidNode = allNodes.find( solidNode => solidNode.id === tree.id) as TopicNodeType;

  if (solidNode.typeNumber === GROUP_CODE_MAP['PaperClone']) {
    stats.paperCloneCount++;
    stats.allPapersCount++;
  } else  if (solidNode.typeNumber === GROUP_CODE_MAP['Paper']){
    stats.paperCount++;
    stats.allPapersCount++;
  } else  if (solidNode.typeNumber === GROUP_CODE_MAP['Collection']){
    if ((solidNode as TreeNode).topicLeaf) {
      stats.topicLeafNodesCount++;
    }
    stats.allTopic++;
  }

  (tree.children as TreeNode[])?.forEach((treeBranch) =>{
    getTreeStats(treeBranch, allNodes, stats)
  });

  return stats;
}