import { Record, Relationship, isRelationship } from "neo4j-driver";
import { GraphData } from "./dataAdapter";
import { PaperNodeType, TopicNodeType } from "./GraphDataModel";
import { getTreeStats } from "./Stats";

export interface LinkType {
  id: number;
  start: number;
  end: number;
  type: string;
  count: number;
  properties: {edgeWeight?:number};
}

export interface TreeNode extends TopicNodeType {
  id: number;
  // graphLevel: number;
  topicLeaf: boolean;
  children?: (TreeNode | BasicPaperNode)[];
};

export interface BasicPaperNode {
  typeNumber: number,
  id: number,
  value:number,
}

export const createHierarchyData = (records:Record[], graphData:GraphData):TreeNode | undefined => {
  const links:LinkType[] = [];
  const topicLinks = [];
  const linksToSend = [];
  
  records.forEach(record => {
    const result = record.get('result');
    
    if(isRelationship(result) ) {// if (result instanceof Relationship)
      const {identity, start, end, type, properties:props } = (result as Relationship);
      const properties = {};

      if (props?.edgeWeight){
        properties['edgeWeight'] = props?.edgeWeight?.low;
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

  const {nodes} = graphData;
  console.log('all nodes length: ',nodes.length);
  console.log('paper nodes length: ',nodes.filter(n => n.paperNode).length);
  
  const tree = constructTree(nodes as TreeNode[], links)
  
  console.log('links',tree);
  return tree;
}

function constructTree(nodes: TreeNode[], relationships: LinkType[]): TreeNode | undefined {
  
  nodes.forEach(node => {
    node.children = [];
  });
  //debug stats
  console.log(
    '\n all count',nodes.length,
    '\n all edges count',relationships.length,
    '\n MEMBER_OF & PARENT_OF:',relationships.filter(r => r.type === "MEMBER_OF" || r.type === "PARENT_OF"  ).length,
    '\n MEMBER_OF: ',relationships.filter(r => r.type === "MEMBER_OF"  ).length,
    '\n PARENT_OF:',relationships.filter(r => r.type === "PARENT_OF"  ).length,
    '\n SIMILAR_TO_BETWEEN_TOPIC:',relationships.filter(r => r.type === "SIMILAR_TO_BETWEEN_TOPIC"  ).length,
    '\n SIMILAR_TO_WITHIN_TOPIC:',relationships.filter(r => r.type === "SIMILAR_TO_WITHIN_TOPIC"  ).length,
    '\n MATCHING_PAPER:',relationships.filter(r => r.type === "MATCHING_PAPER"  ).length,
  );
    
  //All the 'PARENT_OF' relationships of topics.
  const parentOfRelationships = relationships.filter(r => r.type === "PARENT_OF");
  // r.type === "SIMILAR_TO_WITHIN_TOPIC" 

  /**
   * Creates Topics tree
   */
  parentOfRelationships.forEach(rel => {
    const parentNode = nodes.find(node => node.id === rel.start);
    const childNode = nodes.find(node => node.id === rel.end);
    if (parentNode && childNode) {
      (parentNode.children as TreeNode[]).push(childNode); 
    }
  });

  /**
   * Marks the leaf topics
   */
  nodes.forEach(node => {
    const topicLeaf = node.topicNode && 0 === node.children.length
    node.topicLeaf = topicLeaf;
    if (topicLeaf){
      node.color = '#00BB00';
    }
  });

  /**
   * Adds related papers to the topic leaves.
   * Note, the MEMBER_OF relationship type is between all the topics and papers.
   * However, in the tree structure, the relationships between papers and
   * the topics other than the leaf-topics are not existant.
   */
  const memberOfRelationships = relationships.filter(r => r.type === "MEMBER_OF");
  console.log('memberOfRelationships.length',memberOfRelationships.length);
  const debugPaper:any = [];
  const debugClone:any = [];
  const debugElse:any = [];
  const debugTopics = {}
  let debugC:number = 0;
  memberOfRelationships.forEach(rel => {
    const parentNode = nodes.find(node => node.id === rel.start);
    const childNode = nodes.find(node => node.id === rel.end);

    if (parentNode === undefined || childNode === undefined){
      console.error('ERROR: The "MEMBER_OF" reletionship points to unexistant node',{rel,start:parentNode?.id, end:childNode?.id});
    }

    
    if (parentNode.paperNode && childNode.paperNode) {
      console.log('Both Papers !!!!!!');
      
    }
    if (!parentNode.paperNode && !childNode.paperNode) {
      console.log('Both Topics !!!!!!');
      
    }
    if (!parentNode.paperNode) {
      console.log('parent is not paper!!!!!!');
    }
    if (childNode.paperNode) {
      console.log('child is not paper!!!!!!');
    }
    if (parentNode.paperNode && !childNode.paperNode) {
      debugC++;
      debugTopics[childNode.id] = 1;
    }
    if (parentNode && childNode) {
      if (parentNode.paperNode && !childNode.paperNode){
        const bpn:BasicPaperNode = {
          typeNumber: parentNode.typeNumber,
          id: parentNode.id,
          value: 10*((parentNode as PaperNodeType).props.similarPapers?.length || 1),
        };
        if(parentNode.group==="PaperClone") {
          debugClone.push(bpn);
        } else if(parentNode.group==="Paper") {
          debugPaper.push(bpn);
        } else {
          debugElse.push(bpn);
        }
        (childNode.children as BasicPaperNode[]).push(bpn);
      } else{
        console.log('ELSE A:',parentNode && childNode);
      }
    } else {
      console.log('ELSE B:',parentNode && childNode);
    }
  });
    
  // find and return the root node
  const rootNode = nodes.find(node => node.graphLevel === 0);
  (rootNode.children as TopicNodeType[])?.map( topTopic => {
    if (isNaN(topTopic.title[0] as unknown as number)){
      return topTopic;
    }
    // if the title starts with a number, remove it
    topTopic.title = topTopic.title.substring(3);
    return topTopic;
  });
    
  console.log('debugPaper.length',debugPaper.length);
  console.log('debugClone.length',debugClone.length);
  console.log('debugElse.length',debugElse.length);
  console.log('debugTopics > length',Object.keys(debugTopics).length);
  console.log('debugC',debugC);
  
  console.log('tree stats:', getTreeStats(rootNode, nodes))
  console.log('all nodes.length: ',nodes.length);

  return rootNode;
}






// type Datum = {
//   Title: string;
//   Distributor: string;
//   Genre: string;
//   Worldwide_Gross: number;
//   Rating: number;
// };
// const data: Datum[] = [
//   {
//     Title: 'Adaptation',
//     Distributor: 'Sony Pictures',
//     Genre: 'Comedy',
//     Worldwide_Gross: 22498520,
//     Rating: 91,
//   },
//   {
//     Title: 'Amadeus',
//     Distributor: 'Warner Bros.',
//     Genre: 'Drama',
//     Worldwide_Gross: 51973029,
//     Rating: 96,
//   },
// ];

// function sumWorldwideGross(group) {
//   return d3.sum(group, (d: Datum) => d.Worldwide_Gross);
// }

// function doRollup(data) {
//   const groups = d3.rollup(
//     data,
//     sumWorldwideGross,
//     (d: Datum) => d.Distributor,
//     (d: Datum) => d.Genre,
//   );

//   const root = d3.hierarchy(groups);// holds looped elements

//   console.log(JSON.stringify(root));
// }
