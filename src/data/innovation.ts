import type {
  FutureInnovationPlan,
  InnovationCompetitionRecord,
  InnovationEntry,
  InnovationTimelineItem,
  ProblemSolvingStep,
  TeamCollaborationHighlight,
} from "../types/portfolio";

export const INNOVATION_PROFILE_META = {
  positioningTitle: 'Systems Problem-Solving, Technical Prototyping & Case Strategy',
  positioningSummary:
    'Applying Industrial & Production Engineering frameworks to diagnose operational bottlenecks, build working software and research prototypes, and compete in national business and social-venture competitions—maintaining clear boundaries between early ideas, active prototypes, and future validation.',
  transparencyStatement:
    'No commercial customers, external business validation, angel/VC funding, or launched market products are claimed. Validated Solutions (0) and Launched Products (0) remain at zero until verified customer pilots or live releases occur.',
  ventureReadinessNote:
    '0 Validated Solutions · 0 Launched Products · No External Funding Claimed',
};

export const INNOVATION_ENTRIES: InnovationEntry[] = [
  {
    id: 'inn-factorymind',
    title: 'FactoryMind — Smart Production & Operations Optimization Suite',
    category: 'Software Prototype',
    stage: 'prototype',
    stageLabel: 'Working Prototype',
    period: 'Active Open-Source Prototype',
    teamContext: 'Independent IPE Software Build · Public GitHub Repository',
    problemIdentified:
      'Manufacturing teams—especially in labor- and throughput-sensitive Ready-Made Garments (RMG) workflows—frequently plan scheduling, inventory sizing, Statistical Process Control (SPC), equipment reliability, and line balancing across disconnected spreadsheets.',
    targetUsers:
      'Industrial engineers, shop-floor production planners, operations analysts, and IPE undergraduates evaluating multi-stage manufacturing trade-offs.',
    proposedSolution:
      'A unified five-module Streamlit analytical application connecting OR-Tools Mixed-Integer Programming, Genetic Algorithms, and Simulated Annealing scheduling with supply chain allocation, SPC charts, Scikit-Learn predictive maintenance, and Discrete-Event Simulation.',
    innovationApproach:
      'Translating standalone Industrial & Production Engineering algorithms into an open-source, interactive decision-support suite centered on a Bangladesh RMG operational scenario.',
    currentDevelopmentStage:
      'Working open-source software prototype published at github.com/Ibtasham/FactoryMind with all five analytical engines operational.',
    validationStatus:
      'Technical modules implemented and verified on RMG case scenarios; no external factory pilot, paying industrial customers, or commercial business validation claimed.',
    futureRoadmap:
      'Add reproducible benchmark presets, automated module test coverage, carbon-aware scheduling constraints from ongoing research, and pilot usability feedback with SME plant engineers.',
    relatedProjectId: 'factorymind',
  },
  {
    id: 'inn-forgemind',
    title: 'ForgeMind AI — Decision-Aware Predictive Maintenance Platform',
    category: 'Research Prototype',
    stage: 'prototype',
    stageLabel: 'Working Prototype',
    period: 'Research Prototype · Experiments Active',
    teamContext: 'Undergraduate Research Prototype · Private Codebase',
    problemIdentified:
      'Predictive maintenance models are routinely judged on point prediction error (RMSE) or statistical calibration alone without testing whether predicted uncertainty actually reduces maintenance policy cost under operating-condition shift.',
    targetUsers:
      'Reliability engineers, asset maintenance planners, and industrial analytics researchers evaluating condition-based replacement thresholds.',
    proposedSolution:
      'A two-stage prognostics platform separating implemented NASA C-MAPSS RUL modeling (Random Forest, XGBoost, LSTM + SHAP sensor reduction) from a proposed uncertainty-to-cost maintenance policy simulator.',
    innovationApproach:
      'Coupling explainable sensor-footprint reduction with decision-aware policy evaluation so maintenance schedules optimize total replacement and failure risk rather than isolated prediction scores.',
    currentDevelopmentStage:
      'Working research prototype for C-MAPSS FD001 baselines and SHAP explainability; policy-cost simulation and domain-shift stress evaluation remain experimental.',
    validationStatus:
      'Baseline pipelines active on public NASA C-MAPSS datasets; zero industrial plant trials, commercial revenue, or business validation claimed.',
    futureRoadmap:
      'Complete asymmetric maintenance cost ratio experiments across multi-regime C-MAPSS and FEMTO/PRONOSTIA bearings and package reproducible open-source evaluation scripts.',
    relatedProjectId: 'forgemind-ai',
  },
  {
    id: 'inn-tikatrack',
    title: 'TikaTrack — Software & Product Concept',
    category: 'Product Concept',
    stage: 'idea',
    stageLabel: 'Idea & Concept',
    period: 'Concept Record · Source Pending',
    teamContext: 'Product Development Track · Awaiting Supplied Codebase',
    problemIdentified:
      'Problem definition, user friction points, and operational scope remain held as an inspectable placeholder until TikaTrack source files and README brief are supplied.',
    targetUsers:
      'Pending supplied product brief and architecture documentation (no target user demographics or market size figures fabricated).',
    proposedSolution:
      'Registered product development concept structured for modular documentation of client workflows, core logic, and UI captures once repository files are attached.',
    innovationApproach:
      'Modular engineering documentation discipline—separating verified software implementation from unverified product assumptions prior to codebase review.',
    currentDevelopmentStage:
      'Idea & documentation slot active in Project Laboratory (/projects/tikatrack); awaiting supplied source package and screenshots.',
    validationStatus:
      'Unvalidated concept awaiting supplied codebase and product brief; zero user adoption or commercial claims recorded.',
    futureRoadmap:
      'Inspect supplied TikaTrack codebase, document implemented user workflows, attach verified UI screenshots, and define early user feedback tests.',
    relatedProjectId: 'tikatrack',
    missingInfo: [
      'Supplied source code, product brief, and target user definition pending manual completion.',
    ],
  },
  {
    id: 'inn-innovesta-unbound',
    title: 'Innovesta 3.0 — Team "The Unbound" Case Solution',
    category: 'Innovation Competition',
    stage: 'idea',
    stageLabel: 'Idea & Concept',
    period: 'Sep 2026',
    teamContext: 'Team "The Unbound" · GDN-SUST Competition Track',
    problemIdentified:
      'Competitive innovation and business case challenge framed by Graduate Development Network (GDN-SUST); exact prompt specification pending case deck attachment.',
    targetUsers:
      'Competition stakeholder segment addressed in the case round (exact customer persona pending deck upload).',
    proposedSolution:
      'Collaborative team innovation concept integrating structured root-cause analysis, operational feasibility, and clear presentation delivery to advance into the Top 10 final round.',
    innovationApproach:
      'Cross-functional case decomposition—combining engineering workflow thinking, structured argumentation, and visual pitch storytelling under strict competition deadlines.',
    currentDevelopmentStage:
      'Idea-stage competition case proposal presented by Team "The Unbound" in the Innovesta 3.0 finals.',
    validationStatus:
      'Jury progression verified: Top 10 Finalist recognition (GDN-SUST, Sep 2026). No external startup incorporation, funding, or post-competition launch claimed.',
    futureRoadmap:
      'Archive team pitch deck summary and finalist certificate in portfolio records; extract viable analytical frameworks for future inter-university competitions.',
    missingInfo: [
      'Original Innovesta 3.0 prompt brief, pitch deck summary, and teammate credits pending manual addition.',
    ],
  },
  {
    id: 'inn-hult-prize',
    title: 'Hult Prize SUST — Social Venture Concept',
    category: 'Innovation Competition',
    stage: 'idea',
    stageLabel: 'Idea & Concept',
    period: '2026',
    teamContext: 'Hult Prize at SUST · Campus Venture Team',
    problemIdentified:
      'Social and sustainability challenge framed under the Hult Prize campus prompt (specific venture problem brief and SDG alignment pending manual entry).',
    targetUsers:
      'Impact beneficiaries and campus/community stakeholders targeted by the competition pitch (exact segment details pending pitch upload).',
    proposedSolution:
      'Social-entrepreneurship venture concept structured around sustainable operations impact, problem-solution fit, and measurable delivery feasibility.',
    innovationApproach:
      'Translating Industrial Engineering systems thinking and unit-feasibility framing into a socially focused student venture pitch.',
    currentDevelopmentStage:
      'Early-stage social venture concept presented at the Hult Prize SUST Campus Round (Semi-Finalist stage).',
    validationStatus:
      'Campus jury selection to Semi-Finalist stage (2026). No seed capital, investors, legal entity, or active customers claimed.',
    futureRoadmap:
      'Attach social venture title, pitch overview, and semi-finalist documentation; evaluate whether any operational tooling component merits prototyping.',
    missingInfo: [
      'Venture name, exact campus round date, and pitch summary pending manual completion.',
    ],
  },
  {
    id: 'inn-rmg-copilot',
    title: 'Exploratory Concept: SME Apparel Line-Balancing & Scheduling Copilot',
    category: 'Startup Exploration',
    stage: 'idea',
    stageLabel: 'Idea & Concept',
    period: 'Exploratory Hypothesis · 2026–2027',
    teamContext: 'Independent IPE Venture Hypothesis (Building on FactoryMind)',
    problemIdentified:
      'Smaller apparel and light-manufacturing units in Bangladesh often lack budget for enterprise ERP modules yet lose throughput daily to manual line rebalancing, bottleneck blind spots, and machine downtime.',
    targetUsers:
      'Hypothesis target: Industrial Engineering (IE) officers and floor supervisors in mid-sized SME manufacturing plants (untested via customer discovery interviews yet).',
    proposedSolution:
      'Concept to package FactoryMind’s Python OR-Tools scheduling, SPC drift alerts, and discrete-event line simulation into a lightweight, low-overhead web decision copilot for SME industrial engineers.',
    innovationApproach:
      'Leveraging open-source mathematical solvers and accessible browser interfaces rather than expensive proprietary manufacturing suites.',
    currentDevelopmentStage:
      'Pre-validation startup idea derived conceptually from FactoryMind’s Bangladesh RMG case study; no independent commercial product spun out yet.',
    validationStatus:
      'Pure conceptual hypothesis. Zero customer interviews conducted, zero pilot plants onboarded, and zero funding or revenue claimed.',
    futureRoadmap:
      'Conduct structured problem-discovery interviews with IPE alumni and IE practitioners in RMG factories before deciding whether to build an SME pilot interface.',
    relatedProjectId: 'factorymind',
  },
];

