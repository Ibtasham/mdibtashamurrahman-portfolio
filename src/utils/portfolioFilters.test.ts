import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ABOUT_STORY,
  ACADEMIC_INTERESTS,
  ACHIEVEMENTS,
  CERTIFICATES,
  EDUCATION,
  EXPERIENCES,
  FUTURE_ASPIRATIONS,
  FUTURE_INNOVATION_PLANS,
  INNOVATION_COMPETITIONS,
  INNOVATION_ENTRIES,
  INNOVATION_PROFILE_META,
  INNOVATION_TIMELINE,
  JOURNEY_MILESTONES,
  PROBLEM_SOLVING_FRAMEWORK,
  PROFILE,
  PROJECTS,
  RESEARCH_DATASETS,
  RESEARCH_EXPERIMENTS,
  RESEARCH_MANUSCRIPTS,
  RESEARCH_NOTES,
  RESEARCH_PROFILE_META,
  RESEARCH_PUBLISHED_RECORDS,
  SKILL_CATEGORIES,
  TEAM_COLLABORATION_HIGHLIGHTS,
  VISUAL_ARCHIVE,
} from '../data/portfolio';
import {
  buildMailtoHref,
  buildManuscriptBibTeX,
  countAchievementsByCategory,
  countCertificatesByCategory,
  countExperiencesByCategory,
  countExperiencesByStatus,
  countInnovationByStage,
  countJourneyByCategory,
  countProjectsByCategory,
  countResearchExperimentsByStage,
  countVisualArchiveByCategory,
  countVisualArchiveByKind,
  filterAchievements,
  filterCertificates,
  filterEducationEntries,
  filterExperiences,
  filterInnovationEntries,
  filterInnovationTimeline,
  filterJourneyMilestones,
  filterProjects,
  filterProjectsByCategory,
  filterResearchByDomain,
  filterResearchExperiments,
  filterSkillCategories,
  filterVisualArchive,
  getExperienceNavigation,
  getHomepageArchiveHighlights,
  getLeadershipEntries,
  getProjectLinkedExperiments,
  getProjectLinkedStudies,
  getProjectNavigation,
  getResearchNavigation,
  getVisualArchiveForAchievement,
  getVisualArchiveForEducation,
  getVisualArchiveForExperience,
  getVisualArchiveForJourney,
  groupExperiencesByDimension,
  groupVisualArchiveByEvent,
  summarizeProjectMaturity,
  summarizeResearchPortfolio,
  validateContactForm,
  VISUAL_ARCHIVE_CATEGORIES,
} from './portfolioFilters';
import { HOME_SECTION_IDS, mapSectionIdToNavRoute } from '../hooks/useActiveSection';

test('countExperiencesByCategory totals and 6-dimension grouping stay consistent', () => {
  const counts = countExperiencesByCategory(EXPERIENCES);
  assert.equal(counts.all, EXPERIENCES.length);
  assert.equal(
    counts.executive + counts.ambassador + counts.events_volunteering,
    counts.all,
  );
  assert.equal(counts.ambassador, 17);
  assert.equal(counts.event_organization, 3);
  assert.equal(counts.volunteering, 1);

  assert.equal(filterExperiences(EXPERIENCES, 'event_organization').length, 3);
  assert.equal(filterExperiences(EXPERIENCES, 'volunteering').length, 1);

  const grouped = groupExperiencesByDimension(EXPERIENCES);
  assert.equal(grouped.currentPositions.length + grouped.formerPositions.length, EXPERIENCES.length);
  assert.equal(grouped.executiveCommittee.length, 7);
  assert.equal(grouped.campusAmbassador.length, 17);
  assert.equal(grouped.eventOrganization.length, 3);
  assert.equal(grouped.volunteering.length, 1);

  for (const exp of EXPERIENCES) {
    assert.ok(exp.responsibility.length > 15);
    assert.ok(exp.actualContribution.length > 15);
  }
});

