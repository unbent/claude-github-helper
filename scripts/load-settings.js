const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const globalSettingsPath = path.join(os.homedir(), '.github-helper', 'settings.json');
const projectSettingsPath = path.join(process.cwd(), '.github-helper.json');

const defaults = {
  autoPush: 'ask',
  ghCli: null,
  defaultBranch: 'main'
};

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

const globalSettings = readJSON(globalSettingsPath);
const projectSettings = readJSON(projectSettingsPath);
const settings = { ...defaults, ...globalSettings, ...projectSettings };

if (settings.ghCli === null) {
  try {
    const output = execSync('gh --version', { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
    const version = output.match(/gh version ([\d.]+)/)?.[1] || null;
    settings.ghCli = version;
  } catch {
    settings.ghCli = false;
  }

  const dir = path.dirname(globalSettingsPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(globalSettingsPath, JSON.stringify({ ...globalSettings, ghCli: settings.ghCli }, null, 2));
}

console.log('--- GitHub Helper Settings ---');
console.log(JSON.stringify(settings, null, 2));
