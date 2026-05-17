const { execSync } = require('child_process');

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString().replace(/^﻿/, ''));
    const cmd = (input.tool_input && input.tool_input.command) || '';
    if (!cmd.includes('git commit')) return;

    const run = (command) => execSync(command, { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();

    const commitMsg = run('git log -1 --format=%s');
    const filesChanged = run('git show --stat HEAD --format=');

    let unpushed;
    try {
      unpushed = run('git log --oneline @{u}..HEAD');
    } catch {
      unpushed = run('git log --oneline');
    }

    const unpushedLines = unpushed ? unpushed.split('\n') : [];
    const shown = unpushedLines.slice(0, 5);
    const remaining = unpushedLines.length - shown.length;
    const unpushedSummary = shown.join('\n') + (remaining > 0 ? `\n...and ${remaining} more` : '');

    const context = [
      '--- Post-Commit Summary ---',
      `Commit: ${commitMsg}`,
      '',
      'Files changed:',
      filesChanged,
      '',
      'Unpushed commits:',
      unpushedLines.length ? unpushedSummary : '(none)',
      '',
      'Would you like to push?'
    ].join('\n');

    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: context
      }
    }));
  } catch (e) {
    // silent fail — don't block commits
  }
});
