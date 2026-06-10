# Type Organization

This document clarifies which types belong to which layer: DB, Domain, Graph, or Transfer Objects (DTOs).

## Type Categories

### 1. **DB Types** (Neo4j Driver Structures)
**Location**: [`lib/neo4j/neo4j-types.ts`](lib/neo4j/neo4j-types.ts)

These represent the raw structure returned by the Neo4j driver:

- `LowHigh` — Neo4j integer representation `{low: number, high: number}`
- `RawNode` — Raw Neo4j node structure
- `RawRelationship` — Raw Neo4j relationship structure
- `Field` — Neo4j field structure wrapping domain properties
- `DBRecord` — Raw Neo4j record structure

**Purpose**: Pure database layer types matching what the Neo4j driver returns.

**Note**: Raw node properties may still use legacy Neo4j field names (e.g. `similarPapers`) even though domain types use `similarItems`.

### 2. **Domain Types** (Business Entities)
**Location**: [`lib/items/model/domain-types.ts`](lib/items/model/domain-types.ts)

Database-agnostic business entities:

- `ItemProps` — Properties of an item entity (literature record)
- `CollectionProps` — Properties of a collection entity

**Key design decision**: Domain types use `number`, `string`, etc. Conversion from `LowHigh` to `number` happens at the DB boundary in `dataAdapter.ts`.

**Dependencies**: None (no circular dependencies).

### 3. **App-Bound Types** (Concrete Props Binding)
**Location**: [`lib/items/app-types.ts`](lib/items/app-types.ts)

The only place where concrete domain props are bound to generic graph types:

- `AppItemProps`, `AppCollectionProps`
- `AppItemNode`, `AppCollectionNode`, `AppBranchNode`, `AppGraphData`
- `useRichDataStore` — Zustand store typed with `AppItemProps` / `AppCollectionProps`

**Purpose**: Components and stores import from here; they do not import `domain-types.ts` directly.

### 4. **Graph Types** (Visualization / Graph Structure)
**Location**: [`model/GraphDataModel.ts`](model/GraphDataModel.ts)

Generic, database-agnostic graph structures used by D3 visualization and API responses:

- `GraphNodeType<TProps>` — Generic node (item, clone, or collection)
- `CollectionNodeType<TCollectionProps>` — Collection node
- `GraphData<TItemProps, TCollectionProps>` — Complete graph payload
- `BranchNodeByD3<TItemProps, TCollectionProps>` — D3 hierarchy node
- `Edge`, `EdgeFromServer`, `TreeNode`
- `NodeKind` — `{ Collection = 1, Item = 2, Clone = 3 }`
- `EdgeKind` — Relationship type enum (values match Neo4j rel types)
- `DB_LABEL` — Maps app kinds to Neo4j labels (`Item → "Paper"`, `Clone → "PaperClone"`)

**Purpose**: Shared graph types parameterized by props. Neo4j label strings in `DB_LABEL` and Cypher are unchanged.

### 5. **Transfer Objects (DTOs) / Conversion Layer**
**Location**: [`lib/items/model/dataAdapter.ts`](lib/items/model/dataAdapter.ts), [`app/api/items/route.ts`](app/api/items/route.ts)

- `dataAdapter()` — Converts raw Neo4j records to `GraphData<ItemProps, CollectionProps>`
- `GraphData` returned from `/api/items` endpoint

## Type Flow

```
Neo4j Database (labels: Paper, PaperClone, Collection)
    ↓
[DB Types] RawNode, RawRelationship, LowHigh
    ↓ (conversion in dataAdapter.ts)
[Domain Types] ItemProps, CollectionProps
    ↓ (binding in app-types.ts)
[App Types] AppItemNode, AppBranchNode, useRichDataStore
    ↓
[Graph Types] BranchNodeByD3, Edge (D3 visualization)
```

## Conversion Points

All `LowHigh` → `number` conversions happen at the **DB boundary**:

1. **`lib/items/model/dataAdapter.ts`**:
   - `convertToItemType()` — `RawNode` → item node
   - `convertToCloneType()` — `RawNode` → clone node
   - `convertToCollectionType()` — `RawNode` → collection node
   - Maps `similarPapers` (DB) → `similarItems` (domain)

2. **`lib/items/model/HierarchyPositioning.ts`**:
   - Builds tree layout from raw records and `GraphData`

## Key Principles

1. **Domain types are database-agnostic** — use plain JS types, not `LowHigh`.
2. **Conversion at boundaries** — DB-specific conversions only in `dataAdapter.ts`.
3. **Generic graph layer** — `model/GraphDataModel.ts` is parameterized; concrete props bound in `lib/items/app-types.ts`.
4. **Neo4j schema unchanged** — Cypher queries and `DB_LABEL` still reference `Paper` / `PaperClone` node labels.
5. **No circular dependencies** — Domain types do not import DB types.

## Files Organization

```
lib/neo4j/
  └── neo4j-types.ts              # Neo4j driver types

lib/items/
  ├── app-types.ts                # App-bound types + useRichDataStore
  └── model/
      ├── domain-types.ts         # ItemProps, CollectionProps
      ├── dataAdapter.ts          # DB → Domain → GraphData
      ├── HierarchyPositioning.ts # Tree layout
      ├── cypherQuery.ts          # Cypher (uses Paper/PaperClone labels)
      ├── Stats.ts
      └── stringUtils.ts

model/
  ├── GraphDataModel.ts           # Generic graph types
  └── store/
      └── richDataStore.ts        # Generic store factory

app/api/items/
  └── route.ts                    # GET /api/items
```
