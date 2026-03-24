# AI Etymology Learning (Iframe Prompt Bridge)

Provides AI-powered word root and etymology analysis via the Doubao iframe sidebar with pre-crafted prompts.

## Requirements

### Requirement: Etymology Prompt Generation on Word Add

The system SHALL generate a structured Chinese-language etymology analysis prompt when a user adds a new word, and present it in the AI sidebar for the user to copy into the Doubao chat.

#### Scenario: Successful prompt generation after word add

- **WHEN** a user adds a valid English word
- **THEN** the system generates a structured prompt containing the word, its part of speech, and Chinese meaning
- **AND** the prompt requests word root/origin analysis, memory techniques, and related words
- **AND** the AI drawer opens automatically after an 800ms delay (to allow card fly-in animation)
- **AND** the prompt is displayed as a copyable card inside the AI drawer

#### Scenario: Prompt template structure

- **WHEN** a prompt is generated for a word
- **THEN** the prompt includes sections for: word root decomposition, etymology origin, memory technique, and related words sharing the same root
- **AND** the prompt is written in Chinese for optimal Doubao response quality

### Requirement: Pending Prompt Display in AI Drawer

The system SHALL display pending etymology prompts as a styled card in the AI drawer with copy-to-clipboard functionality.

#### Scenario: Prompt card appears in drawer

- **WHEN** the AI drawer opens with a pending etymology prompt
- **THEN** a prompt card is displayed above the iframe content
- **AND** the card shows a title "词根词源分析" with the prompt text
- **AND** the card includes a "复制 Prompt" button and a dismiss button

#### Scenario: User copies prompt

- **WHEN** the user clicks the "复制 Prompt" button
- **THEN** the prompt text is copied to the system clipboard
- **AND** the button shows "已复制!" success feedback for 2 seconds

#### Scenario: User dismisses prompt

- **WHEN** the user clicks the dismiss button on the prompt card
- **THEN** the prompt card is hidden
- **AND** the pending prompt state is cleared

### Requirement: AI Button Pulse Animation

The system SHALL display a pulse animation on the AI button in the app header when a new etymology prompt is available.

#### Scenario: Pulse animation triggers on word add

- **WHEN** a new word is added and an etymology prompt is generated
- **THEN** the AI button in the header displays an expanding ring pulse animation
- **AND** the animation auto-clears after 4 seconds

#### Scenario: Pulse clears when drawer is opened

- **WHEN** the user opens the AI drawer while a pulse animation is active
- **THEN** the pulse animation stops
