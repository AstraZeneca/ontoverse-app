'use client';

import { createContext, ReactNode, useEffect, useState } from "react";
import { GraphData, TreeNode } from "@/model/GraphDataModel";
import { replaceNodeIdWithSolidData } from "@/model/replaceIdWithSolidData";

export type AppData = {
  data: GraphData | null,
}

export const GraphDataContext = createContext<AppData>({
  data: null,
});

export const GraphDataProvider = ({
  children,
}: {
  children: ReactNode,
}) => {
  const [data, setData] = useState<GraphData | null>(null);

  async function loadData() {
    try {
      const response = await fetch('/api/papers');
      const result = await response.json();
      const graphData: GraphData = result.graphDataResult;
      
      const treeNodeWithSolidNodes = replaceNodeIdWithSolidData(graphData.treeNode, graphData.nodes) as TreeNode;
      const enrichedTreeGraphData: GraphData = { ...graphData, treeNode: treeNodeWithSolidNodes };
      
      setData(enrichedTreeGraphData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <GraphDataContext.Provider value={{ data }}>
      {children}
    </GraphDataContext.Provider>
  );
};
