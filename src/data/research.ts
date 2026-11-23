import type {
  ResearchDatasetEntry,
  ResearchExperiment,
  ResearchManuscript,
  ResearchMethodologyStep,
  ResearchNoteEntry,
  ResearchPublicationRecord,
  ResearchToolGroup,
} from "../types/portfolio";

export const RESEARCH_PROFILE_META = {
  positioningTitle: 'Emerging Undergraduate Researcher · Industrial & Production Engineering',
  positioningSummary:
    'Undergraduate researcher at Shahjalal University of Science & Technology (SUST, B.Sc. IPE, Session 2024–25) investigating how applied machine learning, uncertainty quantification, and mathematical optimization translate into reliable manufacturing decisions, sustainable scheduling, and cost-aware maintenance.',
  featuredDirection: {
    title: 'Uncertainty-Aware Predictive Maintenance & Prognostics on NASA C-MAPSS',
    subtitle: 'Featured Research Direction · Linked to ForgeMind AI',
    summary:
      'Studying Remaining Useful Life (RUL) modeling, SHAP-guided sensor reduction, and probabilistic interval calibration on NASA C-MAPSS turbofan engine degradation datasets—evaluating whether uncertainty metrics genuinely improve downstream maintenance policy cost under operating-condition shifts.',
    datasetHighlight: 'NASA C-MAPSS Turbofan Benchmarks (FD001 & Multi-Regime Subsets)',
    relatedProjectId: 'forgemind-ai',
  },
  collaborationSummary:
    'Open to undergraduate research mentorship, international co-authorship, reproducible benchmark validation, and collaborative studies across industrial analytics, reliability engineering, and operations optimization.',
  collaborationTracks: [
    {
      title: 'Faculty-Mentored & Lab Research',
      detail: 'Contributing data pipelines, comparative modeling, and simulation experiments to IPE, reliability, or operations research groups.',
    },
    {
      title: 'International Benchmark Replication',
      detail: 'Collaborating across NASA C-MAPSS, FEMTO/PRONOSTIA, job-shop energy benchmarks, and M5 retail replenishment studies.',
    },
    {
      title: 'Open-Source Analytical Tooling',
      detail: 'Building inspectable Python, OR-Tools, and Streamlit research companions bridging optimization theory with practice.',
    },
  ],
  futureDirections: [
    {
      title: 'Decision-Aware Prognostics Under Distribution Shift',
      detail: 'Formalizing maintenance cost policy loss alongside statistical calibration checks when operating regimes change between training and deployment.',
    },
    {
      title: 'Grid-Coupled Carbon & Tariff Manufacturing Optimization',
      detail: 'Extending tri-objective scheduling toward stochastic machine breakdowns and dynamic renewable grid intensity.',
    },
    {
      title: 'Unified Uncertainty-to-Decision Evaluation',
      detail: 'Cross-domain synthesis connecting probabilistic forecasting errors in inventory replenishment and RUL prediction to operational cost.',
    },
  ],
};

