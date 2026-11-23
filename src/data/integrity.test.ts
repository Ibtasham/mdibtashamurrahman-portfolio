import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  ABOUT_STORY,
  ACHIEVEMENTS,
  CERTIFICATES,
  EDUCATION,
  EXPERIENCES,
  INNOVATION_ENTRIES,
  JOURNEY_MILESTONES,
  PROFILE,
  PROJECTS,
  RESEARCH_MANUSCRIPTS,
  SKILL_CATEGORIES,
  VISUAL_ARCHIVE,
} from './portfolio';

const PUBLIC_ROOT = path.resolve(process.cwd(), 'public');
const AISTUDIO_DIR = path.join(PUBLIC_ROOT, 'assets', 'aistudio');

function toPublicDiskPath(assetUrl: string): string {
  const cleanUrl = assetUrl.split('#')[0]?.split('?')[0] ?? assetUrl;
  return path.join(PUBLIC_ROOT, cleanUrl.replace(/^\/+/, ''));
}

test('all referenced public assets exist on disk with non-zero file size', () => {
  const assetUrls = new Set<string>([
    PROFILE.profilePhoto,
    PROFILE.profileAvatar,
    PROFILE.guidePortrait,
    PROFILE.hologramPortrait,
    PROFILE.links.cvPdf,
    PROFILE.links.researchOdysseyCertificate,
    ABOUT_STORY.portrait.src,
  ]);

  for (const exp of EXPERIENCES) {
    if (exp.organizationLogoUrl) {
      assetUrls.add(exp.organizationLogoUrl);
    }
  }

  for (const cert of CERTIFICATES) {
    if (cert.fileUrl) {
      assetUrls.add(cert.fileUrl);
    }
  }

  for (const item of VISUAL_ARCHIVE) {
    assetUrls.add(item.src);
  }

  for (const url of assetUrls) {
    assert.ok(url.startsWith('/assets/'), `Expected asset path under /assets/: ${url}`);
    const fullPath = toPublicDiskPath(url);
    assert.ok(fs.existsSync(fullPath), `Missing public asset file for ${url} (${fullPath})`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 0, `Empty asset file detected for ${url}`);
  }
});

test('every file inside public/assets/aistudio is actively referenced (zero orphans)', () => {
  const filesOnDisk = fs.readdirSync(AISTUDIO_DIR);
  const referencedPaths = new Set<string>([
    PROFILE.guidePortrait,
    PROFILE.hologramPortrait,
    PROFILE.links.researchOdysseyCertificate,
    ...VISUAL_ARCHIVE.map((item) => item.src),
    ...EXPERIENCES.map((exp) => exp.organizationLogoUrl).filter((v): v is string => Boolean(v)),
    ...CERTIFICATES.map((cert) => cert.fileUrl).filter((v): v is string => Boolean(v)),
  ]);

  for (const filename of filesOnDisk) {
    const publicPath = `/assets/aistudio/${filename}`;
    assert.ok(
      referencedPaths.has(publicPath),
      `Orphan asset detected in public/assets/aistudio: ${publicPath}`,
    );
  }
});

test('all internal cross-references across portfolio modules resolve cleanly', () => {
  const expIds = new Set(EXPERIENCES.map((e) => e.id));
  const achIds = new Set(ACHIEVEMENTS.map((a) => a.id));
  const eduIds = new Set(EDUCATION.map((e) => e.id));
  const journeyIds = new Set(JOURNEY_MILESTONES.map((j) => j.id));
  const certIds = new Set(CERTIFICATES.map((c) => c.id));
  const projectIds = new Set(PROJECTS.map((p) => p.id));

  for (const item of VISUAL_ARCHIVE) {
    if (item.linkedExperienceId) {
      assert.ok(expIds.has(item.linkedExperienceId), `Missing linkedExperienceId ${item.linkedExperienceId} on ${item.id}`);
    }
    if (item.linkedAchievementId) {
      assert.ok(achIds.has(item.linkedAchievementId), `Missing linkedAchievementId ${item.linkedAchievementId} on ${item.id}`);
    }
    if (item.linkedEducationId) {
      assert.ok(eduIds.has(item.linkedEducationId), `Missing linkedEducationId ${item.linkedEducationId} on ${item.id}`);
    }
    if (item.linkedJourneyId) {
      assert.ok(
        journeyIds.has(item.linkedJourneyId),
        `Missing linkedJourneyId ${item.linkedJourneyId} on ${item.id}`,
      );
    }
    if (item.certificateId) {
      assert.ok(certIds.has(item.certificateId), `Missing certificateId ${item.certificateId} on ${item.id}`);
    }
  }

  for (const exp of EXPERIENCES) {
    if (exp.certificateId) {
      assert.ok(certIds.has(exp.certificateId), `Missing certificateId ${exp.certificateId} on ${exp.id}`);
    }
  }

  for (const ach of ACHIEVEMENTS) {
    if (ach.certificateId) {
      assert.ok(certIds.has(ach.certificateId), `Missing certificateId ${ach.certificateId} on ${ach.id}`);
    }
  }

  for (const study of RESEARCH_MANUSCRIPTS) {
    if (study.relatedProjectId) {
      assert.ok(
        projectIds.has(study.relatedProjectId),
        `Missing relatedProjectId ${study.relatedProjectId} on ${study.id}`,
      );
    }
  }

  for (const entry of INNOVATION_ENTRIES) {
    if (entry.relatedProjectId) {
      assert.ok(
        projectIds.has(entry.relatedProjectId),
        `Missing relatedProjectId ${entry.relatedProjectId} on ${entry.id}`,
      );
    }
  }

  const studyIds = new Set(RESEARCH_MANUSCRIPTS.map((s) => s.id));
  for (const group of SKILL_CATEGORIES) {
    for (const item of group.items) {
      for (const link of item.evidenceLinks ?? []) {
        assert.ok(link.to.startsWith('/'), `Skill link must be root-relative: ${link.to}`);
        if (link.to.startsWith('/projects/')) {
          const targetId = link.to.replace('/projects/', '');
          assert.ok(projectIds.has(targetId), `Missing skill project target ${targetId}`);
        } else if (link.to.startsWith('/research/')) {
          const targetId = link.to.replace('/research/', '');
          assert.ok(studyIds.has(targetId), `Missing skill study target ${targetId}`);
        } else if (link.to.startsWith('/experience/')) {
          const targetId = link.to.replace('/experience/', '');
          assert.ok(expIds.has(targetId), `Missing skill experience target ${targetId}`);
        }
      }
    }
  }
});

