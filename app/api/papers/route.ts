import { NextRequest, NextResponse } from 'next/server';
import { readCypher } from '@/lib/neo4j/neo4j-driver';
import { CYPHER_LEAF_PAPERS } from '@/lib/papers/model/cypherQuery';
import dataAdapter, { GraphData } from '@/lib/papers/model/dataAdapter';
import { createHierarchyData, TreeNode } from '@/lib/papers/model/HierarchyPositioning';
import { Stats } from '@/lib/papers/model/Stats';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

// Cache for papers data
let papersCache: GraphData | TreeNode | {} | null = null;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const useCache = searchParams.get('useCache') !== 'false';

    Stats.init(Stats.GET_PAPERS);
    
    if (useCache && papersCache) {
      Stats.track(Stats.GET_PAPERS, 'Cached data found! Calculating nodes positions...');
      return NextResponse.json(papersCache);
    }

    console.log('Cached data not found! \nCalculates GraphData ... >>>');

    const rawResult = await readCypher(CYPHER_LEAF_PAPERS, {});
    const graphDataResult: GraphData = dataAdapter(rawResult.records);
    const treeData: TreeNode = createHierarchyData(rawResult.records, graphDataResult);
    graphDataResult.treeNode = treeData;

    papersCache = { graphDataResult };
    
    Stats.track(Stats.GET_PAPERS, 'Calculation has been completed and cached');
    Stats.raport(Stats.GET_PAPERS);

    return NextResponse.json({ graphDataResult });
  } catch (error: any) {
    console.error('Error in /api/papers:', error);
    const errorMessage = error?.message || 'Internal server error';
    const errorDetails = process.env.NODE_ENV === 'development' 
      ? { message: errorMessage, stack: error?.stack } 
      : { message: errorMessage };
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorDetails
      },
      { status: 500 }
    );
  }
}

