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
    id: 'ach-unilever-sparks',
    title: 'Unilever Sparks Campus Ambassador Program',
    placement: 'Top 3 Candidate (Whole SUST)',
    organization: 'Unilever Bangladesh · SUST Campus Selection',
    organizationCode: 'ULV',
    year: '2026',
    category: 'Competition',
    details:
      'Selected among the Top 3 candidates across the entire Shahjalal University of Science and Technology (SUST) campus in the competitive Unilever Sparks Campus Ambassador Program.',
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
  {
    id: 'ach-createx-2',
    title: 'CreateX 2.0 — Campus Ambassador Appreciation',
    placement: 'Certificate of Appreciation',
    organization: 'The Trailblazers · BUBT TAFE',
    organizationCode: 'CRX',
    year: '2026',
    category: 'Recognition & Volunteering',
    details:
      'Presented Certificate of Appreciation for dedicated contribution as Campus Ambassador for CreateX 2.0 representing SUST, organized by The Trailblazers in collaboration with TAFE, BUBT.',
    certificateId: 'cert-createx-2',
  },
  {
    id: 'ach-ndc-attendance',
    title: 'Notre Dame College — Perfect Attendance Distinction',
    placement: 'Perfect Attendance (#12404016)',
    organization: 'Notre Dame College, Dhaka',
    organizationCode: 'NDC',
    year: '30 May 2024',
    category: 'Academic',
    details:
      'Awarded official Perfect Attendance Certificate (#12404016) signed by the Principal upon completing the two-year Higher Secondary course of study at Notre Dame College with perfect attendance.',
    certificateId: 'cert-ndc-attendance',
  },
  {
    id: 'ach-iqac-obe',
    title: 'OBE Curriculum Transformation Training (IQAC, SUST)',
    placement: 'Participation Certificate',
    organization: 'Institutional Quality Assurance Cell (IQAC), SUST',
    organizationCode: 'IQAC',
    year: '24 Feb 2026',
    category: 'Academic',
    details:
      'Completed formal training on "Transforming Higher Education: Drivers and Challenges of OBE Curriculum" conducted by the Institutional Quality Assurance Cell (IQAC), SUST on 24 February 2026.',
    certificateId: 'cert-iqac-obe',
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
    id: 'cert-createx-2',
    title: 'CreateX 2.0 — Campus Ambassador Certificate of Appreciation',
    issuer: 'The Trailblazers · BUBT TAFE (Bangladesh University of Business and Technology)',
    organizationCode: 'CRX',
    date: '2026',
    category: 'Experience & Outreach',
    status: 'Verified Attachment',
    fileUrl: '/assets/aistudio/IMG_20261116_174151_032655df.png',
    fileType: 'Image',
    linkedEntryId: 'createx-2',
    linkedRoute: '/experience/createx-2',
    notes:
      'Certificate of Appreciation for serving as Campus Ambassador for CreateX 2.0, organized by The Trailblazers with BUBT TAFE; signed by Sudipto Chaki (Director, BUBT TAFE), Zinnath Zafar Hiya (Programme Chief & CEO), and Masru Zafar Plabon (Programme Director & Co-Founder).',
  },
  {
    id: 'cert-ndc-attendance',
    title: 'Notre Dame College — Perfect Attendance Certificate',
    issuer: 'Notre Dame College, Dhaka',
    organizationCode: 'NDC',
    date: '30 May 2024',
    category: 'Academic',
    status: 'Verified Attachment',
    credentialId: '#12404016',
    fileUrl: '/assets/aistudio/IMG_20260928_154453_aab03d5c.jpg',
    fileType: 'Image',
    rotateDeg: 270,
    linkedEntryId: 'ach-ndc-attendance',
    linkedRoute: '/awards',
    notes:
      'Official Perfect Attendance Certificate (#12404016) dated May 30, 2024 and signed by the Principal of Notre Dame College, Dhaka, recognizing completion of the two-year HSC program with perfect attendance.',
  },
  {
    id: 'cert-iqac-obe',
    title: 'Training on Transforming Higher Education: Drivers and Challenges of OBE Curriculum',
    issuer: 'Institutional Quality Assurance Cell (IQAC), SUST',
    organizationCode: 'IQAC',
    date: '24 Feb 2026',
    category: 'Academic',
    status: 'Verified Attachment',
    fileUrl: '/assets/aistudio/IMG_20261123_225736_366c2712.jpg',
    fileType: 'Image',
    linkedEntryId: 'ach-iqac-obe',
    linkedRoute: '/awards',
    notes:
      'Participation Certificate issued by IQAC, Shahjalal University of Science and Technology (Sylhet-3114) for the February 24, 2026 training on Outcome-Based Education (OBE) curriculum; signed by Dr. Salma Akhter, Dr. Md. Abdul Hamid, and Dr. Mohammad Masud Alam.',
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
        name: 'Interactive TypeScript, React & Three.js Engineering UIs',
        detail:
          'Building browser-native engineering workbenches and offline-first PWAs uniting solvers, Recharts, 3D models, and jsPDF exports.',
        evidenceLinks: [
          { label: 'FactoryMind Workbench', kind: 'Project', to: '/projects/factorymind' },
          { label: 'TikaTrack PWA', kind: 'Project', to: '/projects/tikatrack' },
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
        name: 'Benchmark Time-Series & Prognostic Analysis',
        detail:
          'Evaluating NASA C-MAPSS (FD001/FD003), FEMTO/PRONOSTIA bearings, and bottom-level M5 retail demand series.',
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
          { label: 'Research & Ongoing Work', kind: 'Research', to: '/research' },
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
        name: 'Closed-Loop Decision Science & Risk Calibration',
        detail:
          'Framing maintenance replacement rules via DAPE renewal-reward evaluation, ETCE, tail-Brier, and DRC recalibration.',
        evidenceLinks: [
          { label: 'Decision-Aware Uncertainty', kind: 'Research', to: '/research/decision-aware-prognostics' },
        ],
      },
      {
        name: 'Inventory Replenishment & Quantile Policy Modeling',
        detail:
          'Single-echelon periodic-review lost-sales simulation pairing point, LightGBM quantile, and empirical-interval forecasters with review policies.',
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
      'Disciplined undergraduate inquiry focused on decision-centric evaluation, baseline integrity, and explicit disclosure of study limitations.',
    items: [
      {
        name: 'Experimental Design & Decision-Centric Framing',
        detail:
          'Structuring benchmark and simulation experiments that evaluate realized operational cost alongside statistical accuracy.',
        evidenceLinks: [
          { label: 'Decision-Aware Uncertainty', kind: 'Research', to: '/research/decision-aware-prognostics' },
          { label: 'Decision-Centric Demand', kind: 'Research', to: '/research/decision-centric-demand' },
        ],
      },
      {
        name: 'Systematic Literature Synthesis',
        detail:
          'Mapping baseline architectures and evaluation gaps across RUL prognostics, uncertainty calibration, and retail inventory replenishment.',
        evidenceLinks: [
          { label: 'Research & Ongoing Work', kind: 'Research', to: '/research' },
        ],
      },
      {
        name: 'Technical Manuscript Preparation',
        detail:
          'Authoring problem statements, methodology protocols, contribution scopes, and limitation disclosures across 3 unpublished studies.',
        evidenceLinks: [
          { label: 'Unpublished Research Brief', kind: 'Research', to: '/research' },
          { label: 'Think Lab Ambassador', kind: 'Experience', to: '/experience/think-lab' },
        ],
      },
      {
        name: 'Cross-Dataset & Sensitivity Evaluation',
        detail:
          'Sensor pruning sensitivity checks, cross-fault transfer evaluation (FD001/FD003), and regime-shift boundary analysis.',
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
          'Directed SUST representation across 15+ national/international ambassador, Campus Lead, and program finalist tracks—building a 200+ student learning community and earning Top 3 SUST candidate selection in Unilever Sparks.',
        evidenceLinks: [
          { label: 'Linked Community BD (Campus Lead)', kind: 'Experience', to: '/experience/linked-community-bd' },
          { label: 'Data Solution-360 (200+ Members)', kind: 'Experience', to: '/experience/data-solution-360' },
          { label: 'Unilever Sparks Top 3 (SUST)', kind: 'Award', to: '/awards' },
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
      'Python, TypeScript & React Analytical Interfaces',
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
