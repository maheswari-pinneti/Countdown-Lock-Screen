# IndexedDB Architecture (Planned)

## 1. Current State vs. Roadmap
- **Current**: Application data fits comfortably within the 5MB `localStorage` boundary across text notes and JSON configurations.
- **Planned (Stage 9)**: Migration to `idb` (IndexedDB) for storing larger canvas blobs, high-resolution custom background images, and extensive multi-year journal archives without storage quota warnings.
