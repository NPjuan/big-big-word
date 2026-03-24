# Change: Fix card animation performance and restore drag after animation

## Why

The 3D lift-spin-slam animation introduced in `update-card-add-animation` has two critical issues:

1. **Animation is janky/stuttering** — 3D transforms (`translateZ`, `rotateY`) inside a `perspective` container, combined with `backdrop-filter: blur()`, `filter: blur()`, and `box-shadow` changes in keyframes, cause heavy GPU compositing and per-frame repaints.
2. **Card becomes non-draggable after animation** — CSS `animation-fill-mode: forwards` keeps the final keyframe value (`rotateY(1080deg)`) permanently applied, which overrides the inline `transform` set by drag logic in `cardStyle`, making the card unresponsive to drag.

## What Changes

- **Replace CSS `@keyframes` animation with Web Animations API** — JS-controlled animation uses `fill: 'none'`, so after the animation finishes, inline styles immediately regain control. No residual transform override.
- **Replace 3D transforms with 2D transforms** — Drop `translateZ`, `rotateY`, `perspective`, and `transform-style: preserve-3d`. Use a 2D "lift → shake → slam" animation instead: card lifts up, shakes side-to-side (simulating energy/excitement), then slams back down with a bounce overshoot.
- **Remove card-back element** — No longer needed since there's no 3D rotation showing the back face.
- **Remove all `box-shadow` from keyframes** — Shadow effects were a major repaint source; entirely removed from animation path.
- **Remove `backdrop-filter`/`filter` overrides** — No longer needed since 3D rotation is eliminated.

## Current Behavior (Broken)

1. User adds a word → top card enters CSS `animation: cardLiftSpinSlam 1.2s forwards`
2. Card rotates in 3D with `rotateY(1080deg)` → heavy GPU load, stuttering
3. Animation ends → `forwards` fill-mode permanently applies `rotateY(1080deg)` to the element
4. User tries to drag → `cardStyle` computed sets `translate(...)` inline, but CSS animation `forwards` has higher specificity → **drag visually broken**

## Proposed Behavior

1. User adds a word → JS calls `el.animate(keyframes, { fill: 'none', duration: 900 })` on the top card
2. Card lifts up (-120px), shakes left/right (±8°), then slams down with bounce overshoot (+14px → -5px → 0)
3. Mid-animation (~450ms), card data is swapped to the new word
4. Animation `.onfinish` fires → emits `spin-end` → clears flags → **inline `cardStyle` immediately resumes control**
5. User can drag the card normally — no residual transform override

## Impact

- Affected specs: `word-card-animation` (modifies existing spec from `update-card-add-animation`)
- Affected code:
  - `src/components/word-display/WordCard.vue` — replace CSS animation with Web Animations API, remove `.card-back`, remove `.card-spinning` CSS, remove `@keyframes cardLiftSpinSlam`
  - `src/pages/Home.vue` — remove `perspective`/`transform-style: preserve-3d` from container, adjust data swap timing (480ms → 450ms)
