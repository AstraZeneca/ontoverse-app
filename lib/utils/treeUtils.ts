import { BranchNodeByD3 } from "@/model/GraphDataModel";

export const getCloneTopicTreePath = (clone: BranchNodeByD3): string => {
  if (clone.parent?.data?.graphLevel < 1) return "";

  const nextLevelTopic = getCloneTopicTreePath(clone.parent);

  if (!nextLevelTopic) {
    return clone.parent.data?.title || "";
  }
  return nextLevelTopic + " / " + clone.parent.data?.title;
};
