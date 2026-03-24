## Context

The `update-card-add-animation` change introduced a 3D "lift → spin → slam" CSS animation for the word card. It had two fundamental flaws:

1. CSS `animation: ... forwards` permanently overrides inline `transform`, breaking drag after animation
2. 3D transforms (`perspective` + `translateZ` + `rotateY`) combined with `backdrop-filter: blur()` and `filter: blur()` in child elements cause massive GPU overhead

## Goals / Non-Goals

- **Goal**: Smooth 60fps animation when adding a word, with immediate drag functionality after
- **Goal**: Maintain the "exciting card transformation" feel (lift, energy, slam)
- **Non-Goal**: 3D card flip effect (explicitly removed for performance)
- **Non-Goal**: Card back face design

## Decisions

### Decision 1: Web Animations API instead of CSS `@keyframes`

**Why**: CSS `animation-fill-mode: forwards` is the root cause of the drag-breaking bug. With `forwards`, the browser keeps the last keyframe's `transform` applied permanently, which has _higher priority than inline styles_. The Web Animations API supports `fill: 'none'`, meaning once the animation finishes, it's completely removed — inline styles from `cardStyle` computed immediately regain control.

**Alternative considered**: Using CSS animation with `animation-fill-mode: none` — rejected because the card would snap back to its pre-animation position for one frame before the next paint applies inline styles. Web Animations API `.onfinish` callback allows atomic state cleanup.

### Decision 2: 2D animation instead of 3D

**Why**: `perspective` + `translateZ` + `rotateY` in a container with many child elements using `filter: blur()` and `backdrop-filter: blur()` creates excessive compositing layers. The browser must:

- Create an offscreen buffer for each blurred element
- Rasterize the entire card subtree every frame during 3D rotation
- Manage multiple compositing layers for `translateZ` depth changes

A 2D "lift → shake → slam" achieves a similar energy level without these costs:

- `translateY` and `scale` are pure compositor properties (no repaint)
- `rotate` in 2D is also compositor-only
- No per-frame rasterization of blurred children

**Alternative considered**: Keeping 3D but disabling all blur/filter during animation — partially effective but still expensive due to `translateZ` layer creation. Rejected for complexity.

### Decision 3: 900ms duration (vs. 1200ms)

Shorter duration feels snappier and reduces the window where the card is non-interactive. The 2D shake animation communicates the same energy as the 3D spin in less time.

## Risks / Trade-offs

- **Visual downgrade**: No 3D card flip means no "card back" reveal during animation. Mitigated by the energetic shake pattern which still feels dynamic.
- **Browser compatibility**: Web Animations API is supported in all modern browsers (Chrome 36+, Firefox 48+, Safari 13.1+). The project already targets modern browsers per `project.md`.

## Open Questions

None — this is a targeted bug fix + performance optimization.
