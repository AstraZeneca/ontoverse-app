import { SVGCircleElementSelection, SVGEdgesGroupSelection, useSvgElemsStore } from "@/model/store/svgElemsStore";
import { GRAPH_CONFIG } from "@/components/graphs/GraphConfig";
import {
  getCloneRadius,
  getCloneStrokeColor,
  getCloneStrokeWidth,
  getLabelDisplayValue,
  getLabelFontSize,
  getLabelFontWeigh,
  getLabelStrokeColor,
  getLabelStrokeWidth,
} from "./utils/HierarchyUtils";
import { removeAllEdgeLines, removeDirectEdgeLines, renderConnectedLines } from "./utils/LineRenderHelper";
import { getEgdesDataConnectedToNode } from "./utils/LineUtils";
import { renderCloneNodesWithStroke } from "./utils/NodeRenderHelper";
import { getCloneNodesFromEdges, } from "./utils/NodeUtils";
import { BranchNodeByD3, Edge, TreeNode } from "@/model/GraphDataModel";
import { ZoomStore, useZoomStore } from "@/model/store/zoomStore";

export const SHOW_TOPIC_CIRCLES = false;

/***
 * NODES with LABELS in Front on the view
 * Note:
 *  - labels are visible
 *  - nodes are transparent, but teay are active on mouse behaviour
 */