export const INNOVATION_TIMELINE: InnovationTimelineItem[] = [
  {
    id: 'tl-2024-init',
    period: '2024',
    title: 'iNIT 3.0 — 1st Place in IT Olympiad & Tech Event Execution',
    stage: 'idea',
    kind: 'Competition Track',
    organizationOrContext: 'Notre Dame IT Club · Dhaka',
    summary:
      'Won 1st Place in the IT Olympiad segment and earned a Volunteer Certificate of Excellence at iNIT 3.0 (hosted at IUB), strengthening technical problem-solving under competitive time constraints.',
    statusNote: 'Verified Competition & Event Record',
  },
  {
    id: 'tl-factorymind',
    period: '2025 – 2026',
    title: 'FactoryMind — 5-Module Open-Source Operations Prototype Built',
    stage: 'prototype',
    kind: 'Prototype Build',
    organizationOrContext: 'Independent IPE Engineering · GitHub',
    summary:
      'Translated Industrial & Production Engineering theory (OR-Tools MIP, GA/SA, SPC, ML predictive maintenance, and DES) into an interactive Streamlit software prototype anchored on an RMG case study.',
    statusNote: 'Working Open-Source Prototype · No Commercial Pilot',
    linkedInnovationId: 'inn-factorymind',
  },
  {
    id: 'tl-forgemind',
    period: '2026 · Active',
    title: 'ForgeMind AI — Uncertainty-Aware Prognostics Research Prototype',
    stage: 'prototype',
    kind: 'Prototype Build',
    organizationOrContext: 'NASA C-MAPSS Benchmarks · Reliability Track',
    summary:
      'Developed comparative C-MAPSS FD001 Remaining Useful Life baselines and SHAP sensor reduction pipelines, while scoping proposed maintenance-cost policy simulation experiments.',
    statusNote: 'Research Prototype · Experiments Active',
    linkedInnovationId: 'inn-forgemind',
  },
  {
    id: 'tl-2026-cases',
    period: '2026',
    title: 'Hult Prize SUST, Case Quest 2.0, ShowCase 1.0 & Innovesta 3.0',
    stage: 'idea',
    kind: 'Competition Track',
    organizationOrContext: 'SUST · GDN-SUST · IPE Assoc. · AIBA Sylhet',
    summary:
      'Competed across entrepreneurship and business strategy rounds: Innovesta 3.0 Top 10 Finalist (Team "The Unbound", Sep 2026), Case Quest 2.0 Finalist, ShowCase 1.0 National Semi-Finalist, and Hult Prize SUST Semi-Finalist.',
    statusNote: 'Idea & Case Strategy Stage · Verified Placements',
    linkedInnovationId: 'inn-innovesta-unbound',
  },
  {
    id: 'tl-2026-ecosystem',
    period: 'Aug – Oct 2026',
    title: 'Campus Representation for AI, Tech & Data Platforms (200+ Community)',
    stage: 'idea',
    kind: 'Product Concept',
    organizationOrContext: 'Elevetr AI · STechNest · Data Solution-360 · SSA',
    summary:
      'Served as Campus Director (Elevetr AI), Campus Ambassador (STechNest, Data Solution-360 building a 200+ student learning group for THE UNBOUND), and 21st EC Asst. Organizing Secretary at SUST Science Arena.',
    statusNote: 'Student Ecosystem & Community Execution',
  },
  {
    id: 'tl-future-validation',
    period: '2026 – 2027 Horizon',
    title: 'Customer Discovery, TikaTrack Documentation & Pilot Testing Roadmap',
    stage: 'idea',
    kind: 'Future Plan',
    organizationOrContext: 'Planned Validation & Prototyping Milestones',
    summary:
      'Next phase focuses on documenting TikaTrack upon codebase supply, gathering practicing IE practitioner feedback on FactoryMind workflows, and finalizing reproducible research tooling.',
    statusNote: 'Planned Roadmap · Pre-Validation',
    linkedInnovationId: 'inn-rmg-copilot',
  },
];

