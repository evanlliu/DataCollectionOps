# WPF Demo Single-Screen Layout Design

## Goal
Keep the workstation assistant within one viewport with no vertical page/diagnosis scrolling. Only the checklist item list may scroll vertically.

## Layout
- Window remains viewport-bounded and hides overflow.
- Title bar, status overview, workspace, and runtime rail are fixed within the viewport grid.
- Checklist panel uses a three-row grid: fixed header, scrollable checklist list, fixed summary.
- Diagnosis panel must not scroll; its content is compacted to fit in the remaining workspace height.
- Reason/impact cards remain side-by-side and recommended actions remain three columns down to 1366px desktop width.
- Compact height mode targets 1366×768 and 1600×900 without hiding core content.

## UI adjustments
- Reduce excessive padding, card heights, and title sizes.
- Keep key hierarchy: health state first, metrics second, diagnosis third, actions fourth.
- Retain light/dark themes and existing behavior without changing JavaScript data flow.
- AI assistant stays floating and is not part of the main layout height calculation.

## Acceptance criteria
- At 1920×1080, 1600×900, and 1366×768: body/window/diagnosis panel have no vertical scroll.
- Checklist list can scroll independently when its items exceed available height.
- Runtime rail remains visible.
- Diagnosis reason + impact remain horizontal; action steps remain three columns.
