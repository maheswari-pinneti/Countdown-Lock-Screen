# Backup Export & Restore Engine

## 1. JSON Export Protocol
Implemented in [`src/services/storageService.ts`](file:///f:/Countdown-Lock-Screen/src/services/storageService.ts#L71-L98):
- Exports complete application state into a single formatted JSON file with version tag and ISO timestamp.
- Allows seamless data transfer across browsers, devices, and operating systems without external servers.
