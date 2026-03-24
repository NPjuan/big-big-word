# Change: Update word card addition animation from fly-in to 3D lift-spin-slam

## Why

The current "fly in from bottom" animation when adding a new word feels unnatural and disconnected from the card stack interaction model. Users expect the animation to involve the existing top card rather than a new card appearing from nowhere.

## What Changes

- **Replace** the current bottom-fly-in animation with a dramatic 3D "lift → spin → slam" animation on the first (top) card
- **Phase 1 — Lift & Approach**: The top card lifts upward and moves toward the user in 3D space (`translateZ` positive), creating a sense of depth and proximity
- **Phase 2 — Multi-Spin**: The card performs 3–4 full 3D rotations (`rotateY` 1080°–1440°) while hovering close to the user, with slight X/Y wobble for dynamism
- **Phase 3 — Slam Down**: The card rapidly descends back to the stack position with an overshoot-bounce effect ("slam"), creating a satisfying impact feeling against the cards below
- At the spin midpoint (card edge-on / backside), the card data is swapped to the new word
- This creates a visceral, engaging transition that feels connected to the card stack

## Current Behavior

1. User inputs a new word → word is saved to store
2. New word is `unshift`-ed into `displayWords` with `_flyIn: true` flag
3. WordCard detects `flyIn` prop → applies `cardFlyIn` CSS animation (translateY from 400px, scale, blur)
4. After 650ms, `_flyIn` flag is cleared → card becomes interactive

## Proposed Behavior

1. User inputs a new word → word is saved to store
2. The **existing top card** (index 0) enters a 3-phase "lift → spin → slam" animation:
   - **Phase 1 (0%–20%)**: Card lifts upward (`translateY` negative) and approaches the user (`translateZ` positive ~150px), slight scale increase for depth feel
   - **Phase 2 (20%–70%)**: Card performs 3–4 full rotations (`rotateY` 1080°–1440°) while hovering close, with subtle wobble. At the midpoint (~45%), swap the card data to the new word (card is edge-on, content hidden)
   - **Phase 3 (70%–100%)**: Card rapidly slams downward to its original stack position (`translateZ` back to 0, `translateY` back to 0) with an overshoot-bounce easing — overshoots ~20px past target then bounces back, creating an impact effect
3. Brief screen shake or shadow pulse on the card stack to emphasize the "slam" impact
4. Animation completes → card is now showing the new word and is fully interactive

## Impact

- Affected specs: None currently (no existing spec for card animation; this is a new capability spec)
- Affected code:
  - `src/components/word-display/WordCard.vue` — replace `cardFlyIn` keyframes with new `cardLiftSpin` animation, update `flyIn` prop behavior
  - `src/pages/Home.vue` — change `handleWordAdded` to animate the existing top card instead of unshifting a new one; swap card data at animation midpoint
