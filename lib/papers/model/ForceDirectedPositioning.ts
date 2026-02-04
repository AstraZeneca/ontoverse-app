import { forceLink, forceManyBody, forceCollide, forceSimulation, SimulationNodeDatum } from "d3-force";
import { EdgeType, PaperNodeType, TopicNodeType } from "./GraphDataModel";
import { GraphData } from "./dataAdapter";
import { Stats } from "./Stats";

/**
 * Calculates and Injects Fixed Topic Nodes
 * @param {GraphData} graphData.
 */
const injectFixedTopicNodes = ({topicNodes, edges:linksData}:GraphData) => {
  const CENTER_X = 0; //width / 2;
  const CENTER_Y = 0; //height / 2;
  const CIRCLE_RADIUS = 3000;
  const PERIOD = 2*Math.PI;

  //Organise topics by level
  const topicNodesByLevel:TopicNodeType[][] = topicNodes.reduce((acc,tn) => {
    if (!acc[tn.graphLevel]){
      acc[tn.graphLevel] = [];
    }
    acc[tn.graphLevel].push(tn);
    return acc;
  },[])


  //The root topics level is 0. The topTopics level is 1.
  const [rootTopics, topTopics, ...childrenTopicNodesByLevel] = topicNodesByLevel;
  const childrenTopicNodes:TopicNodeType[] = childrenTopicNodesByLevel.flat();
  const connectedTopics:TopicNodeType[] = [...topTopics, ...childrenTopicNodes];
  
  //The root topics array has only one topic(The 'ROOT' topic) at index 0.
  ///Sets it fixed (f prefix to x and y) on the center pos(0,0).
  rootTopics[0].fx = CENTER_X;
  rootTopics[0].fy = CENTER_Y;
  
  //the topTopics are layed out in a circular manner
  const angleUnitInRad = PERIOD/topTopics.length;
  topTopics.forEach((topTopicNode:TopicNodeType, i) => {
    const angle = angleUnitInRad*i;
    topTopicNode.fx = CENTER_X + CIRCLE_RADIUS * Math.cos(angle); //using fx prop used by d3 as fixed X pos.
    topTopicNode.fy = CENTER_Y + CIRCLE_RADIUS * Math.sin(angle); //using fy prop used by d3 as fixed Y pos.
  });
  // Stats.track(Stats.GET_PAPERS, '\t\t > topTopics positioning completed');
  
  /**
   * Set the rest of the nodes with fixed force-dirrected positions
  */
 const topicsLinks = linksData.filter((link:EdgeType) => 
  link.type==='PARENT_OF' 
  && connectedTopics.some((node) => node.id === link.source) 
  && connectedTopics.some((node) => node.id === link.target) );
 const forceNode = forceManyBody().strength((d) => (d as PaperNodeType).graphLevel === 1 ? 1000 : -1000);
//  const collisionForce = forceCollide().radius(40);//set minimum distance of 20px (less means collision)
 const linkForce = forceLink(topicsLinks)
 .id((d) => (d as EdgeType).id)
 .strength(link => link.value)
 .distance(400)// Set a desired link distance of 50 - very useful
 
 const simulation = forceSimulation( connectedTopics as SimulationNodeDatum[])
 .force('link', linkForce)
 .force('charge', forceNode)
//  .force('collide', collisionForce) //very useful
 .stop()
 .tick(300)
 
 childrenTopicNodes.forEach((topicNode:TopicNodeType, i) => {
   topicNode.fx = (topicNode as unknown as {x: number}).x //using fx prop used by d3 as fixed X pos.
   topicNode.fy = (topicNode as unknown as {y: number}).y; //using fy prop used by d3 as fixed Y pos.
  });
  // Stats.track(Stats.GET_PAPERS, '\t\t > childrenTopicNodes positioning completed');


    
  /**
   * Code for layout all the topics in the radius-by-level circular manner
  */
  // topicNodesByLevel.forEach((topics:TopicNodeType[], indexAsLevel:number) => {
  //   if ( indexAsLevel===0 ){ //special case for the ROOT topic with graphLevel=0
  //     topics[0].fx = centerX;
  //     topics[0].fy = centerY;
  //     return;
  //   }
      
  //   topics.sort((topicA, topicB) => (topicA.linkedNodeIds.length - topicB.linkedNodeIds.length))

  //   const radius = CIRCLE_GAP*indexAsLevel;
  //   const angleUnitInRad = PERIOD/topics.length;
  //   topics.forEach((topicNode:TopicNodeType, i) => {
  //     const angle = angleUnitInRad*i;

  //     topicNode.fx = centerX + radius * Math.cos(angle);
  //     topicNode.fy = centerY + radius * Math.sin(angle);
  //   });
  // });
  
}

/**
 * Calculates and injects force-directed positions to all non-fixed nodes
 * @param {GraphData} graphData.
 */
const injectForceDirectedPositionsToAllNodes = ({
  nodes, 
  edges:linksData, 
}:GraphData) => {
  /**
   * Construct the forces.
   */
  // The strength of the attraction(positive value) or repulsion(negative value). 
  const forceNode = forceManyBody().strength((d) => (d as PaperNodeType).grouping ? 90 : -30);
  const collisionForce = forceCollide().radius(20);
  const linkForce = forceLink(linksData)
    .id((d) => (d as EdgeType).id)
    // .strength(link => link.value)
    .distance(40)// Set a desired link distance of 50 - very useful
  
  /**
   * Run the Simulation.
   */
  forceSimulation(nodes as SimulationNodeDatum[])
    .force('link', linkForce)
    .force('charge', forceNode)
    .force('collide', collisionForce) //very useful
    // .force('x', forceX())
    // .force('y', forceY())
    .stop()
    .tick(300);
}


/**
 * Stripping the egde objects from the heavy real node references abd other props that were injected by d3
 * and repleacing them with just the ids and positions of these objects.
 * @param {GraphData} graphData.
 */
function prepareEdgesToBeSend({edgesToSend, edges:linksData}:GraphData) {
  edgesToSend.forEach((edgeToSend:EdgeType, i:number)=> {   
    const {source, target} = linksData[i] as {source: { id: number; x: number; y: number; }, target: { id: number; x: number; y: number; }} 
    //getting rid of the real node references injected by d3 and repleacing with a simple 3-prop object.
    edgeToSend.source = {id: source.id, x: source.x, y: source.y};
    edgeToSend.target = {id: target.id, x: target.x, y: target.y};
  });
}


export const calculateAndInjectNodesPositions = (graphData:GraphData) => {
  Stats.track(Stats.GET_PAPERS, 'calculateAndInjectNodesPositions');
  injectFixedTopicNodes(graphData);
  Stats.track(Stats.GET_PAPERS, '\t > injectFixedTopicNodes competed');
  injectForceDirectedPositionsToAllNodes(graphData);
  Stats.track(Stats.GET_PAPERS, '\t > injectForceDirectedPositionsToAllNodes completed');
  prepareEdgesToBeSend(graphData);
  Stats.track(Stats.GET_PAPERS, '\t > prepareEdgesToBeSend completed');
}
        
