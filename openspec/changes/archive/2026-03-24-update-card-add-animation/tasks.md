## 1. Animation Design & CSS

- [x] 1.1 Replace `@keyframes cardFlyIn` in WordCard.vue with `@keyframes cardLiftSpinSlam` — 3-phase animation:
  - Phase 1 (0%–15%): lift up (`translateY: -200px`) + approach user (`translateZ: 150px`) + scale up (`1.1`)
  - Phase 2 (15%–70%): multi-spin (`rotateY: 1080°`, 3 full rotations) + subtle X wobble, hovering close to user
  - Phase 3 (70%–100%): rapid descent + overshoot bounce (`translateY: 15px → -5px → 0`) for slam impact
- [x] 1.2 Added `.card-spinning` class with `cardLiftSpinSlam` animation, duration 1200ms
- [x] 1.3 Added `will-change: transform` on the animating card via `cardStyle` computed (when `spinning` is true)
- [x] 1.4 Added slam impact effects: `@keyframes slamPulse` box-shadow pulse + `@keyframes stackShake` container shake in Home.vue
- [x] 1.5 `prefers-reduced-motion` media query preserved in both WordCard.vue and Home.vue

## 2. WordCard Component Changes

- [x] 2.1 Updated `cardStyle` computed — when `spinning` is true, set `zIndex: 999`, `willChange: transform`, `transition: none` to let CSS animation control
- [x] 2.2 Added `transform-style: preserve-3d` on `.word-card` and `.card-content` for proper 3D rotation chain
- [x] 2.3 Added `backface-visibility: hidden` on `.card-spinning .card-face`
- [x] 2.4 Added `.card-back` element (teal gradient, book icon) with `backface-visibility: hidden` and `rotateY(180deg)`, conditionally rendered when `spinning` is true
- [x] 2.5 Added `@animationend` listener on `.word-card` that emits `spin-end` event when `cardLiftSpinSlam` animation completes

## 3. Home.vue Data Swap Logic

- [x] 3.1 Changed `handleWordAdded` — for non-empty stack, sets `_spinning: true` on existing top card (index 0) instead of unshifting
- [x] 3.2 At ~40% of animation duration (~480ms via setTimeout), swaps top card data via `Object.assign` while preserving `_spinning` and `_displayKey`
- [x] 3.3 `handleSpinEnd` clears `_spinning` flag + triggers `isShaking` for container shake class
- [x] 3.4 Container shake class removed after 200ms via setTimeout
- [x] 3.5 AI etymology sidebar triggered in `handleSpinEnd` after full animation completes

## 4. Edge Cases

- [x] 4.1 Empty stack falls back to existing `cardFlyIn` animation (simple fly-in, unshift with `_flyIn` flag)
- [x] 4.2 Rapid additions blocked — `isAnimating` flag prevents new word additions during spin animation
- [x] 4.3 Spinning card z-index set to 999 in `cardStyle` to stay on top during slam overshoot
- [x] 4.4 TransitionGroup stability ensured via stable `_displayKey` on each card (not `word.id`), preventing re-mount during data swap

## 5. Cleanup

- [x] 5.1 Kept `cardFlyIn` keyframes as empty-stack fallback; added new `cardLiftSpinSlam` as the primary animation for non-empty stacks
- [x] 5.2 Updated comments: "Card Content (3D container)", fly-in section labeled as fallback

## 6. Performance Optimization (fix jank/stutter)

- [x] 6.1 Removed `box-shadow` from all keyframe steps — replaced with pseudo-element `::after` using `opacity` animation (`@keyframes shadowPulse`), which is GPU-composited and avoids per-frame repaint
- [x] 6.2 Reduced keyframe steps from 11 to 8 — let browser interpolate for smoother motion
- [x] 6.3 Added `will-change: transform` and `contain: layout style paint` on `.card-spinning` for compositor promotion
- [x] 6.4 Added `contain: layout style` on `.word-card` base class
- [x] 6.5 Changed `.card-back` from `v-if` to `v-show` — avoids DOM insertion at animation start (layout thrash)
- [x] 6.6 Disabled `backdrop-filter: blur()` on `.card-face` during spinning (expensive GPU blur during 3D rotation)
- [x] 6.7 Disabled `filter: blur(3px)` on `.blurrable-content` during spinning (reduces compositing layers)
- [x] 6.8 Switched `stackShake` keyframes to `translate3d()` for GPU compositing + added `will-change: transform`
- [x] 6.9 Added `contain: layout style paint` on `.card-back` to isolate compositing
