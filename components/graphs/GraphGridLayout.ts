import {
  Selection,
  ZoomBehavior,
  ZoomTransform,
  drag,
  select,
  zoom,
  zoomTransform,
} from "d3";
// import { renderContoursByDencity, CONTOURS_KEY_GRADIENT_COLORS, renderContoursByAltitude } from "./contourLines";
import { GRAPH_CONFIG } from "./GraphConfig";
import {
  BranchNodeByD3,
  GraphData,
  NodeKind,
  RichGraphData,
  TreeNode,
} from "@/model/GraphDataModel";
import { HierarchyGraph } from "./hierarchy/HierarchyGraph";
import { Point, renderContoursByDencity } from "./contourLines/contourLines";
import { getTreeStats } from "@/model/Stats";
// import { Dispatch, SetStateAction } from "react";
import { NodesSelection, SelectionSource } from "@/lib/state/selectionReducer";
import { ZoomStore, useZoomStore } from "@/model/store/zoomStore";
import { useRichDataStore } from "@/model/store/richDataStore";
import {
  SVGGraphBGGroupSelection,
  useSvgElemsStore,
} from "@/model/store/svgElemsStore";
import {
  BBox,
  getPositionsBoundingBox,
  zoomToRectangle,
  zoomWithTransform,
} from "./hierarchy/utils/zoomUtils";
import { hideLongerTextOnCollision } from "./hierarchy/utils/LabelsUtils";
import { debounce } from "@mui/material";
// import { debounce } from "@/lib/utils/miscUtils";

type SVGCallFunction = (
  selection: Selection<SVGSVGElement, unknown, HTMLElement, any>,
  ...args: any[]
) => void;

export type NodeClickEvent = (
  lastSelectedNodeData: any,
  nodesSelectionIds: []
) => void;

export const CHART_DIV_ELEMENT_ID = "chartContainer";

let d3ZoomBehavior: ZoomBehavior<SVGSVGElement, unknown> = zoom();
useZoomStore.setState({ d3ZoomBehavior });

let svg: Selection<SVGSVGElement, unknown, HTMLElement, any>;
// let defs: Selection<SVGDefsElement, unknown, HTMLElement, any>;
let rootSVGGroup: Selection<SVGGElement, unknown, HTMLElement, any>;

let currentZoomTransform: { k?: number } = {};
let startZoomTransform: { x?: number; y?: number; k?: number } = {};
let hierarchyGraph: HierarchyGraph;

const getAllNodesList = (tree: BranchNodeByD3): BranchNodeByD3[] => {
  if (tree === null) {
    return [];
  }

  const { children, ...node } = tree;
  const flattenNodes: BranchNodeByD3[] = [node as BranchNodeByD3];

  children?.forEach((treeBranch) => {
    if ((treeBranch as unknown as TreeNode).topicLeaf) {
      flattenNodes.push(treeBranch as BranchNodeByD3);
    } else {
      flattenNodes.push(...getAllNodesList(treeBranch));
    }
  });
  return flattenNodes;
};