export const RESEARCH_MANUSCRIPTS: ResearchManuscript[] = [
  {
    id: 'rul-explainable',
    title:
      'Machine Learning for Remaining Useful Life Prediction of Turbofan Engines: A Lightweight and Explainable Comparative Approach',
    status: 'Manuscript in Preparation',
    domain: 'Prognostics & Predictive Maintenance',
    datasetsOrBenchmarks: 'NASA C-MAPSS FD001',
    methods: ['Random Forest', 'XGBoost', 'LSTM', 'SHAP Explainability', 'Sensor Reduction'],
    keyFocus: 'Model interpretability and sensor footprint reduction for resource-constrained industrial deployment.',
    abstract:
      'Compares Random Forest, XGBoost, and Long Short-Term Memory (LSTM) architectures for Remaining Useful Life (RUL) prediction on the NASA C-MAPSS FD001 turbofan degradation dataset. Incorporates SHAP-based feature attribution and systematic sensor reduction to evaluate accuracy–complexity trade-offs for resource-constrained predictive maintenance.',
    motivation:
      'Industrial predictive maintenance workflows frequently rely on black-box deep models using full sensor arrays, creating high telemetry overhead and limited interpretability for maintenance engineers.',
    expectedContribution:
      'Provide a structured empirical comparison showing whether SHAP-guided sensor reduction enables lightweight tree ensembles to retain competitive RUL estimation while reducing sensor footprint.',
    featuredDirection: true,
    relatedProjectId: 'forgemind-ai',
    researchQuestions: [
      'How do lightweight tree ensembles (Random Forest, XGBoost) compare against sequential LSTM baselines on NASA C-MAPSS FD001 under constrained sensor subsets?',
      'Which physical engine sensor channels contribute most consistently under SHAP attribution as turbofans degrade toward failure?',
    ],
    methodologySteps: [
      'Ingest and normalize NASA C-MAPSS FD001 run-to-failure engine cycles using piecewise RUL targets.',
      'Train comparative Random Forest, XGBoost, and LSTM baselines across unified feature windows.',
      'Rank sensor channels via SHAP attribution and evaluate accuracy–complexity trade-offs under progressive sensor pruning.',
    ],
    completedWork: [
      'Baseline preprocessing and comparative Random Forest, XGBoost, and LSTM pipeline structure established on FD001.',
      'Initial SHAP feature attribution workflow scoped to rank engine sensor importance.',
    ],
    ongoingWork: [
      'Refining sensor-reduction sensitivity experiments and manuscript drafting/formatting.',
    ],
    proposedWork: [
      'Cross-validate lightweight reduced-sensor feature sets against multi-condition C-MAPSS subsets.',
    ],
    futureDirections: [
      'Integrate SHAP-selected sensor profiles into edge-deployable condition monitoring tooling.',
    ],
  },
  {
    id: 'decision-aware-prognostics',
    title:
      'Do Uncertainty Metrics Predict Maintenance Cost? A Decision-Aware Evaluation of Probabilistic Prognostics Under Operating-Condition Shift',
    status: 'Manuscript in Preparation',
    domain: 'Decision-Aware Reliability Engineering',
    datasetsOrBenchmarks: 'NASA C-MAPSS Turbofan Engines · FEMTO/PRONOSTIA Bearings',
    methods: ['Probabilistic RUL', 'Calibration & Coverage Metrics', 'Cost-Based Maintenance Policy Evaluation'],
    keyFocus: 'Testing whether statistical calibration metrics actually translate into lower realized maintenance cost under domain shift.',
    abstract:
      'Investigates whether conventional probabilistic accuracy, interval coverage, and calibration metrics of Remaining Useful Life (RUL) models reliably predict downstream maintenance cost under operating-condition shifts across NASA C-MAPSS turbofan engines and FEMTO/PRONOSTIA bearing datasets.',
    motivation:
      'Prognostic models are routinely ranked by symmetric calibration or prediction-interval coverage without verifying whether those statistical rankings actually reduce asymmetric replacement and unplanned failure costs when operating conditions shift.',
    expectedContribution:
      'Establish a decision-aware evaluation framing linking RUL uncertainty metrics to simulated maintenance policy cost across shifting engine and bearing operating regimes.',
    featuredDirection: true,
    relatedProjectId: 'forgemind-ai',
    researchQuestions: [
      'Do standard probabilistic calibration and prediction-interval coverage metrics consistently correlate with lower realized maintenance cost?',
      'How severely do uncertainty-driven maintenance thresholds degrade when operating conditions shift between training and evaluation regimes?',
    ],
    methodologySteps: [
      'Construct probabilistic RUL intervals and record statistical calibration and coverage scores across benchmark engines and bearings.',
      'Define preventive vs. corrective failure cost ratios inside a discrete maintenance policy evaluator.',
      'Measure alignment between statistical uncertainty rankings and realized maintenance policy cost under operating shift.',
    ],
    completedWork: [
      'Experimental problem formulation and cross-benchmark evaluation scope defined across NASA C-MAPSS and FEMTO/PRONOSTIA.',
    ],
    ongoingWork: [
      'Evaluating probabilistic interval calibration behaviors and manuscript preparation.',
    ],
    proposedWork: [
      'Full cross-regime maintenance policy cost simulation sweeps across asymmetric preventive-to-failure cost ratios.',
    ],
    futureDirections: [
      'Design decision-aware recalibration triggers for non-stationary industrial fleets.',
    ],
  },
  {
    id: 'carbon-aware-jss',
    title:
      'Tri-objective Carbon-Aware Job-Shop Scheduling Under Real Hourly Electricity Prices and Grid Carbon Intensity: Price–Carbon Decoupling and Delivery-Neutral Savings',
    status: 'Manuscript in Preparation',
    domain: 'Sustainable Manufacturing & Scheduling',
    datasetsOrBenchmarks: 'Public Job-Shop Benchmarks · 2025 Hourly Data (4 European Grids)',
    methods: ['Tri-Objective Optimization', 'Job-Shop Scheduling', 'Time-of-Use Tariff & Carbon Modeling'],
    keyFocus: 'Quantifying delivery-neutral carbon emission reductions where electricity price and grid carbon intensity decouple.',
    abstract:
      'Formulates and simulates tri-objective job-shop scheduling under real 2025 hourly electricity prices and grid carbon intensity across four European power grids on public benchmark instances. Examines price–carbon decoupling dynamics and demonstrates how scheduling flexibility achieves delivery-neutral emission savings.',
    motivation:
      'Cost-minimizing schedules assume cheaper off-peak electricity hours are automatically cleaner, yet real 2025 grid series reveal frequent periods where wholesale electricity prices and marginal carbon intensity decouple.',
    expectedContribution:
      'Characterize when tri-objective job-shop scheduling can leverage residual slack to achieve delivery-neutral operational carbon reductions without incurring late-order penalties.',
    relatedProjectId: 'factorymind',
    researchQuestions: [
      'When hourly electricity prices and grid carbon intensity decouple, can tri-objective scheduling reduce emissions without sacrificing makespan or tardiness commitments?',
    ],
    methodologySteps: [
      'Pair standard public job-shop benchmark instances with 2025 hourly tariff and carbon intensity series across four European grids.',
      'Optimize simultaneously over delivery tardiness/makespan, energy cost, and operational carbon emissions.',
      'Analyze delivery-neutral Pareto flexibility where emissions decline without late-order penalties.',
    ],
    completedWork: [
      'Tri-objective formulation and benchmark simulation runs across four European grid datasets compiled for analysis.',
    ],
    ongoingWork: [
      'Synthesizing price–carbon decoupling findings and preparing manuscript tables and discussion.',
    ],
    proposedWork: [
      'Extend deterministic job-shop baselines to stochastic processing disruptions and dynamic real-time dispatch.',
    ],
    futureDirections: [
      'Incorporate carbon-aware scheduling modules into open-source manufacturing tooling such as FactoryMind.',
    ],
  },
  {
    id: 'decision-centric-demand',
    title:
      'Beyond Forecast Accuracy: Decision-Centric Evaluation of Demand Forecasting for Inventory Replenishment under Intermittent and Shifting Retail Demand',
    status: 'Manuscript in Preparation',
    domain: 'Supply Chain & Inventory Analytics',
    datasetsOrBenchmarks: '3,999 Real Retail Series (M5 Dataset) · 59 Forecaster–Policy Pairings',
    methods: ['Lost-Sales Periodic-Review Simulation', 'Intermittent Demand Forecasting', 'Inventory Cost Analysis'],
    keyFocus: 'Measuring the disconnect between point/probabilistic forecast error and actual replenishment cost.',
    abstract:
      'Measures the empirical gap between standard forecast accuracy metrics and realized inventory replenishment cost across 3,999 real retail demand series from the M5 competition dataset, evaluated via a lost-sales periodic-review simulation spanning 59 forecaster–policy pairings under intermittent and shifting demand.',
    motivation:
      'Retail replenishment pipelines often select demand forecasters using aggregate point or quantile error scores even though intermittent and shifting demand creates highly nonlinear holding versus lost-sales cost consequences.',
    expectedContribution:
      'Document how statistical forecast accuracy rankings diverge from realized periodic-review replenishment cost across 3,999 intermittent retail series and 59 forecaster–policy pairings.',
    relatedProjectId: 'factorymind',
    researchQuestions: [
      'How well do traditional point and quantile forecast error metrics rank inventory replenishment policies when demand is intermittent and non-stationary?',
    ],
    methodologySteps: [
      'Filter 3,999 intermittent and shifting demand series from the M5 retail benchmark.',
      'Simulate lost-sales periodic-review replenishment across 59 forecaster–policy pairings.',
      'Evaluate correlation and rank discrepancies between statistical accuracy scores and realized holding/stockout cost.',
    ],
    completedWork: [
      'Large-scale periodic-review simulation matrix framed across 3,999 M5 series and 59 forecaster–policy pairings.',
    ],
    ongoingWork: [
      'Structured synthesis of forecast-error versus replenishment-cost divergence for manuscript completion.',
    ],
    proposedWork: [
      'Evaluate multi-echelon lead-time uncertainty interaction with intermittent demand forecasters.',
    ],
    futureDirections: [
      'Unify decision-centric evaluation principles across both inventory forecasting and predictive maintenance domains.',
    ],
  },
];

