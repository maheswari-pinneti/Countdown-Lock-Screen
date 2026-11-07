# OFFER MODE — Local Storage & Persistence Specification

## 1. Storage Architecture

OFFER MODE is built on a **Local-First, Privacy-Preserving** persistence layer (`src/services/storageService.ts` and `src/utils/storage.ts`).

### Guarantees
- **100% Client-Side**: No user data, goals, notes, or compensation figures are sent to any remote server.
- **Fail-Safe Fallbacks**: Malformed or unparseable JSON values automatically fall back to default configurations without throwing unhandled runtime exceptions.
- **Data Versioning**: Uses explicit storage keys (`_v2`) to prevent collisions with legacy schemas.

---

## 2. Storage Schema & Keys

| Key | Description | Type |
| :--- | :--- | :--- |
| `offer_mode_experiences_v2` | Array of 5 active career experiences and milestones | `CareerExperience[]` |
| `offer_mode_settings_v2` | Global application settings (theme, time format, sound volume) | `AppSettings` |
| `offer_mode_presets_v2` | User-saved custom wallpaper design presets | `CountdownDesignPreset[]` |
| `offer_mode_notif_log_v2` | History log of dispatched web notifications | `NotificationLogEntry[]` |
| `offer_mode_seen_reminders_v2`| Deduplication cache of already triggered reminder IDs | `string[]` |

---

## 3. Backup, Export & Import

Users can export and restore their entire workspace via **Settings → Workspace Data**:

```json
{
  "version": "2.0.0",
  "exportDate": "2026-11-06T12:00:00.000Z",
  "experiences": [ ... ],
  "settings": { ... },
  "presets": [ ... ]
}
```

- **Export**: Downloads a formatted `.json` backup file.
- **Import**: Validates data structure before updating reactive state, ensuring no missing fields break the UI.
- **Factory Reset**: Resets all data to clean factory defaults with double-confirmation dialogs.

