/**
 * Automated GitHub Pull Request, Issue & Review Sync Tool
 * 
 * Usage:
 *   node scratch/github-api-sync.mjs <GITHUB_TOKEN>
 * 
 * Or set environment variable:
 *   $env:GITHUB_TOKEN="ghp_yourTokenHere"
 *   node scratch/github-api-sync.mjs
 */

const REPO_OWNER = 'maheswari-pinneti';
const REPO_NAME = 'Countdown-Lock-Screen';
const TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.log(`
=======================================================
GITHUB SYNC HELPER: TOKEN REQUIRED
=======================================================
To create Pull Requests, Issues, and Reviews on GitHub:

1. Generate a Personal Access Token (PAT) with 'repo' scope at:
   https://github.com/settings/tokens

2. Run this command in PowerShell:
   $env:GITHUB_TOKEN="your_personal_access_token_here"
   node scratch/github-api-sync.mjs
=======================================================
  `);
  process.exit(0);
}

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Accept': 'application/vnd.github+json',
  'User-Agent': 'Offer-Mode-Agent',
};

async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}${endpoint}`;
  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, options);
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function runSync() {
  console.log(`Connecting to GitHub repository: ${REPO_OWNER}/${REPO_NAME}...`);

  // 1. Create Issues
  const issues = [
    {
      title: '[Feature] WebAuthn Biometric Passkey Integration and Workstation Access Control',
      body: 'Integrate browser WebAuthn API (Touch ID, Face ID, Windows Hello) and per-project passkey locks.',
      labels: ['enhancement', 'security', 'auth']
    },
    {
      title: '[Feature] Guided Step-by-Step Onboarding and Sequential Workflow Navigation',
      body: 'Implement 4-stage sequential workflow on the main dashboard (Tracks, Milestones, Passkeys, Lock Screen).',
      labels: ['enhancement', 'ux', 'dashboard']
    },
    {
      title: '[Enhancement] Sound Engine Audio Feedback and Local Storage Session Persistence',
      body: 'Web Audio API chimes for milestone completion and versioned localStorage state synchronization.',
      labels: ['enhancement', 'audio', 'storage']
    },
    {
      title: '[Security] Client-side Session Encryption and Passkey Fallback Handling',
      body: 'Graceful fallback simulation for non-secure contexts and session-scoped project unlock tokens.',
      labels: ['security', 'passkeys', 'auth']
    }
  ];

  for (const issue of issues) {
    console.log(`Creating Issue: "${issue.title}"...`);
    const res = await apiRequest('/issues', 'POST', issue);
    if (res.ok) {
      console.log(`  ✓ Created Issue #${res.data.number}: ${res.data.html_url}`);
    } else {
      console.warn(`  ✗ Failed (${res.status}): ${res.data.message || JSON.stringify(res.data)}`);
    }
  }

  // 2. Create Pull Requests
  const pullRequests = [
    {
      title: 'feat: Biometric Passkey Authentication & WebAuthn Project Security',
      head: 'feature/passkey-auth-security',
      base: 'main',
      body: 'Implements WebAuthn biometric passkey authentication, login, signup, and per-project security locks.'
    },
    {
      title: 'feat: Step-by-Step Guided Dashboard & Protected Router Flow',
      head: 'feature/step-by-step-dashboard',
      base: 'main',
      body: 'Implements 4-stage sequential dashboard workflow, guided stepper, and protected route shell.'
    },
    {
      title: 'feat: 5 Dedicated Career Countdown Tracks & Workstations',
      head: 'feature/interview-countdown',
      base: 'main',
      body: 'Implements dedicated career tracks, milestone roadmaps, and synchronized live countdown timers.'
    }
  ];

  for (const pr of pullRequests) {
    console.log(`Creating Pull Request: "${pr.title}" (${pr.head} -> ${pr.base})...`);
    const res = await apiRequest('/pulls', 'POST', pr);
    if (res.ok) {
      console.log(`  ✓ Created PR #${res.data.number}: ${res.data.html_url}`);
    } else {
      console.warn(`  ✗ Note (${res.status}): ${res.data.message || JSON.stringify(res.data)}`);
    }
  }

  console.log('\nGitHub sync process completed.');
}

runSync().catch(console.error);

