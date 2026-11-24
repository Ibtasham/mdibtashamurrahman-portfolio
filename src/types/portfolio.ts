export type DimensionId = 'engineering' | 'research' | 'innovation' | 'leadership';

export interface DimensionPillar {
  id: DimensionId;
  title: string;
  subtitle: string;
  summary: string;
  highlights: string[];
  route: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  location: string;
  degree: string;
  field: string;
  period: string;
  status: 'Current' | 'Completed';
  grade: string;
  details: string[];
}

export type ProjectCategory =
  | 'Engineering'
  | 'Research'
  | 'AI/ML'
  | 'Software'
  | 'Innovation';

export type ProjectDevelopmentStage =
  | 'Active Prototype'
  | 'Research Prototype'
  | 'Developing Concept';

export type ProjectMaturityState =
  | 'Implemented'
  | 'Experimental'
  | 'Proposed'
  | 'Planned'
  | 'Awaiting Source';

export interface ProjectModule {
  id: string;
  name: string;
  methods: string[];
  description: string;
  domainContext: string;
}

export interface ProjectArchitectureLayer {
  id: string;
  stage: string;
  title: string;
  detail: string;
  state: ProjectMaturityState;
  inputs?: string;
  outputs?: string;
  technologies?: string[];
  verificationNote?: string;
}

export interface ProjectStackGroup {
  group: string;
  items: string[];
}

export interface ProjectScreenshotEntry {
  id: string;
  title: string;
  caption: string;
  kind:
    | 'Conceptual Illustration'
    | 'Concept Blueprint'
    | 'Architectural Illustration'
    | 'Awaiting Product Screenshot'
    | 'Verified Screenshot';
  useGeneratedPreview?: boolean;
  previewSource?: 'live' | 'conceptual';
  imageUrl?: string;
  requirements?: string;
}

export interface ProjectCoreFeature {
  id: string;
  name: string;
  maturity: ProjectMaturityState;
  description: string;
  technicalBasis: string;
}

export interface ProjectEngineeringDecision {
  id: string;
  challenge: string;
  decision: string;
  rationale: string;
  tradeoff: string;
}

export interface ProjectValidationRecord {
  id: string;
  method: string;
  scope: string;
  status: 'Verified' | 'Active Experiment' | 'Planned' | 'Pending Source';
  evidenceSummary: string;
}

export interface ProjectCaseStudy {
  overviewSummary: string;
  problemStatement: string;
  motivation: string;
  proposedSolution: string;
  architectureOverview: string;
  architectureLayers: ProjectArchitectureLayer[];
  implementationSummary: string;
  implementedHeading: string;
  implementedItems: string[];
  secondaryHeading?: string;
  secondaryItems?: string[];
  secondaryKind?: 'proposed' | 'pending';
  coreFeatures: ProjectCoreFeature[];
  technologyStackGroups: ProjectStackGroup[];
  screenshots: ProjectScreenshotEntry[];
  challenges: string[];
  engineeringDecisions: ProjectEngineeringDecision[];
  testingValidationSummary: string;
  validationRecords: ProjectValidationRecord[];
  currentLimitations: string[];
  currentProgress: string[];
  futureDevelopment: string[];
  impact: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  tagline: string;
  categories: ProjectCategory[];
  categoryLabel: string;
  status: string;
  developmentStage: ProjectDevelopmentStage;
  context: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  sourceNote: string;
  roleAndContribution?: string;
  implementedHighlights?: string[];
  scopeDistinctionNote?: string;
  oneSentenceProblem: string;
  mainContribution: string;
  summary: string;
  stack: string[];
  previewKindLabel: 'Verified Product Screenshot' | 'Conceptual Illustration' | 'Concept Blueprint';
  previewAlt: string;
  previewImageUrl?: string;
  modules: ProjectModule[];
  caseStudy: ProjectCaseStudy;
}

export type ExperimentStage = 'completed' | 'ongoing' | 'proposed';

