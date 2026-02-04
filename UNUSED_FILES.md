# Unused Files Analysis

This document lists files in the codebase that appear to be unused or not referenced.

## Definitely Unused Files

### Components
1. **`components/NodeDetailsPanels/MockNodePanel.tsx`**
   - Not imported anywhere in the codebase
   - Appears to be a mock/test component with placeholder content

2. **`components/NodeDetailsPanels/GroupingNodeDetailsPanel.tsx`**
   - Imported in `components/RightDrawer.tsx` but only used in commented-out code (lines 201-203)
   - The component itself is functional but not actively used

3. **`components/icons/ListIcon.tsx`**
   - Not imported anywhere
   - Simple SVG icon component

4. **`components/icons/l.svg`**
   - Not referenced anywhere

### Model/Data Files
5. **`lib/papers/model/RecordExamples.ts`**
   - Not imported anywhere
   - Contains example data structures (NodePaper, NodeCollection, Relationship)
   - Appears to be documentation/example code

6. **`lib/papers/model/ForceDirectedPositioning.ts`**
   - Not imported anywhere
   - Contains force-directed graph positioning logic (alternative to hierarchy positioning)
   - Currently unused in favor of HierarchyPositioning

7. **`lib/papers/model/contourLines.ts`**
   - Not imported anywhere
   - There's a different contourLines implementation in `components/graphs/contourLines/contourLines.ts` which is actually used
   - This appears to be an old/unused version

8. **`lib/papers/model/FetchedDataModel.ts`** ⚠️ **ACTUALLY USED**
   - **IMPORTED BY:** `lib/papers/model/dataAdapter.ts`, `lib/papers/model/GraphDataModel.ts`
   - Exports `LowHigh` type and other data model types
   - **Note:** Nearly identical to `model/FetchedDataModel.ts` (only difference: `authors` type)

9. **`model/FetchedDataModel.ts`** ⚠️ **ACTUALLY USED**
   - **IMPORTED BY:** `model/GraphDataModel.ts`
   - Exports `LowHigh` type and other data model types
   - **Note:** Nearly identical to `lib/papers/model/FetchedDataModel.ts` (only difference: `authors` type)
   - **Recommendation:** These two files could potentially be consolidated into one, but both are currently used

### Static Files
10. **`public/index.html`**
    - Not used by Next.js (Next.js generates HTML automatically)
    - This appears to be a leftover from a React app migration
    - Contains references to `%PUBLIC_URL%` which is Create React App syntax

## Files That May Be Used Indirectly

These files might be used but are harder to detect:

- **`lib/papers/model/stringUtils.ts`** - Used in `dataAdapter.ts`
- **`lib/utils/srtingUtils.ts`** - Used in multiple components (note: typo in filename "srting" instead of "string")
- **`model/Stats.ts`** - Used in `GraphGridLayout.ts`
- **`lib/papers/model/Stats.ts`** - Used in API route and other model files

## Recommendations

1. **Safe to Remove:**
   - MockNodePanel.tsx
   - RecordExamples.ts
   - lib/papers/model/contourLines.ts (duplicate)
   - ListIcon.tsx
   - components/icons/l.svg
   - public/index.html

2. **Review Before Removing:**
   - GroupingNodeDetailsPanel.tsx (might be needed for future features)
   - ForceDirectedPositioning.ts (might be an alternative algorithm to keep)

3. **Consider Fixing:**
   - `lib/utils/srtingUtils.ts` - Typo in filename (should be "stringUtils.ts")

