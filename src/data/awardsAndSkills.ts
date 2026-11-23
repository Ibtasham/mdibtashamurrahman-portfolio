import type {
  AchievementEntry,
  CertificateAttachment,
  SkillCategoryGroup,
  SkillGroup,
} from "../types/portfolio";

export const ACHIEVEMENTS: AchievementEntry[] = [
  {
    id: 'ach-init',
    title: 'IT Olympiad — iNIT 3.0',
    placement: '1st Place',
    organization: 'Notre Dame IT Club',
    organizationCode: 'NDITC',
    year: '2024',
    category: 'Competition',
    details: 'Secured 1st Place in the IT Olympiad segment of iNIT 3.0.',
    certificateId: 'cert-init-olympiad',
    missingInfo: [
      'Exact event month/day in 2024 and competition bracket details pending manual entry.',
      'Award certificate PDF/image pending upload.',
    ],
  },
  {
    id: 'ach-triple-gpa',
    title: 'Triple GPA 5.00 & Government Talent Pool Scholarship',
    placement: 'GPA 5.00 / 5.00 (JSC, SSC, HSC)',
    organization: 'Government of Bangladesh · Education Boards',
    organizationCode: 'GOB',
    year: '2019 · 2022 · 2024',
    category: 'Academic',
    details:
      'Achieved a perfect 5.00 GPA across JSC (2019), SSC (2022), and HSC (2024), earning the Govt. of Bangladesh Talent Pool Scholarship in JSC.',
    certificateId: 'cert-academic-scholar',
    missingInfo: ['Board scholarship gazette/certificate scan optional for upload.'],
  },
  {
    id: 'ach-speakup',
    title: 'Speak Up 2026 — Extempore Speech Competition',
    placement: '4th Place Overall (1st in 2024–25 Session)',
    organization: 'Shahjalal University Speakers Club (SUSC)',
    organizationCode: 'SUSC',
    year: '18 Sep 2026',
    category: 'Public Speaking',
    details:
      'Ranked 4th overall in the final round on 18 September 2026 and placed 1st among competitors from the 2024–25 academic session.',
    certificateId: 'cert-speakup-2026',
  },
  {
    id: 'ach-innovesta',
    title: 'Innovesta 3.0',
    placement: 'Finalist (Top 10)',
    organization: 'Graduate Development Network (GDN-SUST)',
    organizationCode: 'GDN',
    year: 'Sep 2026',
    category: 'Competition',
    details: 'Represented team "The Unbound" and advanced to remain among the Top 10 finalists.',
    certificateId: 'cert-innovesta-3',
    missingInfo: ['Case problem statement / pitch summary pending manual completion.'],
  },
  {
    id: 'ach-casequest',
    title: 'Case Quest 2.0',
    placement: 'Finalist',
    organization: 'IPE Association, SUST',
    organizationCode: 'IPEA',
    year: '2026',
    category: 'Competition',
    details: 'Advanced to the final round of the departmental business and industrial case competition.',
    missingInfo: ['Exact month, team name, and finalist certificate pending manual completion.'],
  },
  {
    id: 'ach-showcase',
    title: 'ShowCase 1.0: National Business Case Competition',
    placement: 'Semi-Finalist',
    organization: 'AIBA Business Club, Sylhet · Lifeline Welfare Organisation',
    organizationCode: 'AIBA',
    year: '2026',
    category: 'Competition',
    details:
      'Advanced to the national Semi-Finalist stage (strategic partners: ACCA & Marico Bangladesh Ltd.).',
    certificateId: 'cert-showcase-1',
    missingInfo: ['Exact competition date and team name pending manual completion.'],
  },
  {
    id: 'ach-hult',
    title: 'Hult Prize — SUST Campus Round',
    placement: 'Semi-Finalist',
    organization: 'Hult Prize at SUST',
    organizationCode: 'HULT',
    year: '2026',
    category: 'Competition',
    details:
      'Reached the campus Semi-Finalist stage in the global student social-entrepreneurship competition.',
    missingInfo: ['Exact competition date, social venture name, and certificate pending manual completion.'],
  },
  {
    id: 'ach-init-volunteer',
    title: 'iNIT 3.0 — Volunteering Certificate of Excellence',
    placement: 'Certificate of Excellence',
    organization: 'Notre Dame Information Technology Club (at IUB)',
    organizationCode: 'NDITC',
    year: 'Mar 2024',
    category: 'Recognition & Volunteering',
    details:
      'Awarded Certificate of Excellence signed by NDITC Moderator Saikat Lawrence Rozario and Notre Dame College Principal Dr. Fr. Hemanto Pius Rozario, CSC for event volunteering in iNIT 3.0.',
    certificateId: 'cert-init-volunteer',
  },
  {
    id: 'ach-research-odyssey',
    title: 'Research Odyssey 2.0 — Campus Ambassador Recognition',
    placement: 'Certificate of Achievement',
    organization: 'AUST Research and Publication Club (AUSTRPC)',
    organizationCode: 'AUSTRPC',
    year: 'Aug 2026',
    category: 'Recognition & Volunteering',
    details:
      'Awarded signed digital Certificate of Achievement recognizing enthusiasm and commitment during nationwide Bangladesh event outreach for Research Odyssey 2.0.',
    certificateId: 'cert-research-odyssey',
  },
];

