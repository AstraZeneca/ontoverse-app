// import { addColorsToNodes } from "../utils/colorUtils";
// import { brakeStringIntoLines, truncateArticleAuthors } from "../utils/str";
import { LowHigh, RawNode, RawRelationship } from '@/lib/neo4j/neo4j-types';
import { EdgeType, PaperNodeType, PaperNodeTypeProps, TopicNodeType } from './GraphDataModel';
import { TreeNode } from './HierarchyPositioning';
import { truncateArticleAuthors } from './stringUtils';

export type GraphData = {
  treeNode: TreeNode | undefined;
  nodes: PaperNodeType[];
  topicNodes: PaperNodeType[];
  paperNodes: PaperNodeType[];
  paperCloneNodes: PaperNodeType[];
  edges: EdgeType[]; //this one will be updated by d3 and will have real references to the papers
  edgesToSend: EdgeType[]; // this one will just have papers ids. So, this lightweight objects we must send.
};

type GroupName = 'Collection' | 'Paper' | 'PaperClone';
export const GROUP_CODE_MAP: { [key in GroupName]: number } = {
  Collection: 1,
  Paper: 2,
  PaperClone: 3,
};
const getNodeTypeNumber = (nodeLabel: GroupName): number => {
  return GROUP_CODE_MAP[nodeLabel] || -1;
};

// - [ ] if 2 auhors: Zeisel and Manuel, 2015
// - [ ] if > 2 authors: Zeisel et al., 2015
/**
 *
 * @param {string[]} titles
 * @param {number} articleYear
 * @returns
 */
// export const truncateArticleAuthors = (authors, articleYear) => {
//   let truncated = authors[0];
//   if (!truncated) {
//     return '';
//   }

//   const namesCount = authors.length;

//   if( namesCount === 2 ) {
//     truncated += ' and ' + authors[1];
//   } else if( namesCount > 2 ){
//     truncated += ' et al.';
//   }

//   return truncated + (!articleYear ? '' : ', ' + articleYear);
// }
export const brakeStringIntoLines = (
  str,
  output = [],
  maxLineLength = 40,
  maxLines = 3,
) => {
  if (str.length <= maxLineLength) {
    //the 'str' doesn't need to be truncated
    output.push(str);

    return output;
  }

  //The 'str' has to be truncated
  const firstLineWithMaxLength = str.substring(0, maxLineLength + 1); //the raw 'str' cut (+1 to allow the last ' ' in case the last word fits exactly)
  const resultLine = str.substring(0, firstLineWithMaxLength.lastIndexOf(' ')); //adjust the raw cut to full word
  const remainingString = str.substring(resultLine.length + 1); //remaining string that needs furter cutting into lines (+1 to skip the ' ')

  output.push(resultLine);

  if (output.length < maxLines) {
    //see if need more lines
    return brakeStringIntoLines(
      remainingString,
      output,
      maxLineLength,
      maxLines,
    );
  }

  /** No need for more lines, so see if it needs '...' */
  if (remainingString.length > 2) {
    output[maxLines - 1] += '...';
  }

  return output;
};
export default function dataAdapter(records: any[]): GraphData {
  // console.log('====> records',records);

  const graphData: GraphData = records?.reduce(
    (
      acc: GraphData,
      { _fields: [it] }: { _fields: (RawNode | RawRelationship)[] },
    ) => {
      if (!!(it as RawRelationship).type) {
        //most of the elems are edges so we are checking them first especially that the check is performant as only edge would have 'type' property (with value "SIMILAR_TO", "PARENT_OF", etc.)
        acc.edges.push(convertToEdgeType(it as RawRelationship)); //~730k elements
      } else {
        switch ((it as RawNode).labels[0]) {
          case 'Paper': //~4000 elements
            acc.paperNodes.push(convertToPaperType(it as RawNode));
            break;
          case 'PaperClone': //~7500 elements
            acc.paperCloneNodes.push(convertToPaperCloneType(it as RawNode));
            break;
          case 'Collection': //~400 elements
            if (it.properties.graphLevel !== undefined){
              acc.topicNodes.push(convertToTopicType(it as RawNode));
            }
            break;
          default:
            console.warn('result item is not recognised => item: ', it);
        }
      }
      return acc;
    },
    {
      topicNodes: [],
      paperNodes: [],
      paperCloneNodes: [],
      edges: [],
      nodes: [],
    },
  );

  graphData.nodes = [
    ...graphData.topicNodes,
    ...graphData.paperNodes,
    ...graphData.paperCloneNodes,
  ];
  graphData.edgesToSend = graphData.edges.map((edge: EdgeType) => ({
    ...edge,
  }));
  console.log({
    topicNodes: graphData.topicNodes.length,
    paperNodes: graphData.paperNodes.length,
    paperCloneNodes: graphData.paperCloneNodes.length,
    edges: graphData.edges.length,
    nodes: graphData.nodes.length,
  });
  return graphData;
}

