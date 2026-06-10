import { VirtuosoHandle } from "react-virtuoso";
import { BranchNodeByD3 } from "@/model/GraphDataModel";
import { SortDirection, SortKind, SortOption } from "./SortDropdown";

type ItemLikeProps = {
  all_authors?: string[];
  abstract?: string;
  journal?: string;
  doi?: string;
  keywords?: string[];
  meshTerms?: string[];
  pubmedID?: number;
  year?: number;
  itemID?: number;
};

export type ComparatorFunction = (
  a: BranchNodeByD3<unknown, unknown>,
  b: BranchNodeByD3<unknown, unknown>,
) => number;

export const getDecsendingComparatorBySortOption = (
  sortOption: SortOption,
): ComparatorFunction => {
  switch (sortOption.value) {
    case SortKind.AuthorAsc:
    case SortKind.AuthorDesc:
      return (a, b) =>
        String((a.data.props as ItemLikeProps)?.all_authors?.[0] ?? "").localeCompare(
          String((b.data.props as ItemLikeProps)?.all_authors?.[0] ?? ""),
        );
    case SortKind.TitleAsc:
    case SortKind.TitleDesc:
      return (a, b) =>
        String(a.data.title ?? "").localeCompare(String(b.data.title ?? ""));
    case SortKind.DateAsc:
    case SortKind.DateDesc:
      return (a, b) =>
        String(a.data.year ?? "").localeCompare(String(b.data.year ?? ""));
    default:
      return () => 0;
  }
};

export const getSortedItems = (
  normalNodesData: BranchNodeByD3<unknown, unknown>[],
  sortOption: SortOption,
): BranchNodeByD3<unknown, unknown>[] => {
  const descSort = [...normalNodesData].sort(
    getDecsendingComparatorBySortOption(sortOption),
  );

  return sortOption.direction === SortDirection.Descending
    ? descSort
    : descSort.reverse();
};

export const getFilteredItems = (
  sortedItems: BranchNodeByD3<unknown, unknown>[],
  searchQuery: string,
): BranchNodeByD3<unknown, unknown>[] => {
  return (
    sortedItems?.filter((p) => {
      const props = p.data.props as ItemLikeProps;
      return (
        p.data.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        props?.all_authors?.join().toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(props?.abstract ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(props?.journal ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(props?.doi ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        props?.keywords?.join().toLowerCase().includes(searchQuery.toLowerCase()) ||
        props?.meshTerms?.join().toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(props?.pubmedID ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(props?.year ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }) || []
  );
};

export const scrollToSelection = (
  lastSelectedNodeData: BranchNodeByD3<unknown, unknown> | undefined,
  virtuosoListRefCurrent: VirtuosoHandle | null,
  filteredAndSortedItems: BranchNodeByD3<unknown, unknown>[],
) => {
  const props = lastSelectedNodeData?.data.props as ItemLikeProps | undefined;
  const selectedCloneItemId = props?.itemID || -1;
  if (selectedCloneItemId !== -1 && virtuosoListRefCurrent) {
    const selectedIndex = filteredAndSortedItems.findIndex(
      (item) => (item.data.props as ItemLikeProps).itemID === selectedCloneItemId,
    );

    virtuosoListRefCurrent.scrollToIndex({
      index: selectedIndex,
      align: "center",
      behavior: "smooth",
    });
  }
};
