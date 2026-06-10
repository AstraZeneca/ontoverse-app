import { ItemProps, CollectionProps } from "./model/domain-types";
import {
  GraphData,
  GraphNodeType,
  CollectionNodeType,
  BranchNodeByD3,
} from "@/model/GraphDataModel";
import { createRichDataStore } from "@/model/store/richDataStore";

export type AppItemProps = ItemProps;
export type AppCollectionProps = CollectionProps;
export type AppItemNode = GraphNodeType<AppItemProps>;
export type AppCollectionNode = CollectionNodeType<AppCollectionProps>;
export type AppBranchNode = BranchNodeByD3<AppItemProps, AppCollectionProps>;
export type AppGraphData = GraphData<AppItemProps, AppCollectionProps>;

export const useRichDataStore = createRichDataStore<
  AppItemProps,
  AppCollectionProps
>();
