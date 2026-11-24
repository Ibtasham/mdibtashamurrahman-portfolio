import type {
  AboutStory,
  AcademicInterest,
  AspirationGoal,
  DimensionPillar,
  EducationEntry,
  JourneyMilestone,
} from "../types/portfolio";

export const PROFILE = {
  name: 'MD Ibtashamur Rahman',
  shortName: 'Ibtashamur Rahman',
  headline: 'Industrial & Production Engineering Undergraduate at SUST',
  subHeadline:
    'Industry 4.0 & Smart Manufacturing · Operations & Data Analytics · Research & Student Leadership',
  summary:
    'Second-year Industrial & Production Engineering student at Shahjalal University of Science and Technology (SUST) working at the intersection of engineering systems, operations research, applied machine learning, and campus leadership.',
  extendedBio:
    'With a triple GPA 5.00 academic record across JSC, SSC, and HSC (Notre Dame College, Dhaka) and a Government of Bangladesh Talent Pool Scholarship, I build optimization and predictive analytics systems for manufacturing and supply chains while serving in executive committee roles and representing national and international initiatives on campus.',
  email: 'ibtarahman@gmail.com',
  publicLocation: 'Sylhet, Bangladesh',
  academicBase: 'Department of Industrial & Production Engineering · SUST',
  locationPermanent: 'Noakhali District, Bangladesh',
  privacyNote:
    'Personal phone number and precise residential address are kept private by default and shared upon verified inquiry.',
  university: 'Shahjalal University of Science & Technology (SUST)',
  department: 'Department of Industrial & Production Engineering (IPE)',
  session: '2024–25',
  academicStanding: '2nd Year, 1st Semester',
  nationality: 'Bangladeshi',
  languages: ['Bengali (Native)', 'English (Fluent)'],
  profilePhoto: '/assets/portrait-card.webp',
  profileAvatar: '/assets/portrait-avatar.webp',
  guidePortrait: '/assets/aistudio/WhatsApp_Image_2026-09-14_at_6.44.42_PM_9eca5786.jpeg',
  hologramPortrait: '/assets/aistudio/file_00000000ed0c820bb2e3dcfedb05bedd_08a4aca0.png',
  links: {
    linkedin: 'https://www.linkedin.com/in/md-ibtashamur-rahman-56951029a',
    github: 'https://github.com/Ibtasham',
    factoryMind: 'https://github.com/Ibtasham/FactoryMind',
    factoryMindDemo: 'https://ibtasham.github.io/FactoryMind/',
    tikaTrack: 'https://github.com/Ibtasham/TikaTrack',
    tikaTrackDemo: 'https://ibtasham.github.io/TikaTrack/',
    researchOdysseyCertificate: '/assets/aistudio/Ibtashamur_Rahman_31aca808.pdf',
    cvPdf: '/assets/MD_Ibtashamur_Rahman_CV.pdf',
  },
  memberships: [
    'SUST Speakers Club (SUSC)',
    'SUST Career Club',
    'SUST Tourist Club',
    'SUST Sports Arena',
    'Notre Dame Science Club',
    'Notre Dame Math Club',
    'Notre Dame IT Club',
  ],
  interests: [
    {
      title: 'Esports & Competitive Gaming',
      detail: 'Competitive mobile and PC gaming.',
    },
    {
      title: 'Reading & Cinema',
      detail: 'Fiction, popular science, technology; sci-fi, thriller, and drama.',
    },
    {
      title: 'Athletics & Campus Sports',
      detail: 'Actively involved through SUST Sports Arena.',
    },
  ],
};