export const renderNodesWithLabels = (
  descendants: BranchNodeByD3[],
  graphMaxLevel: number,
  edgesData: Edge[],
  onNodeClick:  (targetNode:BranchNodeByD3) => void ,
) => {
  
  const _selectedNodesIds = [];
  console.log('graphMaxLevel', graphMaxLevel);
  
  /***
   * LINK
   */
  useSvgElemsStore.setState(state => {
    const edgesSVGGroup = state.graphSVGGroup?.append('g')
      .attr('class', 'edges-group')
      .attr('stroke-linecap', 'round') // link stroke linecap
      // .attr('stroke-opacity', 0.6) // link stroke opacity
      // .attr('stroke-width', '')
      // .style('display', 'unset')
    return {
      edgesSVGGroup: edgesSVGGroup as unknown as SVGEdgesGroupSelection,
      allEdgeLines: edgesSVGGroup?.selectAll('line')
    };
  });



  /***
   * NODES
   */

  const nodesInFrontGroup = useSvgElemsStore.getState().graphSVGGroup?.append('g')//the group for all the nodes (circles)
    .attr('class', 'nodesInFrontGroup')
    .attr('fill', 'currentColor') // node stroke fill (if not using a group color encoding)
    .attr('stroke-width', GRAPH_CONFIG.nodeStrokeWidth) // node stroke width, in pixels
    .attr('stroke', '#fff') // node stroke color

  useSvgElemsStore.setState({
    nodesCirclesWithLabelSVGGroup: nodesInFrontGroup?.selectAll('g')
    .attr('class', 'nodesCirclesWithLabelSVGGroup')
    .data(descendants)
    .enter().append('g') //to group a circle with a label
    .attr('transform', d => `translate(${d.x},${d.y})`)
    // .call(drag(simulation));
  });



  useSvgElemsStore.setState( (state) => ({
    nodesCirclesInFront: state.nodesCirclesWithLabelSVGGroup?.append('circle')
      .attr('r', d => getCloneRadius(d))
      .attr('id', (d) => 'c' + d.data.id)
      .attr("fill", d => d.data.paperNode ? "#FFF" : "#fff")
      .attr("fill-opacity", d => d.data.paperNode ? 1 : 0.1)
      .attr('stroke', d => getCloneStrokeColor(d))
      .attr('stroke-width', d => getCloneStrokeWidth(d))//d.selected ? getCloneStrokeWidth(d) : 0)
      // .attr("stroke-width", d => getLabelStrokeWidth(d.data?.graphLevel, graphMaxLevel))
      .attr("stroke-opacity", 1)
      .attr('display', d => (SHOW_TOPIC_CIRCLES || d.data.typeNumber !== 1) && getCloneRadius(d)>2? 'unset' : 'none')
  }));

  /** MOUSE OVER (ENTER) */
  useSvgElemsStore.getState().nodesCirclesWithLabelSVGGroup?.filter(d => d.data.typeNumber > 1)//exlude the topic nodes
    .on('mouseenter', (e, targetNodeDatum) => {


      const egdesDataConnectedToNode = getEgdesDataConnectedToNode(targetNodeDatum, edgesData);//All edges connected to the node
      const cloneNodes = getCloneNodesFromEdges(useSvgElemsStore.getState().nodesCirclesInFront as SVGCircleElementSelection , egdesDataConnectedToNode, targetNodeDatum);//LINKED CIRCLES

      useSvgElemsStore.getState().allEdgeLines = renderConnectedLines(useSvgElemsStore.getState().edgesSVGGroup as SVGEdgesGroupSelection, egdesDataConnectedToNode); // SVG's LINES of the LINK
      renderCloneNodesWithStroke(targetNodeDatum, cloneNodes);


    //console.log('on HOVER >> targetNodeDatum.data.id', targetNodeDatum.data.id);
    //console.log('on HOVER >> cloneNodes.size()', cloneNodes.size(), 'cloneNodes', cloneNodes);
    //console.log('on HOVER >> egdesDataConnectedToNode', egdesDataConnectedToNode);


      /** MOUSE OUT (LEAVE) */
    }).on('mouseleave', (e) => {
      useSvgElemsStore.getState().nodesCirclesInFront
        ?.attr('stroke', (d) => getCloneStrokeColor(d))
        .attr('stroke-width', d => getCloneStrokeWidth(d))

      // removeAllEdgeLinesExeptFromSelectedNodes( useSvgElemsStore.getState().edgesSVGGroup);
      removeDirectEdgeLines( useSvgElemsStore.getState().edgesSVGGroup as SVGEdgesGroupSelection);

      /** MOUSE CLICK */
    }).on('click', (e, d) => { // on CLICK selects/deselects the node
    //console.log('HerrarchyRenders >> node click > d:', d);
      removeAllEdgeLines( useSvgElemsStore.getState().edgesSVGGroup as SVGEdgesGroupSelection);

      onNodeClick(d);


      /*
      const filteredLinkData = edgesData.filter(linkD => linkD.source.data.id === currentTargetNodeD.data.id || linkD.target.data.id === currentTargetNodeD.data.id);
    //console.log({ nf: edgesData, f: filteredLinkData, _currentZoomLevel:xxxx });

      filteredLinkData.sort(sortEdges)
      // SVG's LINES of the LINK
       useSvgElemsStore.getState().edgeLines =  useSvgElemsStore.getState().edgesSVGGroup.selectAll('line')
        .data(filteredLinkData)
        .enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('display', d => getLinkDisplayValue(d))//(d) => d.visible ? 'unset' : 'none') //set filtered links only
        .attr('stroke', d => getLinkColour(d)) //set filtered links only
        .attr("stroke-opacity", d => getLinkOpacity(d))
        .attr('stroke-width', GRAPH_CONFIG.edgeStrokeWidth / zoomLevel);
*/


      /*
            //LINKED CIRCLES 
            const connectedCircles = useSvgElemsStore.getState().nodesCirclesInFront.filter(nodeD => {
                const selectedLinkLinesWithTheNode =  useSvgElemsStore.getState().edgeLines.filter(selectedLinkD =>
                selectedLinkD.source.data.id === nodeD.data.id || selectedLinkD.target.data.id === nodeD.data.id)
              return selectedLinkLinesWithTheNode.size() > 0//Links pointing to the nodeD
            });
            
      
            const targetItemId = currentTargetNodeD.data.props.itemID;
          //console.log('on HOVER >> connectedCircles',connectedCircles, 'targetItemId',targetItemId);
            if (targetItemId) { //it's an item node, not a topic node
              connectedCircles
                .attr('r',  d => getCloneRadius(d))//might need to increase radiu by half of the stroke width
                .attr('stroke', d => (d.data.props.itemID === targetItemId) ? '#000' : getCloneStrokeColor(d))//show stroke only on clones and the target
                .attr('stroke-width',   d => (getCloneStrokeWidth(d) || 2) / xxxxxxx());//CIRCLE stroke on MOUSE ENTER 
            }
            */
      // onNodeClick(currentTargetNodeD);

      // console.log(' HierarchyRender => on Node Click => event', e, 'nodeD', d);
      // d3Select(e.srcElement)//e.path[0])//[circle, g, g, g.chart11, g.root-chart, svg, div#chartContainer,.../ /...div#root, body, html, document, Window]
      // .attr('stroke-opacity', 1)
      // .attr('stroke', '#00F') //CIRCLE stroke on CLICK (selected)

      // useSvgElemsStore.getState().nodesCirclesInFront
      //   .attr('stroke-opacity', 0)
      //   .attr('stroke',  '#999')
      //  useSvgElemsStore.getState().edgeLines.attr('stroke-width', GRAPH_CONFIG.strokeWidth/currentZoomTransform.k);
    });

  useSvgElemsStore.setState( (state) => ({
    nodesLabels: state.nodesCirclesWithLabelSVGGroup?.append('text')
      .attr('y', d => (-d.data.titleInLines.length - 1) * 0.5)
      .text((d):string => {
        // console.log({g:d.data.grouping, l:d.data.label, t:d.data.title, d:d}); 
        return !d.data.grouping ? d.data.label : d.data.title;
      })
    .style('display', d => getLabelDisplayValue(d.data.graphLevel, graphMaxLevel, 1))
    .style('font-size', d => getLabelFontSize(d.data.graphLevel, 1))
    .style('font-weight', d => getLabelFontWeigh(d.data.graphLevel))//400)
    .style('stroke', d => getLabelStrokeColor(d.data.graphLevel))
    .style('stroke-width', d => getLabelStrokeWidth(d.data.graphLevel, graphMaxLevel, 1))//'1px')
    .style('stroke-linecap', 'butt')
    .style('stroke-linejoin', 'miter')
    .style('paint-order', 'stroke')
    // .style('pointer-events', 'none')
    .attr('text-anchor', 'middle')
  }));
  
  /** tspan lines */
  useSvgElemsStore.setState( (state) => ({
    nodesSubLabels1: state.nodesLabels?.append('tspan')
      .text(d => !d.data.grouping ? d.data.titleInLines[0] : '')//.substring(0, 40)
      // .text(d => !d.grouping ? d.title : '')//.substring(0, 40)
      .attr('text-anchor', 'middle')
      .attr("x", 0)
      .attr("y", d => (-d.data.titleInLines.length - 0) * 0.5)
      .style('display', 'none'),
    nodesSubLabels2: state.nodesLabels?.append('tspan')
      .text(d => !d.data.grouping && d.data.titleInLines[1] ? d.data.titleInLines[1] : '')//.substring(0, 40)
      // .text(d => !d.grouping ? d.title : '')//.substring(0, 40)
      .attr('text-anchor', 'middle')
      .attr("x", 0)
      .attr("y", d => (-d.data.titleInLines.length + 1) * 0.5)
      .style('display', 'none'),
    nodesSubLabels3: state.nodesLabels?.append('tspan')
      .text(d => !d.data.grouping && d.data.titleInLines[2] ? d.data.titleInLines[2] : '')//.substring(0, 40)
      // .text(d => !d.grouping ? d.title : '')//.substring(0, 40)
      .attr('text-anchor', 'middle')
      .attr("x", 0)
      .attr("y", d => (-d.data.titleInLines.length + 2) * 0.5)
      .style('display', 'none'),
  }));


  //Sets the mouse over Tooltip
  useSvgElemsStore.getState().nodesCirclesWithLabelSVGGroup?.append('title').text(d => d.data.title);

}


