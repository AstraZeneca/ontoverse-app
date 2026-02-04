'use client';

import { useContext, useEffect, useRef } from "react";
import { Typography, debounce } from "@mui/material";
import { GraphDataContext } from "@/components/GraphDataContext";
import {
  CHART_DIV_ELEMENT_ID,
  initGraph,
  markSelectionOnAllGraphs,
} from "./GraphGridLayout";
import { useSelection } from "@/lib/state/SelectionProvider";
import {
  SelectionActions,
  SelectionSource,
} from "@/lib/state/selectionReducer";
import { BranchNodeByD3 } from "@/model/GraphDataModel";
import { findCloneNodes } from "@/lib/state/selectionUtils";
import { useRichDataStore } from "@/model/store/richDataStore";
import { useSidePanelStore } from "@/model/store/sidePanelStore";
import { useSelectStore } from "@/model/store/useSelection";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useZoomStore } from "@/model/store/zoomStore";
import { zoomToTopic, zoomToTopics } from "./hierarchy/utils/zoomUtils";

const GraphContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    data,
    // richData, setRichData
  } = useContext(GraphDataContext);
  const { state: nodesSelection, dispatch } = useSelection();

  const { setShowSelectedOnly } = useSidePanelStore();
  const selectedTopic = useSelectStore((state) => state.selectedTopic);
  const selectedChipClone = useSelectStore((state) => state.selectedChipClone);

  const debouncedUrlQueryUpdate = debounce((event: any) => {
    // console.log('debouncedUrlQueryUpdate');
    if (event.sourceEvent?.type === "mousemove") {
      // console.log('debouncedUrlQueryUpdate IF > handleZoomUpdate > event.type', event);
      const { x, y, k } = event.transform;
      const params = new URLSearchParams(searchParams.toString());
      params.set('x', x.toString());
      params.set('y', y.toString());
      params.set('k', k.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, 500);
  // console.log('GraphContainer ---> multiSelect',multiSelect);

  const chartRef = useRef(null);
  const chartElement = chartRef.current;

  const handleNodeClick = (targetNode: BranchNodeByD3): void => {
    const multiSelect = useSelectStore.getState().multiSelect;
    const cloneNodes = useRichDataStore.getState().cloneNodes;
    const targetClones = findCloneNodes(targetNode, cloneNodes);
    // console.log('GraphContainer.handleNodeClick >>> handleNodeClick >',{targetNode, tergetClones, cloneNodes, multiSelect});

    if (!multiSelect) {
      dispatch({
        type: SelectionActions.CLEAR_SELECTION, //Temporarily switched off multi selection
        payload: undefined,
      });
    }

    dispatch({
      type: SelectionActions.TOGGLE_CLONE_SELECTION,
      payload: {
        targetNode,
        clones: targetClones,
        selectionSource: SelectionSource.GRAPH,
        multiSelect,
      },
    });

    setShowSelectedOnly(true);
  };

  useEffect(() => {
    // console.log('>>>>>>>>>>>>>>>>searchParams>',searchParams.get('x'));

    useZoomStore.setState({
      x: +searchParams.get("x")!,
      y: +searchParams.get("y")!,
      k: +searchParams.get("k")!,
    });
  }, [searchParams]);

  useEffect(() => {
    // console.log('GraphContainer => useEffect[data]',data);
    // console.log('GraphContainer => chartRef.current',chartRef);
    if (data && chartElement) {
      // console.log('GraphContainer MOUNT => initMiltiGraphs(',{nodesData: data});
      initGraph(data, handleNodeClick, debouncedUrlQueryUpdate);

      // setZoomByExternalEvent(zoomLevel);
    }

    return () => {
      // console.log('GraphContainer UNMOUNT => destroyForceDirectedGraph(',{data});
      // destroyForceDirectedGraph();
    };
  }, [data, chartElement]);

  useEffect(() => {
    markSelectionOnAllGraphs(nodesSelection);
  }, [nodesSelection]);

  useEffect(() => {
    if (selectedTopic !== null) {
      // console.log('GraphContainer => useEffect > selectedTopic',selectedTopic);
      zoomToTopic(selectedTopic);
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (selectedChipClone !== null) {
      zoomToTopics([selectedChipClone.parent]);
    }
  }, [selectedChipClone]);

  return (
    <div
      ref={chartRef}
      id={CHART_DIV_ELEMENT_ID}
      style={{ width: "100%", height: "100%" }}
    >
      {!data && (
        <>
          <Typography variant="h6" noWrap component="div">
            Loading
          </Typography>
        </>
      )}
    </div>
  );
};
export default GraphContainer;
