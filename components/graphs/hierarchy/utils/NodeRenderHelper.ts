import { getCloneRadius, getCloneStrokeColor, getCloneStrokeWidth } from "./HierarchyUtils";
import { BranchNodeByD3 } from "@/model/GraphDataModel";
import { SVGCircleElementSelection } from "@/model/store/svgElemsStore";
import { SHOW_TOPIC_CIRCLES } from "@/components/graphs/hierarchy/HierarchyRenders";
import { ZoomStore, useZoomStore } from "@/model/store/zoomStore";
import { select } from "d3";


export const renderUpdatedNodeSizeAndStrokeAndVisibility = (nodesCirclesInFront:SVGCircleElementSelection) => {
  const {zoomLevel, smallNodesShown} = (useZoomStore.getState() as ZoomStore);

  nodesCirclesInFront
    .attr('r', d => getCloneRadius(d))
    .attr('stroke', d => getCloneStrokeColor(d))
    .attr('stroke-width', d => getCloneStrokeWidth(d))
    .attr('display', function(d) {
      if (zoomLevel < 4){//hide small nodes if not hidden already
        if (!smallNodesShown){//small nodes already hidden
          return select(this).attr('display');//nothing changed.
        }

        useZoomStore.getState().smallNodesShown = false;//mark as hidden
        return (SHOW_TOPIC_CIRCLES || d.data.typeNumber !== 1) && getCloneRadius(d)>2 ? 'unset' : 'none';//hide small nodes
      } 

      //zoomLevel >= 4 here, hence show small nodes if not shown already
      if (smallNodesShown) {//already shown
        return select(this).attr('display');//nothing changed.
      }
      useZoomStore.getState().smallNodesShown = true;//mark as shown
      return  (SHOW_TOPIC_CIRCLES || d.data.typeNumber !== 1) ? 'unset' : 'none';//show small nodes
    });
}



export const renderCloneNodesWithStroke = (targetNodeDatum:BranchNodeByD3, cloneNodes:SVGCircleElementSelection) => {
  const targetItemId = targetNodeDatum.data.props.itemID;
  cloneNodes
    .attr('r',  d => getCloneRadius(d))
    .attr('stroke', d => (d.data.props.itemID === targetItemId) ? '#000' : getCloneStrokeColor(d))//show stroke only on clones and the target
    .attr('stroke-width',   d => getCloneStrokeWidth(d))//CIRCLE stroke on MOUSE ENTER 
}