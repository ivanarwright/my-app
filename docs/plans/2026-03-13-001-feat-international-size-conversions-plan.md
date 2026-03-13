---
title: "feat: Add International Size Conversions to Measurements Table"
type: feat
status: completed
date: 2026-03-13
---

# feat: Add International Size Conversions to Measurements Table

## Overview

Label the existing computed sizes in the Body Measurements component as "US" and add real-time international size equivalents for UK, JP (Japan), FR (France), and IT (Italy). This is a UI-only enhancement — sizes are computed client-side from cm values, so no database schema changes are needed.

## Problem Statement / Motivation

The app currently shows US size labels (XS, S, M, L, XL, XXL) next to body measurements but doesn't identify them as US-specific. Users shopping internationally need to know their equivalent sizes in other countries' sizing systems.

## Proposed Solution

### 1. Add Size Conversion Mappings

Create a size conversion map in `measurement-converter.tsx` that maps US sizes to international equivalents:

| US Size | UK Size | JP Size | FR Size | IT Size |
|---------|---------|---------|---------|---------|
| XS      | 4-6     | 5       | 32-34   | 36-38   |
| S       | 8-10    | 7       | 36-38   | 40-42   |
| M       | 12-14   | 9-11    | 40-42   | 44-46   |
| L       | 16-18   | 13-15   | 44-46   | 48-50   |
| XL      | 20-22   | 17-19   | 48-50   | 52-54   |
| XXL     | 24-26   | 21-23   | 52-54   | 56-58   |

For height (Petite/Regular/Tall), these labels are universal and don't need country-specific conversions.

### 2. Update the UI Layout

Transform the current single badge display into a multi-column table-like layout showing all regional sizes at once. Each measurement row will show:

```
[Label] [Input cm] [= X.X in] [US: M] [UK: 12-14] [JP: 9-11] [FR: 40-42] [IT: 44-46]
```

### 3. Label Existing Sizes as "US"

Prefix the current size badge with "US:" to make it clear which sizing system is being used.

## Technical Considerations

- **No database changes** — all conversions are computed from the existing US size
- **No server action changes** — the size display is purely client-side
- **Responsive design** — the additional columns need to work on smaller screens. Consider wrapping the size badges onto a second line on mobile
- **Height row exception** — Petite/Regular/Tall are not country-specific sizing, so only show one badge for height (no country prefix needed)

## Acceptance Criteria

- [x] Current size badges in `measurement-converter.tsx` are labeled as "US"
- [x] UK, JP, FR, and IT size equivalents display next to each measurement
- [x] Height row (Petite/Regular/Tall) shows a single badge without country prefix
- [x] Size conversions update in real-time as the user types (same as current US size behavior)
- [x] Layout is readable and doesn't overflow on typical screen widths
- [x] No database migrations or schema changes are introduced

## Files to Modify

### `src/components/measurement-converter.tsx`
- Add `SIZE_CONVERSIONS` mapping object (US → UK, JP, FR, IT)
- Update `getSize()` or add `getInternationalSizes()` helper
- Update JSX to render multiple size badges per row with country labels
- Handle the height row separately (no international conversion)

## MVP

### measurement-converter.tsx — Size conversion data

```typescript
const SIZE_CONVERSIONS: Record<string, Record<string, string>> = {
  XS:  { US: "XS",  UK: "4-6",   JP: "5",    FR: "32-34", IT: "36-38" },
  S:   { US: "S",   UK: "8-10",  JP: "7",    FR: "36-38", IT: "40-42" },
  M:   { US: "M",   UK: "12-14", JP: "9-11", FR: "40-42", IT: "44-46" },
  L:   { US: "L",   UK: "16-18", JP: "13-15",FR: "44-46", IT: "48-50" },
  XL:  { US: "XL",  UK: "20-22", JP: "17-19",FR: "48-50", IT: "52-54" },
  XXL: { US: "XXL", UK: "24-26", JP: "21-23",FR: "52-54", IT: "56-58" },
};
```

### measurement-converter.tsx — Updated badge rendering

```tsx
{size && (
  <div className="flex flex-wrap gap-1">
    {name === "height" ? (
      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
        {size}
      </span>
    ) : (
      Object.entries(SIZE_CONVERSIONS[size] || {}).map(([region, regionSize]) => (
        <span key={region} className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {region}: {regionSize}
        </span>
      ))
    )}
  </div>
)}
```

## Success Metrics

- All 5 regional size labels render correctly for waist, torso, and hips
- Height row displays only one label (Petite/Regular/Tall)
- No visual regressions on the existing measurement form

## Sources

- US to international women's clothing size charts (general industry standard)
- Existing component: `src/components/measurement-converter.tsx`
