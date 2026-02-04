import { HierarchyNode, Selection, descending, hierarchy, pack, select as d3Select } from 'd3';
import { GRAPH_CONFIG } from '@/components/graphs/GraphConfig';
import { renderNodesWithLabels } from './HierarchyRenders';
import { getLabelDisplayValue, getLabelFontSize, getLabelStrokeWidth, getSubLabelDisplayValue } from './utils/HierarchyUtils';
import { renderUpdatedNodeSizeAndStrokeAndVisibility } from './utils/NodeRenderHelper';
import { replaceEdgeIdWithSolidData } from '@/model/replaceIdWithSolidData';
import { markSelectionInNodesDatum } from './utils/NodeUtils';
import { removeSelectionEdgeLines, renderLinesBetweenTargetAndClones } from './utils/LineRenderHelper';
import { SVGCircleElementSelection, SVGEdgesGroupSelection, SVGGraphGroupSelection, useSvgElemsStore } from '@/model/store/svgElemsStore';
import { NodeClickEvent } from '@/components/graphs/GraphGridLayout';
import { BranchNodeByD3, EdgeFromServer, GraphData, TreeNode } from '@/model/GraphDataModel';
import { NodesSelection, SelectionSource } from '@/lib/state/selectionReducer';
import { useZoomStore } from '@/model/store/zoomStore';
import { hideLongerTextOnCollision } from './utils/LabelsUtils';

export class HierarchyGraph {
  _handleNodeClick: NodeClickEvent;
  _rootSVGGroup: Selection<SVGGElement, unknown, HTMLElement, any>;
  _rootNode: HierarchyNode<TreeNode>;
  _graphMaxLevel:number;
  _graphData: GraphData;

  /**
   * Constructor  -  HierarchyGraph
   *
   */
  constructor(
    graphData : GraphData,
    handleNodeClick:  (targetNode:BranchNodeByD3)=>void,
    rootSVGGroup:Selection<SVGGElement, unknown, HTMLElement, any>,
  ) {
    this._graphData = graphData;
    this._handleNodeClick = handleNodeClick;
    this._rootSVGGroup = rootSVGGroup;

    this._graphMaxLevel = graphData.topicNodes.reduce((maxLevel, { graphLevel }) => {
      return (maxLevel < graphLevel) ? graphLevel : maxLevel;
    }, 0)

  //console.log('useSvgElemsStore.getState()',useSvgElemsStore.getState());
    useSvgElemsStore.setState({
      //Add encompassing group for the zoom
      graphSVGGroup: rootSVGGroup.append('g')
        .attr('class', 'hierarchy-graph')
        .attr('transform', `translate(0,0)`) as unknown as SVGGraphGroupSelection,
    });


    /**
     *
     * example data = { "name": "A1", "children": [
     *  { "name": "B1", "children": [{ "name": "C1", "value": 100 }, { "name": "C2", "value": 300 }, { "name": "C3", "value": 200 }] },
     *  { "name": "B2", "value": 200 }
     * ]};
    */
  //console.log('HerarchyGraph gefore', graphData?.treeNode);
    const rootNode = hierarchy(graphData?.treeNode)
  //console.log('HerarchyGraph after', rootNode);
  //console.log('this._graphMaxLevel', this._graphMaxLevel);
    rootNode.sum((d) => ( d as {value:number}).value * 10);//rootNode.count(); // Calculate the nodes values by aggregating from the leaves.
    // rootNode.sort((a, b) => descending(a.value, b.value) );// Sort the leaves by descending value for a pleasing layout.

    const descendants = rootNode.descendants() as unknown as BranchNodeByD3[];
    // const leaves = descendants.filter(d => !d.children);
    // leaves.forEach((d, i) => d.index = i);
    // const L = label == null ? null : leaves.map(d => label(d.data, d));
    // const T = title == null ? null : descendants.map(d => title(d.data, d));
  //console.log('descendants', descendants);
    pack().size([3840, 2160])(rootNode);//here x & y positions are injected
    this._rootNode = rootNode;

    if (graphData.edges) {
      graphData.edges = replaceEdgeIdWithSolidData(graphData.edges as unknown as EdgeFromServer[], descendants );
    }

    renderNodesWithLabels(
      descendants,
      this._graphMaxLevel,
      graphData?.edges,
      handleNodeClick,
    );

    // this.updateOnZoomChange(1);
  }



