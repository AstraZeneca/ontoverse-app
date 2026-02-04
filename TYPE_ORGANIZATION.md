# Type Organization

This document clarifies which types belong to which layer: DB, Domain, Graph, or Transfer Objects (DTOs).

## Type Categories

### 1. **DB Types** (Neo4j Driver Structures)
**Location**: `lib/neo4j/neo4j-types.ts`

These represent the raw structure returned by Neo4j driver:

- ✅ `LowHigh` - Neo4j integer representation `{low: number, high: number}`
- ✅ `RawNode` - Raw Neo4j node structure
- ✅ `RawRelationship` - Raw Neo4j relationship structure
- ✅ `Field` - Neo4j field structure wrapping domain properties
- ✅ `DBRecord` - Raw Neo4j record structure

**Purpose**: These are pure database layer types. They represent exactly what Neo4j driver returns.

**Dependencies**: Imports domain types (`PaperFieldProps`, `CollectionFieldProps`) to wrap them in Neo4j structures.

### 2. **Domain Types** (Business Entities)
**Location**: `lib/papers/model/domain-types.ts`

These represent the business domain entities (database-agnostic):

- ✅ `PaperFieldProps` - Properties of a Paper entity
- ✅ `CollectionFieldProps` - Properties of a Collection entity

**Purpose**: These are pure domain/business logic types. They are **database-agnostic** and use regular JavaScript types (`number`, `string`, etc.) instead of database-specific types.

**Key Design Decision**: Domain types use `number` instead of `LowHigh`. Conversion from `LowHigh` to `number` happens at the DB boundary in `dataAdapter.ts`.

**Dependencies**: None (completely independent, no circular dependencies).

### 3. **Graph Types** (Visualization/Graph Structure)
**Location**: `model/GraphDataModel.ts` (primary) and `lib/papers/model/GraphDataModel.ts` (DTOs)

These are for D3.js graph visualization and API responses:

**In `model/GraphDataModel.ts`** (D3 Visualization Types):
- `PaperNodeType` - Node for graph visualization (has x, y, color, etc.)
- `TopicNodeType` - Topic node extending PaperNodeType
- `BranchNodeByD3` - D3 hierarchy node structure
- `Edge` - Graph edge with D3 references
- `EdgeFromServer` - Edge DTO from server
- `EdgeByd3` - D3 edge structure
- `TreeNode` - Tree structure for hierarchy
- `GraphData` - Complete graph data structure for visualization
- `RichGraphData` - Enriched graph data
- `EdgeKind` - Enum for edge types
- `NodeKind` - Enum for node types

**In `lib/papers/model/GraphDataModel.ts`** (DTO Types for API):
- `PaperNodeType` - Paper node structure for API responses (no x, y coordinates)
- `TopicNodeType` - Topic node structure for API responses
- `EdgeType` - Edge structure for API responses
- `PaperNodeTypeProps` - Props for paper nodes in API responses
- `GraphData` - Graph data structure returned from `/api/papers` endpoint

**Purpose**: 
- `model/GraphDataModel.ts` - Types for D3.js visualization (used by components)
- `lib/papers/model/GraphDataModel.ts` - Types for API responses (used by `dataAdapter.ts`)

**Key Design Decision**: Both use `number` instead of `LowHigh` for IDs and numeric properties. Conversion happens at DB boundary.

### 4. **Transfer Objects (DTOs)**
**Location**: `lib/papers/model/dataAdapter.ts` and `app/api/papers/route.ts`

These are data structures for API communication:

- `GraphData` in `dataAdapter.ts` - Returned from `/api/papers` endpoint
- `EdgeFromServer` in `model/GraphDataModel.ts` - Edge data from server

**Purpose**: Lightweight objects optimized for network transfer.

## Type Flow

```
Neo4j Database
    ↓
[DB Types] RawNode, RawRelationship, LowHigh
    ↓ (conversion in dataAdapter.ts)
[Domain Types] PaperFieldProps, CollectionFieldProps (number, not LowHigh)
    ↓
[DTO Types] GraphData, PaperNodeType (for API)
    ↓
[Graph Types] BranchNodeByD3, Edge (for D3 visualization)
```

## Conversion Points

All `LowHigh` → `number` conversions happen at the **DB boundary**:

1. **`lib/papers/model/dataAdapter.ts`**:
   - `convertToPaperType()` - Converts `RawNode` to `PaperNodeType`
   - `convertToTopicType()` - Converts `RawNode` to `TopicNodeType`
   - `convertToEdgeType()` - Converts `RawRelationship` to `EdgeType`
   - Converts `item.identity.low`, `props.graphLevel.low`, etc. to `number`

2. **`lib/papers/model/HierarchyPositioning.ts`**:
   - Converts raw Neo4j structures for hierarchy building

## Key Principles

1. **Domain Types are Database-Agnostic**: Domain types use `number`, `string`, etc., not database-specific types like `LowHigh`.

2. **Conversion at Boundaries**: All database-specific type conversions happen at the DB boundary (in `dataAdapter.ts`), not throughout the codebase.

3. **Clear Separation**: 
   - **DB Layer** = Database structures (Neo4j-specific)
   - **Domain Layer** = Business logic (database-agnostic)
   - **DTO Layer** = API transfer structures
   - **Graph Layer** = Visualization structures (D3.js-specific)

4. **No Circular Dependencies**: Domain types don't import DB types. DB types can import domain types (one-way dependency).

## Files Organization

```
lib/neo4j/
  └── neo4j-types.ts          # Pure Neo4j driver types
      ├── LowHigh
      ├── RawNode
      ├── RawRelationship
      ├── Field
      └── DBRecord

lib/papers/model/
  ├── domain-types.ts         # Pure domain entities (no DB dependencies)
  │   ├── PaperFieldProps
  │   └── CollectionFieldProps
  │
  ├── GraphDataModel.ts       # DTO types for API responses
  │   ├── PaperNodeType (API)
  │   ├── TopicNodeType (API)
  │   ├── EdgeType (API)
  │   └── GraphData (API)
  │
  └── dataAdapter.ts          # Conversion layer (DB → Domain → DTO)

model/
  └── GraphDataModel.ts       # D3-specific graph types
      ├── PaperNodeType (D3)
      ├── BranchNodeByD3
      ├── Edge (D3)
      ├── TreeNode
      └── GraphData (D3)
```

## Benefits

1. **No Circular Dependencies**: Domain types are independent of DB types
2. **Clear Separation**: Each layer has clear responsibilities
3. **Type Safety**: Conversions are explicit at boundaries
4. **Maintainability**: Easy to understand which types belong where
5. **Testability**: Domain logic can be tested without database dependencies
