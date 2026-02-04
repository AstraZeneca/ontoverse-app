import { Selection, ZoomBehavior, easeLinear, select, zoomIdentity } from "d3";
import { DRAWER_WIDTH } from "@/components/layout/DrawerHeader";
import { GRAPH_CONFIG } from "@/components/graphs/GraphConfig";
import { useZoomStore } from "@/model/store/zoomStore";
import { useSvgElemsStore } from "@/model/store/svgElemsStore";
import { debounce } from "@mui/material";
import {
  BranchNodeByD3,
  TopicNodeType,
} from "@/model/GraphDataModel";

export interface BBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  width: number;
  height: number;
}

const BB_MARGIN = 64;
export const getPositionsBoundingBox = (
  positions: { x: number; y: number }[]
): BBox => {
  const bb = positions.reduce(
    (acc, it) => {
      return {
        x0: Math.min(it.x, acc.x0),
        y0: Math.min(it.y, acc.y0),
        x1: Math.max(it.x, acc.x1),
        y1: Math.max(it.y, acc.y1),
        width: 0,
        height: 0,
      };
    },
    {
      x0: Number.MAX_SAFE_INTEGER,
      y0: Number.MAX_SAFE_INTEGER,
      x1: Number.MIN_SAFE_INTEGER,
      y1: Number.MIN_SAFE_INTEGER,
    } as BBox
  );

  return {
    x0: bb.x0 - BB_MARGIN,
    y0: bb.y0 - BB_MARGIN,
    x1: bb.x1 + BB_MARGIN,
    y1: bb.y1 + BB_MARGIN,
    width: bb.x1 - bb.x0 + BB_MARGIN * 2,
    height: bb.y1 - bb.y0 + BB_MARGIN * 2,
  };
};

export function getNodeBBox(node: BranchNodeByD3): BBox {
  return {
    x0: node.x - node.r,
    y0: node.y - node.r,
    x1: node.x + node.r,
    y1: node.y + node.r,
    width: node.r * 2,
    height: node.r * 2,
  };
}

export function zoomToTopic(topic: BranchNodeByD3) {
  //console.log('zoomToTopic >>  topic: ',topic);
  const rect: BBox = getNodeBBox(topic);
  //console.log('zoomToTopic >>  rect: BBox: ',rect);
  zoomToRectangle(rect);
}

export function zoomToTopics(topics: BranchNodeByD3[]) {
  //console.log('zoomToTopic >>  topic: ',topic);
  const rects: { x: number; y: number }[] = topics
    .map((topic) => {
      const bb = getNodeBBox(topic);
      return [
        { x: bb.x0, y: bb.y0 },
        { x: bb.x1, y: bb.y1 },
      ];
    })
    .flat();

  const boundingBox = getPositionsBoundingBox(rects);
  console.log("rects", rects, "boundingBox", boundingBox);
  zoomToRectangle(boundingBox);
}

export function zoomToRectangle(rect: BBox) {
  const svg = useSvgElemsStore.getState().svg as Selection<
    SVGSVGElement,
    unknown,
    HTMLElement,
    any
  >;
  const d3ZoomBehavior = useZoomStore.getState().d3ZoomBehavior as ZoomBehavior<
    SVGSVGElement,
    unknown
  >;

  const width = +svg.attr("width") - DRAWER_WIDTH;
  const height = +svg.attr("height") - 64; //AppTopBar.HEIGHT;
  const xCenter = (rect.x0 + rect.x1) / 2;
  const yCenter = (rect.y0 + rect.y1) / 2;
  const dx = rect.x1 - rect.x0;
  const dy = rect.y1 - rect.y0;

  const scaleFactor = Math.min(width / dx, height / dy);
  const tx = width / 2 - scaleFactor * xCenter;
  const ty = height / 2 - scaleFactor * yCenter;
  //console.log('zoomToRectangle >>', { rect, scaleFactor, tx, ty });

  svg
    .transition()
    .duration(750)
    .call(
      d3ZoomBehavior.transform,
      zoomIdentity.translate(tx, ty).scale(scaleFactor)
    );
}

export const zoomWithTransform = (x: number, y: number, k: number): void => {
  const svg = useSvgElemsStore.getState().svg as Selection<
    SVGSVGElement,
    unknown,
    HTMLElement,
    any
  >;
  const d3ZoomBehavior = useZoomStore.getState().d3ZoomBehavior as ZoomBehavior<
    SVGSVGElement,
    unknown
  >;

  svg
    .transition()
    .duration(750)
    .call(d3ZoomBehavior.transform, zoomIdentity.translate(x, y).scale(k));
};

const zoomTheMapImmediately = (zoomLevel: number) => {
  if (zoomLevel < GRAPH_CONFIG.minZoom) {
    zoomLevel = GRAPH_CONFIG.minZoom;
  } else if (zoomLevel > GRAPH_CONFIG.maxZoom) {
    zoomLevel = GRAPH_CONFIG.maxZoom;
  }

  const d3ZoomBehavior = useZoomStore.getState().d3ZoomBehavior as ZoomBehavior<
    SVGSVGElement,
    unknown
  >;
  const svg = useSvgElemsStore.getState().svg as Selection<
    SVGSVGElement,
    unknown,
    HTMLElement,
    any
  >;

  svg
    .transition()
    .duration(200)
    .ease(easeLinear)
    .call(d3ZoomBehavior.scaleTo, zoomLevel);

  //console.log('zoomTheMapImmediately >> zoomLevel', zoomLevel);

  useZoomStore.setState({ zoomLevel });
};

export const zoomTheMap = debounce((zoomLevel: number) => {
  zoomTheMapImmediately(zoomLevel);
}, 500);
