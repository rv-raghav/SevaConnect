# Animations and Interactions

SevaConnect frontend uses a restrained animation strategy focused on clarity and polish.

---

## 1) Animation Stack

### Framer Motion

Dependency:

- `framer-motion`

Used for:

- route/page transitions (`PageTransitionOutlet`)
- modal enter/exit transitions (`Modal`)
- card hover lift (`CategoryCard`, `ProviderCard`)

### CSS Animations

Defined in `src/index.css`:

- spinner rotation (`spin`)
- skeleton shimmer (`shimmer`)
- fade-up transitions (`fade-up`)
- modal utility keyframes (retained for fallback consistency)

---

## 2) Route Transitions

Component:

- `src/components/ui/PageTransitionOutlet.jsx`

Pattern:

- wraps `<Outlet />` with `AnimatePresence`
- keys transition by `location.pathname`
- uses light translate + opacity transitions

Goal:

- avoid abrupt page content swaps
- keep transition subtle for productivity UX

---

## 3) Modal Motion

Component:

- `src/components/ui/Modal.jsx`

Motion behavior:

- overlay fade in/out
- modal card fade + slight scale + y-offset
- body scroll lock while modal open

Goal:

- reinforce layer separation and context focus

---

## 4) Card Interactions

Components:

- `CategoryCard`
- `ProviderCard`

Behavior:

- framer hover `y` lift
- CSS shadow/border transition from surface card class

Goal:

- tactile affordance without visual noise

---

## 5) Button Feedback

Buttons are CSS-driven:

- hover background/shadow adjustments
- active press feedback (`translateY + slight scale`)
- disabled opacity + cursor lock
- loading spinner support in `Button` component

---

## 6) Loading and Empty UX States

Loading:

- `Spinner` component (inline/full screen)
- `skeleton` placeholders for list/card loading

Empty:

- `EmptyState` component with icon/title/description/action slots

Goal:

- no blank screens
- clear status communication during async operations

---

## 7) Accessibility Considerations

Implemented:

- focus-visible outlines
- aria labels on key icon buttons (toggle, close, menu actions)
- clear hit targets for touch/mobile interactions

Future recommendation:

- add reduced-motion preference handling (`prefers-reduced-motion`) to disable non-essential transitions.

---

## 8) Interaction Philosophy

- calm and trustworthy
- fast and deliberate
- minimal cognitive overhead

Animations should support understanding, never distract from tasks.

---

## 9) Related Docs

- [Design System](./design-system.md)
- [Architecture](./architecture.md)
