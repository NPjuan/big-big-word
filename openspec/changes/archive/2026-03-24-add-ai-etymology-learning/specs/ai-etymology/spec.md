## ADDED Requirements

### Requirement: AI Etymology Generation on Word Add

The system SHALL generate structured etymology data via Doubao AI API when a user adds a new word, populating the word's `Etymology` fields (roots, origin, evolution, relatedWords, mnemonic).

#### Scenario: Successful etymology generation

- **WHEN** a user adds a valid English word AND a Doubao API key is configured
- **THEN** the system calls Doubao AI with a structured prompt containing the word, its part of speech, and basic meaning
- **AND** parses the AI response into the `Etymology` data model
- **AND** saves the word with populated etymology fields
- **AND** displays a loading step "🧠 Analyzing word roots & etymology..." during generation

#### Scenario: Etymology generation failure (graceful degradation)

- **WHEN** a user adds a word AND the Doubao API call fails (timeout, rate limit, parse error)
- **THEN** the system saves the word with empty etymology fields (same as current behavior)
- **AND** does not block or fail the word addition
- **AND** logs the error for debugging

#### Scenario: No API key configured

- **WHEN** a user adds a word AND no Doubao API key is configured
- **THEN** the system skips etymology generation entirely
- **AND** saves the word with empty etymology fields
- **AND** no loading step for etymology is shown

### Requirement: Etymology Display in Word Detail

The system SHALL display AI-generated etymology data in the WordDetail page as a dedicated "Etymology & Memory" card section.

#### Scenario: Word has etymology data

- **WHEN** a user views a word's detail page AND the word has populated etymology fields
- **THEN** the system displays word roots with meaning and source language (e.g., "struct- (Latin: to build)")
- **AND** displays the word origin and evolution text
- **AND** displays the AI-generated mnemonic / memory technique
- **AND** displays related words sharing the same root as clickable tags

#### Scenario: Word has no etymology data

- **WHEN** a user views a word's detail page AND the word has empty etymology fields
- **THEN** the Etymology & Memory section is hidden or shows a "Generate" button (if API key is configured)

### Requirement: Etymology Regeneration

The system SHALL allow users to regenerate etymology data for a word from the WordDetail page.

#### Scenario: User triggers regeneration

- **WHEN** a user clicks "Regenerate Etymology" on the WordDetail page AND a Doubao API key is configured
- **THEN** the system calls Doubao AI to generate new etymology data
- **AND** updates the word's etymology fields with the new data
- **AND** shows a loading indicator during regeneration

### Requirement: API Key Configuration

The system SHALL provide a way for users to configure their Doubao API key.

#### Scenario: User sets API key

- **WHEN** a user enters a Doubao API key in the configuration UI
- **THEN** the system validates the key by making a test API call
- **AND** persists the key in localStorage
- **AND** enables etymology generation for future word additions

#### Scenario: User removes API key

- **WHEN** a user clears the Doubao API key from configuration
- **THEN** the system removes the key from localStorage
- **AND** disables etymology generation (words added without etymology)
