import {
  ACHIEVEMENTS,
  CERTIFICATES,
  EDUCATION,
  EXPERIENCES,
  INNOVATION_ENTRIES,
  PROFILE,
  PROJECTS,
  RESEARCH_MANUSCRIPTS,
  RESEARCH_PROFILE_META,
  SKILL_CATEGORIES,
  VISUAL_ARCHIVE,
} from '../data/portfolio';
import {
  countCertificatesByCategory,
  countExperiencesByCategory,
  countExperiencesByStatus,
  countVisualArchiveByKind,
} from './portfolioFilters';

export const README_SYNC_START = '<!-- PORTFOLIO_SYNC:START -->';
export const README_SYNC_END = '<!-- PORTFOLIO_SYNC:END -->';

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\r?\n+/g, ' ').trim();
}

export function buildReadmeManagedBlock(): string {
  const expStatus = countExperiencesByStatus(EXPERIENCES);
  const expCategories = countExperiencesByCategory(EXPERIENCES);
  const certCounts = countCertificatesByCategory(CERTIFICATES);
  const verifiedCertCount = CERTIFICATES.filter(
    (c) => c.status === 'Verified Attachment',
  ).length;
  const archiveKinds = countVisualArchiveByKind(VISUAL_ARCHIVE);

  const currentRoles = EXPERIENCES.filter((e) => e.isCurrent);

  const lines: string[] = [
    README_SYNC_START,
    `# ${PROFILE.name} — Engineering, Research & Leadership Portfolio`,
    '',
    `> **${PROFILE.headline}** · ${PROFILE.academicStanding} · Session \`${PROFILE.session}\`  `,
    `> ${PROFILE.subHeadline}`,
    '',
    PROFILE.summary,
    '',
    '<!-- Auto-synced from src/data/portfolio.ts via npm run readme:sync & GitHub Actions -->',
    '',
    '## Portfolio Snapshot (Live Data)',
    '',
    '| Portfolio Dimension | Count / Scope | Source Module |',
    '| :--- | :--- | :--- |',
    `| **Engineering & Software Projects** | **${PROJECTS.length}** Featured Systems (FactoryMind, ForgeMind AI, TikaTrack) | \`src/data/projects.ts\` |`,
    `| **Research Manuscripts (Unpublished)** | **${RESEARCH_MANUSCRIPTS.length}** Active Studies (Public Benchmarks & Simulation) | \`src/data/research.ts\` |`,
    `| **Leadership & Campus Outreach** | **${expStatus.all}** Roles (**${expStatus.current}** Current · **${expCategories.executive}** Executive · **${expCategories.ambassador}** Ambassador/Lead) | \`src/data/experience.ts\` |`,
    `| **Honors & Recognitions** | **${ACHIEVEMENTS.length}** Verified Academic, Competition & Speaking Records | \`src/data/awardsAndSkills.ts\` |`,
    `| **Certificates & Verification** | **${certCounts.All}** Records (**${verifiedCertCount}** Verified Attachments) | \`src/data/awardsAndSkills.ts\` |`,
    `| **Visual Achievement Archive** | **${VISUAL_ARCHIVE.length}** Media Items (${archiveKinds.Certificate} Archive Certificates · ${archiveKinds['Official Poster']} Posters) | \`src/data/visualArchive.ts\` |`,
    `| **Innovation & Prototyping** | **${INNOVATION_ENTRIES.length}** Prototypes & Venture Tracks | \`src/data/innovation.ts\` |`,
    `| **Technical Skill Domains** | **${SKILL_CATEGORIES.length}** Structured Tracks | \`src/data/awardsAndSkills.ts\` |`,
    '',
    '---',
    '',
    '## Featured Engineering & Software Projects',
    '',
    '| Project | Stage | Problem & Technical Focus | Links |',
    '| :--- | :--- | :--- | :--- |',
  ];

  for (const project of PROJECTS) {
    const links: string[] = [];
    if (project.liveDemoUrl) {
      links.push(`[Live Demo](${project.liveDemoUrl})`);
    }
    if (project.githubUrl) {
      links.push(`[GitHub](${project.githubUrl})`);
    }
    if (links.length === 0) {
      links.push('Private Research Codebase');
    }

    lines.push(
      `| **${escapeTableCell(project.title)}** — *${escapeTableCell(project.tagline)}* | ${escapeTableCell(project.developmentStage)} | ${escapeTableCell(project.mainContribution)} | ${links.join(' · ')} |`,
    );
  }

  lines.push(
    '',
    '---',
    '',
    '## Research & Ongoing Work (Unpublished Studies)',
    '',
    RESEARCH_PROFILE_META.positioningSummary,
    '',
    `> **Academic Integrity Notice:** ${RESEARCH_PROFILE_META.integrityNotice}`,
    '',
  );

  RESEARCH_MANUSCRIPTS.forEach((study, index) => {
    lines.push(
      `### ${index + 1}. ${study.title}`,
      `- **Status:** ${study.status}`,
      `- **Working Title:** ${study.workingTitle ?? study.title}`,
      `- **Research Area:** ${study.researchArea ?? study.domain}`,
      `- **Benchmarks / Testbed:** ${study.datasetsOrBenchmarks}`,
      `- **Central Question:** ${study.centralQuestion ?? study.keyFocus}`,
      `- **Approaches & Methods:** ${study.methods.join(' · ')}`,
      '',
    );
  });

  lines.push(
    '---',
    '',
    '## Leadership, Executive Governance & Outreach',
    '',
    `Active across **${expStatus.current}** current mandates (out of **${expStatus.all}** documented roles):`,
    '',
    '| Role | Organization | Period | Category |',
    '| :--- | :--- | :--- | :--- |',
  );

  for (const exp of currentRoles) {
    lines.push(
      `| **${escapeTableCell(exp.role)}** | ${escapeTableCell(exp.organization)} | ${escapeTableCell(exp.period)} | ${escapeTableCell(exp.subCategory ?? exp.category)} |`,
    );
  }

  lines.push(
    '',
    '---',
    '',
    '## Honors, Competitions & Recognitions',
    '',
    '| Honor / Competition | Placement / Recognition | Organizer | Date |',
    '| :--- | :--- | :--- | :--- |',
  );

  for (const item of ACHIEVEMENTS) {
    lines.push(
      `| **${escapeTableCell(item.title)}** | ${escapeTableCell(item.placement)} | ${escapeTableCell(item.organization)} | ${escapeTableCell(item.year)} |`,
    );
  }

  lines.push(
    '',
    '---',
    '',
    '## Education',
    '',
    '| Institution | Program & Field | Period | Record |',
    '| :--- | :--- | :--- | :--- |',
  );

  for (const edu of EDUCATION) {
    lines.push(
      `| **${escapeTableCell(edu.institution)}** (${escapeTableCell(edu.location)}) | ${escapeTableCell(edu.degree)} — ${escapeTableCell(edu.field)} | ${escapeTableCell(edu.period)} | ${escapeTableCell(edu.grade)} |`,
    );
  }

  lines.push(
    '',
    '---',
    '',
    '## Core Technical & Engineering Capabilities',
    '',
  );

  for (const group of SKILL_CATEGORIES) {
    const names = group.items.map((item) => item.name).join(' · ');
    lines.push(`- **${group.title}** (*${group.subtitle}*): ${names}`);
  }

  lines.push(
    '',
    '---',
    '',
    '## Connect',
    '',
    `- **Email:** [${PROFILE.email}](mailto:${PROFILE.email})`,
    `- **LinkedIn:** [linkedin.com/in/md-ibtashamur-rahman-56951029a](${PROFILE.links.linkedin})`,
    `- **GitHub:** [github.com/Ibtasham](${PROFILE.links.github})`,
    `- **FactoryMind Demo / Repo:** [Live Workbench](${PROFILE.links.factoryMindDemo}) · [Source](${PROFILE.links.factoryMind})`,
    `- **ForgeMind AI Demo / Repo:** [Live Workbench](${PROFILE.links.forgeMindDemo}) · [Source](${PROFILE.links.forgeMind})`,
    `- **TikaTrack Demo / Repo:** [Live PWA](${PROFILE.links.tikaTrackDemo}) · [Source](${PROFILE.links.tikaTrack})`,
    README_SYNC_END,
  );

  return lines.join('\n');
}

