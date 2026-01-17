## ADDED Requirements

### Requirement: Word Export to CSV

The system SHALL provide functionality to export the user's word collection to CSV format.

#### Scenario: Export words to CSV

- **WHEN** user clicks the export button and selects CSV format
- **THEN** the system generates a CSV file containing all words with columns: word, phonetic, partOfSpeech, participle, meaning, createdAt
- **AND** the browser downloads the file with filename format: `words-export-YYYY-MM-DD.csv`

#### Scenario: Export empty word list to CSV

- **WHEN** user attempts to export with no words in the collection
- **THEN** the system generates a CSV file with only headers
- **AND** the browser downloads the file successfully

#### Scenario: Export words with special characters to CSV

- **WHEN** user exports words containing commas, quotes, or newlines
- **THEN** the system properly escapes special characters according to CSV RFC 4180 standard
- **AND** the exported data maintains integrity when opened in spreadsheet applications

### Requirement: Word Export to JSON

The system SHALL provide functionality to export the user's word collection to JSON format.

#### Scenario: Export words to JSON

- **WHEN** user clicks the export button and selects JSON format
- **THEN** the system generates a valid JSON file containing an array of word objects
- **AND** each word object includes all properties: word, phonetic, partOfSpeech, participle, meaning, createdAt
- **AND** the browser downloads the file with filename format: `words-export-YYYY-MM-DD.json`

#### Scenario: Export empty word list to JSON

- **WHEN** user attempts to export with no words in the collection
- **THEN** the system generates a JSON file containing an empty array `[]`
- **AND** the browser downloads the file successfully

### Requirement: Export User Interface

The system SHALL provide an intuitive user interface for initiating word exports.

#### Scenario: Display export button

- **WHEN** user views the Word Gallery page
- **THEN** an export button is visible in the card header area
- **AND** the button displays an appropriate icon (e.g., download or export icon)

#### Scenario: Show export format options

- **WHEN** user clicks the export button
- **THEN** a menu appears with options for CSV and JSON formats
- **AND** each option is clearly labeled

#### Scenario: Provide export feedback

- **WHEN** user initiates an export
- **THEN** a loading indicator appears during file generation
- **AND** a success toast notification appears after the file is downloaded
- **AND** the toast message indicates the export format and filename
