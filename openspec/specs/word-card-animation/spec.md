# Capability: Word Card Animation

Defines how word cards are animated when added to the card stack.

### Requirement: Lift-Shake-Slam Animation on Word Add

When a new word is added and the card stack is non-empty, the system SHALL animate the top card with a 2D "lift → shake → slam" effect using the Web Animations API:

- **Phase 1 (Lift)**: The card lifts upward (`translateY(-120px)`) with a slight scale increase (`scale(1.06)`), creating a sense of energy.
- **Phase 2 (Shake)**: The card shakes left and right (alternating `rotate(±5°–8°)`) for 4 rapid cycles while hovering, simulating excitement/transformation.
- **Phase 3 (Slam Down)**: The card rapidly descends back to the stack with an overshoot-bounce (slam) effect (`translateY(14px) → -5px → 0`), creating a satisfying impact.
  The word data SHALL be swapped to the new word during the shake phase (~50% of animation duration).
  The animation MUST use `fill: 'none'` so that inline styles regain control after completion, preserving drag functionality.

#### Scenario: Successful lift-shake-slam on word add

- **WHEN** a user adds a new word and at least one card exists in the stack
- **THEN** the top card lifts upward with a scale increase
- **AND** the card shakes left and right rapidly for several cycles
- **AND** the card rapidly descends back to the stack with an overshoot-bounce "slam" effect
- **AND** the card content changes from the previous word to the newly added word during the shake phase
- **AND** after the animation completes, the card is fully interactive (swipeable, draggable, revealable)

#### Scenario: Card is draggable after animation

- **WHEN** the lift-shake-slam animation completes
- **THEN** the card immediately responds to drag/swipe gestures
- **AND** no residual CSS animation values override the card's inline transform

#### Scenario: Slam impact feedback

- **WHEN** the card completes the slam phase and lands on the stack
- **THEN** a brief visual impact effect is displayed (subtle container shake)
- **AND** the impact effect lasts no more than 200ms

#### Scenario: Animation performance

- **WHEN** the lift-shake-slam animation is playing
- **THEN** only compositor-friendly properties are animated (`transform`, `opacity`)
- **AND** no `box-shadow`, `filter`, or `backdrop-filter` changes occur during animation frames
- **AND** the animation runs at 60fps on modern devices

### Requirement: Empty Stack Fallback Animation

When a new word is added and the card stack is empty (first word), the system SHALL display the new card with a simple scale-up fade-in animation instead of the lift-shake-slam effect.

#### Scenario: First word added to empty stack

- **WHEN** a user adds a word and no cards exist in the stack
- **THEN** the new card appears with a scale-up fade-in animation
- **AND** the card is fully interactive after the animation completes

### Requirement: Animation Interaction Lock

During the lift-shake-slam animation, the system SHALL prevent additional word additions and card interactions (swipe, drag) until the full animation (including slam impact feedback) completes.

#### Scenario: User attempts to add word during animation

- **WHEN** the lift-shake-slam animation is in progress
- **AND** the user attempts to add another word
- **THEN** the addition is blocked until the current animation completes

#### Scenario: User attempts to swipe during animation

- **WHEN** the lift-shake-slam animation is in progress
- **AND** the user attempts to swipe or drag the top card
- **THEN** the swipe/drag is ignored until the animation completes
