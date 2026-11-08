# Google Antigravity Paired Programming Guide

## 1. Operating Instructions
When working with Google Antigravity on OFFER MODE:
1. **Always Verify First**: Before touching code, inspect existing implementations to prevent duplicating components or inventing non-existent APIs.
2. **Deterministic Test Verification**: Run `npm test` and `npm run typecheck` on every iteration.
3. **Windows Sandbox Execution**: Standard commands run in the sandbox; Git lockfile operations (`git add`, `git commit`, `git push`) require `BypassSandbox: true` on Windows to avoid `.git/index.lock` permission issues.
