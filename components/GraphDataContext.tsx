'use client';

import { createContext, ReactNode, useEffect, useState } from "react";
import { replaceNodeIdWithSolidData } from "@/model/replaceIdWithSolidData";
import { AppGraphData } from "@/lib/items/app-types";

export type AppData = {
  data: AppGraphData | null;
};

export const GraphDataContext = createContext<AppData>({
  data: null,
});

export const GraphDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<AppGraphData | null>(null);

  async function loadData() {
    try {
      const response = await fetch("/api/items");
      const result = await response.json();
      const graphData: AppGraphData = result.graphDataResult;

      const treeNodeWithSolidNodes = replaceNodeIdWithSolidData(
        graphData.treeNode,
        graphData.nodes,
      ) as AppGraphData["treeNode"];
      const enrichedTreeGraphData: AppGraphData = {
        ...graphData,
        treeNode: treeNodeWithSolidNodes,
      };

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