export const PROBLEM_SOLVING_FRAMEWORK: ProblemSolvingStep[] = [
  {
    step: '01',
    title: 'Bottleneck & Root-Cause Framing',
    question: 'Where do operational delays, unplanned failures, or disconnected manual workflows actually occur?',
    methods: ['IPE Systems Mapping', 'Constraint Diagnosis', 'Stakeholder Empathy'],
    appliedTo: 'RMG line scheduling friction (FactoryMind) and multi-case business diagnostics (Case Quest 2.0, ShowCase 1.0).',
  },
  {
    step: '02',
    title: 'Quantitative & Economic Formulation',
    question: 'How should decisions be scored by real operational cost rather than abstract proxy metrics?',
    methods: ['Mixed-Integer Optimization', 'Asymmetric Cost Modeling', 'Pareto Trade-Offs'],
    appliedTo: 'Mapping RUL prediction errors to preventive vs. reactive maintenance cost (ForgeMind AI) and carbon-tariff scheduling.',
  },
  {
    step: '03',
    title: 'Rapid Open-Tooling Prototype',
    question: 'What minimum working analytical interface lets an engineer inspect trade-offs hands-on?',
    methods: ['Python & OR-Tools', 'Streamlit Interfaces', 'SHAP Feature Reduction'],
    appliedTo: 'Building the five-module FactoryMind Streamlit suite and C-MAPSS baseline pipeline.',
  },
  {
    step: '04',
    title: 'Team Critique & Pitch Storytelling',
    question: 'Can the problem, solution feasibility, and operational value survive live jury scrutiny?',
    methods: ['Team Case Synthesis', 'Structured Slide Narratives', 'Extempore Q&A Defense'],
    appliedTo: 'Team "The Unbound" (Innovesta 3.0 Top 10), Hult Prize SUST rounds, and Speak Up 2026 delivery.',
  },
  {
    step: '05',
    title: 'Honest Validation & Iteration Gate',
    question: 'What is empirically verified today versus what requires practitioner testing before launch?',
    methods: ['Controlled Benchmarks', 'Practitioner Discovery', 'Scope Transparency'],
    appliedTo: 'Distinguishing active software/research prototypes from externally validated or launched commercial products.',
  },
];

