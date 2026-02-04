import React, { useRef, useEffect, useState } from "react";
import { Download, FilterAlt, FilterAltOff } from "@mui/icons-material";
import { Box, Chip, IconButton } from "@mui/material";
import { useContext, useMemo } from "react";
import { BranchNodeByD3 } from "@/model/GraphDataModel";
import { exportPapersToCSV } from "@/lib/utils/srtingUtils";
import { AppData, GraphDataContext } from "@/components/GraphDataContext";
import PaperItem, { PAPER_ITEM_HEIGHT } from "./PaperItem";
import SearchField from "./SearchField";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import SortDropdown, {
  SortKind,
  SortOption,
  getSortOptionByItsKind,
} from "./SortDropdown";
import { FilterIndicator } from "./FilterIndicator";
import {
  getFilteredPapers,
  getSortedPapers,
  scrollToSelection,
} from "./filterUtils";
import { useSelection } from "@/lib/state/SelectionProvider";
import {
  SelectionActions,
  SelectionSource,
} from "@/lib/state/selectionReducer";
import { findCloneNodes } from "@/lib/state/selectionUtils";
import { useSidePanelStore } from "@/model/store/sidePanelStore";
import { useSelectStore } from "@/model/store/useSelection";

// import styled from "@emotion/styled";
// import { DRAWER_WIDTH } from '../layout/DrawerHeader';
import { styled } from "@mui/material/styles";
import { useRichDataStore } from "@/model/store/richDataStore";

const TopicChip = styled(Chip)({
  background: "#fff",
  margin: "1px",
  "&:hover": {
    backgroundColor: "#dedede", // Your desired hover color
    cursor: "pointer",
  },
  // Additional styling if needed
});

const TopicContainer = styled(Box)`
  position: absolute;
  background: #ffffff00;
  backdrop-filter: blur(4px);
  width: 280px;
  max-height: 100%;
  padding: 8px;
  margin-right: 8px;
  z-index: 1301;
  top: 0;
  left: -300px;
  overflow-y: auto;
  overflow-x: hidden;
  text-align: right;
`;

