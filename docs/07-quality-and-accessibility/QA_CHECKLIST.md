# QA Automation & Release Checklist

Every release must verify:
- [x] `npm run typecheck` exits with 0 errors.
- [x] `npm test` passes all 7 suites (100% success).
- [x] `npm run build` generates bundle < 200 kB with zero warnings.
- [x] Passkey registration succeeds on hardware authenticators.
- [x] Web Audio plays focus soundscapes without audio clipping.
- [x] Wallpaper downloads as valid 1080p PNG image.