export const INNOVATION_COMPETITIONS: InnovationCompetitionRecord[] = [
  {
    id: 'comp-innovesta',
    title: 'Innovesta 3.0',
    organizer: 'Graduate Development Network (GDN-SUST)',
    placement: 'Finalist (Top 10)',
    year: 'Sep 2026',
    teamName: 'Team "The Unbound"',
    domain: 'Innovation & Business Strategy Case',
    problemSolvingFocus:
      'Collaborated with teammates to structure an innovative business solution and defend feasibility in the Top 10 final round.',
    missingInfo: 'Case prompt details and final pitch deck summary ready for manual upload.',
  },
  {
    id: 'comp-hult',
    title: 'Hult Prize — SUST Campus Round',
    organizer: 'Hult Prize at SUST',
    placement: 'Semi-Finalist',
    year: '2026',
    domain: 'Social Entrepreneurship & Impact Venture',
    problemSolvingFocus:
      'Developed and pitched an early-stage social impact concept aligned with the annual Hult Prize challenge framework.',
    missingInfo: 'Social venture name and pitch brief pending manual addition.',
  },
  {
    id: 'comp-casequest',
    title: 'Case Quest 2.0',
    organizer: 'IPE Association, SUST',
    placement: 'Finalist',
    year: '2026',
    domain: 'Industrial & Operations Case Competition',
    problemSolvingFocus:
      'Tackled departmental industrial engineering and business operations constraints to advance to the final round.',
    missingInfo: 'Exact date, team name, and case brief pending completion.',
  },
  {
    id: 'comp-showcase',
    title: 'ShowCase 1.0: National Business Case Competition',
    organizer: 'AIBA Business Club, Sylhet · Lifeline Welfare Org. (with ACCA & Marico BD)',
    placement: 'Semi-Finalist',
    year: '2026',
    domain: 'National Business Case Strategy',
    problemSolvingFocus:
      'Analyzed strategic market and operational trade-offs in an inter-university national business case challenge.',
    missingInfo: 'Exact competition round date and team roster pending upload.',
  },
  {
    id: 'comp-init',
    title: 'IT Olympiad — iNIT 3.0',
    organizer: 'Notre Dame Information Technology Club (NDITC)',
    placement: '1st Place',
    year: '2024',
    domain: 'Technology & Analytical Problem-Solving',
    problemSolvingFocus:
      'Secured 1st Place in individual analytical and IT problem-solving competition at Notre Dame College.',
  },
];

