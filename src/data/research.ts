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
  positioningTitle: 'Undergraduate Researcher · Industrial & Production Engineering (SUST)',
  positioningSummary:
    'Three connected unpublished research studies connecting predictive modelling with operational decisions in industrial and supply-chain systems—spanning explainable cross-dataset RUL prediction, decision-aware uncertainty calibration under operating shift, and decision-centric demand forecasting for inventory replenishment.',
  integrityNotice:
    'All three works are Unpublished Research conducted strictly on public benchmarks and simulation testbeds. Complete manuscripts, confidential numerical results, full result tables, and unapproved figures are withheld prior to formal review and publication, with zero operational fleet or commercial deployment claims.',
  featuredDirection: {
    title: 'Decision-Aware Uncertainty & Explainable Prognostics Across Benchmark Regimes',
    subtitle: 'Featured Research Thread · Benchmark & Simulation Studies',
    summary:
      'Connecting sensor-level Remaining Useful Life (RUL) explainability and cross-dataset generalization on NASA C-MAPSS (FD001 / FD003) with closed-loop DAPE maintenance risk calibration across turbofan and FEMTO/PRONOSTIA bearing prognostics under operating-condition shift.',
    datasetHighlight: 'NASA C-MAPSS (FD001 / FD003 & Operating Shift) · FEMTO / PRONOSTIA Bearings · M5 Retail Panel',
    relatedProjectId: 'forgemind-ai',
  },
  collaborationSummary:
    'Open to undergraduate research mentorship, reproducible benchmark replication, and collaborative studies across reliability engineering, uncertainty quantification, and operations research.',
  collaborationTracks: [
    {
      title: 'Faculty-Mentored & Lab Research',
      detail:
        'Contributing data pipelines, comparative modeling, and simulation experiments to Industrial & Production Engineering, reliability, and operations research groups.',
    },
    {
      title: 'Public Benchmark Replication',
      detail:
        'Reproducible experimentation on NASA C-MAPSS, FEMTO/PRONOSTIA bearing testbeds, and the M5 retail competition demand dataset.',
    },
    {
      title: 'Analytical Decision Tooling',
      detail:
        'Connecting academic optimization and predictive maintenance methods with inspectable Python and TypeScript decision-support interfaces.',
    },
  ],
  futureDirections: [
    {
      title: 'Multi-Condition RUL & Hardware Validation',
      detail:
        'Extending C-MAPSS explainability and cross-fault studies to multi-operating-condition subsets (FD002/FD004), alternative recurrent architectures, sensitivity analysis, and target-hardware validation.',
    },
    {
      title: 'Domain-Adaptive Recalibration Under Severe Shift',
      detail:
        'Investigating domain-adaptive retraining when target operating regimes fall outside training support, addressing cases where post-hoc recalibration alone cannot recover maintenance performance.',
    },
    {
      title: 'Multi-Echelon & Protection-Interval Inventory Modelling',
      detail:
        'Expanding lost-sales M5 evaluation toward direct protection-interval quantile modelling, longer rolling-origin windows, stochastic lead times, backorders, and multi-echelon networks.',
    },
  ],
};