test('filterExperiences filters by category, current status, and search query', () => {
  const currentAmbassadors = filterExperiences(EXPERIENCES, 'ambassador', 'current');
  assert.ok(currentAmbassadors.length > 0);
  assert.ok(currentAmbassadors.every((e) => e.category === 'ambassador' && e.isCurrent));

  const formerRoles = filterExperiences(EXPERIENCES, 'all', 'former');
  assert.ok(formerRoles.every((e) => !e.isCurrent));

  const odyssey = filterExperiences(EXPERIENCES, 'all', 'all', 'Research Odyssey');
  assert.equal(odyssey.length, 1);
  assert.equal(odyssey[0]?.id, 'research-odyssey-2');

  const linkedCommunity = filterExperiences(EXPERIENCES, 'ambassador', 'current', 'Linked Community');
  assert.equal(linkedCommunity.length, 1);
  assert.equal(linkedCommunity[0]?.role, 'Campus Lead');
  assert.equal(linkedCommunity[0]?.period, 'Nov 2026 – Present');

  const unilever = filterExperiences(EXPERIENCES, 'ambassador', 'former', 'Unilever Sparks');
  assert.equal(unilever.length, 1);
  assert.ok(unilever[0]?.role.includes('Top 3 Candidate'));
});

test('status counts, leadership ordering, certificates, and detail navigation are consistent', () => {
  const statusCounts = countExperiencesByStatus(EXPERIENCES);
  assert.equal(statusCounts.current + statusCounts.former, statusCounts.all);

  const leadership = getLeadershipEntries(EXPERIENCES);
  assert.equal(leadership.length, 7);
  // First 5 executive roles are current, last 2 (Noakhali 2nd EC & NDEC) are former
  assert.ok(leadership.slice(0, 5).every((entry) => entry.isCurrent));
  assert.ok(leadership.slice(5).every((entry) => !entry.isCurrent));

  const nav = getExperienceNavigation(EXPERIENCES, 'research-odyssey-2');
  assert.equal(nav.entry?.id, 'research-odyssey-2');
  assert.ok(nav.previous);
  assert.ok(nav.next);
  assert.equal(getExperienceNavigation(EXPERIENCES, 'missing-role').entry, null);

  assert.equal(PROFILE.profilePhoto, '/assets/portrait-card.webp');
  assert.equal(PROFILE.profileAvatar, '/assets/portrait-avatar.webp');
  assert.ok(!ABOUT_STORY.portrait.context.toLowerCase().includes('speak up'));
  const verifiedCert = CERTIFICATES.find((c) => c.status === 'Verified Attachment');
  assert.ok(verifiedCert?.fileUrl);
});

test('journey filtering and counts are consistent with milestone dataset', () => {
  const counts = countJourneyByCategory(JOURNEY_MILESTONES);
  assert.equal(counts.All, JOURNEY_MILESTONES.length);
  assert.equal(
    counts['Academic Foundation'] +
      counts['Engineering & Research'] +
      counts['Competitions & Voice'] +
      counts['Leadership & Outreach'],
    counts.All,
  );

  const eng = filterJourneyMilestones(JOURNEY_MILESTONES, 'Engineering & Research');
  assert.equal(eng.length, 1);
  assert.equal(eng[0]?.id, 'm-factorymind-research');
});

test('about profile, academic interests, and future aspirations stay populated', () => {
  assert.equal(ABOUT_STORY.portrait.src, '/assets/portrait-card.webp');
  assert.ok(ABOUT_STORY.biographyParagraphs.length >= 3);
  assert.equal(ACADEMIC_INTERESTS.length, 3);
  assert.equal(
    ACADEMIC_INTERESTS.some((item) => item.id === 'ai-scheduling'),
    false,
  );
  assert.equal(FUTURE_ASPIRATIONS.length, 3);
});

test('filterAchievements returns expected subsets including Recognition & Volunteering', () => {
  assert.equal(filterAchievements(ACHIEVEMENTS, 'All').length, ACHIEVEMENTS.length);
  const speaking = filterAchievements(ACHIEVEMENTS, 'Public Speaking');
  assert.equal(speaking.length, 1);
  assert.equal(speaking[0]?.id, 'ach-speakup');

  const volunteering = filterAchievements(ACHIEVEMENTS, 'Recognition & Volunteering');
  assert.equal(volunteering.length, 3);

  const academicAwards = filterAchievements(ACHIEVEMENTS, 'Academic');
  assert.equal(academicAwards.length, 3);
  assert.ok(academicAwards.some((a) => a.id === 'ach-ndc-attendance'));
  assert.ok(academicAwards.some((a) => a.id === 'ach-iqac-obe'));

  const counts = countAchievementsByCategory(ACHIEVEMENTS);
  assert.equal(
    counts.Competition + counts.Academic + counts['Public Speaking'] + counts['Recognition & Volunteering'],
    counts.All,
  );

  const unileverAward = ACHIEVEMENTS.find((a) => a.id === 'ach-unilever-sparks');
  assert.ok(unileverAward);
  assert.equal(unileverAward.placement, 'Top 3 Candidate (Whole SUST)');
  assert.equal(unileverAward.category, 'Competition');
});

