export const CYPHER_LEAF_PAPERS = `
/* Step 1: Define all relevant nodes (leaf-connected Papers + all Collections) */
CALL {
  /* Find all leaf Collections */
  MATCH (leaf:Collection)
  WHERE NOT (leaf)-[:PARENT_OF]->(:Collection)

  /* Get all Paper/PaperClone children connected to leaf Collections */
  MATCH (p)
  WHERE (p:Paper OR p:PaperClone) AND (p)-[:MEMBER_OF]->(leaf)

  /* Get all Collections (leaf and non-leaf) */
  MATCH (c:Collection)

  /* Return all relevant nodes */
  RETURN collect(DISTINCT p) + collect(DISTINCT c) AS allNodes
}

/* Step 2: Return all nodes as 'result' */
UNWIND allNodes AS n
RETURN n AS result

UNION

/* Step 3: Return only relationships where both ends are among the nodes above */
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