export const RESEARCH_MANUSCRIPTS: ResearchManuscript[] = [
  {
    id: 'rul-explainable',
    cardTitle: 'Explainable & Cross-Dataset RUL Prediction',
    title: 'Explainable and Cross-Dataset RUL Prediction for Turbofan Engines',
    workingTitle:
      'Machine Learning for Remaining Useful Life Prediction of Turbofan Engines: A Lightweight, Explainable, and Cross-Dataset Generalization Study',
    status: 'Unpublished Research',
    domain: 'Predictive Maintenance',
    researchArea: 'Predictive Maintenance, Machine Learning and Explainable AI',
    centralQuestion:
      'How reliably can models estimate equipment remaining useful life across fault modes?',
    datasetsOrBenchmarks: 'NASA C-MAPSS FD001 & FD003 (Single Operating Condition, Distinct Fault Modes)',
    methods: ['NASA C-MAPSS', 'FD001 / FD003', 'Random Forest', 'XGBoost', 'LSTM', 'SHAP'],
    keyFocus:
      'Comparing lightweight tree ensembles and sequence learning across accuracy, SHAP interpretability, sensor reduction, and cross-dataset fault-mode generalization.',
    abstract:
      'This study investigates machine-learning approaches for estimating the Remaining Useful Life (RUL) of turbofan engines using NASA\'s C-MAPSS degradation benchmark. It compares tree-based models and a sequence-learning approach, examines how model behaviour changes across degradation stages, and uses explainability techniques to identify influential sensor measurements. The work also studies whether models trained on one fault-mode dataset transfer reliably to another, and evaluates sensor-reduction and pooled-training strategies as practical considerations for predictive-maintenance modelling.',
    motivation:
      'Predictive-maintenance models are often evaluated on data drawn from conditions similar to their training data. A model may perform well in that setting yet fail when equipment exhibits a different fault mechanism. The study examines model accuracy, interpretability, sensor requirements and generalization together, rather than relying on a single aggregate prediction metric.',
    expectedContribution:
      'Provides a controlled benchmark synthesis combining comparative model evaluation, SHAP-led sensor-reduction trade-offs, and cross-dataset fault-mode generalization experiments.',
    contributionAreas: [
      'A comparative evaluation of lightweight tree ensembles and sequence learning under a common evaluation protocol.',
      'An explainability-led investigation of sensor importance and a practical sensor-reduction experiment.',
      'A controlled examination of cross-dataset fault-mode generalization and pooled training.',
    ],
    featuredDirection: true,
    relatedProjectId: 'forgemind-ai',
    researchQuestions: [
      'How reliably can models estimate equipment remaining useful life across fault modes?',
      'Can reduced sensor subsets selected via SHAP attribution retain useful predictive performance compared with full telemetry arrays?',
    ],
    methodologySteps: [
      'Prepare NASA C-MAPSS FD001 and FD003 datasets sharing a single operating condition while differing in fault-mode composition.',
      'Evaluate Random Forest and XGBoost on cycle-level sensor features alongside an LSTM on sequential windows using RMSE, MAE, the NASA scoring function, aligned test instances, repeated random seeds, and degradation-stage analysis.',
      'Apply SHAP attribution independently across tree-based models to rank influential sensor measurements and retrain models on selected reduced sensor subsets.',
      'Test cross-dataset fault-mode transfer by training on one dataset and evaluating on the other, followed by pooled-training experiments.',
    ],
    completedWork: [
      'Unified preprocessing and comparative Random Forest, XGBoost, and LSTM evaluation protocol structured on FD001 and FD003.',
      'Independent tree-model SHAP sensor importance workflow and reduced-sensor retraining setup established.',
    ],
    ongoingWork: [
      'Synthesis of degradation-stage behaviour, cross-dataset transfer observations, and pooled-training manuscript refinement.',
    ],
    proposedWork: [
      'Extend benchmark evaluation to multi-operating-condition FD002 and FD004 subsets and alternative recurrent architectures.',
    ],
    limitations: [
      'Scope is limited to NASA C-MAPSS FD001 and FD003, both operating under a single operating condition.',
      'Reported benchmark findings must not be treated as proof of operational performance in a real industrial fleet.',
    ],
    futureDirections: [
      'Evaluate multi-condition FD002/FD004 subsets alongside alternative recurrent architectures and more extensive LSTM tuning.',
      'Conduct formal sensitivity analysis and validate reduced-sensor pipelines on real industrial sensor streams and target hardware.',
    ],
  },
  {
    id: 'decision-aware-prognostics',
    cardTitle: 'Decision-Aware Uncertainty for Predictive Maintenance',
    title: 'Decision-Aware Uncertainty for Maintenance under Operating Shift',
    workingTitle:
      'Does Uncertainty-Aware Prognostics Actually Reduce Maintenance Cost Under Operating-Condition Shift? A Decision-Theoretic Evaluation Framework with Cross-Domain Evidence',
    status: 'Unpublished Research',
    domain: 'Decision-Aware Uncertainty',
    researchArea: 'Prognostics, Uncertainty Quantification and Decision Science',
    centralQuestion:
      'Do uncertainty estimates lead to better maintenance actions under operating shift?',
    datasetsOrBenchmarks: 'NASA C-MAPSS Turbofan Data · FEMTO / PRONOSTIA Bearing Data',
    methods: ['DAPE', 'C-MAPSS', 'FEMTO / PRONOSTIA', 'ETCE', 'Tail-Brier', 'DRC'],
    keyFocus:
      'Closed-loop DAPE decision evaluation, decision-relevant risk calibration (ETCE & tail-Brier), and Decision-Relevant Conformal (DRC) recalibration under operating shift.',
    abstract:
      'This study asks whether uncertainty estimates in remaining-useful-life prediction actually improve maintenance decisions when operating conditions shift. It frames replacement decisions through a cost-sensitive decision rule and develops a closed-loop evaluation approach linking predictions, uncertainty calibration, maintenance actions and long-run cost. The work examines why conventional accuracy and interval-calibration measures may not reflect the reliability of the specific risk estimate used by a maintenance policy, and explores decision-relevant recalibration methods across turbofan and bearing prognostics data.',
    motivation:
      'A prognostic model can have competitive prediction accuracy or apparently satisfactory interval coverage while still producing poor maintenance actions. Under distribution shift, an overconfident model may delay intervention, while an overly conservative model may encourage unnecessary maintenance. The manuscript focuses on calibrating the risk quantity that the replacement decision actually uses.',
    expectedContribution:
      'Connects decision theory, closed-loop maintenance cost evaluation (DAPE), and trigger-aligned calibration (ETCE, tail-Brier, DRC) across shifting engine and bearing regimes.',
    contributionAreas: [
      'A decision-theoretic explanation of why maintenance decisions may depend on a calibrated risk score rather than general interval coverage.',
      'A closed-loop framework (DAPE) for evaluating prognostic systems through the costs of the actions they induce.',
      'Decision-relevant calibration metrics and recalibration strategies designed around the maintenance trigger.',
    ],
    featuredDirection: true,
    relatedProjectId: 'forgemind-ai',
    researchQuestions: [
      'Do uncertainty estimates lead to better maintenance actions under operating shift?',
      'Why can conventional accuracy and interval-coverage scores diverge from the risk-score reliability required by a cost-sensitive replacement rule?',
    ],
    methodologySteps: [
      'Formulate single-unit replacement with a decision lead time as a cost-sensitive newsvendor-style rule driven by planned versus corrective maintenance costs.',
      'Couple prediction, uncertainty calibration, action triggers, and long-run renewal-reward cost inside the Decision-Aware Prognostics Evaluation (DAPE) loop.',
      'Measure trigger-level risk reliability via Expected Tail Calibration Error (ETCE) and tail-Brier-style metrics, then apply Decision-Relevant Conformal (DRC) quantile calibration alongside post-hoc and online baselines.',
      'Compare predictors, recalibration strategies, and multiple operating-condition shift scenarios across NASA C-MAPSS turbofan and FEMTO/PRONOSTIA bearing data using statistical and sensitivity analyses.',
    ],
    completedWork: [
      'Cost-sensitive replacement formulation and closed-loop DAPE evaluation structure defined across C-MAPSS and FEMTO/PRONOSTIA.',
      'Decision-relevant risk calibration (ETCE / tail-Brier) and DRC quantile recalibration baselines organized for cross-domain shift testing.',
    ],
    ongoingWork: [
      'Refining statistical and sensitivity analyses across operating-shift comparisons while keeping private metrics unpublished.',
    ],
    proposedWork: [
      'Investigate domain-adaptive retraining strategies when target operating conditions fall outside training support.',
    ],
    limitations: [
      'Constrained by the small number of run-to-failure bearing units and simplified deterministic age-indexed renewal modelling.',
      'Uses limited Monte Carlo seeds, normalized cost parameters, and reveals scenarios where post-hoc recalibration alone cannot recover out-of-support shifts.',
    ],
    futureDirections: [
      'Pursue domain-adaptive model retraining rather than relying solely on post-hoc recalibration when target regimes leave training support.',
      'Perform real-fleet validation once public benchmark evaluation and manuscript review conclude.',
    ],
  },
  {
    id: 'decision-centric-demand',
    cardTitle: 'Decision-Centric Demand Forecasting & Inventory Optimization',
    title: 'Decision-Centric Demand Forecasting for Inventory Replenishment',
    workingTitle:
      'Beyond Forecast Accuracy: Decision-Centric Evaluation of Demand Forecasting for Inventory Replenishment under Intermittent and Shifting Retail Demand',
    status: 'Unpublished Research',
    domain: 'Inventory & Operations Research',
    researchArea: 'Operations Research, Demand Forecasting and Inventory Control',
    centralQuestion:
      'Does a more accurate forecast necessarily produce a better replenishment decision?',
    datasetsOrBenchmarks: 'M5 Retail Dataset (Bottom-Level Item-Store Series & Stratified Sample)',
    methods: ['M5 Dataset', 'LightGBM', 'Intermittent Demand', 'Inventory Control', 'Quantile Forecasting'],
    keyFocus:
      'Comparing point, quantile, and calibrated empirical-interval forecasters paired with replenishment policies under periodic-review lost-sales economics.',
    abstract:
      'This study investigates whether choosing a demand-forecasting model by prediction accuracy necessarily leads to better inventory replenishment decisions. Using a retail demand panel and a simulated lost-sales, periodic-review inventory system, it compares forecasting approaches together with replenishment policies under a margin-based cost framework. The work emphasizes the interaction between forecasts, demand uncertainty, safety-stock decisions and replenishment rules, and explores how strategy selection can be made using validation-period decision costs.',
    motivation:
      'Forecasting systems are commonly ranked by statistical error, but replenishment decisions balance the cost of holding excess inventory against the cost of unmet demand. Under intermittent and skewed demand, a lower forecast error does not necessarily imply a lower inventory cost or a better service outcome. The study evaluates forecasting and inventory policy as a combined decision system.',
    expectedContribution:
      'Evaluates forecasting models and replenishment rules as a coupled decision system and examines portfolio-level validation-cost strategy selection.',
    contributionAreas: [
      'A decision-centric comparison of demand forecasters and replenishment policies, rather than treating forecast error as the only objective.',
      'A simulation framework that connects retail demand forecasts to inventory costs and service outcomes.',
      'An investigation of validation-based strategy selection at portfolio level and the limits of per-item selection and empirical calibration.',
    ],
    relatedProjectId: 'factorymind',
    researchQuestions: [
      'Does a more accurate forecast necessarily produce a better replenishment decision?',
      'Can validation-period decision costs guide forecaster–policy selection more effectively than statistical forecast error alone?',
    ],
    methodologySteps: [
      'Sample bottom-level item-store demand series and a stratified evaluation panel from the M5 retail dataset.',
      'Evaluate nine point-forecasting methods alongside a trained quantile forecasting approach (including LightGBM) and calibrated empirical-interval variants.',
      'Simulate single-echelon, periodic-review, lost-sales replenishment with deterministic lead time and a margin-based cost model across base-stock and alternative review-policy families.',
      'Select strategies using a dedicated validation period while reserving a separate test block for economic cost, service outcome, paired uncertainty, and sensitivity checks.',
    ],
    completedWork: [
      'Single-echelon periodic-review lost-sales simulation pairing forecasting families and replenishment policies on stratified M5 demand series.',
      'Validation-period versus reserved-test-block evaluation design and margin-based cost framing established.',
    ],
    ongoingWork: [
      'Documenting aggregation-confound diagnostics and portfolio-level strategy selection limits in manuscript revision.',
    ],
    proposedWork: [
      'Test direct protection-interval quantile modelling and longer rolling-origin evaluation windows.',
    ],
    limitations: [
      'Identifies an aggregation confound between daily quantile aggregation and direct protection-interval calibration, alongside an upper-edge quantile grid.',
      'Scope reflects a single retail dataset and test period, assumed cost parameters, one ML family, deterministic lead times, and a lost-sales-only setting.',
    ],
    futureDirections: [
      'Incorporate additional retail datasets, longer rolling-origin evaluation, and direct protection-interval quantile modelling.',
      'Extend simulation settings to stochastic lead times, backorders, and multi-echelon inventory networks.',
    ],
  },
];

