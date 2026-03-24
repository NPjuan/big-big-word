## 1. Replace CSS animation with Web Animations API

- [x] 1.1 Remove `card-spinning` CSS class and all related `.card-spinning` selectors from WordCard.vue `<style>`
- [x] 1.2 Remove `@keyframes cardLiftSpinSlam`, `@keyframes shadowPulse` from WordCard.vue
- [x] 1.3 Remove `.card-back`, `.card-back-inner`, `.card-back-logo` CSS rules from WordCard.vue
- [x] 1.4 Remove `transform-style: preserve-3d` from `.word-card` and `.card-content` in WordCard.vue
- [x] 1.5 Add `playSpinAnimation()` function using `el.animate()` with `fill: 'none'`, emitting `spin-end` via `.onfinish`
- [x] 1.6 Add `watch` on `spinning` prop to trigger `playSpinAnimation()` when set to true
- [x] 1.7 Add `isPlayingSpinAnim` local ref to block drag during JS-driven animation

## 2. Remove 3D elements from template

- [x] 2.1 Remove `.card-back` element (v-show/v-if div with card-back-inner and SVG logo) from WordCard.vue template
- [x] 2.2 Remove `card-spinning` from the `:class` binding on `.word-card`
- [x] 2.3 Replace `@animationend="handleAnimationEnd"` with `ref="cardEl"` for Web Animations API access

## 3. Update cardStyle computed for new animation

- [x] 3.1 Update the spinning branch in `cardStyle` to no longer set `willChange: 'transform'` (Web Animations API handles this)
- [x] 3.2 Use `isPlayingSpinAnim` in the spinning guard to prevent drag during animation

## 4. Remove 3D container properties from Home.vue

- [x] 4.1 Remove `perspective: 1000px` and `transform-style: preserve-3d` from `.card-stack-container`
- [x] 4.2 Adjust data swap timing from 480ms to 450ms to match new 900ms animation duration

## 5. Define 2D animation keyframes

- [x] 5.1 The Web Animations API keyframes should follow this sequence:
  - 0%: resting (`translateY(0) scale(1)`)
  - 15%: lift (`translateY(-120px) scale(1.06)`)
  - 22%–46%: shake left/right (alternating `rotate(±5°–8°)`) — 4 shake cycles
  - 55%: center pause (`rotate(0)`)
  - 72%: start falling
  - 85%: slam overshoot (`translateY(14px)`)
  - 93%: bounce back (`translateY(-5px)`)
  - 100%: settle (`translateY(0)`)
- [x] 5.2 Total duration: 900ms, easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- [x] 5.3 `fill: 'none'` — critical for drag to work after animation

## 6. Validation

- [x] 6.1 Verify card is draggable immediately after animation ends — `fill: 'none'` ensures no residual transform override; `isPlayingSpinAnim` cleared in `onfinish`
- [x] 6.2 Verify animation runs at 60fps — only compositor-friendly properties (`transform`) used; no box-shadow/filter/backdrop-filter in animation
- [x] 6.3 Verify data swap occurs mid-animation — `setTimeout` at 450ms (~50% of 900ms) in `handleWordAdded`
- [x] 6.4 Verify empty-stack fly-in fallback still works — `card-fly-in` CSS animation preserved
- [x] 6.5 Verify `prefers-reduced-motion` still respected — JS check added via `window.matchMedia('(prefers-reduced-motion: reduce)')` in `playSpinAnimation`