const FilterPanel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const virtuosoListRef = useRef<VirtuosoHandle | null>(null);
  const { data } = useContext<AppData>(GraphDataContext);
  const { state: nodesSelection, dispatch } = useSelection();
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>(
      getSortOptionByItsKind(SortKind.TitleAsc)
  );
  const multiSelect = useSelectStore((state) => state.multiSelect);
  const { showSelectedOnly, toggleShowSelectedOnly } = useSidePanelStore();
  const allPapers: BranchNodeByD3[] = useRichDataStore(
      (state) => state.paperNodes
  );
  const topicNodes: BranchNodeByD3[] = useRichDataStore(
      (state) => state.topicNodes
  );
  const allClones = useRichDataStore((state) => state.cloneNodes);
  // const topicNodes:TopicNodeType[] = !data?.topicNodes ? [] as TopicNodeType[] : data?.topicNodes as TopicNodeType[];
  // const allPapers:BranchNodeByD3[] = !richData?.paperNodes ? [] : richData.paperNodes;
  // const allClones:BranchNodeByD3[] = useMemo( () => !richData?.nodes ? [] :  richData.nodes.filter( n => n.data.typeNumber > 1 ), [richData?.nodes]);

  const sortedPapers: BranchNodeByD3[] = useMemo(() => {
    const papers = showSelectedOnly
        ? ((allPapers.filter((p) =>
            nodesSelection.clonesSelection.some(
                (clone) => clone.data.id === p.data.id
            )
        ) || []) as BranchNodeByD3[])
        : allPapers;
    return getSortedPapers(papers, sortOption);
  }, [allPapers, sortOption, showSelectedOnly, nodesSelection.clonesSelection]);

  // console.log( 'FilterPanel >> sortedPapers', sortedPapers )

  const filteredAndSortedPapers: BranchNodeByD3[] = useMemo(() => {
    try {
      return getFilteredPapers(sortedPapers, searchQuery);
    } catch (error) {
      console.error("Error in getFilteredPapers:", error);
      // alert("Error while fitering papers. Possibly due to data inconsistancy. \nCheck the console for the error details.");
      return []; // Return a fallback value to prevent crashes
    }
  }, [sortedPapers, searchQuery]);

  const filteredTopicNodes: BranchNodeByD3[] =
      searchQuery === ""
          ? []
          : topicNodes.filter((topicNode) => {
            return topicNode.data.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
          });

  const handleSortDropdownChange = (sortOption: SortOption) => {
    // console.log('handleSortDropdownChange > sortOption',sortOption);

    setSortOption(sortOption);
  };
  // console.log('searchQuery',searchQuery,'filteredAndSortedPapers',filteredAndSortedPapers, {allPapers});
  // console.log('FilterPanel >>>>>>>>> nodesSelection',nodesSelection);
  // console.log("FilterPanel ------->> filteredTopicNodes", filteredTopicNodes);

  const handleExportClick = () => {
    const { itemsSelectionIds } = nodesSelection;
    let papersToExport: BranchNodeByD3[] = [];
    if (itemsSelectionIds.length > 0) {
      papersToExport = filteredAndSortedPapers.filter((paper: BranchNodeByD3) =>
          itemsSelectionIds.some((id) => id === paper.data.props.itemID)
      );
    }

    exportPapersToCSV(
        papersToExport.map((p) => p.data),
        "papers.csv"
    );
  };

  const handleSubmitSearchQuery = () => {
    // alert('TODO: upadate the Graph with the selection IDs: '+filteredAndSortedPapers.map((it:BranchNodeByD3) => it.data.id).join(', '));
  };

  const handlePaperItemClick = (paperNodeData: BranchNodeByD3) => {
    const clones = findCloneNodes(paperNodeData, allClones);
    // console.log('handlePaperItemClick > newNodeSelection', {clones, targetNode:paperNodeData});
    if (!multiSelect) {
      dispatch({
        type: SelectionActions.CLEAR_SELECTION, //Temporarily switched off multi selection
        payload: undefined,
      });
    }
    dispatch({
      type: SelectionActions.TOGGLE_ITEM_SELECTION,
      payload: {
        targetNode: paperNodeData,
        clones,
        selectionSource: SelectionSource.FILTER_PANEL,
      },
    });
  };

  const handleSetSearchQuery = (q: string) => {
    dispatch({
      type: SelectionActions.CLEAR_SELECTION,
      payload: undefined,
    });
    setSearchQuery(q);
  };

  const handleShowSelectedOnlyButtonClick = () => {
    toggleShowSelectedOnly();
    if (virtuosoListRef.current && nodesSelection.lastSelectedNodeData) {
      scrollToSelection(
          nodesSelection.lastSelectedNodeData,
          virtuosoListRef.current,
          filteredAndSortedPapers
      );
    }
  };

  //ScrollToSelection
  useEffect(() => {
    // console.log('FilterPanel >> useEffect > last selected',nodesSelection.lastSelectedNodeData,'ref', filteredAndSortedPapers, virtuosoListRef.current, 'filteredAndSortedPapers',filteredAndSortedPapers);
    if (virtuosoListRef.current) {
      scrollToSelection(
          nodesSelection.lastSelectedNodeData,
          virtuosoListRef.current,
          filteredAndSortedPapers
      );
    }
  }, [nodesSelection.lastSelectedNodeData?.data?.id, filteredAndSortedPapers]);

  useEffect(() => {
    scrollToSelection(
        nodesSelection.lastSelectedNodeData,
        virtuosoListRef.current,
        filteredAndSortedPapers
    );
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
      <Box
          ref={containerRef}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%", // Use full available height
            overflow: "hidden", // Prevent overflow
          }}
      >
        <Box sx={{ 
          display: 'flex', 
          paddingTop: '12px', 
          margin: 'auto', 
          marginBottom : '-4px', 
          }}>
          <SortDropdown
            sortOption={sortOption}
            onChange={handleSortDropdownChange}
          />
          <SearchField
              label=""
              setSearchQuery={handleSetSearchQuery}
              onSubmitSearchQuery={handleSubmitSearchQuery}
          >
            <IconButton
                color={"primary"}
                aria-label="Open in new tab"
                component="a"
                href="#link-cvs"
                onClick={handleExportClick}
                title={"Export the selection to CSV"}
            >
              <Download />
            </IconButton>
            <IconButton
                color={
                  nodesSelection.itemsSelectionIds.length > 0
                      ? "secondary"
                      : "primary"
                }
                aria-label={
                  showSelectedOnly
                      ? "click to show Selected Items Only"
                      : "click to show All Items"
                }
                onClick={handleShowSelectedOnlyButtonClick}
                title={
                  showSelectedOnly ? "Show selected items only" : "Show All Items"
                }
            >
              {showSelectedOnly ? <FilterAlt /> : <FilterAltOff />}
            </IconButton>
          </SearchField>
        </Box>
         <FilterIndicator
            filteredPapersCount={filteredAndSortedPapers.length}
            totalPapersCount={allPapers.length}
        />
        <Box
            sx={{
              flexGrow: 1, // Make the list take up remaining space
              overflow: "auto", // Allow scrolling for the list
              margin: "4px 8px",
            }}
        >
          <Virtuoso
              ref={virtuosoListRef}
              style={{ height: "100%"}} // Ensure Virtuoso uses full height
              data={filteredAndSortedPapers}
              itemContent={(index, it) => 
              {
                const itemNodeId = it.data.props.itemID;
                const selected = nodesSelection.itemsSelectionIds.some(
                    (id) => id === itemNodeId
                );
                if (showSelectedOnly && !selected) return null;
              return (
                  <PaperItem
                    key={itemNodeId}
                      paperNode={it}
                      selected={selected}
                      lastSelected={
                          nodesSelection.lastSelectedNodeData?.data.props.itemID ===
                          itemNodeId
                      }
                      // key={paper.data.props.itemID.low}
                      // paperNode={paper}
                      // selected={nodesSelection.itemsSelectionIds.includes(
                      //     paper.data.props.itemID.low
                      // )}
                      onPaperItemClick={handlePaperItemClick}
                  />
              )}}
          />
        </Box>
        {filteredTopicNodes?.length > 0 && (
            <TopicContainer>
              {filteredTopicNodes.map((topicNode) => (
                  <TopicChip
                      // color="info"
                      key={topicNode.data.id}
                      label={topicNode.data.title}
                      onClick={() =>
                          useSelectStore.setState({ selectedTopic: topicNode })
                      }
                  />
              ))}
            </TopicContainer>
        )}
      </Box>
  );
};

export default FilterPanel;