export const ABOUT_STORY: AboutStory = {
  eyebrow: 'Emerging IPE Professional · Systems, Research & Leadership',
  headline:
    'Combining Quantitative Engineering Rigor with Software Execution and Student Governance',
  personalIntroduction:
    'I am an emerging Industrial & Production Engineering professional driven by how analytical problem-solving, applied technology, and disciplined leadership can make real-world production and supply systems faster, cleaner, and more resilient.',
  biographyParagraphs: [
    'Originally from Begumganj, Noakhali and now based in Sylhet as a 2nd Year, 1st Semester undergraduate at Shahjalal University of Science & Technology (SUST, Session 2024–25), my foundation was shaped by consistent academic focus—earning a Government of Bangladesh Talent Pool Scholarship in JSC (2019) and achieving a perfect GPA 5.00 across JSC, SSC at Nasirabad Govt. High School, Chattogram, and HSC at Notre Dame College, Dhaka.',
    'At Notre Dame College, early exposure to debating ideas and organizing events as Group Representative of the Notre Dame English Club, alongside winning 1st Place in the IT Olympiad and volunteering at iNIT 3.0, taught me to pair technical curiosity with clear communication. That dual track deepened at SUST, where I built FactoryMind—an open-source TypeScript & Three.js Industrial Engineering workbench—and TikaTrack—a bilingual offline-first immunization PWA—while authoring three unpublished research manuscripts.',
    'Beyond laboratories and codebases, I invest heavily in building student ecosystems—serving on executive committees for SUST Science Arena (21st EC), Graduate Development Network (GDN-SUST, 11th EC), Noakhali Association (3rd EC), and Engineer’s Association, serving as Campus Lead at Linked Community Bangladesh (from November 2026) alongside Campus Director and Ambassador roles including Elevetr AI, CaraLox, MyTravaly Bangladesh, and STechNest, and placing among the Top 3 candidates across whole SUST in the Unilever Sparks Campus Ambassador Program.',
  ],
  personalDevelopmentNarrative:
    'From early merit scholarships in Chattogram to college leadership in Dhaka and applied operations research, national case finals, and executive governance at SUST, each stage has strengthened a core habit: breaking complex systems into structured decisions and mobilizing people around clear execution.',
  portrait: {
    src: '/assets/portrait-card.webp',
    alt: 'Profile photograph of MD Ibtashamur Rahman',
    caption: 'MD Ibtashamur Rahman',
    context: 'B.Sc. Industrial & Production Engineering (Session 2024–25) · SUST, Sylhet',
  },
};

export const ACADEMIC_INTERESTS: AcademicInterest[] = [
  {
    id: 'ai-industry4',
    title: 'Industry 4.0 & Smart Manufacturing',
    domain: 'Production Systems Engineering',
    summary:
      'Integrating optimization solvers, statistical process control, and discrete-event simulation into accessible shop-floor decision-support tooling.',
    topics: [
      'Line Balancing & Bottleneck Analysis',
      'Statistical Process Control (SPC)',
      'Discrete-Event Simulation',
    ],
  },
  {
    id: 'ai-prognostics',
    title: 'Explainable Prognostics & Reliability Analytics',
    domain: 'Predictive Maintenance',
    summary:
      'Evaluating lightweight, interpretable ML and probabilistic Remaining Useful Life models under sensor constraints and operating-condition shifts.',
    topics: [
      'NASA C-MAPSS & FEMTO Benchmarks',
      'SHAP Attribution & Sensor Reduction',
      'Decision-Aware Uncertainty Evaluation',
    ],
  },
  {
    id: 'ai-supply-chain',
    title: 'Decision-Centric Supply Chain & Inventory',
    domain: 'Supply Chain Analytics',
    summary:
      'Closing the gap between statistical forecast accuracy metrics and realized inventory replenishment costs under intermittent demand.',
    topics: [
      'Lost-Sales Periodic-Review Policies',
      'Multi-Echelon Flow Modeling',
      'M5 Intermittent Demand Series',
    ],
  },
];