export function buildFullReadmeDocument(): string {
  const managed = buildReadmeManagedBlock();

  return [
    managed,
    '',
    '---',
    '',
    '## Portfolio Architecture & Visual Theme',
    '',
    '- **Dual Theme IPE Drafting Aesthetic:**',
    '  - **Day Mode:** Warm wooden-industrial drafting table palette (`#e8dac4` / `#dfceb4` / `#f4ebe0` surfaces with deep walnut inks) layered with subtle CNC, spur gear, articulated robotic arm, roller conveyor, ball bearing, and vernier caliper CAD schematics.',
    '  - **Dark Mode:** Precision CAD blueprint workspace (`#050914` abyss canvas with cyan & cobalt linework) plus interactive 2.5D holographic portrait stage and Three.js mechanical twins (`/studio`).',
    '- **Single Source of Truth:** All portfolio pages, SEO/JSON-LD metadata, search filters, visual archive links, and this `README.md` are driven from `src/data/*`.',
    '',
    '## Local Development & Verification',
    '',
    '```bash',
    '# Install dependencies',
    'npm install',
    '',
    '# Run development server (port 3000)',
    'npm run dev',
    '',
    '# Sync README.md directly from src/data/*',
    'npm run readme:sync',
    '',
    '# Typecheck & production build',
    'npm run lint',
    'npm run build',
    '```',
    '',
    '## Automatic GitHub README Sync on Push',
    '',
    'This repository includes `.github/workflows/update-readme.yml` and `scripts/update-readme.ts`. Whenever commits are pushed to `main` or `master` (for example after adding a project, role, certificate, research update, or archive record in `src/data/`), GitHub Actions automatically verifies the data integrity tests, regenerates the synced block between `<!-- PORTFOLIO_SYNC:START -->` and `<!-- PORTFOLIO_SYNC:END -->`, and commits the updated `README.md` back to the branch while preserving any custom notes outside the sync markers.',
    '',
  ].join('\n');
}

export function syncReadmeContent(existingContent?: string): string {
  const managed = buildReadmeManagedBlock();

  if (!existingContent || existingContent.trim().length === 0) {
    return buildFullReadmeDocument();
  }

  const startIdx = existingContent.indexOf(README_SYNC_START);
  const endIdx = existingContent.indexOf(README_SYNC_END);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const before = existingContent.slice(0, startIdx);
    const after = existingContent.slice(endIdx + README_SYNC_END.length);
    return `${before}${managed}${after}`;
  }

  return buildFullReadmeDocument();
}
