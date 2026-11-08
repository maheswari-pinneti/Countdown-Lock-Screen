# Storage Strategy & Schema Versioning

## 1. Multi-Key Namespace
To prevent collision and permit granular serialization, OFFER MODE uses distinct, versioned storage keys:
- `offer_mode_experiences_v2`
- `offer_mode_settings_v2`
- `offer_mode_presets_v2`
- `offer_mode_habits_v2`
- `offer_mode_routines_v2`
- `offer_mode_journal_v2`
- `offer_mode_planner_v2`
- `offer_mode_notes_v2`
- `offer_mode_budget_v2`
- `offer_mode_savings_v2`
- `offer_mode_dreams_v2`