export const RESEARCH_PUBLISHED_RECORDS: ResearchPublicationRecord[] = [];

export const RESEARCH_EXPERIMENTS: ResearchExperiment[] = [
  {
    id: 'exp-cmapss-fd001-baseline',
    title: 'NASA C-MAPSS FD001 & FD003 Multi-Model & Cross-Dataset Setup',
    stage: 'completed',
    stageLabel: 'Completed Experiment',
    domain: 'Predictive Maintenance',
    dataset: 'NASA C-MAPSS FD001 / FD003',
    summary:
      'Structured Random Forest, XGBoost, and LSTM baselines with aligned test instances, repeated random seeds, SHAP feature attribution, and cross-fault transfer runs.',
    relatedStudyId: 'rul-explainable',
    relatedProjectId: 'forgemind-ai',
  },
  {
    id: 'exp-dape-shift-setup',
    title: 'DAPE Closed-Loop Maintenance Framework & Risk Calibration Runs',
    stage: 'completed',
    stageLabel: 'Completed Experiment',
    domain: 'Decision-Aware Uncertainty',
    dataset: 'NASA C-MAPSS · FEMTO / PRONOSTIA',
    summary:
      'Constructed cost-sensitive newsvendor-style replacement evaluator linking RUL predictions, ETCE/tail-Brier diagnostics, and Decision-Relevant Conformal (DRC) recalibration.',
    relatedStudyId: 'decision-aware-prognostics',
    relatedProjectId: 'forgemind-ai',
  },
  {
    id: 'exp-m5-replenishment',
    title: 'Lost-Sales Periodic-Review Simulation Across M5 Retail Series',
    stage: 'completed',
    stageLabel: 'Completed Experiment',
    domain: 'Inventory & Operations Research',
    dataset: 'M5 Retail Competition Dataset',
    summary:
      'Built single-echelon lost-sales inventory simulation pairing nine point-forecasting methods, trained quantile forecasting, and empirical intervals with replenishment policy families.',
    relatedStudyId: 'decision-centric-demand',
    relatedProjectId: 'factorymind',
  },
  {
    id: 'exp-sensor-pruning',
    title: 'SHAP Sensor Reduction & Pooled-Training Synthesis',
    stage: 'ongoing',
    stageLabel: 'Ongoing Experiment',
    domain: 'Predictive Maintenance',
    dataset: 'NASA C-MAPSS FD001 / FD003',
    summary:
      'Evaluating whether reduced sensor subsets retain useful predictive stability across degradation stages and fault-mode shifts under pooled training.',
    relatedStudyId: 'rul-explainable',
    relatedProjectId: 'forgemind-ai',
  },
  {
    id: 'exp-cmapss-shift-calibration',
    title: 'Out-of-Support Shift & Sensitivity Analysis in Prognostics',
    stage: 'ongoing',
    stageLabel: 'Ongoing Experiment',
    domain: 'Decision-Aware Uncertainty',
    dataset: 'NASA C-MAPSS & FEMTO/PRONOSTIA',
    summary:
      'Examining sensitivity checks across operating-condition shift scenarios and documenting boundary cases where post-hoc recalibration cannot recover performance.',
    relatedStudyId: 'decision-aware-prognostics',
    relatedProjectId: 'forgemind-ai',
  },
  {
    id: 'exp-cmapss-fd002-fd004',
    title: 'Multi-Condition FD002/FD004 & Hardware Validation Extension',
    stage: 'proposed',
    stageLabel: 'Proposed Experiment',
    domain: 'Predictive Maintenance',
    dataset: 'NASA C-MAPSS FD002 / FD004 & Field Hardware',
    summary:
      'Proposed expansion to multi-operating-condition turbofan subsets, alternative recurrent architectures, broader LSTM tuning, and real industrial sensor validation.',
    relatedStudyId: 'rul-explainable',
    relatedProjectId: 'forgemind-ai',
  },
  {
    id: 'exp-domain-adaptive-retrain',
    title: 'Domain-Adaptive Retraining Beyond Post-Hoc Recalibration',
    stage: 'proposed',
    stageLabel: 'Proposed Experiment',
    domain: 'Decision-Aware Uncertainty',
    dataset: 'Cross-Regime Engine & Bearing Benchmarks',
    summary:
      'Proposed domain-adaptive retraining methods for target operating conditions falling outside training support, paired with real-fleet validation.',
    relatedStudyId: 'decision-aware-prognostics',
    relatedProjectId: 'forgemind-ai',
  },
  {
    id: 'exp-m5-multi-echelon',
    title: 'Direct Protection-Interval Quantiles & Multi-Echelon Inventory',
    stage: 'proposed',
    stageLabel: 'Proposed Experiment',
    domain: 'Inventory & Operations Research',
    dataset: 'Multi-Dataset Retail & Rolling-Origin Panels',
    summary:
      'Proposed extensions addressing protection-interval quantile calibration, stochastic lead times, backorders, and multi-echelon inventory structures.',
    relatedStudyId: 'decision-centric-demand',
    relatedProjectId: 'factorymind',
  },
];