export const RESEARCH_PUBLISHED_RECORDS: ResearchPublicationRecord[] = [];

export const RESEARCH_EXPERIMENTS: ResearchExperiment[] = [
  {
    id: 'exp-cmapss-fd001-baseline',
    title: 'NASA C-MAPSS FD001 Multi-Model Baseline & SHAP Pipeline',
    stage: 'completed',
    stageLabel: 'Completed Experiment',
    domain: 'Predictive Maintenance',
    dataset: 'NASA C-MAPSS FD001',
    summary:
      'Constructed comparative Random Forest, XGBoost, and LSTM baselines with SHAP feature attribution workflow to examine sensor contribution across run-to-failure cycles.',
    relatedStudyId: 'rul-explainable',
    relatedProjectId: 'forgemind-ai',
  },
  {
    id: 'exp-europe-grid-jss',
    title: 'Tri-Objective Job-Shop Scheduling Under 2025 European Grid Series',
    stage: 'completed',
    stageLabel: 'Completed Experiment',
    domain: 'Engineering Optimization',
    dataset: 'Job-Shop Benchmarks · 4 European Grids',
    summary:
      'Simulated tri-objective schedules balancing delivery timing, electricity price, and hourly grid carbon intensity across four real 2025 European grid profiles.',
    relatedStudyId: 'carbon-aware-jss',
    relatedProjectId: 'factorymind',
  },
  {
    id: 'exp-m5-replenishment',
    title: 'Lost-Sales Periodic-Review Simulation Across 3,999 M5 Retail Series',
    stage: 'completed',
    stageLabel: 'Completed Experiment',
    domain: 'Industrial & Supply Chain Analytics',
    dataset: 'M5 Competition Dataset (3,999 Series)',
    summary:
      'Executed comparative evaluation of 59 forecaster–policy pairings under intermittent retail demand to inspect forecast error vs. replenishment cost gaps.',
    relatedStudyId: 'decision-centric-demand',
    relatedProjectId: 'factorymind',
  },
  {
    id: 'exp-cmapss-shift-calibration',
    title: 'Uncertainty Calibration Sensitivity Under Operating-Condition Shift',
    stage: 'ongoing',
    stageLabel: 'Ongoing Experiment',
    domain: 'Uncertainty-Aware Prognostics',
    dataset: 'NASA C-MAPSS & FEMTO/PRONOSTIA',
    summary:
      'Analyzing how prediction interval coverage and probabilistic calibration metrics behave when turbofan and bearing operating conditions shift across subsets.',
    relatedStudyId: 'decision-aware-prognostics',
    relatedProjectId: 'forgemind-ai',
  },
  {
    id: 'exp-sensor-pruning',
    title: 'Progressive Sensor Footprint Reduction & Trade-Off Analysis',
    stage: 'ongoing',
    stageLabel: 'Ongoing Experiment',
    domain: 'Explainable Applied ML',
    dataset: 'NASA C-MAPSS FD001',
    summary:
      'Testing systematic sensor removal guided by SHAP rankings to weigh computational compactness against RUL prediction stability.',
    relatedStudyId: 'rul-explainable',
    relatedProjectId: 'forgemind-ai',
  },
  {
    id: 'exp-policy-cost-sweep',
    title: 'Decision-Aware Maintenance Policy Cost Sweep (ForgeMind AI)',
    stage: 'proposed',
    stageLabel: 'Proposed Experiment',
    domain: 'Maintenance Policy Optimization',
    dataset: 'NASA C-MAPSS Multi-Regime Subsets',
    summary:
      'Proposed evaluation translating probabilistic RUL bounds directly into preventive vs. unexpected-failure replacement cost curves across asymmetric cost ratios.',
    relatedStudyId: 'decision-aware-prognostics',
    relatedProjectId: 'forgemind-ai',
  },
  {
    id: 'exp-carbon-stochastic-ext',
    title: 'Stochastic Breakdown Extension for Carbon-Aware Scheduling',
    stage: 'proposed',
    stageLabel: 'Proposed Experiment',
    domain: 'Smart Manufacturing Systems',
    dataset: 'Public Job-Shop Instances + Hourly Grid Signals',
    summary:
      'Proposed integration of machine health triggers with hourly grid carbon intensity inside open-source scheduling tooling.',
    relatedStudyId: 'carbon-aware-jss',
    relatedProjectId: 'factorymind',
  },
];

