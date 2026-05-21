const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString().replace(/^﻿/, ''));
    const cmd = (input.tool_input && input.tool_input.command) || '';
    if (!cmd.includes('git commit')) return;

    const run = (command) => execSync(command, { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();

    const currentBranch = run('git branch --show-current');

    const globalSettingsPath = path.join(os.homedir(), '.github-helper', 'settings.json');
    let defaultBranch = 'main';
    try {
      const settings = JSON.parse(fs.readFileSync(globalSettingsPath, 'utf8'));
      if (settings.defaultBranch) defaultBranch = settings.defaultBranch;
    } catch {}

    const protectedBranches = new Set(['main', 'master', defaultBranch]);

    if (protectedBranches.has(currentBranch)) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          additionalContext: [
            `⚠️  WARNING: You are about to commit directly to \`${currentBranch}\`.`,
            'This is a protected branch. Consider creating a feature branch instead.',
            'If this is intentional, you may proceed — otherwise, stop and create a new branch first.'
          ].join('\n')
        }
      }));
    }
  } catch (e) {
    // silent fail — never block commits due to hook errors
  }
});