export interface ResearchManuscript {
  id: string;
  title: string;
  cardTitle?: string;
  workingTitle?: string;
  status: 'Unpublished Research' | 'Research in Progress' | 'Manuscript in Preparation';
  domain: string;
  researchArea?: string;
  centralQuestion?: string;
  datasetsOrBenchmarks: string;
  methods: string[];
  abstract: string;
  motivation: string;
  expectedContribution: string;
  contributionAreas?: string[];
  keyFocus: string;
  featuredDirection?: boolean;
  relatedProjectId?: string;
  researchQuestions?: string[];
  methodologySteps?: string[];
  completedWork?: string[];
  ongoingWork?: string[];
  proposedWork?: string[];
  limitations?: string[];
  futureDirections?: string[];
}

export interface ResearchExperiment {
  id: string;
  title: string;
  stage: ExperimentStage;
  stageLabel: 'Completed Experiment' | 'Ongoing Experiment' | 'Proposed Experiment';
  domain: string;
  dataset: string;
  summary: string;
  relatedStudyId?: string;
  relatedProjectId?: string;
}

export interface ResearchDatasetEntry {
  id: string;
  name: string;
  domain: string;
  scope: string;
  usage: string;
  featured?: boolean;
}

export interface ResearchNoteEntry {
  id: string;
  title: string;
  dateLabel: string;
  topic: string;
  summary: string;
  relatedStudyId?: string;
}

export interface ResearchMethodologyStep {
  step: string;
  title: string;
  description: string;
}

export interface ResearchToolGroup {
  category: string;
  tools: string[];
}

export interface ResearchPublicationRecord {
  id: string;
  title: string;
  venue: string;
  year: string;
  doi?: string;
}

export type ExperienceCategory = 'executive' | 'ambassador' | 'events_volunteering';

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  organizationCode: string;
  organizationLogoUrl?: string;
  category: ExperienceCategory;
  subCategory?:
    | 'Events'
    | 'Organizations'
    | 'Executive Committee'
    | 'Department & Club'
    | 'Event Organization'
    | 'Volunteering';
  period: string;
  isCurrent: boolean;
  location: string;
  responsibility: string;
  actualContribution: string;
  summary: string;
  highlights: string[];
  evidenceUrl?: string;
  evidenceLabel?: string;
  certificateId?: string;
  missingInfo?: string[];
}

export interface AchievementEntry {
  id: string;
  title: string;
  placement: string;
  organization: string;
  organizationCode: string;
  organizationLogoUrl?: string;
  year: string;
  category:
    | 'Competition'
    | 'Academic'
    | 'Public Speaking'
    | 'Recognition & Volunteering';
  details: string;
  certificateId?: string;
  missingInfo?: string[];
}

export interface CertificateAttachment {
  id: string;
  title: string;
  issuer: string;
  organizationCode: string;
  organizationLogoUrl?: string;
  date: string;
  category: 'Experience & Outreach' | 'Competition' | 'Volunteering' | 'Academic';
  status: 'Verified Attachment' | 'Pending Upload';
  credentialId?: string;
  verificationUrl?: string;
  fileUrl?: string;
  fileType?: 'PDF' | 'Image';
  rotateDeg?: 90 | 180 | 270;
  linkedEntryId?: string;
  linkedRoute?: string;
  notes: string;
}

export type VisualArchiveCategory =
  | 'Academic achievements'
  | 'Awards and competitions'
  | 'Public speaking'
  | 'Leadership activities'
  | 'Campus ambassador experiences'
  | 'Volunteering'
  | 'University events'
  | 'Projects'
  | 'Personal photographs';

export type VisualArchiveKind =
  | 'Event Photograph'
  | 'Certificate'
  | 'Appointment Letter'
  | 'Official Poster'
  | 'Portrait'
  | 'Video Submission';