export const RESEARCH_DATASETS: ResearchDatasetEntry[] = [
  {
    id: 'ds-cmapss',
    name: 'NASA C-MAPSS Turbofan Engine Degradation (FD001 / FD003 & Shift)',
    domain: 'Aerospace & Industrial Prognostics',
    scope: 'Run-to-failure multivariate sensor trajectories across single-condition fault modes and operating-condition shifts',
    usage: 'Comparative RUL modeling, SHAP sensor reduction, cross-dataset generalization, and DAPE cost-aware calibration.',
    featured: true,
  },
  {
    id: 'ds-femto',
    name: 'FEMTO / PRONOSTIA Bearing Dataset',
    domain: 'Rotating Machinery Reliability',
    scope: 'Accelerated degradation run-to-failure bearing vibration testbed across operating regimes',
    usage: 'Cross-domain evaluation of decision-relevant risk calibration (ETCE, tail-Brier, DRC) under operating shift.',
  },
  {
    id: 'ds-m5',
    name: 'M5 Retail Competition Demand Dataset',
    domain: 'Supply Chain & Inventory Replenishment',
    scope: 'Bottom-level intermittent and shifting item-store retail demand series (stratified sample)',
    usage: 'Comparing point, quantile, and empirical-interval forecasting paired with periodic-review lost-sales inventory policies.',
  },
];

