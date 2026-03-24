## ADDED Requirements

### Requirement: 3D Lift-Spin-Slam Animation on Word Add

When a new word is added and the card stack is non-empty, the system SHALL animate the top card with a dramatic 3-phase "lift → spin → slam" effect:

- **Phase 1 (Lift & Approach)**: The card lifts upward and moves toward the user in 3D space (translateZ), creating a sense of proximity and depth.
- **Phase 2 (Multi-Spin)**: The card performs at least 3 full 3D rotations (≥1080° rotateY) while hovering close to the user.
- **Phase 3 (Slam Down)**: The card rapidly descends back to the stack with an overshoot-bounce (slam) effect, creating a satisfying impact.
  The word data SHALL be swapped to the new word during the spin phase when the card face is visually hidden (edge-on).

#### Scenario: Successful 3D lift-spin-slam on word add

- **WHEN** a user adds a new word and at least one card exists in the stack
- **THEN** the top card lifts upward and visually approaches the user (3D depth effect)
- **AND** the card performs at least 3 full 3D rotations (≥1080° rotateY)
- **AND** the card rapidly descends back to the stack with an overshoot-bounce "slam" effect
- **AND** the card content changes from the previous word to the newly added word during the spin phase
- **AND** after the animation completes, the card is fully interactive (swipeable, revealable)

#### Scenario: Card back is visible during spin

- **WHEN** the top card is mid-spin (rotated past 90°)
- **THEN** a styled card back (solid or gradient, not mirrored content) is displayed instead of the reversed card face

#### Scenario: Slam impact feedback

- **WHEN** the card completes the slam phase and lands on the stack
- **THEN** a brief visual impact effect is displayed (shadow pulse and/or subtle container shake)
- **AND** the impact effect lasts no more than 200ms

### Requirement: Empty Stack Fallback Animation

When a new word is added and the card stack is empty (first word), the system SHALL display the new card with a simple scale-up fade-in animation instead of the lift-and-spin effect.

#### Scenario: First word added to empty stack

- **WHEN** a user adds a word and no cards exist in the stack
- **THEN** the new card appears with a scale-up fade-in animation
- **AND** the card is fully interactive after the animation completes

### Requirement: Animation Interaction Lock

During the lift-spin-slam animation, the system SHALL prevent additional word additions and card interactions (swipe, drag) until the full animation (including slam impact feedback) completes.

#### Scenario: User attempts to add word during animation

- **WHEN** the lift-spin-slam animation is in progress
- **AND** the user attempts to add another word
- **THEN** the input is temporarily disabled until the current animation completes

#### Scenario: User attempts to swipe during animation

- **WHEN** the lift-spin-slam animation is in progress
- **AND** the user attempts to swipe or drag the top card
- **THEN** the swipe/drag is ignored until the animation completes

## REMOVED Requirements

### Requirement: Bottom Fly-In Animation

**Reason**: Replaced by the lift-and-spin animation. The fly-in from bottom behavior is no longer desired.
**Migration**: All fly-in related CSS (`cardFlyIn` keyframes, `.card-fly-in` class) and JS logic (`_flyIn` flag, `unshift` with fly-in marker) will be removed and replaced with the new animation system.