test('filterResearchByDomain returns exact manuscript matches and brief-grounded completeness', () => {
  assert.equal(filterResearchByDomain(RESEARCH_MANUSCRIPTS, 'All').length, 3);
  const inventory = filterResearchByDomain(
    RESEARCH_MANUSCRIPTS,
    'Inventory & Operations Research',
  );
  assert.equal(inventory.length, 1);
  assert.equal(inventory[0]?.id, 'decision-centric-demand');

  for (const study of RESEARCH_MANUSCRIPTS) {
    assert.equal(study.status, 'Unpublished Research');
    assert.ok(study.motivation.length > 20);
    assert.ok(study.expectedContribution.length > 20);
    assert.ok((study.researchQuestions?.length ?? 0) >= 1);
    assert.ok((study.methodologySteps?.length ?? 0) >= 4);
    assert.ok((study.contributionAreas?.length ?? 0) >= 3);
    assert.ok((study.limitations?.length ?? 0) >= 2);
    assert.ok((study.futureDirections?.length ?? 0) >= 2);
  }

  const portfolioSummary = summarizeResearchPortfolio(
    RESEARCH_MANUSCRIPTS,
    RESEARCH_EXPERIMENTS,
    RESEARCH_PUBLISHED_RECORDS.length,
  );
  assert.equal(portfolioSummary.totals.manuscriptsInPrep, 3);
  assert.equal(portfolioSummary.totals.publishedResearch, 0);
  assert.equal(portfolioSummary.totals.completedExperiments, 3);
  assert.equal(portfolioSummary.totals.ongoingExperiments, 2);
  assert.equal(portfolioSummary.totals.proposedExperiments, 3);
  assert.equal(portfolioSummary.studyRows.length, 3);
});

