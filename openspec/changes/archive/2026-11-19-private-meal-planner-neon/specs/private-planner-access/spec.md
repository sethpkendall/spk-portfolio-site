# Spec Delta

## Purpose

Keep the personal meal planner accessible only to its verified owner while preserving the independent anonymous portfolio demonstration.

## ADDED Requirements

### Requirement: Verified owner access
The system SHALL authorize every private read, write, export, and deletion using a server-validated session and the configured verified owner identity. Missing configuration SHALL deny access.

#### Scenario: Anonymous or different user
- **WHEN** an anonymous visitor, an unverified user, or another authenticated account calls a private endpoint
- **THEN** the request is denied without returning or changing private data

#### Scenario: Forged ownership
- **WHEN** a caller supplies another owner identifier in request data
- **THEN** the system rejects that field and derives ownership only from the authenticated identity

### Requirement: Managed sign-in and sign-out
The owner SHALL be able to sign in using an emailed one-time code, restore a session on reload, and sign out. Loading and authentication failures SHALL be visible. Signing out SHALL remove the active private view and in-memory drafts.

#### Scenario: Successful owner session
- **WHEN** the owner completes a valid sign-in and reloads the private planner
- **THEN** the session is restored and the owner can load the same cloud data

#### Scenario: Invalid or expired session
- **WHEN** sign-in fails or a private request finds an expired session
- **THEN** a visible error or sign-in screen appears and no write is represented as saved

### Requirement: Demo and private separation
The anonymous showcase SHALL remain browser-local. The private planner SHALL start empty and SHALL NOT read, import, upload, modify, or clear the demo database. Private records SHALL NOT be persisted in browser storage or shared caches.

#### Scenario: First private visit with local meals
- **WHEN** the owner signs in from a browser with existing demo meals
- **THEN** the private plan is empty and the local demo meals remain unchanged

#### Scenario: Returning to anonymous use
- **WHEN** the owner signs out or opens the anonymous showcase
- **THEN** the private plan is absent from that view and all private API responses remain non-cacheable
