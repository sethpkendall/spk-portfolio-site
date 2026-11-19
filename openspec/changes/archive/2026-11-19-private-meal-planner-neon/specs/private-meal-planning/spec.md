# Spec Delta

## Purpose

Provide a reliable private meal and grocery plan shared across the owner's devices, with explicit consistency and practical control over the stored data.

## ADDED Requirements

### Requirement: Complete meal persistence
The system SHALL persist meal dates, breakfast/lunch/dinner slots, titles, instructions, normalized tags, ordered ingredients, quantities, units, and food relationships with stable identities. It SHALL support creation, editing, deletion, and prior-meal prefill.

#### Scenario: Cross-device edit
- **WHEN** the owner saves a meal on one device and refreshes another
- **THEN** the second device displays all saved meal fields and ingredient relationships

#### Scenario: Invalid meal
- **WHEN** a mutation contains an invalid date, meal type, quantity, relationship, or oversized field
- **THEN** the entire mutation is rejected without a partial change

### Requirement: Atomic week copy
The owner SHALL be able to copy a week using merge or replace. Merge SHALL preserve occupied destination slots; replace SHALL require explicit confirmation. Copied meals SHALL have new identities while retaining tags, instructions, and ingredients. The operation SHALL be atomic.

#### Scenario: Merge and replace
- **WHEN** a week is copied to an occupied destination
- **THEN** merge skips occupied slots or confirmed replace replaces destination meals, and the result reports copied and skipped counts

### Requirement: Persistent grocery state
The system SHALL aggregate ingredients by normalized food name and unit, and persist per-week checked status, quantity overrides, removed generated rows, and freeform additions/removals. Different units SHALL remain separate.

#### Scenario: Grocery continuity
- **WHEN** the owner checks an item, changes a quantity, removes a generated row, and adds a freeform item
- **THEN** refreshing another device displays the same grocery state

### Requirement: Online revision-checked writes
Private writes SHALL require connectivity and an expected plan revision. Stale writes SHALL fail without overwriting newer data. The UI SHALL preserve unsaved form values on failure and SHALL NOT automatically replay ambiguous writes or queue offline edits.

#### Scenario: Two stale devices
- **WHEN** two devices submit changes based on the same revision
- **THEN** at most one succeeds and the other receives a conflict with instructions to refresh and review

#### Scenario: Interrupted response
- **WHEN** a write response is lost or cannot be confirmed
- **THEN** the UI marks the outcome uncertain, retains the draft, and requires refresh/review before another mutation

### Requirement: Export and private-data deletion
The owner SHALL be able to export all private planner records in versioned JSON and explicitly confirm deletion of all private planner data. Deletion SHALL NOT delete the authentication account or local demo data, and SHALL invalidate stale plan revisions.

#### Scenario: Export then clear
- **WHEN** the owner exports and confirms deletion
- **THEN** the export contains meal, food, ingredient, and grocery data; the private plan becomes empty; and an older device cannot restore deleted data through a stale write

### Requirement: Operational recovery
The project SHALL document environment setup, isolated migration testing, two-device acceptance, export handling, failed-write recovery, and non-destructive deployment rollback. Unverified live checks SHALL be reported as pending.

#### Scenario: Unconfigured environment
- **WHEN** database or auth configuration is missing
- **THEN** the private planner fails closed with a setup-unavailable state while the public showcase remains usable
