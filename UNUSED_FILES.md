# Unused Files Analysis

This document lists files in the codebase that appear to be unused or not referenced.

Last updated after the Paper → Item refactor (June 2026).

## Removed in Recent Cleanup

These files were deleted because they had zero code references:

- `lib/items/model/_res.json` — orphaned Neo4j response dump (~72k lines)
- `model/__mock__/newDB.json` — orphaned mock data
- `REFACTORING_SUMMARY.md` — superseded by this doc and `TYPE_ORGANIZATION.md`

## Previously Listed — No Longer Present

The following were listed in earlier audits but have already been removed from the repo:

- `components/NodeDetailsPanels/MockNodePanel.tsx`
- `components/NodeDetailsPanels/GroupingNodeDetailsPanel.tsx`
- `components/icons/ListIcon.tsx`, `components/icons/l.svg`
- `lib/papers/model/RecordExamples.ts`
- `lib/papers/model/ForceDirectedPositioning.ts`
- `lib/papers/model/contourLines.ts`
- `lib/papers/model/FetchedDataModel.ts`, `model/FetchedDataModel.ts`
- `public/index.html`

## Currently Used (lib/items)

- `lib/items/model/stringUtils.ts` — used in `dataAdapter.ts`
- `lib/items/model/Stats.ts` — used in API route and graph layout
- `lib/utils/srtingUtils.ts` — used in filter/export (note: typo in filename)
- `model/Stats.ts` — used in `GraphGridLayout.ts`

## Recommendations

1. **Consider fixing**: `lib/utils/srtingUtils.ts` — rename to `stringUtils.ts` (requires updating imports).
2. **Keep an eye on**: commented-out code in components — prefer deletion over accumulation.