export const CERTIFICATES: CertificateAttachment[] = [
  {
    id: 'cert-research-odyssey',
    title: 'Research Odyssey 2.0 — Campus Ambassador Certificate of Achievement',
    issuer: 'AUST Research and Publication Club (AUSTRPC)',
    organizationCode: 'AUSTRPC',
    date: 'Aug 2026',
    category: 'Experience & Outreach',
    status: 'Verified Attachment',
    fileUrl: '/assets/aistudio/Ibtashamur_Rahman_31aca808.pdf',
    fileType: 'PDF',
    linkedEntryId: 'research-odyssey-2',
    linkedRoute: '/experience/research-odyssey-2',
    notes:
      'Signed digital Certificate of Achievement recognizing nationwide Bangladesh event outreach for Research Odyssey 2.0.',
  },
  {
    id: 'cert-speakup-2026',
    title: 'Speak Up 2026 — 4th Place Certificate of Achievement',
    issuer: "Shahjalal University Speakers' Club (SUSC)",
    organizationCode: 'SUSC',
    date: '18 Sep 2026',
    category: 'Competition',
    status: 'Verified Attachment',
    fileUrl: '/assets/aistudio/1790517980130_c22c864c.jpeg',
    fileType: 'Image',
    linkedEntryId: 'ach-speakup',
    linkedRoute: '/awards',
    notes:
      'Scanned Certificate of Achievement signed by Chief Advisor Dr. Md Nazrul Islam and President Abul Hasnat Akanda recognizing 4th place in SPEAK UP - 2026 on 18 September 2026 at SUST.',
  },
  {
    id: 'cert-innovesta-3',
    title: 'Innovesta 3.0 — Finalist Certificate of Participation',
    issuer: 'Graduate Development Network (GDN-SUST)',
    organizationCode: 'GDN',
    date: 'Sep 2026',
    category: 'Competition',
    status: 'Verified Attachment',
    fileUrl: '/assets/aistudio/1790618355233_b2f278cc.jpeg',
    fileType: 'Image',
    linkedEntryId: 'ach-innovesta',
    linkedRoute: '/awards',
    notes:
      'Scanned Certificate of Participation signed by GDN-SUST President Shibly Sadik Sojeeb and General Secretary Fatiha Chowdhury Ratri recognizing MD Ibtashamur Rahman as Finalist representing Team The Unbound.',
  },
  {
    id: 'cert-showcase-1',
    title: 'ShowCase 1.0: National Business Case Competition — Certificate',
    issuer: 'AIBA Business Club, Sylhet · Lifeline Welfare Organisation',
    organizationCode: 'AIBA',
    date: '2026',
    category: 'Competition',
    status: 'Verified Attachment',
    fileUrl: '/assets/aistudio/1789471998181_dcacdddc.jpeg',
    fileType: 'Image',
    linkedEntryId: 'ach-showcase',
    linkedRoute: '/awards',
    notes:
      'Digital Certificate of Participation for ShowCase 1.0: National Business Case Competition (2026), co-powered by NAAAS Holding Venture BD Ltd. in association with ACCA and strategic partner Marico Bangladesh Ltd.',
  },
  {
    id: 'cert-init-volunteer',
    title: 'iNIT 3.0 — Event Volunteer Certificate of Excellence',
    issuer: 'Notre Dame Information Technology Club (NDITC)',
    organizationCode: 'NDITC',
    date: 'Mar 2024',
    category: 'Volunteering',
    status: 'Verified Attachment',
    fileUrl: '/assets/aistudio/1789367702778_6063110f.jpeg',
    fileType: 'Image',
    linkedEntryId: 'vol-init-3',
    linkedRoute: '/experience/vol-init-3',
    notes:
      'Scanned Certificate of Excellence signed by NDITC Moderator Saikat Lawrence Rozario and Notre Dame College Principal Dr. Fr. Hemanto Pius Rozario, CSC for volunteering in IUB Presents init 3.0.',
  },
  {
    id: 'cert-init-olympiad',
    title: 'iNIT 3.0 — IT Olympiad 1st Place Recognition',
    issuer: 'Notre Dame Information Technology Club (NDITC)',
    organizationCode: 'NDITC',
    date: '2024',
    category: 'Competition',
    status: 'Pending Upload',
    linkedEntryId: 'ach-init',
    linkedRoute: '/awards',
    notes:
      'Verified competition distinction from Notre Dame Information Technology Club (NDITC). Digital scan archival documentation pending.',
  },
  {
    id: 'cert-academic-scholar',
    title: 'JSC Talent Pool Scholarship & SSC / HSC GPA 5.00 Transcripts',
    issuer: 'Government of Bangladesh · Education Boards',
    organizationCode: 'GOB',
    date: '2019 · 2022 · 2024',
    category: 'Academic',
    status: 'Pending Upload',
    linkedEntryId: 'ach-triple-gpa',
    linkedRoute: '/awards',
    notes:
      'Optional verification slot for official board scholarship notices or redacted mark sheets.',
  },
];

