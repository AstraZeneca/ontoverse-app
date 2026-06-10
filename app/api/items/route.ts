import { NextRequest, NextResponse } from "next/server";
import { readCypher } from "@/lib/neo4j/neo4j-driver";
import { CYPHER_GRAPH_DATA } from "@/lib/items/model/cypherQuery";
import dataAdapter, { GraphData } from "@/lib/items/model/dataAdapter";
import { createHierarchyData, TreeNode } from "@/lib/items/model/HierarchyPositioning";
import { Stats } from "@/lib/items/model/Stats";
import { CollectionProps, ItemProps } from "@/lib/items/model/domain-types";

export const dynamic = "force-dynamic";

let itemsCache: GraphData<ItemProps, CollectionProps> | { graphDataResult: GraphData<ItemProps, CollectionProps> } | null = null;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const useCache = searchParams.get("useCache") !== "false";

    Stats.init(Stats.GET_ITEMS);

    if (useCache && itemsCache) {
      Stats.track(Stats.GET_ITEMS, "Cached data found! Calculating nodes positions...");
      return NextResponse.json(itemsCache);
    }

    console.log("Cached data not found! \nCalculates GraphData ... >>>");

    const rawResult = await readCypher(CYPHER_GRAPH_DATA, {});
    const graphDataResult = dataAdapter(rawResult.records);
    const treeData: TreeNode = createHierarchyData(
      rawResult.records,
      graphDataResult,
    );
    graphDataResult.treeNode = treeData;

    itemsCache = { graphDataResult };

    Stats.track(Stats.GET_ITEMS, "Calculation has been completed and cached");
    Stats.raport(Stats.GET_ITEMS);

    return NextResponse.json({ graphDataResult });
  } catch (error: unknown) {
    console.error("Error in /api/items:", error);
    const err = error as { message?: string; stack?: string };
    const errorMessage = err?.message || "Internal server error";
    const errorDetails =
      process.env.NODE_ENV === "development"
        ? { message: errorMessage, stack: err?.stack }
        : { message: errorMessage };

    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorDetails,
      },
      { status: 500 },
    );
  }
}