export const RESEARCH_DATASETS: ResearchDatasetEntry[] = [
  {
    id: 'ds-cmapss',
    name: 'NASA C-MAPSS Turbofan Engine Degradation',
    domain: 'Aerospace & Industrial Prognostics',
    scope: 'Run-to-failure multivariate sensor trajectories (FD001 & multi-regime subsets)',
    usage: 'Comparative RUL modeling, SHAP sensor reduction, and uncertainty-aware maintenance policy evaluation.',
    featured: true,
  },
  {
    id: 'ds-femto',
    name: 'FEMTO / PRONOSTIA Bearing Dataset',
    domain: 'Rotating Machinery Reliability',
    scope: 'Accelerated degradation vibration & thermal run-to-failure testbeds',
    usage: 'Cross-benchmark verification of probabilistic calibration under operating-condition shift.',
  },
  {
    id: 'ds-grids',
    name: 'Public Job-Shop Benchmarks + 2025 European Grid Series',
    domain: 'Sustainable Manufacturing Scheduling',
    scope: 'Hourly electricity tariffs and carbon intensity across four European power grids',
    usage: 'Evaluating price–carbon decoupling and delivery-neutral emission savings.',
  },
  {
    id: 'ds-m5',
    name: 'M5 Retail Competition Demand Dataset (3,999 Series)',
    domain: 'Supply Chain & Inventory Replenishment',
    scope: 'Intermittent and shifting retail demand time series',
    usage: '59 forecaster–policy lost-sales periodic-review simulations.',
  },
];