export const RESEARCH_METHODOLOGY: ResearchMethodologyStep[] = [
  {
    step: '01',
    title: 'Decision-Theoretic Problem Framing',
    description:
      'Connect predictive models directly to operational decisions—whether sensor footprint reduction, preventive vs. corrective replacement rules, or margin-based inventory replenishment.',
  },
  {
    step: '02',
    title: 'Reproducible Public Benchmarks & Simulation',
    description:
      'Conduct controlled experiments strictly on established public testbeds (NASA C-MAPSS, FEMTO/PRONOSTIA, M5 retail series) using explicit validation/test splits.',
  },
  {
    step: '03',
    title: 'Explainability & Risk-Score Calibration',
    description:
      'Examine SHAP sensor attribution, Expected Tail Calibration Error (ETCE), tail-Brier reliability, and Decision-Relevant Conformal (DRC) quantile alignment.',
  },
  {
    step: '04',
    title: 'Limitation Disclosure & Boundary Testing',
    description:
      'Identify structural scope limits—single operating conditions, limited bearing units, aggregation confounds, and out-of-support regimes—before claiming generalization.',
  },
];

export const RESEARCH_TOOL_GROUPS: ResearchToolGroup[] = [
  {
    category: 'Predictive Maintenance & Explainable AI',
    tools: ['Python', 'Random Forest', 'XGBoost', 'LSTM Networks', 'SHAP Explainability', 'NASA Scoring & Degradation Analysis'],
  },
  {
    category: 'Uncertainty Quantification & Decision Science',
    tools: ['DAPE Closed-Loop Evaluator', 'ETCE & Tail-Brier Metrics', 'Decision-Relevant Conformal (DRC)', 'Renewal-Reward Cost Analysis'],
  },
  {
    category: 'Inventory Control & Demand Forecasting',
    tools: ['LightGBM Quantile Forecasting', 'Point & Empirical-Interval Forecasters', 'Periodic-Review Lost-Sales Simulation', 'Base-Stock Policy Comparison'],
  },
];

