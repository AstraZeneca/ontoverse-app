import { VirtuosoHandle } from "react-virtuoso";
import { BranchNodeByD3 } from "@/model/GraphDataModel";
import { SortDirection, SortKind, SortOption } from "./SortDropdown";


export type ComparatorFunction = (a:BranchNodeByD3,b:BranchNodeByD3) => number;

export const getDecsendingComparatorBySortOption = (sortOption:SortOption): ComparatorFunction => {
  switch(sortOption.value){
    case SortKind.AuthorAsc:
    case SortKind.AuthorDesc:
      return (a:BranchNodeByD3,b:BranchNodeByD3) => String(a.data.props?.all_authors[0] ?? '').localeCompare(b.data.props?.all_authors[0] ?? '');
    case SortKind.TitleAsc:
    case SortKind.TitleDesc:
      return (a:BranchNodeByD3,b:BranchNodeByD3) => String(a.data.title ?? '').localeCompare(b.data.title ?? '');
      case SortKind.DateAsc:
    case SortKind.DateDesc:
        return (a:BranchNodeByD3,b:BranchNodeByD3) => String(a.data.year ?? '').localeCompare(b.data.year ?? '');
    default:
      return (a:BranchNodeByD3,b:BranchNodeByD3) => 0;
  }
}
export const getSortedPapers = (normalNodesData:BranchNodeByD3[], sortOption:SortOption):BranchNodeByD3[] => {
  const descSort = [...normalNodesData].sort(getDecsendingComparatorBySortOption(sortOption));

  return sortOption.direction === SortDirection.Descending ? descSort : descSort.reverse();
}

export const getFilteredPapers = (sortedPapers:BranchNodeByD3[], searchQuery:string):BranchNodeByD3[] => {
  return  sortedPapers?.filter((p) => {
    return (p).data.title?.toLowerCase().includes(searchQuery.toLowerCase())
      || (p).data.props?.all_authors?.join().toLowerCase().includes(searchQuery.toLowerCase())
      || (p).data.props?.abstract?.toLowerCase().includes(searchQuery.toLowerCase())
      || (p).data.props?.journal?.toLowerCase().includes(searchQuery.toLowerCase())
      || (p).data.props?.doi?.toLowerCase().includes(searchQuery.toLowerCase())
      || (p).data.props?.keywords?.join().toLowerCase().includes(searchQuery.toLowerCase())
      || (p).data.props?.meshTerms?.join().toLowerCase().includes(searchQuery.toLowerCase())
      || (p).data.props?.pubmedID?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      || (p).data.props?.year?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  }) as BranchNodeByD3[] || [];
}

export const scrollToSelection = (lastSelectedNodeData: BranchNodeByD3 | undefined, virtuosoListRefCurrent: VirtuosoHandle | null, filteredAndSortedPapers:BranchNodeByD3[]) => {
  const selectedCloneItemId = lastSelectedNodeData?.data.props.itemID || -1;;
  if (selectedCloneItemId !== -1 && virtuosoListRefCurrent) {
    const selectedIndex = filteredAndSortedPapers.findIndex(paper => paper.data.props.itemID === selectedCloneItemId);
  
    virtuosoListRefCurrent.scrollToIndex({
      index: selectedIndex,
      align:'center',
      behavior:'smooth',
    });
  }
};