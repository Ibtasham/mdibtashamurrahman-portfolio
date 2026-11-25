import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ACHIEVEMENTS,
  CERTIFICATES,
  EXPERIENCES,
  PROJECTS,
  RESEARCH_MANUSCRIPTS,
  RESEARCH_PROFILE_META,
  VISUAL_ARCHIVE,
} from '../data/portfolio';
import {
  buildFullReadmeDocument,
  buildReadmeManagedBlock,
  README_SYNC_END,
  README_SYNC_START,
  syncReadmeContent,
} from './readmeGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

test('README managed block reflects accurate portfolio counts and highlights', () => {
  const block = buildReadmeManagedBlock();

  assert.ok(block.includes(README_SYNC_START));
  assert.ok(block.includes(README_SYNC_END));
  assert.ok(block.includes(`**${PROJECTS.length}** Featured Systems`));
  assert.ok(block.includes(`**${RESEARCH_MANUSCRIPTS.length}** Active Studies`));
  assert.ok(block.includes(`**${EXPERIENCES.length}** Roles`));
  assert.ok(block.includes(`**${ACHIEVEMENTS.length}** Verified Academic`));
  assert.ok(block.includes(`**${CERTIFICATES.length}** Records`));
  assert.ok(block.includes(`**${VISUAL_ARCHIVE.length}** Media Items`));

  for (const project of PROJECTS) {
    assert.ok(block.includes(project.title), `Missing project ${project.title}`);
  }
  for (const study of RESEARCH_MANUSCRIPTS) {
    assert.ok(block.includes(study.title), `Missing research study ${study.title}`);
  }
  assert.ok(block.includes('https://forge-mind-ai-wheat.vercel.app/?subset=FD002&model=gradient_boosting'));
  assert.ok(block.includes('https://github.com/ibta10/ForgeMind-Ai'));
  assert.ok(block.includes('Linked Community Bangladesh'));
  assert.ok(block.includes('Unilever Sparks'));
});

test('README enforces research confidentiality and avoids fabricated numbers', () => {
  const block = buildReadmeManagedBlock();
  assert.ok(block.includes(RESEARCH_PROFILE_META.integrityNotice));
  assert.ok(!block.includes('RMSE ='));
  assert.ok(!block.includes('MAE ='));
});

test('syncReadmeContent preserves custom sections outside sync markers and is idempotent', () => {
  const customHeader = '# Custom Intro Note\n\nKeep me intact.\n\n';
  const customFooter = '\n\n## Custom Footer\n\nPreserved across pushes.\n';
  const seeded = `${customHeader}${README_SYNC_START}\nstale\n${README_SYNC_END}${customFooter}`;

  const synced = syncReadmeContent(seeded);
  assert.ok(synced.startsWith(customHeader));
  assert.ok(synced.endsWith(customFooter));
  assert.ok(!synced.includes('\nstale\n'));
  assert.equal(syncReadmeContent(synced), synced);

  const fresh = buildFullReadmeDocument();
  assert.equal(syncReadmeContent(fresh), fresh);
});

test('on-disk README.md stays synchronized with src/data/*', () => {
  const readmePath = path.join(ROOT_DIR, 'README.md');
  assert.ok(fs.existsSync(readmePath), 'README.md must exist at repository root');
  const onDisk = fs.readFileSync(readmePath, 'utf8');
  assert.equal(
    syncReadmeContent(onDisk),
    onDisk,
    'README.md drifted from src/data/*; run `npm run readme:sync`.',
  );
});