export const RESEARCH_METHODOLOGY: ResearchMethodologyStep[] = [
  {
    step: '01',
    title: 'Operational & Decision Framing',
    description:
      'Formulate mathematical or machine learning objectives around real engineering trade-offs—maintenance replacement cost, delivery tardiness, energy emissions, or inventory stockouts—rather than isolated accuracy scores.',
  },
  {
    step: '02',
    title: 'Public Benchmark Standardization',
    description:
      'Curate transparent, reproducible public datasets (NASA C-MAPSS, FEMTO/PRONOSTIA, job-shop instances, M5 retail series) with explicit operating splits and zero synthetic metric inflation.',
  },
  {
    step: '03',
    title: 'Comparative & Explainable Modeling',
    description:
      'Benchmark lightweight interpretable models alongside deep/metaheuristic baselines (Random Forest, XGBoost, LSTM, SHAP, OR-Tools MIP, GA, SA).',
  },
  {
    step: '04',
    title: 'Policy Simulation & Robustness Checks',
    description:
      'Test whether statistical intervals and predictions hold up inside closed-loop maintenance or replenishment cost simulations under operating-condition shifts.',
  },
];

export const RESEARCH_TOOL_GROUPS: ResearchToolGroup[] = [
  {
    category: 'Machine Learning & Prognostics',
    tools: ['Python', 'Scikit-Learn', 'XGBoost', 'LSTM Networks', 'SHAP Explainability', 'Calibration & Coverage Analysis'],
  },
  {
    category: 'Operations Research & Simulation',
    tools: ['Google OR-Tools (MIP)', 'Genetic Algorithms', 'Simulated Annealing', 'Discrete-Event Simulation', 'Lost-Sales Inventory Simulation'],
  },
  {
    category: 'Manufacturing Analytics & Software',
    tools: ['Statistical Process Control (SPC)', 'Streamlit Analytical UI', 'Git / Reproducible Pipelines', 'Technical Manuscript Writing'],
  },
];

export const RESEARCH_NOTES: ResearchNoteEntry[] = [
  {
    id: 'note-uncertainty-cost',
    title: 'Working Note: Why Statistical Interval Coverage Alone Can Misrank Maintenance Policies',
    dateLabel: 'Working Research Memo · Prognostics',
    topic: 'Uncertainty-Aware Reliability',
    summary:
      'Symmetric interval coverage rewards narrow uniform bounds, whereas preventive vs. run-to-failure maintenance costs are strongly asymmetric under degradation shift.',
    relatedStudyId: 'decision-aware-prognostics',
  },
  {
    id: 'note-shap-sensors',
    title: 'Working Note: Sensor Footprint Reduction Trade-Offs in NASA C-MAPSS FD001',
    dateLabel: 'Working Research Memo · Explainable ML',
    topic: 'Lightweight Diagnostics',
    summary:
      'Ranking multi-sensor channels with SHAP helps identify redundant telemetry streams before committing embedded monitoring bandwidth.',
    relatedStudyId: 'rul-explainable',
  },
  {
    id: 'note-forecast-gap',
    title: 'Working Note: Disconnecting Point Forecast Error from Replenishment Cost',
    dateLabel: 'Working Research Memo · Supply Chain',
    topic: 'Decision-Centric Analytics',
    summary:
      'Under intermittent retail demand, standard point error improvements do not guarantee proportional holding or lost-sales cost reductions inside periodic-review policies.',
    relatedStudyId: 'decision-centric-demand',
  },
];