  /**
   *
   * Public methods
   */
  getRootNode() {
    return this._rootNode;
  }

  
  /**
   *
   * Public methods
   */
  updateOnZoomChange(currentZoomLevel:number) {
    const svgRefs = useSvgElemsStore.getState();
    const smallNodesShown = useZoomStore.getState().smallNodesShown;
  //console.log('HierarchyGraph >> updateOnZoomChange > currentZoomLevel', currentZoomLevel, 'svgRefs',svgRefs);
    // svgRefs.nodesCirclesWithLabelSVGGroup?.attr('stroke-width', 1 / currentZoomLevel);
    // svgRefs.nodesCirclesWithLabelSVGGroup?.attr('stroke-width', 0.05 / currentZoomLevel);
    
    // svgRefs.nodesCirclesWithLabelSVGGroup?.attr('stroke', d => getCloneStrokeColor(d))
   
    
    

    //LINES
    svgRefs.allEdgeLines?.attr('stroke-width', GRAPH_CONFIG.edgeStrokeWidth / currentZoomLevel);
    // this._linkSVGGroup && this._linkSVGGroup.style('display', d => getLinkGroupDisplayValue(currentZoomLevel))
    renderUpdatedNodeSizeAndStrokeAndVisibility(svgRefs.nodesCirclesInFront as SVGCircleElementSelection);
    

    //LABELS
    svgRefs.nodesLabels
      ?.style('display', d => getLabelDisplayValue(d.data.graphLevel, this._graphMaxLevel, currentZoomLevel))
      .style('font-size', d => getLabelFontSize(d.data.graphLevel, currentZoomLevel))
      .style('stroke-width', d => getLabelStrokeWidth(d.data.graphLevel, this._graphMaxLevel, currentZoomLevel));
    svgRefs.nodesSubLabels1?.style('display', d => getSubLabelDisplayValue(!d.data.grouping, currentZoomLevel))
    svgRefs.nodesSubLabels2?.style('display', d => getSubLabelDisplayValue(!d.data.grouping, currentZoomLevel))
    svgRefs.nodesSubLabels3?.style('display', d => getSubLabelDisplayValue(!d.data.grouping, currentZoomLevel))


    // if ( currentZoomLevel > 40 ) {
      svgRefs.nodesLabels?.attr('y', d => {
      if (getSubLabelDisplayValue(!d.data.grouping, currentZoomLevel) === 'none') {
        return -1.1;
      }
      return (-d.data.titleInLines.length - 1) * 0.5;
    });


    // /**
    //  * Labels visibility
    //  **/
    hideLongerTextOnCollision();
  }

  /**
   *
   * @param {*} nodesSelection
                NodesSelection {
                  lastSelectedNodeData: BranchNodeByD3 | undefined;
                  itemsSelectionIds: number[];
                  clonesSelection: BranchNodeByD3[];
                }
   * @param {*} zoomLevel
   */
  setSelection(nodesSelection:NodesSelection) {
    const {nodesCirclesInFront, edgesSVGGroup} = useSvgElemsStore.getState();
    if (!!nodesCirclesInFront) {
    //console.log('HierarchyGraph =====> setSelection(nodesSelection)', nodesSelection);
      
      markSelectionInNodesDatum(nodesCirclesInFront, nodesSelection)
      
      renderUpdatedNodeSizeAndStrokeAndVisibility(nodesCirclesInFront);
      
      const includeCloneCloneConnections = nodesSelection.selectionSource === SelectionSource.FILTER_PANEL;
      const targetNode = nodesSelection.lastSelectedNodeData as BranchNodeByD3;
      
      removeSelectionEdgeLines(edgesSVGGroup as SVGEdgesGroupSelection);
      const lines = renderLinesBetweenTargetAndClones(
        edgesSVGGroup as SVGEdgesGroupSelection,
        targetNode,
        nodesSelection.lastSelectedNodeClones,
        includeCloneCloneConnections
      );
      useSvgElemsStore.setState({
        allEdgeLines: lines,
      });
    //console.log('--> lines', lines, 'clonesOfLastSelected', nodesSelection.clonesSelection);
    }
  }

}






