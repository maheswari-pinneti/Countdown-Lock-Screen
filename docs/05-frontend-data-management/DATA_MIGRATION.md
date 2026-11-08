# Data Migration & Backward Compatibility

## 1. Schema Recovery Pipeline
When loading experiences from `offer_mode_experiences_v2`, [`storageService.ts`](file:///f:/Countdown-Lock-Screen/src/services/storageService.ts#L24-L41) merges stored data with `DEFAULT_EXPERIENCES`. If a user upgrades and new milestone fields or properties are introduced, defaults are non-destructively patched into the user's stored records without erasing their custom milestones.
