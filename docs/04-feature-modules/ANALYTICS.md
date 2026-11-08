# Client-Side Analytics & Telemetry Sovereignty

## 1. Zero Third-Party Analytics Rule
OFFER MODE strictly enforces a **Zero Third-Party Telemetry** rule. No Google Analytics, Segment, Mixpanel, or Facebook tracking pixels exist in the codebase.

## 2. In-Memory Ring Buffer (`loggerService.ts`)
Internal telemetry is maintained locally in an in-memory 150-entry ring buffer for diagnostic auditing and security inspection.