export const TEAM_COLLABORATION_HIGHLIGHTS: TeamCollaborationHighlight[] = [
  {
    id: 'collab-unbound',
    context: 'Team "The Unbound" · Business & Innovation Case Rounds',
    role: 'Team Finalist & Analytical Strategist',
    collaborators: 'Cross-functional undergraduate case teammates at SUST',
    focus:
      'Divided quantitative structuring, operational feasibility checks, slide architecture, and live Q&A defense under competition deadlines (Innovesta 3.0 Top 10).',
  },
  {
    id: 'collab-ssa-gdn',
    context: 'SUST Science Arena (21st EC) & GDN-SUST (11th EC)',
    role: 'Asst. Organizing Secretary & Organizing Executive',
    collaborators: 'Executive boards, faculty advisors, and student organizing teams',
    focus:
      'Planning workshops, career grooming sessions, recruitment drives, and science innovation initiatives across campus student cohorts.',
  },
  {
    id: 'collab-tech-ecosystem',
    context: 'Elevetr AI · STechNest · Data Solution-360',
    role: 'Campus Director & Campus Ambassador',
    collaborators: 'Startup/tech partner teams & 200+ campus student learners',
    focus:
      'Connecting SUST students with AI automation, digital growth, and applied data literacy initiatives—helping grow a 200+ member community for THE UNBOUND course.',
  },
];

export const FUTURE_INNOVATION_PLANS: FutureInnovationPlan[] = [
  {
    id: 'fip-1',
    horizon: 'Near-Term · Prototype & Documentation',
    title: 'Complete TikaTrack Dossier & Expand FactoryMind Usability',
    stage: 'prototype',
    hypothesis:
      'Making open-source optimization and software tools thoroughly documented with clean test presets lowers the barrier for student and SME adoption.',
    nextMilestone:
      'Integrate supplied TikaTrack repository/screenshots and add reproducible scenario presets plus automated tests to FactoryMind.',
  },
  {
    id: 'fip-2',
    horizon: 'Mid-Term · Practitioner Discovery (Pre-Validation)',
    title: 'Validate Real Shop-Floor Workflow Pain With IPE Practitioners',
    stage: 'idea',
    hypothesis:
      'Before treating any manufacturing software concept as a startup product, direct interviews with IE officers in Bangladesh RMG units must verify willingness to adopt browser-based decision tools.',
    nextMilestone:
      'Conduct structured problem-discovery conversations with practicing IPE alumni to test assumptions behind the SME Line-Balancing Copilot hypothesis.',
  },
  {
    id: 'fip-3',
    horizon: 'Long-Term · Research-to-Tooling Translation',
    title: 'Bridge Carbon-Aware Scheduling & Decision-Aware PdM Into Open Tooling',
    stage: 'prototype',
    hypothesis:
      'Embedding uncertainty-aware maintenance cost models and grid-carbon-aware scheduling into accessible open-source software creates tangible operational value.',
    nextMilestone:
      'Release reproducible Python modules connecting ForgeMind AI and carbon-aware scheduling formulations once benchmark experiments conclude.',
  },
];