export interface VisualArchiveItem {
  id: string;
  filename: string;
  src: string;
  mediaType?: 'image' | 'video';
  category: VisualArchiveCategory;
  associatedRecord: string;
  linkedRoute?: string;
  linkedExperienceId?: string;
  linkedAchievementId?: string;
  linkedEducationId?: string;
  linkedJourneyId?: string;
  certificateId?: string;
  eventGroup: string;
  caption: string;
  date: string;
  alt: string;
  kind: VisualArchiveKind;
  featuredOnHome?: boolean;
  needsConfirmation?: string;
  rotateDeg?: 90 | 180 | 270;
  focalPosition?: 'top' | 'upper' | 'center' | 'bottom' | 'lower';
}

export type SkillCategoryId =
  | 'industrial-engineering'
  | 'programming-software'
  | 'data-ml'
  | 'operations-research'
  | 'research-methods'
  | 'communication-leadership';

export interface SkillEvidenceLink {
  label: string;
  kind: 'Project' | 'Research' | 'Coursework' | 'Experience' | 'Award';
  to: string;
}

export interface SkillItem {
  name: string;
  detail?: string;
  proficiency?: string;
  evidenceLinks?: SkillEvidenceLink[];
}

export interface SkillCategoryGroup {
  id: SkillCategoryId;
  title: string;
  subtitle: string;
  summary: string;
  items: SkillItem[];
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export type JourneyCategory =
  | 'Academic Foundation'
  | 'Engineering & Research'
  | 'Competitions & Voice'
  | 'Leadership & Outreach';

export interface JourneyMilestone {
  id: string;
  year: string;
  title: string;
  institution: string;
  category: JourneyCategory;
  detail: string;
  highlights: string[];
  takeaway: string;
}

export interface AcademicInterest {
  id: string;
  title: string;
  domain: string;
  summary: string;
  topics: string[];
}

export interface AspirationGoal {
  id: string;
  horizon: string;
  title: string;
  description: string;
  pillars: string[];
}

export interface AboutStory {
  eyebrow: string;
  headline: string;
  personalIntroduction: string;
  biographyParagraphs: string[];
  personalDevelopmentNarrative: string;
  portrait: {
    src: string;
    alt: string;
    caption: string;
    context: string;
  };
}

export type InnovationStage = 'idea' | 'prototype' | 'validated' | 'launched';

export interface InnovationEntry {
  id: string;
  title: string;
  category:
    | 'Software Prototype'
    | 'Research Prototype'
    | 'Product Concept'
    | 'Innovation Competition'
    | 'Startup Exploration';
  stage: InnovationStage;
  stageLabel:
    | 'Idea & Concept'
    | 'Working Prototype'
    | 'Validated Solution'
    | 'Launched Product';
  period: string;
  teamContext: string;
  problemIdentified: string;
  targetUsers: string;
  proposedSolution: string;
  innovationApproach: string;
  currentDevelopmentStage: string;
  validationStatus: string;
  futureRoadmap: string;
  relatedProjectId?: string;
  missingInfo?: string[];
}

export interface InnovationTimelineItem {
  id: string;
  period: string;
  title: string;
  stage: InnovationStage;
  kind: 'Prototype Build' | 'Competition Track' | 'Product Concept' | 'Future Plan';
  organizationOrContext: string;
  summary: string;
  statusNote: string;
  linkedInnovationId?: string;
}

export interface ProblemSolvingStep {
  step: string;
  title: string;
  question: string;
  methods: string[];
  appliedTo: string;
}

export interface InnovationCompetitionRecord {
  id: string;
  title: string;
  organizer: string;
  placement: string;
  year: string;
  teamName?: string;
  domain: string;
  problemSolvingFocus: string;
  missingInfo?: string;
}

export interface TeamCollaborationHighlight {
  id: string;
  context: string;
  role: string;
  collaborators: string;
  focus: string;
}

export interface FutureInnovationPlan {
  id: string;
  horizon: string;
  title: string;
  stage: InnovationStage;
  hypothesis: string;
  nextMilestone: string;
}