const convertToEdgeType = (item: RawRelationship): EdgeType => {
  const weight = item.properties?.edgeWeight?.low | 1; //weigh is non existant for snome edges
  return {
    id: item.identity.low,
    type: item.type, // "SIMILAR_TO"
    source: item.start.low,
    target: item.end.low,
    value: item.type === 'MEMBER_OF' ? 1 : 0.5,
    weight,
  };
};
// const getGraphLevel = ({properties:{graphLevel}}) => graphLevel? graphLevel.low : -1;
const convertToPaperType = (item: RawNode): PaperNodeType => {
  const id = item.identity.low;
  const group = item.labels ? item.labels.join('-') : '';
  const props: PaperNodeTypeProps = {
    ...item.properties,
    authors: (Array.isArray(item.properties.authors) 
      ? item.properties.authors.join(', ') 
      : [item.properties.authors]) || '',
    // Convert LowHigh to number at DB boundary
    pubmedID: item.properties.pubmedID?.low ?? item.properties.pmid ? parseInt(item.properties.pmid) : 0,
    year: item.properties.year?.low ?? (item.properties.date ? parseInt(item.properties.date.substring(0, 4)) : 0),
  };
  const year = item.properties.date ? item.properties.date.substring(0, 4) : null;
  const title = item.properties.title || item.properties.skos__prefLabel || '';

  return {
    typeNumber: 2,
    id,
    paperNode: true, //depricated
    topicNode: false,
    grouping: false,
    graphLevel: -1,
    linkedNodeIds: [], //[linkedNode.identity.low],
    color: '#ff0000',
    group,
    title,
    titleInLines: brakeStringIntoLines(title || ''),
    year,
    label: !props.authors ? '' : truncateArticleAuthors(props.authors, year),
    props: props, 
  };
};
const convertToPaperCloneType = (item: RawNode): PaperNodeType => {
  return {
    ...convertToPaperType(item),
    typeNumber: 3,
    color: '#0000FF',
  };
};

const convertToTopicType = (item: RawNode): TopicNodeType => {
  const id = item.identity.low;
  const group = item.labels ? item.labels.join('-') : '';
  const props = item.properties;
  const year = props.year ? props.year.low : null;
  const title = props.collectionName || '';

  if(!props.graphLevel){
    console.log('props.graphLevel',props.graphLevel);
  }

  if (item.properties.collectionID === 'ROOT'){
    console.log('props.graphLevel',props.graphLevel);
  }
    
  return {
    typeNumber: 1,
    id,
    paperNode: false, //depricatedz
    topicNode: true,
    grouping: true, //depricated
    linkedNodeIds: [], //[linkedNode.identity.low],
    graphLevel: props.graphLevel?.low ?? -1, // Convert LowHigh to number at DB boundary
    color: '#ff0000',
    group,
    title,
    titleInLines: [''],
    year,
    label: !props.authors ? '' : truncateArticleAuthors(props.authors, year),
    props: props, //TODO: extra data - deep clone please,
  };
};