export const initGraph = (
  graphData: GraphData | null,
  // setRichData: Dispatch<SetStateAction<RichGraphData | null>>,
  // nodesSelection:NodesSelection,
  onNodeClick: (targetNode: BranchNodeByD3) => void,
  debouncedUrlQueryUpdate: (event: any) => void
) => {
  // console.log('initGraph >>>>> graphData',graphData);
  const containerDiv = document.getElementById(CHART_DIV_ELEMENT_ID);

  if (!graphData || !graphData.nodes?.length || !!svg || !containerDiv) {
    if (!containerDiv) return console.error("containerDiv should be existant!");
    else return;
  }

  const viewportWidth = containerDiv.clientWidth;
  const viewportHeight = containerDiv.clientHeight;

  /**
   * Creates the <svg> element where all graphs will be drawn
   */
  svg = select("#" + CHART_DIV_ELEMENT_ID)
    .append("svg")
    .attr("width", viewportWidth)
    .attr("height", viewportHeight)
    .attr("viewBox", [0, 0, viewportWidth, viewportHeight])
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("background", "rgb(0,56,101)");

  useSvgElemsStore.setState({ svg });

  /**
   *  SVG's <defs> element for storing gradients definitions to be utilised in all graphs
   */
  // defs = svg.append('defs');

  /**
   * The root group encompassing all graphs for which zoom will be applied
   */
  rootSVGGroup = svg.append("g").attr("class", "root-chart");
  useSvgElemsStore.setState({
    graphBgSVGGroup: rootSVGGroup.append("g").attr("class", "contour-lines"),
  });
  let allNodeList: BranchNodeByD3[] = [];
  /**
   * Create graph reference
   */

  // console.log('>>>>>>>>>>>>>>>>>>>>> new HierarchyGraph!!!!!!!!!!');

  hierarchyGraph = new HierarchyGraph(graphData, onNodeClick, rootSVGGroup);

  const rootNode: BranchNodeByD3 =
    hierarchyGraph.getRootNode() as unknown as BranchNodeByD3;
  // console.log('rootNode',rootNode);
  // console.log('>>>> stats A', getTreeStats(rootNode));
  allNodeList = getAllNodesList(rootNode);
  // console.log('>>>>>>>>>>>allNodeList',[...allNodeList]);

  useRichDataStore.getState().setRichData(allNodeList);
  // setState({
  //   nodes: allNodeList,
  //   itemNodes: allNodeList.filter(n => n.data.typeNumber !== NodeKind.Collection),
  // });

  //TODO:Depricate the 'setRichData' function below
  // setRichData({
  //   nodes: allNodeList,
  //   paperNodes: allNodeList.filter(n => n.data.typeNumber === NodeKind.Paper),
  // });
  let positionsBBox: BBox = getPositionsBoundingBox(
    allNodeList.map(({ x, y }) => ({ x, y }))
  );
  const { x, y, k } = useZoomStore.getState();
  // console.log('>>>>>>>>>>>>>>>>>>>>{x, y, k} ',{x, y, k});

  if (isNaN(x) || isNaN(y) || isNaN(k) || (x === 0 && y === 0 && k === 0)) {
    //on initial load
    zoomToRectangle(positionsBBox);
  } else {
    //restore zoom level as position
    zoomWithTransform(x, y, k);
  }

  /**
   * Render Contours
   */
  setTimeout(() => {
    // console.log('countour lines >> allNodeList',allNodeList);

    const points: Point[] = allNodeList.map((node) => {
      return {
        x: Math.round(node.x - positionsBBox.x0), // + viewportWidth*0.5),
        y: Math.round(node.y - positionsBBox.y0), // + viewportHeight*0.5),
        z: (node.data.graphLevel || 0.5) * 10,
        r: node.r,
        isTopic: node.data.topicLeaf,
      };
    });
    // console.log('>>>> stats B', getTreeStats(rootNode));
    // console.log('================> renderContoursByDencity > points:',points, {viewportWidth, viewportHeight});
    renderContoursByDencity(
      points,
      useSvgElemsStore.getState().graphBgSVGGroup as SVGGraphBGGroupSelection,
      positionsBBox.x0, //-viewportWidth*0.5,
      positionsBBox.y0, //-viewportHeight*0.5,
      positionsBBox.x1, //viewportWidth+viewportWidth,
      positionsBBox.y1 //viewportHeight+viewportHeight,
    );

    // positionSolidNodesInsideTopicLeaf(rootSVGGroup, rootNode, onNodeClick);
  }, 5000);

  /**
   * Zoom & panning event handling
   */

  svg.call(d3ZoomBehavior); //init zoom

  (d3ZoomBehavior as unknown as ZoomBehavior<Element, unknown>)
    .scaleExtent([GRAPH_CONFIG.minZoom, GRAPH_CONFIG.maxZoom])
    .on("zoom", handleZoomUpdate)
    .on("start", handleZoomStart)
    .on("end", handleZoomEnd);

  const debouncedZoomUpdate = debounce((event: any) => {
    // console.log('debouncedZoomUpdate');
    if (event.sourceEvent?.type === "mousemove") {
      // console.log('debounce IF > handleZoomUpdate > event.type', event.sourceEvent, event.sourceEvent?.type);
      debouncedUrlQueryUpdate(event);
      hideLongerTextOnCollision();
    }
  }, 1000);

  function handleZoomUpdate(e: any) {
    currentZoomTransform = e.transform;
    const { k } = currentZoomTransform;
    // console.log('handleZoomUpdate > currentZoomLevel', k);

    if (k !== undefined) {
      rootSVGGroup.attr(
        "transform",
        (currentZoomTransform as ZoomTransform).toString()
      );
    }
    debouncedZoomUpdate(e);
  }

  function handleZoomStart(e: any) {
    const { x, y, k } = e.transform as ZoomTransform;
    startZoomTransform = { x, y, k };
  }
  function handleZoomEnd(e: any) {
    const currentZoomLevel = e.transform.k;
    // console.log('handleZoomEnd > currentZoomLevel', currentZoomLevel);

    if (startZoomTransform.k !== currentZoomLevel) {
      useZoomStore.setState({ zoomLevel: currentZoomLevel }); // SETS the ZOOM LEVEL !

      rootSVGGroup.attr("transform", e.transform.toString()); //

      hierarchyGraph.updateOnZoomChange(currentZoomLevel);
    }
  }
};

export const markSelectionOnAllGraphs = (nodesSelection: NodesSelection) => {
  //console.log('markSelectionOnAllGraphs!!!!!!!!! > nodesSelection: ', nodesSelection);
  hierarchyGraph?.setSelection(nodesSelection);

  if (nodesSelection.selectionSource === SelectionSource.FILTER_PANEL) {
    //zoom to the selection bounding box
    nodesSelection.clonesSelection.length > 0 &&
      zoomToRectangle(
        getPositionsBoundingBox(
          nodesSelection.clonesSelection.map(({ x, y }) => ({ x, y }))
        )
      );
  }
};

export const navigateToNodes = (nodes: BranchNodeByD3[]) => {
  if (nodes.length > 0) {
    zoomToRectangle(
      getPositionsBoundingBox(nodes.map(({ x, y }) => ({ x, y })))
    );
  }
};

export const destroyMultiGraph = () => {
  // d3.selectAll('svg > *').remove();
  svg && svg.remove();
};
