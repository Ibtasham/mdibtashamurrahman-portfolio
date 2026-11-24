import type {
  AchievementEntry,
  CertificateAttachment,
  EducationEntry,
  ExperienceCategory,
  ExperienceEntry,
  ExperimentStage,
  InnovationEntry,
  InnovationStage,
  InnovationTimelineItem,
  JourneyCategory,
  JourneyMilestone,
  ProjectCategory,
  ProjectEntry,
  ResearchExperiment,
  ResearchManuscript,
  SkillCategoryGroup,
  SkillCategoryId,
  VisualArchiveCategory,
  VisualArchiveItem,
  VisualArchiveKind,
} from '../types/portfolio';

export type EducationFilter = 'all' | 'university' | 'secondary';

export type ExperienceFilter =
  | 'all'
  | ExperienceCategory
  | 'event_organization'
  | 'volunteering';
export type ExperienceStatusFilter = 'all' | 'current' | 'former';
export type AchievementFilter = 'All' | AchievementEntry['category'];
export type JourneyFilter = 'All' | JourneyCategory;
export type SkillFilter = 'all' | SkillCategoryId;
export type CertificateCategoryFilter = 'All' | CertificateAttachment['category'];
export type CertificateStatusFilter = 'all' | 'verified' | 'pending';
export type ProjectCategoryFilter = 'All' | ProjectCategory;
export type ExperimentStageFilter = 'all' | ExperimentStage;
export type InnovationStageFilter = 'all' | InnovationStage;

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Engineering',
  'Research',
  'AI/ML',
  'Software',
  'Innovation',
];

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