test('public copy stays free of internal repository file-path leaks', () => {
  const datasets = {
    PROFILE,
    ABOUT_STORY,
    PROJECTS,
    RESEARCH_MANUSCRIPTS,
    EXPERIENCES,
    ACHIEVEMENTS,
    CERTIFICATES,
    INNOVATION_ENTRIES,
  };
  const serialized = JSON.stringify(datasets);
  assert.equal(serialized.includes('src/data/'), false, 'Found src/data/ path leak in portfolio data');
  assert.equal(serialized.includes('/public/assets/'), false, 'Found /public/assets/ leak in portfolio data');
  assert.equal(serialized.includes('(Monogram placeholder)'), false, 'Found placeholder text leak');
});

test('SEO assets, sitemap routes, and SPA deployment fallbacks are complete', () => {
  const sitemapPath = path.join(PUBLIC_ROOT, 'sitemap.xml');
  const robotsPath = path.join(PUBLIC_ROOT, 'robots.txt');
  const faviconPath = path.join(PUBLIC_ROOT, 'favicon.svg');
  const redirectsPath = path.join(PUBLIC_ROOT, '_redirects');
  const vercelPath = path.resolve(process.cwd(), 'vercel.json');

  assert.ok(fs.existsSync(sitemapPath), 'Missing public/sitemap.xml');
  assert.ok(fs.existsSync(robotsPath), 'Missing public/robots.txt');
  assert.ok(fs.existsSync(faviconPath), 'Missing public/favicon.svg');
  assert.ok(fs.existsSync(redirectsPath), 'Missing public/_redirects');
  assert.ok(fs.existsSync(vercelPath), 'Missing vercel.json');

  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const staticRoutes = [
    '/',
    '/about',
    '/studio',
    '/projects',
    '/research',
    '/innovation',
    '/experience',
    '/awards',
    '/archive',
    '/skills',
    '/contact',
  ];

  for (const route of staticRoutes) {
    assert.ok(sitemap.includes(`<loc>${route}</loc>`), `Sitemap missing static route ${route}`);
  }
  for (const project of PROJECTS) {
    assert.ok(
      sitemap.includes(`<loc>/projects/${project.id}</loc>`),
      `Sitemap missing project route /projects/${project.id}`,
    );
  }
  for (const study of RESEARCH_MANUSCRIPTS) {
    assert.ok(
      sitemap.includes(`<loc>/research/${study.id}</loc>`),
      `Sitemap missing study route /research/${study.id}`,
    );
  }
  for (const exp of EXPERIENCES) {
    assert.ok(
      sitemap.includes(`<loc>/experience/${exp.id}</loc>`),
      `Sitemap missing experience route /experience/${exp.id}`,
    );
  }

  const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(
    indexHtml.includes(PROFILE.links.linkedin),
    'index.html JSON-LD sameAs missing verified LinkedIn URL from PROFILE.links',
  );
  assert.ok(
    indexHtml.includes(PROFILE.links.github),
    'index.html JSON-LD sameAs missing verified GitHub URL from PROFILE.links',
  );
  assert.ok(
    fs.existsSync(path.join(PUBLIC_ROOT, 'og-preview.jpg')),
    'Missing public/og-preview.jpg referenced by index.html OG metadata',
  );
});