export const SKILL_CATEGORIES: SkillCategoryGroup[] = [
  {
    id: 'industrial-engineering',
    title: 'Industrial Engineering',
    subtitle: 'Production Systems, Quality & Manufacturing',
    summary:
      'Core B.Sc. Industrial & Production Engineering coursework and practical tooling spanning statistical quality monitoring, discrete-event simulation, and factory process flows.',
    items: [
      {
        name: 'Statistical Process Control (SPC)',
        detail:
          'X-bar/R control charts, anomaly flags, and process capability evaluation for production monitoring.',
        evidenceLinks: [
          { label: 'FactoryMind SPC Module', kind: 'Project', to: '/projects/factorymind' },
          { label: 'SUST IPE Coursework', kind: 'Coursework', to: '/about' },
        ],
      },
      {
        name: 'Manufacturing Systems & RMG Production Flow',
        detail:
          'Cycle-time bottlenecks, line balancing, workstation throughput, and garment shop-floor production context.',
        evidenceLinks: [
          { label: 'FactoryMind Case Study', kind: 'Project', to: '/projects/factorymind' },
        ],
      },
      {
        name: 'Discrete-Event Simulation',
        detail:
          'Modeling workstation queues, failure disruptions, and resource utilization dynamics across production lines.',
        evidenceLinks: [
          { label: 'FactoryMind Simulation Engine', kind: 'Project', to: '/projects/factorymind' },
          { label: 'M5 Periodic-Review Sim', kind: 'Research', to: '/research/decision-centric-demand' },
        ],
      },
      {
        name: 'Engineering Drawing & Graphics',
        detail:
          'Technical orthographic projection, spatial assembly interpretation, and engineering drafting fundamentals.',
        evidenceLinks: [
          { label: 'SUST IPE Curriculum', kind: 'Coursework', to: '/about' },
        ],
      },
      {
        name: 'Workshop Machinery',
        detail:
          'Foundational hands-on familiarity with undergraduate machining and workshop processes.',
        proficiency: 'Basic coursework exposure',
        evidenceLinks: [
          { label: 'SUST IPE Curriculum', kind: 'Coursework', to: '/about' },
        ],
      },
    ],
  },
  {
    id: 'programming-software',
    title: 'Programming and Software',
    subtitle: 'Python Applications, Interfaces & Documentation',
    summary:
      'Modular Python development, interactive analytical interfaces, reproducible workflows, and technical documentation.',
    items: [
      {
        name: 'Python Engineering Pipelines',
        detail:
          'Structuring optimization solvers, machine learning preprocessing, and simulation workflows into maintainable modules.',
        evidenceLinks: [
          { label: 'FactoryMind Repository', kind: 'Project', to: '/projects/factorymind' },
          { label: 'ForgeMind AI Platform', kind: 'Project', to: '/projects/forgemind-ai' },
        ],
      },
      {
        name: 'Streamlit Analytical Dashboards',
        detail:
          'Building interactive decision-support web tools uniting scheduling, SPC charts, and reliability views.',
        evidenceLinks: [
          { label: 'FactoryMind Streamlit UI', kind: 'Project', to: '/projects/factorymind' },
        ],
      },
      {
        name: 'Software Prototyping & Version Control (Git)',
        detail:
          'Repository organization, dependency management, technical README authoring, and collaborative code workflows.',
        evidenceLinks: [
          { label: 'FactoryMind', kind: 'Project', to: '/projects/factorymind' },
          { label: 'IT Olympiad 1st Place', kind: 'Award', to: '/awards' },
        ],
      },
      {
        name: 'Productivity & Technical Media Tools',
        detail:
          'Microsoft Excel, Word & PowerPoint for quantitative decks; GIMP compositing; DaVinci Resolve (Cuts, Colour, Basic VFX).',
        evidenceLinks: [
          { label: 'Case Competition Decks', kind: 'Award', to: '/awards' },
        ],
      },
    ],
  },
  {
    id: 'data-ml',
    title: 'Data Analytics and Machine Learning',
    subtitle: 'Prognostics, Explainability & Benchmark Modeling',
    summary:
      'Supervised degradation modeling, time-series forecasting, feature attribution, and uncertainty calibration on verified industrial benchmarks.',
    items: [
      {
        name: 'Predictive Maintenance & RUL Modeling',
        detail:
          'Random Forest, XGBoost, and LSTM baselines evaluated on NASA C-MAPSS turbofan run-to-failure trajectories.',
        evidenceLinks: [
          { label: 'ForgeMind AI', kind: 'Project', to: '/projects/forgemind-ai' },
          { label: 'Explainable RUL Manuscript', kind: 'Research', to: '/research/rul-explainable' },
        ],
      },
      {
        name: 'SHAP Explainability & Sensor Reduction',
        detail:
          'Quantifying sensor channel contributions and testing reduced-sensor feature sets for compact diagnostics.',
        evidenceLinks: [
          { label: 'Explainable RUL Study', kind: 'Research', to: '/research/rul-explainable' },
        ],
      },
      {
        name: 'Uncertainty Quantification & Calibration',
        detail:
          'Analyzing probabilistic prediction interval coverage under operating-condition shift across C-MAPSS and FEMTO/PRONOSTIA.',
        evidenceLinks: [
          { label: 'Decision-Aware Prognostics', kind: 'Research', to: '/research/decision-aware-prognostics' },
        ],
      },
      {
        name: 'Large-Scale Benchmark Data Analysis',
        detail:
          'Processing and evaluating 3,999 real retail time series (M5) and 2025 hourly European power grid datasets.',
        evidenceLinks: [
          { label: 'M5 Inventory Study', kind: 'Research', to: '/research/decision-centric-demand' },
          { label: 'Data Solution-360 Role', kind: 'Experience', to: '/experience/data-solution-360' },
        ],
      },
    ],
  },
  {
    id: 'operations-research',
    title: 'Operations Research',
    subtitle: 'Optimization Solvers, Metaheuristics & Policies',
    summary:
      'Formulating mathematical optimization models and cost-aligned operational decision policies across scheduling, supply chains, and maintenance.',
    items: [
      {
        name: 'Mixed-Integer Programming (Google OR-Tools)',
        detail:
          'Formulating exact linear and mixed-integer production scheduling and resource allocation problems.',
        evidenceLinks: [
          { label: 'FactoryMind Scheduler', kind: 'Project', to: '/projects/factorymind' },
          { label: 'Carbon-Aware JSS Study', kind: 'Research', to: '/research/carbon-aware-jss' },
        ],
      },
      {
        name: 'Metaheuristic Search (GA & Simulated Annealing)',
        detail:
          'Designing Genetic Algorithm and Simulated Annealing heuristics for combinatorial shop-floor schedules.',
        evidenceLinks: [
          { label: 'FactoryMind Optimization Core', kind: 'Project', to: '/projects/factorymind' },
        ],
      },
      {
        name: 'Tri-Objective & Carbon-Aware Scheduling',
        detail:
          'Balancing tardiness/makespan, ToU electricity cost, and grid carbon intensity under price–carbon decoupling.',
        evidenceLinks: [
          { label: 'Carbon-Aware JSS Manuscript', kind: 'Research', to: '/research/carbon-aware-jss' },
        ],
      },
      {
        name: 'Inventory Replenishment & Maintenance Policy Modeling',
        detail:
          'Lost-sales periodic-review simulation across 59 forecaster–policy pairings and asymmetric failure-cost evaluation.',
        evidenceLinks: [
          { label: 'Inventory Replenishment Study', kind: 'Research', to: '/research/decision-centric-demand' },
          { label: 'Policy Cost Study', kind: 'Research', to: '/research/decision-aware-prognostics' },
        ],
      },
    ],
  },
  {
    id: 'research-methods',
    title: 'Research Methods',
    subtitle: 'Empirical Framing, Synthesis & Academic Writing',
    summary:
      'Disciplined undergraduate inquiry focused on decision-centric evaluation, baseline integrity, and transparent hypothesis testing.',
    items: [
      {
        name: 'Experimental Design & Decision-Centric Framing',
        detail:
          'Structuring experiments that test realized operational cost alongside statistical accuracy rather than isolated error scores.',
        evidenceLinks: [
          { label: 'Decision-Aware Prognostics', kind: 'Research', to: '/research/decision-aware-prognostics' },
          { label: 'Decision-Centric Demand', kind: 'Research', to: '/research/decision-centric-demand' },
        ],
      },
      {
        name: 'Systematic Literature Synthesis',
        detail:
          'Mapping baseline architectures and evaluation gaps across prognostics, sustainable job-shop scheduling, and retail inventory.',
        evidenceLinks: [
          { label: 'Research Studies Portfolio', kind: 'Research', to: '/research' },
        ],
      },
      {
        name: 'Technical Manuscript Preparation',
        detail:
          'Authoring abstracts, research questions, methodology pipelines, and limitation disclosures across 4 manuscripts in preparation.',
        evidenceLinks: [
          { label: 'Manuscripts in Preparation', kind: 'Research', to: '/research' },
          { label: 'Think Lab Ambassador', kind: 'Experience', to: '/experience/think-lab' },
        ],
      },
      {
        name: 'Empirical Verification & Ablation Analysis',
        detail:
          'Sensor pruning sensitivity checks, regime-shift stress evaluations, and strict separation of completed vs. proposed tests.',
        evidenceLinks: [
          { label: 'Explainable RUL Study', kind: 'Research', to: '/research/rul-explainable' },
        ],
      },
    ],
  },
  {
    id: 'communication-leadership',
    title: 'Communication and Leadership',
    subtitle: 'Governance, Extempore Speaking & Outreach',
    summary:
      'Public speaking, executive committee governance, event organization, and multi-campus community building documented across SUST and national competitions.',
    items: [
      {
        name: 'Public Speaking & Extempore Delivery',
        detail:
          'Stage extempore speaking, AGM address delivery, and persuasive presentation under time limits.',
        evidenceLinks: [
          { label: 'Speak Up 2026 (4th Overall / 1st Session)', kind: 'Award', to: '/awards' },
          { label: 'GDN AGM Speech', kind: 'Experience', to: '/experience/gdn-11ec' },
        ],
      },
      {
        name: 'Executive Governance & Event Logistics',
        detail:
          'Serving in executive committees for SUST Science Arena, GDN-SUST, Noakhali Association, Engineer’s Association, and NDCA.',
        evidenceLinks: [
          { label: 'SUST Science Arena 21st EC', kind: 'Experience', to: '/experience/ssa-21ec' },
          { label: 'GDN-SUST 11th EC', kind: 'Experience', to: '/experience/gdn-11ec' },
        ],
      },
      {
        name: 'Campus Outreach & Community Building',
        detail:
          'Directed SUST representation across 12 national/international ambassador tenures, building a 200+ student learning community.',
        evidenceLinks: [
          { label: 'Data Solution-360 (200+ Members)', kind: 'Experience', to: '/experience/data-solution-360' },
          { label: 'Research Odyssey 2.0 Cert', kind: 'Experience', to: '/experience/research-odyssey-2' },
        ],
      },
      {
        name: 'Case Strategy & Team Collaboration',
        detail:
          'Decomposing open-ended business and industrial prompts in multi-round competitions (Team The Unbound & departmental finals).',
        evidenceLinks: [
          { label: 'Innovesta 3.0 Top 10 Finalist', kind: 'Award', to: '/awards' },
          { label: 'ShowCase 1.0 & Case Quest 2.0', kind: 'Award', to: '/awards' },
        ],
      },
      {
        name: 'Languages',
        detail: 'Academic, technical writing, and stage communication fluency.',
        proficiency: 'Bengali (Native) · English (Fluent)',
        evidenceLinks: [
          { label: 'Notre Dame English Club Rep', kind: 'Experience', to: '/experience/ndec-group-rep' },
        ],
      },
    ],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'sg-eng',
    category: 'Industrial Engineering & Operations Research',
    items: [
      'Operations Research & Scheduling (OR-Tools MIP, GA, SA)',
      'Statistical Process Control (SPC)',
      'Discrete-Event Simulation',
      'Engineering Drawing & Graphics',
      'Workshop Machinery (Basic coursework exposure)',
    ],
  },
  {
    id: 'sg-data',
    category: 'Programming, Data Analytics & Research Methods',
    items: [
      'Python & Streamlit Analytical Interfaces',
      'Predictive Maintenance Modeling (RF, XGBoost, LSTM, SHAP)',
      'Uncertainty Calibration & Policy Cost Evaluation',
      'Systematic Literature Synthesis & Manuscript Drafting',
    ],
  },
  {
    id: 'sg-media',
    category: 'Productivity, Design & Media',
    items: [
      'Microsoft Excel, Word & PowerPoint',
      'GIMP (Photo Editing, Compositing, Visual Layout)',
      'DaVinci Resolve (Colour Grading, Cuts, Transitions, Basic VFX)',
    ],
  },
  {
    id: 'sg-leadership',
    category: 'Communication, Leadership & Languages',
    items: [
      'Extempore Public Speaking & Case Presentation',
      'Executive Committee Governance & Event Organization',
      'Campus Representation & Community Building',
      'Bengali (Native) · English (Fluent)',
    ],
  },
];
