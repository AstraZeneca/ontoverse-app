# Type Organization Refactoring Summary

## Completed Actions

### 1. ✅ Fixed Circular Dependency
- **Before**: `domain-types.ts` imported `LowHigh` from `neo4j-types.ts`, and `neo4j-types.ts` imported domain types
- **After**: Domain types use `number` instead of `LowHigh`. Conversion happens at DB boundary in `dataAdapter.ts`
- **Files Changed**:
  - `lib/papers/model/domain-types.ts` - Now uses `number` for `itemID` and `graphLevel`
  - `lib/neo4j/neo4j-types.ts` - Imports domain types (one-way dependency)

### 2. ✅ Moved Raw DB Types
- **Moved**: `RawNode` and `RawRelationship` from `model/GraphDataModel.ts` to `lib/neo4j/neo4j-types.ts`
- **Files Changed**:
  - `lib/neo4j/neo4j-types.ts` - Now contains all Neo4j driver types
  - `model/GraphDataModel.ts` - Removed duplicate definitions
  - `lib/papers/model/dataAdapter.ts` - Updated to import from `neo4j-types.ts`

### 3. ✅ Consolidated Graph Types
- **Clarified Purpose**:
  - `lib/papers/model/GraphDataModel.ts` - DTO types for API responses (used by `dataAdapter.ts`)
  - `model/GraphDataModel.ts` - D3 visualization types (used by components)
- **Updated**: Both files now use `number` instead of `LowHigh` in their type definitions
- **Files Changed**:
  - `lib/papers/model/GraphDataModel.ts` - Updated `PaperNodeTypeProps` to use `number`
  - `model/GraphDataModel.ts` - Updated `PaperNodeType.props` to use `number`

### 4. ✅ Separated Concerns & Updated All Imports
- **Updated all `.low` accesses** to use direct number values:
  - `model/store/richDataStore.ts`
  - `lib/state/selectionUtils.ts`
  - `lib/state/selectionReducer.ts`
  - `components/filter/filterUtils.ts`
  - `components/filter/FilterPanel.tsx`
  - `components/graphs/hierarchy/utils/NodeRenderHelper.ts`
  - `components/graphs/hierarchy/HierarchyRenders.ts`
- **Conversion Logic**: All LowHigh → number conversions happen in `dataAdapter.ts` at the DB boundary

## Type Organization (Final Structure)

### DB Types (`lib/neo4j/neo4j-types.ts`)
Pure Neo4j driver structures:
- `LowHigh` - Neo4j integer representation
- `RawNode` - Raw Neo4j node structure
- `RawRelationship` - Raw Neo4j relationship structure
- `Field` - Neo4j field wrapper (uses domain types)
- `DBRecord` - Raw Neo4j record structure

### Domain Types (`lib/papers/model/domain-types.ts`)
Business entities (database-agnostic):
- `PaperFieldProps` - Paper entity properties (uses `number`, not `LowHigh`)
- `CollectionFieldProps` - Collection entity properties (uses `number`, not `LowHigh`)

### DTO Types (`lib/papers/model/GraphDataModel.ts`)
API response structures:
- `PaperNodeType` - Paper node for API responses
- `TopicNodeType` - Topic node for API responses
- `EdgeType` - Edge for API responses
- `GraphData` - Complete graph data structure returned from API

### Graph Types (`model/GraphDataModel.ts`)
D3.js visualization structures:
- `PaperNodeType` - Paper node with x, y coordinates for visualization
- `BranchNodeByD3` - D3 hierarchy node structure
- `Edge` - Graph edge with D3 references
- `TreeNode` - Tree structure for hierarchy
- `GraphData` - Graph data for visualization
- `EdgeKind`, `NodeKind` - Enums for graph types

## Conversion Points

All `LowHigh` → `number` conversions happen at the **DB boundary** in:
- `lib/papers/model/dataAdapter.ts` - Converts raw Neo4j records to domain/API types
- `lib/papers/model/HierarchyPositioning.ts` - Converts raw Neo4j structures for hierarchy

## Benefits

1. **No Circular Dependencies**: Domain types are independent of DB types
2. **Clear Separation**: DB, Domain, Graph, and DTO types are clearly separated
3. **Type Safety**: Conversions are explicit at boundaries
4. **Maintainability**: Each layer has clear responsibilities