export const FUTURE_ASPIRATIONS: AspirationGoal[] = [
  {
    id: 'asp-research',
    horizon: 'Academic & Research Trajectory',
    title: 'Advance Decision-Aware Operations & Reliability Literature',
    description:
      'Complete and refine the three unpublished research studies on explainable cross-dataset RUL prediction, decision-aware uncertainty calibration, and decision-centric demand forecasting for rigorous peer-reviewed contribution.',
    pillars: [
      'Reproducible Benchmark Validation',
      'Decision-Aligned Calibration',
      'Transparent Scope & Limitations',
    ],
  },
  {
    id: 'asp-engineering',
    horizon: 'Technology & Industrial Systems',
    title: 'Scale Practical Open-Source Industrial Optimization Tooling',
    description:
      'Expand open-source decision-support platforms like FactoryMind to bridge academic operations research with real manufacturing bottlenecks, especially across high-impact industrial sectors such as Bangladesh Ready-Made Garments.',
    pillars: [
      'Applied OR-Tools & ML Workflows',
      'Interactive Engineering Dashboards',
      'Shop-Floor Problem Solving',
    ],
  },
  {
    id: 'asp-leadership',
    horizon: 'Leadership & Analytical Practice',
    title: 'Lead Multidisciplinary Analytical & Organizational Teams',
    description:
      'Continue developing strategic communication, project logistics, and stakeholder coordination through executive roles and case competitions—preparing for high-ownership engineering, supply chain, and analytics roles.',
    pillars: [
      'Cross-Functional Coordination',
      'Structured Case Strategy',
      'Mentorship & Student Ecosystems',
    ],
  },
];

