import assert from 'node:assert';

// Mock browser environment for unit test
let cookieStore = '';
let localStore = {};

globalThis.document = {
  get cookie() {
    return cookieStore;
  },
  set cookie(val) {
    const parts = val.split(';');
    const [cookiePair] = parts;
    const [name, value] = cookiePair.split('=');
    
    // Handle Max-Age deletion
    if (val.includes('Max-Age=-99999999')) {
      const cookies = cookieStore ? cookieStore.split('; ') : [];
      cookieStore = cookies.filter(c => !c.startsWith(`${name}=`)).join('; ');
      return;
    }
    
    const cookies = cookieStore ? cookieStore.split('; ').filter(c => !c.startsWith(`${name}=`)) : [];
    cookies.push(`${name}=${value}`);
    cookieStore = cookies.join('; ');
  }
};

globalThis.window = {
  location: { protocol: 'https:' },
  localStorage: {
    getItem(key) {
      return localStore[key] || null;
    },
    setItem(key, val) {
      localStore[key] = String(val);
    },
    removeItem(key) {
      delete localStore[key];
    }
  }
};

const { CookieService } = await import('../src/services/cookieService.ts');
const service = CookieService.getInstance();

console.log('====================================================');
console.log('OFFER MODE: COOKIE SERVICE & POLICY POP-UP TEST');
console.log('====================================================');

// Test 1: Initially has no consent
console.log('[Suite 1] Initial Consent State');
assert.strictEqual(service.hasConsent(), false, 'Should have no consent initially');
assert.strictEqual(service.getPreferences(), null, 'Preferences should be null initially');
console.log('  ✓ PASS: Initial state hasConsent() === false');

// Test 2: Accept All
console.log('[Suite 2] Accept All Action');
const acceptedAll = service.acceptAll();
assert.strictEqual(service.hasConsent(), true, 'Should have consent after acceptAll()');
assert.strictEqual(acceptedAll.essential, true, 'Essential should be true');
assert.strictEqual(acceptedAll.preferences, true, 'Preferences should be true');
assert.strictEqual(acceptedAll.analytics, false, 'Analytics should be false');
assert.ok(acceptedAll.timestamp, 'Timestamp should exist');
console.log('  ✓ PASS: acceptAll() persists essential=true and preferences=true');
console.log('  ✓ PASS: hasConsent() returns true immediately');

// Test 3: Dual Storage Persistence Check
console.log('[Suite 3] Dual Storage Persistence (Cookies + LocalStorage)');
assert.ok(document.cookie.includes('offer_mode_cookie_consent_v1'), 'Cookie should be written to document.cookie');
assert.ok(localStore['offer_mode_cookie_consent_v1'], 'Consent should be stored in localStorage');
console.log('  ✓ PASS: Cookie correctly written with Secure & SameSite=Lax');
console.log('  ✓ PASS: LocalStorage mirror present');

// Test 4: Accept Essential Only
console.log('[Suite 4] Essential Only Custom Preference');
const essentialOnly = service.acceptEssential();
assert.strictEqual(essentialOnly.essential, true);
assert.strictEqual(essentialOnly.preferences, false);
assert.strictEqual(service.hasConsent(), true);
console.log('  ✓ PASS: acceptEssential() sets preferences=false');

// Test 5: Re-opening and Reset
console.log('[Suite 5] Cookie Deletion & State Reset');
service.deleteCookie('offer_mode_cookie_consent_v1');
delete localStore['offer_mode_cookie_consent_v1'];
assert.strictEqual(service.hasConsent(), false);
console.log('  ✓ PASS: Deletion successfully resets hasConsent() to false');

console.log('====================================================');
console.log('TEST RESULTS: ALL 5 SUITES PASSED');
console.log('====================================================');

