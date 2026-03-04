# Design System

This document describes the frontend visual system implemented in `client/src/index.css` and shared UI primitives.

---

## 1) Token Foundations

### Spacing Scale

Defined as CSS variables:

- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

### Radius Scale

- `--radius-sm`
- `--radius-md`
- `--radius-lg`
- `--radius-pill`

### Color Tokens

Primary:

- `--primary-500`
- `--primary-600`
- `--primary-100`

Semantic:

- `--success-500`
- `--warning-500`
- `--error-500`
- `--info-500`

Neutral:

- `--bg`
- `--bg-muted`
- `--surface`
- `--surface-soft`
- `--border`
- `--text`
- `--text-soft`
- `--text-muted`

---

## 2) Dark Mode System

Dark mode is token-driven, not per-component manual overrides.

Mechanism:

- `ThemeProvider` sets `data-theme` on document root.
- `:root[data-theme="dark"]` overrides color/shadow tokens.
- `ThemeToggle` flips persisted preference in localStorage (`seva_theme`).

This keeps component class names stable across themes.

---

## 3) Typography System

Base font:

- Manrope

Semantic classes:

- `.page-title`
- `.section-title`
- `.card-title`
- `.body-text`
- `.caption-text`

These enforce consistent hierarchy and readability.

---

## 4) Core Layout Primitives

- `.app-bg` - app background and text context
- `.page-shell` - max-width container with responsive padding
- `.navbar-shell` - 64px top navigation shell
- `.sidebar-shell` - left dashboard side navigation
- `.sidebar-link` - reusable nav item style

---

## 5) Surface and Card Primitives

- `.surface-card`
  - elevated card with hover transition
- `.surface-card-static`
  - stable non-hover card surface

Cards use:

- neutral background
- soft borders
- subtle shadow progression
- rounded corners

---

## 6) Button System

Base class:

- `.btn`

Variants:

- `.btn-primary`
- `.btn-secondary`
- `.btn-outline`
- `.btn-danger`
- `.btn-ghost`

Sizes:

- `.btn-sm`
- `.btn-md`
- `.btn-lg`

Features:

- hover, active press feedback
- disabled state
- focus-visible ring
- loading spinner in `Button` component

---

## 7) Form System

- `.input-label`
- `.input-field`
- `.input-field.is-error`
- `.input-hint`
- `.input-error`

Patterns:

- labels above controls
- consistent focus ring
- explicit validation states

---

## 8) Status and Feedback Components

- `.status-pill` for booking/status chips
- `Badge` maps status tone to semantic colors
- `EmptyState` shared empty-list representation
- `Spinner` for loading states
- `.skeleton` shimmering placeholders for list/card loading

---

## 9) Modal System

Classes:

- `.modal-overlay`
- `.modal-card`

Component:

- `Modal` (Framer Motion enter/exit + backdrop + lock body scroll)

Modal children compose action buttons and form controls from the same primitives.

---

## 10) Timeline Visualization

`BookingTimeline` renders:

- 4-step linear progress
  - requested
  - confirmed
  - in-progress
  - completed
- cancelled state variant

Driven by classes:

- `.timeline`
- `.timeline-step`
- `.timeline-dot`

---

## 11) Motion and Micro-Interactions

Motion stack:

- Framer Motion for route/modal/card transitions
- CSS animations for spinner, skeleton shimmer, and small fades

Interaction goals:

- restrained and purposeful
- no heavy/flashy transitions
- maintain perceived responsiveness

---

## 12) Where to Extend

Recommended extension points:

- Add new semantic tokens in `index.css`
- Add variant mappings in `Button`, `Badge`
- Add reusable primitives in `components/ui`
- Keep page components composition-focused

---

## 13) Related Docs

- [Architecture](./architecture.md)
- [Animations and Interactions](./animations-and-interactions.md)