export const RESEARCH_NOTES: ResearchNoteEntry[] = [
  {
    id: 'note-shap-sensors',
    title: 'Research Thread 01: Accuracy vs. Fault-Mode Generalization in RUL Prediction',
    dateLabel: 'Unpublished Research · Predictive Maintenance',
    topic: 'Cross-Dataset & Sensor Reduction',
    summary:
      'Models evaluated on matched conditions can struggle under fault-mode shift; pairing SHAP sensor selection with cross-dataset and pooled tests clarifies practical trade-offs.',
    relatedStudyId: 'rul-explainable',
  },
  {
    id: 'note-uncertainty-cost',
    title: 'Research Thread 02: Trigger-Aligned Risk Calibration vs. General Interval Coverage',
    dateLabel: 'Unpublished Research · Decision-Aware Prognostics',
    topic: 'DAPE · ETCE · DRC',
    summary:
      'Maintenance actions rely on a specific quantile or risk threshold rather than symmetric interval coverage, motivating decision-relevant metrics and recalibration around the trigger.',
    relatedStudyId: 'decision-aware-prognostics',
  },
  {
    id: 'note-forecast-gap',
    title: 'Research Thread 03: Forecast Error Rankings vs. Periodic-Review Inventory Cost',
    dateLabel: 'Unpublished Research · Operations Research',
    topic: 'Validation-Based Policy Selection',
    summary:
      'Under intermittent retail demand, lower point error does not automatically yield lower holding and lost-sales costs; evaluating forecasters alongside replenishment rules exposes key limits.',
    relatedStudyId: 'decision-centric-demand',
  },
];
