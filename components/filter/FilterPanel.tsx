import React, { useRef, useEffect, useState } from "react";
import { Download, FilterAlt, FilterAltOff } from "@mui/icons-material";
import { Box, Chip, IconButton } from "@mui/material";
import { useContext, useMemo } from "react";
import { exportItemsToCSV } from "@/lib/utils/srtingUtils";
import { AppData, GraphDataContext } from "@/components/GraphDataContext";
import ItemListRow, { ITEM_LIST_ROW_HEIGHT } from "./ItemListRow";
import SearchField from "./SearchField";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import SortDropdown, {
  SortKind,
  SortOption,
  getSortOptionByItsKind,
} from "./SortDropdown";
import { FilterIndicator } from "./FilterIndicator";
import {
  getFilteredItems,
  getSortedItems,
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
import { useRichDataStore, AppBranchNode, AppItemProps } from "@/lib/items/app-types";

const CollectionChip = styled(Chip)({
  background: "#fff",
  margin: "1px",
  "&:hover": {
    backgroundColor: "#dedede", // Your desired hover color
    cursor: "pointer",
  },
  // Additional styling if needed
});

const CollectionContainer = styled(Box)`
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
  const allItems: AppBranchNode[] = useRichDataStore(
      (state) => state.itemNodes
  );
  const collectionNodes: AppBranchNode[] = useRichDataStore(
      (state) => state.collectionNodes
  );
  const allClones = useRichDataStore((state) => state.cloneNodes);

  const sortedItems: AppBranchNode[] = useMemo(() => {
    const items = showSelectedOnly
        ? ((allItems.filter((p) =>
            nodesSelection.clonesSelection.some(
                (clone) => clone.data.id === p.data.id
            )
        ) || []) as AppBranchNode[])
        : allItems;
    return getSortedItems(items, sortOption) as AppBranchNode[];
  }, [allItems, sortOption, showSelectedOnly, nodesSelection.clonesSelection]);

  const filteredAndSortedItems: AppBranchNode[] = useMemo(() => {
    try {
      return getFilteredItems(sortedItems, searchQuery) as AppBranchNode[];
    } catch (error) {
      console.error("Error in getFilteredItems:", error);
      return [];
    }
  }, [sortedItems, searchQuery]);

  const filteredCollectionNodes: AppBranchNode[] =
      searchQuery === ""
          ? []
          : collectionNodes.filter((collectionNode) => {
            return collectionNode.data.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
          });

  const handleSortDropdownChange = (sortOption: SortOption) => {
    // console.log('handleSortDropdownChange > sortOption',sortOption);

    setSortOption(sortOption);
  };

  const handleExportClick = () => {
    const { itemsSelectionIds } = nodesSelection;
    let itemsToExport: AppBranchNode[] = [];
    if (itemsSelectionIds.length > 0) {
      itemsToExport = filteredAndSortedItems.filter((item: AppBranchNode) =>
          itemsSelectionIds.some((id) => id === (item.data.props as AppItemProps).itemID)
      );
    }

    exportItemsToCSV(
        itemsToExport.map((p) => p.data),
        "items.csv"
    );
  };

  const handleSubmitSearchQuery = () => {
    // alert('TODO: upadate the Graph with the selection IDs: '+filteredAndSortedItems.map((it:BranchNodeByD3) => it.data.id).join(', '));
  };

  const handleItemClick = (itemNodeData: AppBranchNode) => {
    const clones = findCloneNodes(itemNodeData, allClones);
    if (!multiSelect) {
      dispatch({
        type: SelectionActions.CLEAR_SELECTION, //Temporarily switched off multi selection
        payload: undefined,
      });
    }
    dispatch({
      type: SelectionActions.TOGGLE_ITEM_SELECTION,
      payload: {
        targetNode: itemNodeData,
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
          filteredAndSortedItems
      );
    }
  };

  //ScrollToSelection
  useEffect(() => {
    // console.log('FilterPanel >> useEffect > last selected',nodesSelection.lastSelectedNodeData,'ref', filteredAndSortedItems, virtuosoListRef.current, 'filteredAndSortedItems',filteredAndSortedItems);
    if (virtuosoListRef.current) {
      scrollToSelection(
          nodesSelection.lastSelectedNodeData,
          virtuosoListRef.current,
          filteredAndSortedItems
      );
    }
  }, [nodesSelection.lastSelectedNodeData?.data?.id, filteredAndSortedItems]);

  useEffect(() => {
    scrollToSelection(
        nodesSelection.lastSelectedNodeData,
        virtuosoListRef.current,
        filteredAndSortedItems
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
            filteredItemsCount={filteredAndSortedItems.length}
            totalItemsCount={allItems.length}
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
              data={filteredAndSortedItems}
              itemContent={(index, it) => 
              {
                const itemNodeId = (it.data.props as AppItemProps).itemID;
                const selected = nodesSelection.itemsSelectionIds.some(
                    (id) => id === itemNodeId
                );
                if (showSelectedOnly && !selected) return null;
              return (
                  <ItemListRow
                    key={itemNodeId}
                      itemNode={it}
                      selected={selected}
                      lastSelected={
                          (nodesSelection.lastSelectedNodeData?.data.props as AppItemProps | undefined)?.itemID ===
                          itemNodeId
                      }
                      onItemClick={handleItemClick}
                  />
              )}}
          />
        </Box>
        {filteredCollectionNodes?.length > 0 && (
            <CollectionContainer>
              {filteredCollectionNodes.map((collectionNode) => (
                  <CollectionChip
                      key={collectionNode.data.id}
                      label={collectionNode.data.title}
                      onClick={() =>
                          useSelectStore.setState({ selectedTopic: collectionNode })
                      }
                  />
              ))}
            </CollectionContainer>
        )}
      </Box>
  );
};

export default FilterPanel;