export const DIMENSIONS: DimensionPillar[] = [
  {
    id: 'engineering',
    title: 'Engineering',
    subtitle: 'Industrial Systems & Smart Manufacturing',
    summary:
      'Applying Industrial & Production Engineering principles—production scheduling, statistical process control, and discrete-event simulation—to real industrial contexts.',
    highlights: [
      'B.Sc. in IPE at SUST (Session 2024–25)',
      'FactoryMind Smart Production Platform',
      'Engineering Drawing & Workshop Systems',
    ],
    route: '/projects',
  },
  {
    id: 'research',
    title: 'Research',
    subtitle: 'Prognostics, Uncertainty & Inventory OR',
    summary:
      'Investigating explainable cross-dataset RUL prediction, decision-aware maintenance uncertainty under operating shift, and decision-centric inventory forecasting across public benchmarks.',
    highlights: [
      '3 Unpublished Research Studies',
      'NASA C-MAPSS, FEMTO & M5 Benchmarks',
      'Explainable ML & Decision Science',
    ],
    route: '/research',
  },
  {
    id: 'innovation',
    title: 'Innovation',
    subtitle: 'Case Strategy & Algorithmic Tooling',
    summary:
      'Translating quantitative optimization and business strategy into working software prototypes and competitive national case finals.',
    highlights: [
      'Open-Source FactoryMind IPE Workbench & TikaTrack PWA',
      'Finalist — Innovesta 3.0 (Top 10) & Case Quest 2.0',
      '1st Place — iNIT 3.0 IT Olympiad',
    ],
    route: '/innovation',
  },
  {
    id: 'leadership',
    title: 'Leadership',
    subtitle: 'Executive Governance & Campus Outreach',
    summary:
      'Coordinating student organizations, inter-university events, and national outreach programs—including Campus Lead at Linked Community Bangladesh, Top 3 SUST candidate in Unilever Sparks, and executive committees.',
    highlights: [
      'Campus Lead — Linked Community Bangladesh (Nov 2026 – Present)',
      'Asst. Organizing Secretary — SUST Science Arena · GDN-SUST (11th EC)',
      'Top 3 Candidate (Whole SUST) — Unilever Sparks · 200+ Community (DS360)',
    ],
    route: '/experience',
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    id: 'sust-ipe',
    institution: 'Shahjalal University of Science & Technology (SUST)',
    location: 'Sylhet, Bangladesh',
    degree: 'B.Sc. in Industrial & Production Engineering',
    field: 'Industrial & Production Engineering',
    period: '2024 – Present',
    status: 'Current',
    grade: '2nd Year, 1st Semester · Session 2024–25',
    details: [
      'Core focus areas: Operations Research, Industry 4.0, Smart Manufacturing, Supply Chain & Data Analytics, Engineering Drawing & Graphics, and Workshop Machinery.',
      'Completed IQAC, SUST training on "Transforming Higher Education: Drivers and Challenges of OBE Curriculum" (24 Feb 2026).',
      'Serving on executive committees of SUST Science Arena (21st EC), GDN-SUST (11th EC), Noakhali Association (3rd EC), and Engineer’s Association.',
    ],
  },
  {
    id: 'ndc-hsc',
    institution: 'Notre Dame College',
    location: 'Dhaka, Bangladesh',
    degree: 'Higher Secondary Certificate (HSC)',
    field: 'Science',
    period: 'Completed 2024',
    status: 'Completed',
    grade: 'GPA 5.00 / 5.00',
    details: [
      'Awarded Perfect Attendance Certificate (#12404016, dated 30 May 2024) for completing the two-year HSC program with zero absences.',
      'Group Representative at Notre Dame English Club (Feb 2023 – Nov 2023), bridging communication between club members and organizers.',
      'Secured 1st Place in the IT Olympiad at iNIT 3.0 and earned Certificate of Excellence as Event Volunteer at iNIT 3.0 (Mar 2024).',
      'Active member across Notre Dame Science Club, Notre Dame Math Club, and Notre Dame IT Club.',
    ],
  },
  {
    id: 'nghs-ssc',
    institution: 'Nasirabad Govt. High School',
    location: 'Chattogram, Bangladesh',
    degree: 'Secondary School Certificate (SSC)',
    field: 'Science',
    period: 'Completed 2022',
    status: 'Completed',
    grade: 'GPA 5.00 / 5.00',
    details: [
      'Completed secondary science curriculum in Chattogram with a perfect 5.00 GPA.',
    ],
  },
  {
    id: 'nghs-jsc',
    institution: 'Nasirabad Govt. High School',
    location: 'Chattogram, Bangladesh',
    degree: 'Junior School Certificate (JSC)',
    field: 'General Studies',
    period: 'Completed 2019',
    status: 'Completed',
    grade: 'GPA 5.00 / 5.00 · Talent Pool Scholarship',
    details: [
      'Awarded the Government of Bangladesh Talent Pool Scholarship based on JSC board merit.',
    ],
  },
];

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    id: 'm-2019-jsc',
    year: '2019',
    title: 'JSC Perfect GPA 5.00 & Government Talent Pool Scholarship',
    institution: 'Nasirabad Govt. High School, Chattogram',
    category: 'Academic Foundation',
    detail:
      'Established an early quantitative and academic benchmark by earning a perfect 5.00 GPA and the Government of Bangladesh Talent Pool Scholarship.',
    highlights: [
      'GPA 5.00 / 5.00 in Junior School Certificate board examinations.',
      'Government of Bangladesh Talent Pool Scholarship recipient.',
    ],
    takeaway: 'Built disciplined study habits and confidence in analytical subjects.',
  },
  {
    id: 'm-2022-ssc',
    year: '2022',
    title: 'SSC Science Graduation — Perfect GPA 5.00',
    institution: 'Nasirabad Govt. High School, Chattogram',
    category: 'Academic Foundation',
    detail:
      'Completed secondary science education in Chattogram with a second consecutive board-level 5.00 GPA.',
    highlights: [
      'Sustained top-tier academic performance across science and mathematics.',
      'Prepared for national college admissions in Dhaka.',
    ],
    takeaway: 'Reinforced consistency under high-stakes academic milestones.',
  },
  {
    id: 'm-2023-ndc',
    year: '2023 – 2024',
    title: 'Notre Dame College, Dhaka — Leadership, iNIT 3.0 Win & HSC 5.00',
    institution: 'Notre Dame College, Dhaka',
    category: 'Competitions & Voice',
    detail:
      'Transitioned to Dhaka for higher secondary studies, combining a perfect HSC GPA 5.00 with technology competition success and club coordination.',
    highlights: [
      '1st Place in IT Olympiad at iNIT 3.0; Volunteer Certificate of Excellence at iNIT 3.0 (Mar 2024, IUB).',
      'Group Representative at Notre Dame English Club (Feb 2023 – Nov 2023); member of Science, Math, and IT Clubs.',
    ],
    takeaway: 'Learned how communication and teamwork multiply individual technical ability.',
  },
  {
    id: 'm-2024-sust',
    year: '2024 – Present',
    title: 'Entering B.Sc. in Industrial & Production Engineering at SUST',
    institution: 'Shahjalal University of Science & Technology (SUST)',
    category: 'Academic Foundation',
    detail:
      'Enrolled in the Department of Industrial & Production Engineering (Session 2024–25), focusing on connecting core engineering systems with modern optimization and analytics.',
    highlights: [
      'Currently 2nd Year, 1st Semester undergraduate in Sylhet.',
      'Coursework and focus spanning Operations Research, Statistical Process Control, Manufacturing, and Simulation.',
    ],
    takeaway: 'Found an interdisciplinary home uniting systems engineering, math, and management.',
  },
  {
    id: 'm-factorymind-research',
    year: 'Current Work',
    title: 'Building FactoryMind, TikaTrack & Authoring Three Unpublished Research Manuscripts',
    institution: 'Independent Engineering & Research Portfolio',
    category: 'Engineering & Research',
    detail:
      'Translated industrial engineering and systems design into the live browser-based FactoryMind workbench (EOQ, MRP, 12-model forecasting, SPC, DES, and 3D Digital Twin) and the bilingual TikaTrack PWA, while developing three unpublished benchmark and simulation research manuscripts across prognostics, uncertainty calibration, and retail replenishment.',
    highlights: [
      'Deployed FactoryMind (React 19, TypeScript DES/MRP solvers, Three.js 3D twin, 12 tests) and TikaTrack (90 vaccines, ECDSA QR, 46 tests) live on GitHub Pages.',
      '3 unpublished research studies spanning NASA C-MAPSS FD001/FD003, FEMTO/PRONOSTIA bearings, and M5 retail demand series.',
    ],
    takeaway: 'Shifted from learning textbook models to testing decision-aware impact on benchmarks.',
  },
  {
    id: 'm-2026-competitions',
    year: '2026',
    title: 'National Case Competition Finals & Extempore Speaking Distinctions',
    institution: 'SUST · AIBA Sylhet · GDN-SUST · SUSC',
    category: 'Competitions & Voice',
    detail:
      'Tested analytical problem-solving and persuasive delivery under time pressure across business case competitions, entrepreneurship rounds, and extempore speaking.',
    highlights: [
      'Speak Up 2026 (18 Sep 2026): 4th Overall Finalist and 1st in 2024–25 Session.',
      'Innovesta 3.0 Top 10 Finalist (Sep 2026), Case Quest 2.0 Finalist, ShowCase 1.0 National Semi-Finalist, Hult Prize SUST Semi-Finalist, and Top 3 Candidate (Whole SUST) in Unilever Sparks Campus Ambassador Program.',
    ],
    takeaway: 'Sharpened structured problem-framing and clear presentation under competition pressure.',
  },
  {
    id: 'm-2026-governance',
    year: '2026 – Present',
    title: 'Executive Governance & Campus Representation Leadership',
    institution: 'SUST Organizations & National Partner Platforms',
    category: 'Leadership & Outreach',
    detail:
      'Stepped into multi-organization executive leadership at SUST while directing campus outreach across Campus Lead, Campus Director, and Campus Ambassador mandates including Linked Community Bangladesh, CaraLox, MyTravaly Bangladesh, Elevetr AI, and The FOGG Squad Round-02 video campaign.',
    highlights: [
      'Executive roles: SUST Science Arena (21st EC), GDN-SUST (11th EC), Noakhali Association (3rd EC), Engineer’s Association, and NDC Association SUST.',
      'Campus Lead for Linked Community Bangladesh (starting Nov 2026), Campus Ambassador for CaraLox & MyTravaly Bangladesh, 200+ community built for Data Solution-360, and AUSTRPC Certificate of Achievement (Aug 2026).',
    ],
    takeaway: 'Matured from individual contributor to coordinator building lasting student communities.',
  },
];

