## Context

The current word-add animation flies a new card in from the bottom of the screen. This feels detached from the card stack — the user doesn't perceive a connection between the action (typing a word) and the result (a card appearing from nowhere). The desired UX is that the **existing top card** performs a dramatic 3D animation — lifting toward the user, spinning multiple times, then slamming back down onto the stack — transforming into the new word card with a visceral, satisfying impact.

## Goals / Non-Goals

- **Goals:**
  - Dramatic, visceral 3D "lift → spin → slam" animation with real depth (translateZ) making the card appear to fly toward the user
  - Multiple full rotations (3–4 spins) for visual spectacle
  - Satisfying "slam" landing with overshoot-bounce and impact feedback (shadow pulse / micro screen-shake)
  - Seamless data swap at the spin midpoint so the card appears to transform
  - Maintain all existing interactivity (swipe, double-click reveal, drag) after animation completes
- **Non-Goals:**
  - Changing swipe-left/swipe-right animations
  - Changing card stack layout or spacing
  - Adding elaborate card back artwork (use a simple solid/gradient during the flip)

## Decisions

### Animation Technique: CSS `@keyframes` with Multi-Axis 3D Transform

- **Decision:** Use a single CSS `@keyframes` animation combining `rotateY` (3–4 full spins), `translateY` (lift and slam), `translateZ` (depth/proximity), and `scale` (emphasis), with a custom cubic-bezier easing for the slam phase.
- **Why:** The `.card-stack-container` already has `perspective: 1000px`, so `translateZ` will create real visual depth — the card appears to fly toward the user. CSS animations are GPU-accelerated and handle multi-property transforms well. No new dependency needed.
- **Keyframe phases:**
  - **0%**: At rest (stack position)
  - **15%**: Lifted up (`translateY: -200px`), approaching user (`translateZ: 150px`), slight scale up (`scale: 1.1`)
  - **20%–65%**: Spinning (`rotateY: 0° → 1080°+`), hovering close, subtle X wobble for organic feel
  - **70%**: Still airborne, starting descent
  - **85%**: Overshoot past target (`translateY: 15px`) — the "slam" impact moment
  - **90%**: Bounce back up slightly (`translateY: -5px`)
  - **100%**: Settled at rest position
- **Alternatives considered:**
  - GSAP / Web Animations API — more control over per-phase easing but adds dependency; the 3-phase keyframe approach handles this well enough.
  - Vue `<Transition>` JS hooks — possible but mixes concerns; CSS keyframes are cleaner for this pure visual effect.
  - Spring physics (e.g., motion library) — overkill for a single animation, and CSS bounce approximation is sufficient.

### Data Swap Strategy: setTimeout at ~40% (First Edge-On Pass)

- **Decision:** Use `setTimeout` at ~40% of the animation duration to swap the word data. With 3–4 full spins starting around 20%, the first edge-on moment (rotateY ≈ 90°) occurs around 35–40%. Swapping here means the new word content is already in place for most of the visible spin duration.
- **Why:** Earlier swap (vs 50%) means the new word appears sooner, giving users more time to read the new content as the card continues spinning. The seam is hidden because the card is edge-on at this point.
- **Alternatives considered:**
  - `animationiteration` event — doesn't help for a single continuous animation.
  - Two separate animations (out + in) — more complex state management, and the user wants a continuous dramatic spin, not a pause.

### Card Back During Spin

- **Decision:** Apply `backface-visibility: hidden` on the card face, and add a simple card-back element (solid teal gradient matching the app theme) that shows when the card is rotated past 90deg.
- **Why:** Without this, the card content would appear mirrored during the spin, which looks broken.

### Slam Impact Feedback

- **Decision:** On animation completion (the slam landing), briefly apply a `box-shadow` pulse on the top card and a subtle CSS transform "shake" on the `.card-stack-container` (translateY 2-3px oscillation over ~150ms).
- **Why:** Reinforces the physical metaphor — the card "hits" the stack. Pure CSS, no JS needed.
- **Alternatives considered:**
  - Haptic feedback (navigator.vibrate) — only works on mobile, inconsistent support.
  - Particle/dust effect — too complex for the scope; save for future enhancement.

### Empty Stack Fallback

- **Decision:** When `displayWords` is empty (first word ever added), skip the spin animation and use a simple scale-up fade-in instead.
- **Why:** There's no existing card to spin — the animation concept doesn't apply.

## Risks / Trade-offs

- **Data swap timing**: If the setTimeout fires slightly early/late relative to the CSS animation, users might briefly see the old/new word during the spin. Mitigation: Tune the timing; with 3–4 spins there are multiple edge-on windows (~100-200ms each), giving ample margin.
- **Rapid additions**: If a user adds words very quickly, the spin animation might overlap. Mitigation: Block input during the spin (~1200ms total).
- **Performance**: Multi-axis 3D transform with translateZ is GPU-accelerated, but on low-end devices the multi-spin may drop frames. Mitigation: `will-change: transform` on the animating card; `prefers-reduced-motion` fallback to a simple crossfade.
- **Slam overshoot clipping**: The overshoot translateY may cause the card to overlap the card below temporarily. Mitigation: Use z-index to keep the animating card on top; the overlap is brief (~50ms) and actually reinforces the "slam" feel.

## Open Questions

- Exact animation duration: 1200ms proposed (longer to accommodate 3–4 spins + slam). Tune by feel.
- Exact spin count: 3 spins (1080°) vs 4 spins (1440°) — start with 3, increase if it feels too slow.
- Slam shake intensity: Subtle (2px) vs moderate (4-5px) — start subtle, increase if needed.
