import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncReadmeContent } from '../src/utils/readmeGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const README_PATH = path.join(ROOT_DIR, 'README.md');

const checkOnly = process.argv.includes('--check');

const existing = fs.existsSync(README_PATH)
  ? fs.readFileSync(README_PATH, 'utf8')
  : '';

const nextContent = syncReadmeContent(existing);

if (checkOnly) {
  if (existing !== nextContent) {
    console.error('README.md is out of sync with src/data/*. Run `npm run readme:sync`.');
    process.exit(1);
  }
  console.log('README.md is up to date with src/data/*.');
  process.exit(0);
}

if (existing === nextContent) {
  console.log('README.md already up to date.');
} else {
  fs.writeFileSync(README_PATH, nextContent, 'utf8');
  console.log('Updated README.md from src/data/*.');
}