export function filterExperiences(
  items: ExperienceEntry[],
  category: ExperienceFilter,
  status: ExperienceStatusFilter = 'all',
  query = '',
): ExperienceEntry[] {
  const normalized = query.trim().toLowerCase();

  return items.filter((item) => {
    if (category === 'event_organization' && item.subCategory !== 'Event Organization') {
      return false;
    } else if (category === 'volunteering' && item.subCategory !== 'Volunteering') {
      return false;
    } else if (
      category !== 'all' &&
      category !== 'event_organization' &&
      category !== 'volunteering' &&
      item.category !== category
    ) {
      return false;
    }

    if (status === 'current' && !item.isCurrent) {
      return false;
    }
    if (status === 'former' && item.isCurrent) {
      return false;
    }
    if (!normalized) {
      return true;
    }

    const haystack = [
      item.role,
      item.organization,
      item.summary,
      item.responsibility,
      item.actualContribution,
      item.location,
      item.subCategory ?? '',
      ...item.highlights,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function countExperiencesByCategory(items: ExperienceEntry[]): Record<ExperienceFilter, number> {
  return items.reduce<Record<ExperienceFilter, number>>(
    (acc, item) => {
      acc.all += 1;
      acc[item.category] += 1;
      if (item.subCategory === 'Event Organization') {
        acc.event_organization += 1;
      }
      if (item.subCategory === 'Volunteering') {
        acc.volunteering += 1;
      }
      return acc;
    },
    {
      all: 0,
      executive: 0,
      ambassador: 0,
      events_volunteering: 0,
      event_organization: 0,
      volunteering: 0,
    },
  );
}

export function countExperiencesByStatus(items: ExperienceEntry[]): {
  all: number;
  current: number;
  former: number;
} {
  return items.reduce(
    (acc, item) => {
      acc.all += 1;
      if (item.isCurrent) {
        acc.current += 1;
      } else {
        acc.former += 1;
      }
      return acc;
    },
    { all: 0, current: 0, former: 0 },
  );
}

export function getLeadershipEntries(items: ExperienceEntry[]): ExperienceEntry[] {
  const executive = items.filter((item) => item.category === 'executive');
  return [
    ...executive.filter((item) => item.isCurrent),
    ...executive.filter((item) => !item.isCurrent),
  ];
}

export interface ExperienceSectionGroups {
  currentPositions: ExperienceEntry[];
  formerPositions: ExperienceEntry[];
  executiveCommittee: ExperienceEntry[];
  campusAmbassador: ExperienceEntry[];
  eventOrganization: ExperienceEntry[];
  volunteering: ExperienceEntry[];
}

export function groupExperiencesByDimension(
  items: ExperienceEntry[],
): ExperienceSectionGroups {
  return {
    currentPositions: items.filter((item) => item.isCurrent),
    formerPositions: items.filter((item) => !item.isCurrent),
    executiveCommittee: items.filter((item) => item.category === 'executive'),
    campusAmbassador: items.filter((item) => item.category === 'ambassador'),
    eventOrganization: items.filter((item) => item.subCategory === 'Event Organization'),
    volunteering: items.filter((item) => item.subCategory === 'Volunteering'),
  };
}

export function getExperienceNavigation(
  items: ExperienceEntry[],
  id: string | undefined,
): {
  entry: ExperienceEntry | null;
  previous: ExperienceEntry | null;
  next: ExperienceEntry | null;
} {
  if (!id) {
    return { entry: null, previous: null, next: null };
  }
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return { entry: null, previous: null, next: null };
  }
  return {
    entry: items[index] ?? null,
    previous: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
  };
}

export function filterJourneyMilestones(
  items: JourneyMilestone[],
  category: JourneyFilter,
): JourneyMilestone[] {
  if (category === 'All') {
    return items;
  }
  return items.filter((item) => item.category === category);
}

export function countJourneyByCategory(items: JourneyMilestone[]): Record<JourneyFilter, number> {
  return items.reduce<Record<JourneyFilter, number>>(
    (acc, item) => {
      acc.All += 1;
      acc[item.category] += 1;
      return acc;
    },
    {
      All: 0,
      'Academic Foundation': 0,
      'Engineering & Research': 0,
      'Competitions & Voice': 0,
      'Leadership & Outreach': 0,
    },
  );
}

export function filterAchievements(
  items: AchievementEntry[],
  category: AchievementFilter,
): AchievementEntry[] {
  if (category === 'All') {
    return items;
  }
  return items.filter((item) => item.category === category);
}

export function countAchievementsByCategory(
  items: AchievementEntry[],
): Record<AchievementFilter, number> {
  return items.reduce<Record<AchievementFilter, number>>(
    (acc, item) => {
      acc.All += 1;
      acc[item.category] += 1;
      return acc;
    },
    {
      All: 0,
      Competition: 0,
      Academic: 0,
      'Public Speaking': 0,
      'Recognition & Volunteering': 0,
    },
  );
}

export function filterResearchByDomain(
  items: ResearchManuscript[],
  domain: string,
): ResearchManuscript[] {
  if (!domain || domain === 'All') {
    return items;
  }
  return items.filter((item) => item.domain === domain);
}

export function filterResearchExperiments(
  items: ResearchExperiment[],
  stage: ExperimentStageFilter,
): ResearchExperiment[] {
  if (stage === 'all') {
    return items;
  }
  return items.filter((item) => item.stage === stage);
}

export function countResearchExperimentsByStage(
  items: ResearchExperiment[],
): Record<ExperimentStageFilter, number> {
  return items.reduce<Record<ExperimentStageFilter, number>>(
    (acc, item) => {
      acc.all += 1;
      acc[item.stage] += 1;
      return acc;
    },
    { all: 0, completed: 0, ongoing: 0, proposed: 0 },
  );
}

export interface ManuscriptExperimentMatrixRow {
  id: string;
  shortTitle: string;
  domain: string;
  completedCount: number;
  ongoingCount: number;
  proposedCount: number;
  methodsCount: number;
}

export function summarizeResearchPortfolio(
  manuscripts: ResearchManuscript[],
  experiments: ResearchExperiment[],
  publishedCount: number,
): {
  totals: {
    manuscriptsInPrep: number;
    completedExperiments: number;
    ongoingExperiments: number;
    proposedExperiments: number;
    publishedResearch: number;
  };
  studyRows: ManuscriptExperimentMatrixRow[];
} {
  const stageCounts = countResearchExperimentsByStage(experiments);

  const studyRows: ManuscriptExperimentMatrixRow[] = manuscripts.map((study) => {
    const linked = experiments.filter((exp) => exp.relatedStudyId === study.id);
    const shortTitle =
      study.cardTitle ??
      (study.id === 'rul-explainable'
        ? 'Explainable & Cross-Dataset RUL'
        : study.id === 'decision-aware-prognostics'
          ? 'Decision-Aware Uncertainty'
          : study.id === 'decision-centric-demand'
            ? 'Decision-Centric Demand Forecasting'
            : study.title);

    return {
      id: study.id,
      shortTitle,
      domain: study.domain,
      completedCount:
        linked.filter((e) => e.stage === 'completed').length ||
        (study.completedWork?.length ?? 0),
      ongoingCount:
        linked.filter((e) => e.stage === 'ongoing').length ||
        (study.ongoingWork?.length ?? 0),
      proposedCount:
        linked.filter((e) => e.stage === 'proposed').length ||
        (study.proposedWork?.length ?? 0),
      methodsCount: study.methods.length,
    };
  });

  return {
    totals: {
      manuscriptsInPrep: manuscripts.length,
      completedExperiments: stageCounts.completed,
      ongoingExperiments: stageCounts.ongoing,
      proposedExperiments: stageCounts.proposed,
      publishedResearch: publishedCount,
    },
    studyRows,
  };
}

export function getResearchNavigation(
  items: ResearchManuscript[],
  id: string | undefined,
): {
  study: ResearchManuscript | null;
  previous: ResearchManuscript | null;
  next: ResearchManuscript | null;
} {
  if (!id) {
    return { study: null, previous: null, next: null };
  }
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return { study: null, previous: null, next: null };
  }
  return {
    study: items[index] ?? null,
    previous: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
  };
}

export function filterSkillCategories(
  categories: SkillCategoryGroup[],
  selectedCategory: SkillFilter,
  query = '',
): SkillCategoryGroup[] {
  const normalized = query.trim().toLowerCase();

  return categories
    .filter((group) => selectedCategory === 'all' || group.id === selectedCategory)
    .map((group) => {
      if (!normalized) {
        return group;
      }

      const groupMatch =
        group.title.toLowerCase().includes(normalized) ||
        group.subtitle.toLowerCase().includes(normalized) ||
        group.summary.toLowerCase().includes(normalized);

      if (groupMatch) {
        return group;
      }

      const matchingItems = group.items.filter((item) =>
        [
          item.name,
          item.detail ?? '',
          item.proficiency ?? '',
          ...(item.evidenceLinks?.map((l) => `${l.kind} ${l.label}`) ?? []),
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized),
      );

      return {
        ...group,
        items: matchingItems,
      };
    })
    .filter((group) => group.items.length > 0);
}

export function countCertificatesByCategory(
  items: CertificateAttachment[],
): Record<CertificateCategoryFilter, number> {
  return items.reduce<Record<CertificateCategoryFilter, number>>(
    (acc, cert) => {
      acc.All += 1;
      acc[cert.category] += 1;
      return acc;
    },
    {
      All: 0,
      'Experience & Outreach': 0,
      Competition: 0,
      Volunteering: 0,
      Academic: 0,
    },
  );
}

export function filterCertificates(
  items: CertificateAttachment[],
  category: CertificateCategoryFilter,
  status: CertificateStatusFilter = 'all',
  query = '',
): CertificateAttachment[] {
  const normalized = query.trim().toLowerCase();

  return items.filter((cert) => {
    if (category !== 'All' && cert.category !== category) {
      return false;
    }
    if (status === 'verified' && cert.status !== 'Verified Attachment') {
      return false;
    }
    if (status === 'pending' && cert.status !== 'Pending Upload') {
      return false;
    }
    if (!normalized) {
      return true;
    }

    const haystack = [
      cert.title,
      cert.issuer,
      cert.date,
      cert.category,
      cert.credentialId ?? '',
      cert.notes,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function filterEducationEntries(
  items: EducationEntry[],
  filter: EducationFilter,
): EducationEntry[] {
  if (filter === 'all') {
    return items;
  }
  if (filter === 'university') {
    return items.filter((item) => item.status === 'Current');
  }
  return items.filter((item) => item.status !== 'Current');
}

export function filterProjectsByCategory(
  items: ProjectEntry[],
  category: ProjectCategoryFilter,
): ProjectEntry[] {
  if (category === 'All') {
    return items;
  }
  return items.filter((project) => project.categories.includes(category));
}

export function filterProjects(
  items: ProjectEntry[],
  category: ProjectCategoryFilter,
  query = '',
): ProjectEntry[] {
  const byCategory = filterProjectsByCategory(items, category);
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return byCategory;
  }

  return byCategory.filter((project) => {
    const haystack = [
      project.title,
      project.tagline,
      project.oneSentenceProblem,
      project.mainContribution,
      project.roleAndContribution ?? '',
      ...(project.implementedHighlights ?? []),
      ...project.modules.map((m) => `${m.name} ${m.methods.join(' ')}`),
      project.summary,
      project.categoryLabel,
      project.status,
      project.developmentStage,
      project.context,
      ...project.stack,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function countProjectsByCategory(
  items: ProjectEntry[],
): Record<ProjectCategoryFilter, number> {
  return items.reduce<Record<ProjectCategoryFilter, number>>(
    (acc, project) => {
      acc.All += 1;
      for (const cat of project.categories) {
        acc[cat] += 1;
      }
      return acc;
    },
    {
      All: 0,
      Engineering: 0,
      Research: 0,
      'AI/ML': 0,
      Software: 0,
      Innovation: 0,
    },
  );
}

export function getProjectNavigation(
  items: ProjectEntry[],
  id: string | undefined,
): {
  project: ProjectEntry | null;
  previous: ProjectEntry | null;
  next: ProjectEntry | null;
} {
  if (!id) {
    return { project: null, previous: null, next: null };
  }
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return { project: null, previous: null, next: null };
  }
  return {
    project: items[index] ?? null,
    previous: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
  };
}

export function summarizeProjectMaturity(project: ProjectEntry): {
  implemented: number;
  experimentalOrProposed: number;
  plannedOrPending: number;
} {
  return project.caseStudy.coreFeatures.reduce(
    (acc, feature) => {
      if (feature.maturity === 'Implemented') {
        acc.implemented += 1;
      } else if (feature.maturity === 'Experimental' || feature.maturity === 'Proposed') {
        acc.experimentalOrProposed += 1;
      } else {
        acc.plannedOrPending += 1;
      }
      return acc;
    },
    { implemented: 0, experimentalOrProposed: 0, plannedOrPending: 0 },
  );
}

export function getProjectLinkedExperiments(
  projectId: string,
  experiments: ResearchExperiment[],
): ResearchExperiment[] {
  return experiments.filter((exp) => exp.relatedProjectId === projectId);
}

export function getProjectLinkedStudies(
  projectId: string,
  studies: ResearchManuscript[],
): ResearchManuscript[] {
  return studies.filter((study) => study.relatedProjectId === projectId);
}

export function validateContactForm(input: ContactFormInput): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};

  if (!input.name.trim() || input.name.trim().length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!input.subject.trim() || input.subject.trim().length < 3) {
    errors.subject = 'Please provide a brief subject.';
  }

  if (!input.message.trim() || input.message.trim().length < 10) {
    errors.message = 'Please enter a message of at least 10 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildMailtoHref(toEmail: string, input: ContactFormInput): string {
  const subject = encodeURIComponent(input.subject.trim());
  const body = encodeURIComponent(
    `From: ${input.name.trim()} (${input.email.trim()})\n\n${input.message.trim()}`,
  );
  return `mailto:${toEmail}?subject=${subject}&body=${body}`;
}

export function filterInnovationEntries(
  items: InnovationEntry[],
  stage: InnovationStageFilter,
  query = '',
): InnovationEntry[] {
  const normalized = query.trim().toLowerCase();

  return items.filter((item) => {
    if (stage !== 'all' && item.stage !== stage) {
      return false;
    }
    if (!normalized) {
      return true;
    }

    const haystack = [
      item.title,
      item.category,
      item.teamContext,
      item.problemIdentified,
      item.targetUsers,
      item.proposedSolution,
      item.innovationApproach,
      item.validationStatus,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function countInnovationByStage(
  items: InnovationEntry[],
): Record<InnovationStageFilter, number> {
  return items.reduce<Record<InnovationStageFilter, number>>(
    (acc, item) => {
      acc.all += 1;
      acc[item.stage] += 1;
      return acc;
    },
    { all: 0, idea: 0, prototype: 0, validated: 0, launched: 0 },
  );
}

export function filterInnovationTimeline(
  items: InnovationTimelineItem[],
  stage: InnovationStageFilter,
): InnovationTimelineItem[] {
  if (stage === 'all') {
    return items;
  }
  return items.filter((item) => item.stage === stage);
}

export type VisualArchiveCategoryFilter = 'All' | VisualArchiveCategory;
export type VisualArchiveKindFilter = 'All' | VisualArchiveKind;

export const VISUAL_ARCHIVE_CATEGORIES: VisualArchiveCategory[] = [
  'Awards and competitions',
  'Public speaking',
  'Leadership activities',
  'Campus ambassador experiences',
  'Volunteering',
  'University events',
  'Personal photographs',
  'Academic achievements',
  'Projects',
];

export const VISUAL_ARCHIVE_KINDS: VisualArchiveKind[] = [
  'Event Photograph',
  'Certificate',
  'Appointment Letter',
  'Official Poster',
  'Portrait',
  'Video Submission',
];

export function countVisualArchiveByCategory(
  items: VisualArchiveItem[],
): Record<VisualArchiveCategoryFilter, number> {
  const counts: Record<VisualArchiveCategoryFilter, number> = {
    All: 0,
    'Academic achievements': 0,
    'Awards and competitions': 0,
    'Public speaking': 0,
    'Leadership activities': 0,
    'Campus ambassador experiences': 0,
    Volunteering: 0,
    'University events': 0,
    Projects: 0,
    'Personal photographs': 0,
  };

  for (const item of items) {
    counts.All += 1;
    counts[item.category] += 1;
  }
  return counts;
}

export function countVisualArchiveByKind(
  items: VisualArchiveItem[],
): Record<VisualArchiveKindFilter, number> {
  const counts: Record<VisualArchiveKindFilter, number> = {
    All: 0,
    'Event Photograph': 0,
    Certificate: 0,
    'Appointment Letter': 0,
    'Official Poster': 0,
    Portrait: 0,
    'Video Submission': 0,
  };

  for (const item of items) {
    counts.All += 1;
    counts[item.kind] += 1;
  }
  return counts;
}

export function filterVisualArchive(
  items: VisualArchiveItem[],
  category: VisualArchiveCategoryFilter,
  kind: VisualArchiveKindFilter = 'All',
  query = '',
): VisualArchiveItem[] {
  const normalized = query.trim().toLowerCase();

  return items.filter((item) => {
    if (category !== 'All' && item.category !== category) {
      return false;
    }
    if (kind !== 'All' && item.kind !== kind) {
      return false;
    }
    if (!normalized) {
      return true;
    }

    const haystack = [
      item.filename,
      item.category,
      item.associatedRecord,
      item.eventGroup,
      item.caption,
      item.date,
      item.kind,
      item.needsConfirmation ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export interface VisualArchiveEventGroup {
  eventGroup: string;
  items: VisualArchiveItem[];
}

export function groupVisualArchiveByEvent(
  items: VisualArchiveItem[],
): VisualArchiveEventGroup[] {
  const grouped = new Map<string, VisualArchiveItem[]>();
  for (const item of items) {
    const existing = grouped.get(item.eventGroup);
    if (existing) {
      existing.push(item);
    } else {
      grouped.set(item.eventGroup, [item]);
    }
  }
  return Array.from(grouped.entries()).map(([eventGroup, groupItems]) => ({
    eventGroup,
    items: groupItems,
  }));
}

export function getHomepageArchiveHighlights(
  items: VisualArchiveItem[],
): VisualArchiveItem[] {
  return items.filter((item) => item.featuredOnHome === true);
}

export function getVisualArchiveForExperience(
  items: VisualArchiveItem[],
  experienceId: string,
): VisualArchiveItem[] {
  return items.filter((item) => item.linkedExperienceId === experienceId);
}

export function getVisualArchiveForAchievement(
  items: VisualArchiveItem[],
  achievementId: string,
): VisualArchiveItem[] {
  return items.filter((item) => item.linkedAchievementId === achievementId);
}

export function getVisualArchiveForEducation(
  items: VisualArchiveItem[],
  educationId: string,
): VisualArchiveItem[] {
  return items.filter((item) => item.linkedEducationId === educationId);
}

export function getVisualArchiveForJourney(
  items: VisualArchiveItem[],
  journeyId: string,
): VisualArchiveItem[] {
  return items.filter((item) => item.linkedJourneyId === journeyId);
}

export function buildManuscriptBibTeX(
  study: ResearchManuscript,
  authorName = 'MD Ibtashamur Rahman',
): string {
  const citeKey = `rahman_${study.id.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}`;
  return [
    `@unpublished{${citeKey},`,
    `  author = {${authorName}},`,
    `  title  = {${study.workingTitle ?? study.title}},`,
    `  note   = {${study.status} — Department of Industrial and Production Engineering, Shahjalal University of Science and Technology (SUST). Benchmarks: ${study.datasetsOrBenchmarks}. Unpublished benchmark and simulation research; no DOI assigned.}`,
    `}`,
  ].join('\n');
}

