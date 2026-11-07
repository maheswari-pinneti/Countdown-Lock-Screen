import { THEME_PRESETS, getCanvasDimensions } from '../src/utils/wallpaperGenerator.ts';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
    failed++;
  }
}

console.log('====================================================');
console.log('OFFER MODE: WALLPAPER STUDIO & THEMES VERIFICATION');
console.log('====================================================\n');

// 1. ALL 5 PRIMARY THEMES VERIFICATION
console.log('[Suite 1] The 5 Core Signature Wallpaper Themes');
const primaryThemes = [
  'minimal-focus',
  'dark-premium',
  'motivational-career',
  'soft-gradient',
  'clean-professional',
];

for (const themeId of primaryThemes) {
  const theme = THEME_PRESETS[themeId];
  assert(!!theme, `Theme "${themeId}" is registered in THEME_PRESETS`);
  assert(theme.name.length > 0, `Theme "${themeId}" has valid name: ${theme.name}`);
  assert(theme.bgStart.startsWith('#'), `Theme "${themeId}" has valid hex bgStart: ${theme.bgStart}`);
  assert(theme.bgEnd.startsWith('#'), `Theme "${themeId}" has valid hex bgEnd: ${theme.bgEnd}`);
  assert(theme.accent.startsWith('#'), `Theme "${themeId}" has valid accent color: ${theme.accent}`);
  assert(theme.textPrimary.startsWith('#'), `Theme "${themeId}" has valid textPrimary`);
}

// 2. ASPECT RATIO PIXEL DIMENSIONS VERIFICATION
console.log('\n[Suite 2] Smartphone Lock-Screen Aspect Ratios');
{
  const dim16 = getCanvasDimensions('9:16');
  assert(dim16.width === 1080 && dim16.height === 1920, '9:16 yields exact 1080x1920 lock-screen resolution');

  const dim19_5 = getCanvasDimensions('9:19.5');
  assert(dim19_5.width === 1080 && dim19_5.height === 2340, '9:19.5 yields exact 1080x2340 iPhone resolution');

  const dim20 = getCanvasDimensions('9:20');
  assert(dim20.width === 1080 && dim20.height === 2400, '9:20 yields exact 1080x2400 Android resolution');
}

// 3. BACKWARDS COMPATIBILITY ALIASES
console.log('\n[Suite 3] Backwards Compatibility Aliases');
{
  assert(!!THEME_PRESETS['midnight'], 'Alias "midnight" resolves correctly');
  assert(!!THEME_PRESETS['obsidian'], 'Alias "obsidian" resolves correctly');
  assert(!!THEME_PRESETS['electric'], 'Alias "electric" resolves correctly');
  assert(!!THEME_PRESETS['minimal-light'], 'Alias "minimal-light" resolves correctly');
  assert(!!THEME_PRESETS['focus'], 'Alias "focus" resolves correctly');
}

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================\n');

if (failed > 0) process.exit(1);

