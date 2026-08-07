# WPF Demo Single-Screen Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the workstation assistant fit a single desktop viewport, with vertical scrolling limited to the checklist list.

**Architecture:** Keep the existing static HTML/JS structure and implement the change as targeted CSS layout overrides. Use viewport-bounded CSS Grid/Flex sizing, explicit `min-height:0`, and a compact-height media query rather than JavaScript resizing logic.

**Tech Stack:** HTML5, CSS3, jQuery 3.6.1

## Global Constraints
- Only `.official-check-nav` may vertically scroll in the main WPF workspace.
- `.official-diagnosis-panel`, body, window, status overview, workspace, and runtime rail must not vertically scroll.
- Preserve existing light/dark themes, localization, checklist behavior, and AI assistant behavior.
- Target desktop viewports: 1920×1080, 1600×900, 1366×768.

---

### Task 1: Rebalance the viewport layout

**Files:**
- Modify: `assets/styles.css`

**Interfaces:**
- Consumes: existing `.official-wpf-*` DOM classes.
- Produces: viewport-bounded WPF layout with a fixed title/status/runtime hierarchy.

- [ ] Add viewport-safe window dimensions and remove the 760px minimum-height constraint.
- [ ] Compact title bar, status overview, workspace gaps, and runtime rail.
- [ ] Ensure all grid/flex parents use `min-height:0` and hide vertical overflow.

### Task 2: Restrict scrolling to checklist items

**Files:**
- Modify: `assets/styles.css`

**Interfaces:**
- Consumes: `.official-checklist-panel`, `.official-check-nav`, `.official-diagnosis-panel`.
- Produces: independent checklist list scrolling while diagnosis remains static.

- [ ] Keep checklist header and summary fixed.
- [ ] Set `.official-check-nav` to `overflow-y:auto` and `overflow-x:hidden`.
- [ ] Set `.official-diagnosis-panel` to `overflow:hidden` and compact its internal cards.

### Task 3: Preserve horizontal diagnosis composition on narrower desktops

**Files:**
- Modify: `assets/styles.css`

**Interfaces:**
- Consumes: current desktop media queries.
- Produces: side-by-side reason/impact cards and three action cards at 1366px+.

- [ ] Replace the current `<1500px` stacking behavior for diagnosis and action areas.
- [ ] Add width-aware reductions for the title context and left checklist column.
- [ ] Add a compact-height mode for <=850px viewport height.

### Task 4: Verify rendering

**Files:**
- Test: `workstation-assistant.html`

**Interfaces:**
- Consumes: local static server and browser automation.
- Produces: screenshots and DOM overflow measurements for target viewports.

- [ ] Run a local static HTTP server.
- [ ] Verify 1920×1080, 1600×900, and 1366×768.
- [ ] Check document/window/diagnosis overflow and checklist overflow via DOM measurements.
- [ ] Verify checklist selection and AI launcher still work.
