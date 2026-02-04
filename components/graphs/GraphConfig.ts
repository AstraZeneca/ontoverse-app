
import config from "@/lib/config";

export const GRAPH_CONFIG = {
  ... config.zoom.ZOOM_CONFIG, //ZOOM_CONFIG,
  showGroupingConnections: true,
  labelZoomPoint:2,
  defaultZoom: 1,
  minZoom: 0.25,
  maxZoom: config.zoom.MAX_ZOOM, //MAX_ZOOM,
  edgeStrokeWidth: 1.5,
  nodeStrokeWidth: 4,
  linkColor: '#EEE',
  cloudRadius: 120,
}