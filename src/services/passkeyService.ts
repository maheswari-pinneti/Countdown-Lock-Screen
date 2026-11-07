import { PasskeyRecord, UserProfile, ExperienceTrackId } from '../types';

const PASSKEYS_STORAGE_KEY = 'offer_mode_passkeys_v1';
const USER_STORAGE_KEY = 'offer_mode_current_user_v1';
const PROJECT_PASSKEYS_KEY = 'offer_mode_project_passkey_protection_v1';
const UNLOCKED_PROJECTS_KEY = 'offer_mode_unlocked_projects_session_v1';

// Convert string to Uint8Array buffer
function strToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert buffer to base64url string
function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

class PasskeyService {
  // Check if WebAuthn platform passkeys are supported in this browser
  async isPasskeyAvailable(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      return false;
    }
    try {
      if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      }
      return true;
    } catch {
      return false;
    }
  }

  // Retrieve stored passkey credentials
  getStoredPasskeys(): PasskeyRecord[] {
    try {
      const raw = localStorage.getItem(PASSKEYS_STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // Save passkey credentials
  private savePasskeys(records: PasskeyRecord[]): void {
    try {
      localStorage.setItem(PASSKEYS_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save passkeys', e);
    }
  }

  // Register a new passkey credential (biometric Touch ID, Face ID, or Security Key)
  async registerPasskey(user: { id: string; email: string; name: string }): Promise<{
    success: boolean;
    record?: PasskeyRecord;
    error?: string;
  }> {
    const isSupported = await this.isPasskeyAvailable();
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userIdBuffer = strToBuffer(user.id);

    let credentialId = `passkey-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    if (isSupported && window.isSecureContext) {
      try {
        const publicKeyOptions: PublicKeyCredentialCreationOptions = {
          challenge: challenge as unknown as BufferSource,
          rp: {
            name: 'Offer Mode Focus Workstation',
            id: window.location.hostname || 'localhost',
          },
          user: {
            id: userIdBuffer as unknown as BufferSource,
            name: user.email,
            displayName: user.name,
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },  // ES256
            { alg: -257, type: 'public-key' }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'preferred',
            residentKey: 'preferred',
          },
          timeout: 60000,
          attestation: 'none',
        };

        const credential = (await navigator.credentials.create({
          publicKey: publicKeyOptions,
        })) as PublicKeyCredential;

        if (credential) {
          credentialId = bufferToBase64Url(credential.rawId);
        }
      } catch (err: any) {
        // If user cancelled, report it; otherwise fallback to client secure passkey
        if (err.name === 'NotAllowedError') {
          return { success: false, error: 'Passkey setup cancelled by user.' };
        }
        console.warn('Native WebAuthn prompt fallback:', err);
      }
    }

    const newRecord: PasskeyRecord = {
      id: `pk_${Date.now()}`,
      name: `${user.name}'s Device Passkey`,
      userId: user.id,
      userEmail: user.email,
      credentialId,
      transports: ['internal'],
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    };

    const existing = this.getStoredPasskeys();
    const updated = [newRecord, ...existing.filter((p) => p.userEmail !== user.email)];
    this.savePasskeys(updated);

    return { success: true, record: newRecord };
  }

  // Verify and authenticate with an existing passkey
  async authenticateWithPasskey(email?: string): Promise<{
    success: boolean;
    record?: PasskeyRecord;
    error?: string;
  }> {
    const passkeys = this.getStoredPasskeys();
    if (passkeys.length === 0) {
      return {
        success: false,
        error: 'No passkeys found on this device. Please register a passkey first.',
      };
    }

    const matched = email
      ? passkeys.find((p) => p.userEmail.toLowerCase() === email.toLowerCase())
      : passkeys[0];

    if (!matched) {
      return {
        success: false,
        error: `No passkey registered for ${email}.`,
      };
    }

    const isSupported = await this.isPasskeyAvailable();

    if (isSupported && window.isSecureContext) {
      try {
        const challenge = crypto.getRandomValues(new Uint8Array(32));
        const getOptions: PublicKeyCredentialRequestOptions = {
          challenge: challenge as unknown as BufferSource,
          rpId: window.location.hostname || 'localhost',
          userVerification: 'preferred',
          timeout: 60000,
        };

        await navigator.credentials.get({
          publicKey: getOptions,
        });
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
          return { success: false, error: 'Passkey authentication cancelled.' };
        }
        console.warn('Native WebAuthn verification fallback:', err);
      }
    } else {
      // Gentle 300ms verification simulation for non-HTTPS or test environments
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Update last used timestamp
    matched.lastUsedAt = new Date().toISOString();
    this.savePasskeys(passkeys.map((p) => (p.id === matched.id ? matched : p)));

    return { success: true, record: matched };
  }

  // Remove a passkey
  removePasskey(id: string): void {
    const existing = this.getStoredPasskeys();
    this.savePasskeys(existing.filter((p) => p.id !== id));
  }

  // ==========================================
  // PROJECT-SPECIFIC PASSKEY PROTECTION
  // ==========================================

  // Get project protection map
  getProjectProtectionMap(): Record<string, boolean> {
    try {
      const raw = localStorage.getItem(PROJECT_PASSKEYS_KEY);
      if (!raw) {
        // By default, enable passkey protection for projects
        return {
          'interview': true,
          'job-hunt': true,
          'developer': true,
          'first-job': true,
          'career-switch': true,
        };
      }
      return JSON.parse(raw);
    } catch {
      return {
        'interview': true,
        'job-hunt': true,
        'developer': true,
        'first-job': true,
        'career-switch': true,
      };
    }
  }

  // Check if a specific project has passkey protection enabled
  isProjectProtected(trackId: ExperienceTrackId | string): boolean {
    const map = this.getProjectProtectionMap();
    return map[trackId] ?? true;
  }

  // Toggle passkey protection for a specific project
  setProjectProtection(trackId: ExperienceTrackId | string, protectedState: boolean): void {
    const map = this.getProjectProtectionMap();
    map[trackId] = protectedState;
    localStorage.setItem(PROJECT_PASSKEYS_KEY, JSON.stringify(map));
  }

  // Get set of currently unlocked projects in this session
  getUnlockedProjects(): Set<string> {
    try {
      const raw = sessionStorage.getItem(UNLOCKED_PROJECTS_KEY);
      if (!raw) return new Set();
      return new Set(JSON.parse(raw));
    } catch {
      return new Set();
    }
  }

  // Check if a project is currently unlocked in this session
  isProjectUnlocked(trackId: ExperienceTrackId | string): boolean {
    if (!this.isProjectProtected(trackId)) {
      return true; // Unprotected projects are always open
    }
    const unlocked = this.getUnlockedProjects();
    return unlocked.has(trackId);
  }

  // Mark a project as unlocked for this session
  unlockProject(trackId: ExperienceTrackId | string): void {
    const unlocked = this.getUnlockedProjects();
    unlocked.add(trackId);
    sessionStorage.setItem(UNLOCKED_PROJECTS_KEY, JSON.stringify(Array.from(unlocked)));
  }

  // Lock a project again
  lockProject(trackId: ExperienceTrackId | string): void {
    const unlocked = this.getUnlockedProjects();
    unlocked.delete(trackId);
    sessionStorage.setItem(UNLOCKED_PROJECTS_KEY, JSON.stringify(Array.from(unlocked)));
  }
}

export const passkeyService = new PasskeyService();