test('validateContactForm rejects empty or invalid inputs and accepts complete inquiries', () => {
  const invalid = validateContactForm({
    name: '',
    email: 'not-an-email',
    subject: 'Hi',
    message: 'short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.subject);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm({
    name: 'Arefin Rahman',
    email: 'arefin@example.com',
    subject: 'Research Collaboration Inquiry',
    message: 'Interested in collaborating on carbon-aware scheduling benchmarks.',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('buildMailtoHref encodes subject and sender details cleanly', () => {
  const href = buildMailtoHref('ibtarahman@gmail.com', {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Hello SUST',
    message: 'Testing mailto link generation.',
  });
  assert.ok(href.startsWith('mailto:ibtarahman@gmail.com?subject=Hello%20SUST&body='));
  assert.ok(href.includes('Test%20User'));
});

test('skill categories use 6 grounded tracks, no numeric proficiency scores, and evidence search', () => {
  assert.equal(SKILL_CATEGORIES.length, 6);
  assert.deepEqual(
    SKILL_CATEGORIES.map((c) => c.id),
    [
      'industrial-engineering',
      'programming-software',
      'data-ml',
      'operations-research',
      'research-methods',
      'communication-leadership',
    ],
  );

  const pythonResults = filterSkillCategories(SKILL_CATEGORIES, 'all', 'Python');
  assert.equal(pythonResults.length, 1);
  assert.equal(pythonResults[0]?.id, 'programming-software');
  assert.equal(pythonResults[0]?.items[0]?.name, 'Python Engineering Pipelines');
  assert.equal(pythonResults[0]?.items[0]?.proficiency, undefined);

  const workshop = filterSkillCategories(SKILL_CATEGORIES, 'industrial-engineering', 'Workshop');
  assert.equal(workshop[0]?.items[0]?.proficiency, 'Basic coursework exposure');

  const orToolsSearch = filterSkillCategories(SKILL_CATEGORIES, 'all', 'OR-Tools');
  assert.equal(orToolsSearch[0]?.id, 'operations-research');

  for (const group of SKILL_CATEGORIES) {
    for (const item of group.items) {
      assert.ok((item.evidenceLinks?.length ?? 0) >= 1, `Expected evidence links on ${item.name}`);
      if (item.proficiency) {
        assert.equal(/\d+%|\d+\/\d+/.test(item.proficiency), false, 'Numeric score found in proficiency');
      }
    }
  }
});

test('certificate gallery counts and filters by category, status, and query', () => {
  const counts = countCertificatesByCategory(CERTIFICATES);
  assert.equal(counts.All, CERTIFICATES.length);
  assert.equal(
    counts['Experience & Outreach'] +
      counts.Competition +
      counts.Volunteering +
      counts.Academic,
    counts.All,
  );

  const verified = filterCertificates(CERTIFICATES, 'All', 'verified');
  assert.equal(verified.length, 8);
  assert.ok(verified.some((c) => c.id === 'cert-research-odyssey'));
  assert.ok(verified.some((c) => c.id === 'cert-speakup-2026'));
  assert.ok(verified.some((c) => c.id === 'cert-innovesta-3'));
  assert.ok(verified.some((c) => c.id === 'cert-showcase-1'));
  assert.ok(verified.some((c) => c.id === 'cert-init-volunteer'));
  assert.ok(verified.some((c) => c.id === 'cert-createx-2'));
  assert.ok(verified.some((c) => c.id === 'cert-ndc-attendance' && c.rotateDeg === 270));
  assert.ok(verified.some((c) => c.id === 'cert-iqac-obe'));

  const austSearch = filterCertificates(CERTIFICATES, 'All', 'all', 'AUSTRPC');
  assert.equal(austSearch.length, 1);
  assert.equal(austSearch[0]?.organizationCode, 'AUSTRPC');
});

test('project laboratory features FactoryMind, ForgeMind AI, and TikaTrack with valid categories and case studies', () => {
  assert.deepEqual(
    PROJECTS.map((p) => p.id),
    ['factorymind', 'forgemind-ai', 'tikatrack'],
  );

  const counts = countProjectsByCategory(PROJECTS);
  assert.equal(counts.All, 3);
  assert.equal(counts.Engineering, 2);
  assert.equal(counts.Research, 2);
  assert.equal(counts['AI/ML'], 3);
  assert.equal(counts.Software, 3);
  assert.equal(counts.Innovation, 2);

  assert.equal(filterProjectsByCategory(PROJECTS, 'Engineering').length, 2);
  assert.equal(filterProjectsByCategory(PROJECTS, 'Software').length, 3);
  assert.equal(filterProjectsByCategory(PROJECTS, 'Innovation').length, 2);

  const factoryMind = PROJECTS.find((p) => p.id === 'factorymind');
  assert.equal(factoryMind?.githubUrl, 'https://github.com/Ibtasham/FactoryMind');
  assert.equal(factoryMind?.liveDemoUrl, 'https://ibtasham.github.io/FactoryMind/');
  assert.equal(factoryMind?.modules.length, 6);
  assert.equal(factoryMind?.developmentStage, 'Active Prototype');
  assert.equal(factoryMind?.previewKindLabel, 'Verified Product Screenshot');

  const forgeMind = PROJECTS.find((p) => p.id === 'forgemind-ai');
  assert.equal(forgeMind?.githubUrl, 'https://github.com/ibta10/ForgeMind-Ai');
  assert.equal(
    forgeMind?.liveDemoUrl,
    'https://forge-mind-ai-wheat.vercel.app/?subset=FD002&model=gradient_boosting',
  );
  assert.equal(forgeMind?.modules.length, 6);
  assert.equal(forgeMind?.developmentStage, 'Active Prototype');
  assert.equal(forgeMind?.previewKindLabel, 'Verified Product Screenshot');
  assert.equal(forgeMind?.caseStudy.secondaryKind, 'proposed');
  assert.ok((forgeMind?.caseStudy.secondaryItems?.length ?? 0) >= 3);

  const tikaTrack = PROJECTS.find((p) => p.id === 'tikatrack');
  assert.equal(tikaTrack?.githubUrl, 'https://github.com/Ibtasham/TikaTrack');
  assert.equal(tikaTrack?.liveDemoUrl, 'https://ibtasham.github.io/TikaTrack/');
  assert.equal(tikaTrack?.modules.length, 4);
  assert.equal(tikaTrack?.developmentStage, 'Active Prototype');
  assert.equal(tikaTrack?.caseStudy.secondaryKind, 'proposed');
  assert.equal(tikaTrack?.previewKindLabel, 'Verified Product Screenshot');

  for (const project of PROJECTS) {
    assert.ok(project.oneSentenceProblem.length > 20);
    assert.ok(project.mainContribution.length > 20);
    assert.ok(project.caseStudy.overviewSummary.length > 20);
    assert.ok(project.caseStudy.coreFeatures.length >= 1);
    assert.ok(project.caseStudy.engineeringDecisions.length >= 1);
    assert.ok(project.caseStudy.validationRecords.length >= 1);
    assert.ok(project.caseStudy.currentLimitations.length >= 1);
  }

  assert.deepEqual(summarizeProjectMaturity(factoryMind!), {
    implemented: 6,
    experimentalOrProposed: 1,
    plannedOrPending: 1,
  });
  assert.deepEqual(summarizeProjectMaturity(forgeMind!), {
    implemented: 6,
    experimentalOrProposed: 1,
    plannedOrPending: 1,
  });
  assert.deepEqual(summarizeProjectMaturity(tikaTrack!), {
    implemented: 4,
    experimentalOrProposed: 1,
    plannedOrPending: 1,
  });

  const forgeExperiments = getProjectLinkedExperiments('forgemind-ai', RESEARCH_EXPERIMENTS);
  assert.ok(forgeExperiments.length >= 3);
  const forgeStudies = getProjectLinkedStudies('forgemind-ai', RESEARCH_MANUSCRIPTS);
  assert.equal(forgeStudies.length, 2);

  const nav = getProjectNavigation(PROJECTS, 'factorymind');
  assert.equal(nav.project?.id, 'factorymind');
  assert.equal(nav.previous, null);
  assert.equal(nav.next?.id, 'forgemind-ai');

  const middleNav = getProjectNavigation(PROJECTS, 'forgemind-ai');
  assert.equal(middleNav.previous?.id, 'factorymind');
  assert.equal(middleNav.next?.id, 'tikatrack');
  assert.equal(getProjectNavigation(PROJECTS, 'unknown-project').project, null);
});

test('research dashboard separates experiment stages, manuscripts, and keeps zero fabricated publications', () => {
  assert.equal(RESEARCH_PUBLISHED_RECORDS.length, 0);
  assert.equal(RESEARCH_MANUSCRIPTS.length, 3);
  assert.ok(RESEARCH_MANUSCRIPTS.every((m) => m.status === 'Unpublished Research'));
  assert.ok(RESEARCH_PROFILE_META.featuredDirection.title.includes('Prognostics'));

  const stageCounts = countResearchExperimentsByStage(RESEARCH_EXPERIMENTS);
  assert.equal(
    stageCounts.completed + stageCounts.ongoing + stageCounts.proposed,
    stageCounts.all,
  );
  assert.ok(stageCounts.completed >= 2);
  assert.ok(stageCounts.ongoing >= 2);
  assert.ok(stageCounts.proposed >= 2);

  const completed = filterResearchExperiments(RESEARCH_EXPERIMENTS, 'completed');
  assert.ok(completed.every((e) => e.stage === 'completed'));

  assert.ok(RESEARCH_DATASETS.some((d) => d.name.includes('NASA C-MAPSS') && d.featured));
  assert.ok(RESEARCH_NOTES.length >= 3);

  const studyNav = getResearchNavigation(RESEARCH_MANUSCRIPTS, 'decision-aware-prognostics');
  assert.equal(studyNav.study?.id, 'decision-aware-prognostics');
  assert.equal(studyNav.previous?.id, 'rul-explainable');
  assert.equal(studyNav.next?.id, 'decision-centric-demand');
  assert.equal(getResearchNavigation(RESEARCH_MANUSCRIPTS, 'nonexistent').study, null);
});

test('innovation entries include all 7 fields, separate maturity stages, and keep zero fabricated traction', () => {
  assert.ok(INNOVATION_ENTRIES.length >= 6);
  for (const entry of INNOVATION_ENTRIES) {
    assert.ok(entry.problemIdentified.length > 10);
    assert.ok(entry.targetUsers.length > 10);
    assert.ok(entry.proposedSolution.length > 10);
    assert.ok(entry.innovationApproach.length > 10);
    assert.ok(entry.currentDevelopmentStage.length > 10);
    assert.ok(entry.validationStatus.length > 10);
    assert.ok(entry.futureRoadmap.length > 10);
  }

  const stageCounts = countInnovationByStage(INNOVATION_ENTRIES);
  assert.equal(
    stageCounts.idea + stageCounts.prototype + stageCounts.validated + stageCounts.launched,
    stageCounts.all,
  );
  assert.equal(stageCounts.prototype, 3);
  assert.equal(stageCounts.idea, 3);
  assert.equal(stageCounts.validated, 0);
  assert.equal(stageCounts.launched, 0);
  assert.ok(INNOVATION_PROFILE_META.transparencyStatement.includes('Validated Solutions (0)'));

  const prototypes = filterInnovationEntries(INNOVATION_ENTRIES, 'prototype');
  assert.deepEqual(
    prototypes.map((p) => p.id),
    ['inn-factorymind', 'inn-forgemind', 'inn-tikatrack'],
  );

  const searchHult = filterInnovationEntries(INNOVATION_ENTRIES, 'all', 'Hult Prize');
  assert.equal(searchHult.length, 1);
  assert.equal(searchHult[0]?.id, 'inn-hult-prize');

  const prototypeTimeline = filterInnovationTimeline(INNOVATION_TIMELINE, 'prototype');
  assert.equal(prototypeTimeline.length, 2);

  assert.equal(PROBLEM_SOLVING_FRAMEWORK.length, 5);
  assert.equal(INNOVATION_COMPETITIONS.length, 5);
  assert.ok(TEAM_COLLABORATION_HIGHLIGHTS.length >= 3);
  assert.ok(FUTURE_INNOVATION_PLANS.length >= 3);
});

test('project search, interactive education timeline filtering, section nav mapping, and CV asset path work', () => {
  const cmapssMatches = filterProjects(PROJECTS, 'All', 'C-MAPSS');
  assert.equal(cmapssMatches.length, 1);
  assert.equal(cmapssMatches[0]?.id, 'forgemind-ai');

  const factoryMindEoq = filterProjects(PROJECTS, 'Research', 'EOQ');
  assert.equal(factoryMindEoq.length, 1);
  assert.equal(factoryMindEoq[0]?.id, 'factorymind');

  const tikaTrackEcdsa = filterProjects(PROJECTS, 'Software', 'ECDSA');
  assert.equal(tikaTrackEcdsa.length, 1);
  assert.equal(tikaTrackEcdsa[0]?.id, 'tikatrack');

  assert.equal(filterProjects(PROJECTS, 'All', 'nonexistent-query').length, 0);

  assert.equal(filterEducationEntries(EDUCATION, 'all').length, 4);
  assert.equal(filterEducationEntries(EDUCATION, 'university').length, 1);
  assert.equal(filterEducationEntries(EDUCATION, 'secondary').length, 3);

  assert.deepEqual(HOME_SECTION_IDS, [
    'about',
    'projects',
    'research',
    'innovation',
    'studio-3d',
    'experience',
    'awards',
    'archive',
    'skills',
    'contact',
  ]);
  assert.equal(mapSectionIdToNavRoute('about'), '/about');
  assert.equal(mapSectionIdToNavRoute('journey'), '/about');
  assert.equal(mapSectionIdToNavRoute('projects'), '/projects');
  assert.equal(mapSectionIdToNavRoute('innovation'), '/innovation');
  assert.equal(mapSectionIdToNavRoute('archive'), '/archive');
  assert.equal(mapSectionIdToNavRoute('contact'), '/contact');
  assert.equal(mapSectionIdToNavRoute(null), null);

  assert.equal(PROFILE.links.cvPdf, '/assets/MD_Ibtashamur_Rahman_CV.pdf');
});

test('visual achievement archive indexes all 52 unique assets including certificates, posters, and video submissions', () => {
  assert.equal(VISUAL_ARCHIVE.length, 52);
  const uniqueFilenames = new Set(VISUAL_ARCHIVE.map((item) => item.filename));
  assert.equal(uniqueFilenames.size, 52);

  for (const item of VISUAL_ARCHIVE) {
    assert.ok(item.src.startsWith('/assets/aistudio/'));
    assert.ok(item.caption.length > 10);
    assert.ok(item.alt.length > 10);
    assert.ok(item.associatedRecord.length > 3);
    assert.ok(item.date.length >= 4);
  }

  const counts = countVisualArchiveByCategory(VISUAL_ARCHIVE);
  assert.equal(counts.All, 52);
  assert.equal(counts['Academic achievements'], 7);
  assert.equal(counts['University events'], 2);
  assert.equal(counts.Volunteering, 2);
  assert.equal(counts['Personal photographs'], 9);
  assert.equal(VISUAL_ARCHIVE_CATEGORIES.length, 9);
  const categorySum = VISUAL_ARCHIVE_CATEGORIES.reduce(
    (sum, cat) => sum + counts[cat],
    0,
  );
  assert.equal(categorySum, 52);

  const kindCounts = countVisualArchiveByKind(VISUAL_ARCHIVE);
  assert.equal(kindCounts.All, 52);
  assert.equal(kindCounts.Certificate, 7);
  assert.equal(kindCounts['Video Submission'], 1);

  const ndcAttendance = VISUAL_ARCHIVE.find((i) => i.id === 'va-ndc-perfect-attendance-cert');
  assert.equal(ndcAttendance?.rotateDeg, 270);

  const highlights = getHomepageArchiveHighlights(VISUAL_ARCHIVE);
  assert.equal(highlights.length, 4);
  assert.ok(highlights.every((item) => item.kind === 'Event Photograph'));
  assert.ok(highlights.every((item) => item.src !== PROFILE.profilePhoto));

  const ambassadorMedia = filterVisualArchive(
    VISUAL_ARCHIVE,
    'Campus ambassador experiences',
  );
  assert.equal(ambassadorMedia.length, 17);

  const videoSubmissions = filterVisualArchive(VISUAL_ARCHIVE, 'All', 'Video Submission');
  assert.equal(videoSubmissions.length, 1);
  assert.equal(videoSubmissions[0]?.id, 'va-fogg-squad-video');
  assert.equal(videoSubmissions[0]?.mediaType, 'video');

  const showcaseMatches = filterVisualArchive(VISUAL_ARCHIVE, 'All', 'Certificate', 'ShowCase');
  assert.equal(showcaseMatches.length, 1);
  assert.equal(showcaseMatches[0]?.id, 'va-showcase-cert');

  const gdnMedia = getVisualArchiveForExperience(VISUAL_ARCHIVE, 'gdn-11ec');
  assert.equal(gdnMedia.length, 4);

  const createxMedia = getVisualArchiveForExperience(VISUAL_ARCHIVE, 'createx-2');
  assert.equal(createxMedia.length, 2);

  const foggMedia = getVisualArchiveForExperience(VISUAL_ARCHIVE, 'fogg-squad-ca');
  assert.equal(foggMedia.length, 1);

  const speakupMedia = getVisualArchiveForAchievement(VISUAL_ARCHIVE, 'ach-speakup');
  assert.equal(speakupMedia.length, 4);

  assert.equal(getVisualArchiveForEducation(VISUAL_ARCHIVE, 'sust-ipe').length, 3);
  assert.equal(getVisualArchiveForEducation(VISUAL_ARCHIVE, 'ndc-hsc').length, 5);
  assert.equal(getVisualArchiveForJourney(VISUAL_ARCHIVE, 'm-2023-ndc').length, 6);

  const groups = groupVisualArchiveByEvent(VISUAL_ARCHIVE);
  assert.ok(groups.some((g) => g.eventGroup === 'Speak Up 2026 — SUSC' && g.items.length === 4));
  assert.ok(
    groups.some((g) => g.eventGroup === 'GDN-SUST 11th Executive Committee' && g.items.length === 4),
  );
  assert.ok(
    groups.some((g) => g.eventGroup === 'CreateX 2.0 — The Trailblazers & BUBT TAFE' && g.items.length === 2),
  );
});

test('buildManuscriptBibTeX formats unpublished draft citations honestly and profile protects private phone', () => {
  const study = RESEARCH_MANUSCRIPTS[0];
  assert.ok(study);
  const bibtex = buildManuscriptBibTeX(study, PROFILE.name);
  assert.ok(bibtex.startsWith('@unpublished{rahman_'));
  assert.ok(bibtex.includes(study.workingTitle ?? study.title));
  assert.ok(bibtex.includes('no DOI assigned'));
  assert.equal('phone' in PROFILE, false);
  assert.ok(!PROFILE.publicLocation.toLowerCase().includes('shahporan'));
});


