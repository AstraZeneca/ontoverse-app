import { ZoomBehavior } from "d3";
import { create } from "zustand";

export type ZoomStore = {
    d3ZoomBehavior: ZoomBehavior<SVGSVGElement, unknown> | null;
    zoomLevel: number;
    x: number;
    y: number;
    k: number;
    setZoomLevel: (zoomLevel: number) => void;

    smallNodesShown:boolean;
}
export const useZoomStore = create<ZoomStore>()((set) => ({
    d3ZoomBehavior: null,
    zoomLevel: 1,
    x: 0,
    y: 0,
    k: 1,
    setZoomLevel: (newZoomLevel:number) => set(() => ({ zoomLevel: newZoomLevel })),
    
    smallNodesShown:false,

  }))