# ADR-002: Local-First Privacy & Storage Architecture

**Status:** Accepted  
**Date:** November 2026  
**Deciders:** Product Architecture, Privacy & Compliance  

---

## Context
OFFER MODE stores deeply personal information: career aspirations, target compensation figures, interview transcripts, journal reflections, habits, and financial goals. Centralizing this data in external cloud databases introduces significant privacy risk, data breach exposure, and regulatory burdens.

## Decision
1. **Local-First Default:**
   - All user data remains stored on the user's local hardware by default.
   - Zero telemetry, third-party analytics scripts, or external API transmissions of user milestones or notes.

2. **Hybrid Storage Strategy:**
   - Fast lightweight settings, authentication sessions, and feature flags reside in `localStorage`.
   - Rich journal entries, notes, and file attachments transition to `IndexedDB` for high-volume storage without the 5MB browser quota ceiling.

3. **Backup & Data Sovereignty:**
   - User state can be exported as a sanitized, versioned JSON backup file (`AppBackupData`) at any time.
   - Restoration includes validation and prototype pollution defense.
   - A single-click complete data wipe is provided in Settings with double confirmation.

## Consequences
- **Positive:** Ultimate user privacy, zero cloud database infrastructure costs, full offline functionality.
- **Negative:** Users are responsible for backing up their data when switching devices or clearing browser cache.
