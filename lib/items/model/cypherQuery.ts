/* Graph payload: collections, items (Paper), clones (PaperClone), and edges — Neo4j labels unchanged */
export const CYPHER_GRAPH_DATA = `
/* Step 1: Define all relevant nodes (leaf-connected items + all collections) */
CALL {
  MATCH (leaf:Collection)
  WHERE NOT (leaf)-[:PARENT_OF]->(:Collection)

  MATCH (p)
  WHERE (p:Paper OR p:PaperClone) AND (p)-[:MEMBER_OF]->(leaf)

  MATCH (c:Collection)

  RETURN collect(DISTINCT p) + collect(DISTINCT c) AS allNodes
}

UNWIND allNodes AS n
RETURN n AS result

UNION

CALL {
  MATCH (leaf:Collection)
  WHERE NOT (leaf)-[:PARENT_OF]->(:Collection)
  MATCH (p)
  WHERE (p:Paper OR p:PaperClone) AND (p)-[:MEMBER_OF]->(leaf)
  MATCH (c:Collection)
  RETURN collect(DISTINCT p) + collect(DISTINCT c) AS allNodes
}
UNWIND allNodes AS n
WITH collect(n) AS nodeSet
UNWIND nodeSet AS a
UNWIND nodeSet AS b
MATCH (a)-[r]->(b)
RETURN r AS result
`;
