import type { ProjectEntry } from "../types/portfolio";

export const PROJECTS: ProjectEntry[] = [
  {
    id: 'factorymind',
    title: 'FactoryMind',
    tagline: 'Open-Source Smart Production & Operations Optimization Suite',
    categories: ['Engineering', 'Research', 'AI/ML', 'Software'],
    categoryLabel: 'Engineering · Research · AI/ML · Software',
    status: 'Active Prototype · Open-Source',
    developmentStage: 'Active Prototype',
    context: 'Industrial Analytics & Smart Manufacturing · Bangladesh RMG Case Study',
    githubUrl: 'https://github.com/Ibtasham/FactoryMind',
    sourceNote: 'Public GitHub repository available (github.com/Ibtasham/FactoryMind).',
    oneSentenceProblem:
      'Apparel and manufacturing planners frequently evaluate scheduling, inventory allocation, SPC quality drift, equipment reliability, and line queueing in disconnected spreadsheets rather than one decision workflow.',
    mainContribution:
      'Unites five core Industrial Engineering analytical engines—OR-Tools MIP/GA/SA scheduling, supply chain allocation, SPC control charts, ML degradation risk scoring, and discrete-event simulation—inside one open-source Streamlit suite.',
    summary:
      'An integrated industrial analytics and operations decision-support suite uniting production scheduling, supply chain optimization, statistical process control (SPC), ML predictive maintenance, and discrete-event simulation inside a Streamlit interface.',
    stack: [
      'Python',
      'Google OR-Tools (MIP)',
      'Genetic Algorithms',
      'Simulated Annealing',
      'Scikit-Learn',
      'Discrete-Event Simulation',
      'Streamlit',
    ],
    previewKindLabel: 'Conceptual Illustration',
    previewAlt:
      'Conceptual isometric smart manufacturing workstation and optimization trajectory illustration for FactoryMind',
    modules: [
      {
        id: 'scheduling',
        name: 'Production Scheduling Engine',
        methods: ['Mixed-Integer Programming (OR-Tools)', 'Genetic Algorithms', 'Simulated Annealing'],
        description:
          'Solves multi-machine shop-floor sequencing problems, comparing exact MIP bounds against metaheuristic schedules for makespan and tardiness minimization.',
        domainContext: 'Apparel & Ready-Made Garments (RMG) line scheduling case study.',
      },
      {
        id: 'supply-chain',
        name: 'Supply Chain Optimization',
        methods: ['Network Flow & Allocation', 'Inventory & Lead-Time Modeling'],
        description:
          'Models sourcing, capacity constraints, and distribution flows to evaluate bottleneck sensitivity and replenishment policies.',
        domainContext: 'Multi-echelon industrial procurement and dispatch planning.',
      },
      {
        id: 'spc',
        name: 'Statistical Process Control (SPC)',
        methods: ['Control Charts', 'Process Capability Analysis', 'Out-of-Control Detection'],
        description:
          'Monitors production quality metrics across batches to flag process drift and variance shifts before defect accumulation.',
        domainContext: 'Continuous shop-floor quality assurance.',
      },
      {
        id: 'pdm',
        name: 'ML Predictive Maintenance',
        methods: ['Supervised Degradation Modeling', 'Feature Engineering', 'Failure Risk Scoring'],
        description:
          'Applies machine learning models to sensor telemetry to estimate equipment health and reduce unplanned downtime.',
        domainContext: 'Condition-based maintenance planning.',
      },
      {
        id: 'des',
        name: 'Discrete-Event Simulation',
        methods: ['Queueing Dynamics', 'Throughput & Utilization Profiling', 'What-If Scenarios'],
        description:
          'Simulates stochastic workstation arrivals, buffer sizes, and shift capacities inside a unified Streamlit analytical interface.',
        domainContext: 'Line-balancing & bottleneck stress testing.',
      },
    ],
    caseStudy: {
      overviewSummary:
        'FactoryMind is an open-source Industrial & Production Engineering software prototype developed around a Bangladesh Ready-Made Garments (RMG) operational scenario. It bridges five core manufacturing analytics disciplines inside an interactive Python and Streamlit workspace, with public source code verifiable on GitHub.',
      problemStatement:
        'Manufacturing teams—particularly in high-throughput apparel and Ready-Made Garments (RMG) environments—often evaluate production scheduling, inventory allocation, quality control charts, equipment reliability, and line queueing in disconnected spreadsheets rather than an integrated decision workflow.',
      motivation:
        'Built while studying Industrial & Production Engineering at SUST to translate foundational IE coursework—operations research, SPC, reliability modeling, and simulation—into interactive, inspectable Python software rather than isolated textbook formulas.',
      proposedSolution:
        'FactoryMind consolidates five interdependent manufacturing analytics modules inside a single open-source Streamlit dashboard, allowing practitioners and students to configure operational parameters, run exact or metaheuristic solvers, inspect control charts, score failure risks, and stress-test line throughput.',
      architectureOverview:
        'Organized as a modular Python analytical core feeding five domain engines—Scheduling, Supply Chain, SPC, Predictive Maintenance, and Discrete-Event Simulation—surfaced through a unified interactive Streamlit workspace.',
      architectureLayers: [
        {
          id: 'fm-input',
          stage: 'Layer 01',
          title: 'Operational Parameter & Telemetry Input',
          detail: 'Configures job sequences, machine capacities, RMG case parameters, quality samples, and sensor features.',
          state: 'Implemented',
          inputs: 'Job durations, machine routing tables, batch measurements, and condition telemetry inputs',
          outputs: 'Validated scenario dictionaries passed to downstream solvers and simulators',
          technologies: ['Python', 'Streamlit Input Controls'],
          verificationNote: 'Active in public repository workflow; supports scenario parameterization without enterprise ERP integration.',
        },
        {
          id: 'fm-opt',
          stage: 'Layer 02',
          title: 'Optimization & Simulation Engines',
          detail: 'Google OR-Tools MIP solver alongside Genetic Algorithms, Simulated Annealing, network flow allocation, and DES queueing.',
          state: 'Implemented',
          inputs: 'Configured job-shop constraints, supply network arcs, and stochastic inter-arrival parameters',
          outputs: 'Makespan/tardiness schedules, allocation flows, and workstation queue utilization metrics',
          technologies: ['Google OR-Tools (MIP)', 'Genetic Algorithms', 'Simulated Annealing', 'Discrete-Event Simulation'],
          verificationNote: 'All four quantitative engines implemented as modular Python solvers for exact vs. heuristic inspection.',
        },
        {
          id: 'fm-analytics',
          stage: 'Layer 03',
          title: 'Quality & Predictive Analytics',
          detail: 'Statistical Process Control charts, process capability tracking, and supervised Scikit-Learn degradation risk scoring.',
          state: 'Implemented',
          inputs: 'Sequential process sample subgroups and engineered equipment condition features',
          outputs: 'Out-of-control rule flags, capability indices, and failure risk probability estimates',
          technologies: ['SPC Control Charts', 'Scikit-Learn', 'Feature Engineering'],
          verificationNote: 'Implemented inside the Streamlit pipeline for interactive anomaly and failure-risk review.',
        },
        {
          id: 'fm-ui',
          stage: 'Layer 04',
          title: 'Streamlit Decision Dashboard',
          detail: 'Unified browser interface supporting module switching, scenario runs, and visual trade-off inspection.',
          state: 'Implemented',
          inputs: 'Solver trajectories, SPC diagnostics, ML risk outputs, and DES queue traces',
          outputs: 'Interactive multi-module inspection views tailored to RMG planning scenarios',
          technologies: ['Streamlit', 'Python'],
          verificationNote: 'Public source code available on GitHub; screenshots and automated test suite remain planned.',
        },
      ],
      implementationSummary:
        'Implemented in Python around modular analytical components so each Industrial Engineering method—exact optimization, metaheuristics, SPC, ML risk scoring, and DES—can be executed interactively from one Streamlit environment.',
      implementedHeading: 'Implemented Capabilities (Per Repository Documentation)',
      implementedItems: [
        'Production Scheduling Engine comparing Google OR-Tools Mixed-Integer Programming bounds against Genetic Algorithms and Simulated Annealing.',
        'Supply Chain Optimization modeling network flows, sourcing allocations, lead times, and bottleneck sensitivity.',
        'Statistical Process Control (SPC) module generating control charts, process capability diagnostics, and drift checks.',
        'ML Predictive Maintenance workflow applying supervised degradation modeling and feature engineering for failure risk scoring.',
        'Discrete-Event Simulation module modeling stochastic arrivals, buffer capacities, and workstation utilization under what-if scenarios.',
        'Unified Streamlit dashboard anchored around a Bangladesh Ready-Made Garments (RMG) operational scenario.',
      ],
      secondaryHeading: 'Planned Extensions & Experimental Integrations',
      secondaryKind: 'proposed',
      secondaryItems: [
        'Automated pytest regression suite and standardized benchmark fixtures across all five analytical modules.',
        'Carbon-aware scheduling formulation hook derived from ongoing sustainable manufacturing research.',
        'Field usability feedback sessions with practicing Industrial Engineering officers in SME apparel lines.',
      ],
      coreFeatures: [
        {
          id: 'fm-feat-sched',
          name: 'Hybrid Scheduling (OR-Tools MIP · GA · SA)',
          maturity: 'Implemented',
          description: 'Evaluates exact Mixed-Integer Programming schedules alongside Genetic Algorithm and Simulated Annealing metaheuristics.',
          technicalBasis: 'Google OR-Tools CP/MIP solver & custom Python metaheuristic operators',
        },
        {
          id: 'fm-feat-supply',
          name: 'Supply Chain & Allocation Modeling',
          maturity: 'Implemented',
          description: 'Analyzes sourcing allocation, lead-time variability, and multi-stage capacity bottlenecks.',
          technicalBasis: 'Deterministic network flow and inventory sensitivity routines in Python',
        },
        {
          id: 'fm-feat-spc',
          name: 'Statistical Process Control (SPC) Monitor',
          maturity: 'Implemented',
          description: 'Tracks batch control limits, capability indices, and process shift alerts before downstream rework.',
          technicalBasis: 'Shewhart-style control rules & capability diagnostic calculations',
        },
        {
          id: 'fm-feat-pdm',
          name: 'Supervised Failure Risk Scoring',
          maturity: 'Implemented',
          description: 'Scores degradation risk from engineered equipment telemetry features inside the analytics workspace.',
          technicalBasis: 'Scikit-Learn supervised classification/regression pipeline',
        },
        {
          id: 'fm-feat-des',
          name: 'Discrete-Event Line Simulation',
          maturity: 'Implemented',
          description: 'Profiles buffer buildup, arrival variance, and station utilization under configurable what-if scenarios.',
          technicalBasis: 'Stochastic discrete-event queueing simulator in Python',
        },
        {
          id: 'fm-feat-carbon',
          name: 'Grid Carbon-Aware Scheduling Coupling',
          maturity: 'Planned',
          description: 'Planned integration of hourly electricity tariffs and carbon intensity into shop-floor dispatching.',
          technicalBasis: 'Derived from tri-objective carbon-aware job-shop manuscript in preparation',
        },
      ],
      technologyStackGroups: [
        {
          group: 'Optimization & Simulation',
          items: ['Google OR-Tools (MIP)', 'Genetic Algorithms', 'Simulated Annealing', 'Discrete-Event Simulation'],
        },
        {
          group: 'Quality & Machine Learning',
          items: ['Statistical Process Control (SPC)', 'Scikit-Learn', 'Feature Engineering'],
        },
        {
          group: 'Application Runtime',
          items: ['Python', 'Streamlit'],
        },
      ],
      screenshots: [
        {
          id: 'fm-preview',
          title: 'Smart Manufacturing Workstation & Trajectory Concept',
          caption:
            'Conceptual illustration representing FactoryMind’s unified scheduling, quality monitoring, and workstation simulation architecture. This artwork is a visual overview rather than an application screen capture.',
          kind: 'Conceptual Illustration',
          useGeneratedPreview: true,
        },
        {
          id: 'fm-capture-slot',
          title: 'Streamlit Dashboard Module Captures',
          caption:
            'Reserved slot for live browser screenshots of the Scheduling, SPC, Supply Chain, and Discrete-Event Simulation views executed from github.com/Ibtasham/FactoryMind.',
          kind: 'Awaiting Product Screenshot',
          requirements:
            'Requires live local Streamlit capture across RMG scheduling Gantt, SPC control chart, and DES utilization panels.',
        },
      ],
      challenges: [
        'Balancing exact MIP solver runtimes with flexible metaheuristic alternatives (Genetic Algorithms and Simulated Annealing) when instance sizes grow.',
        'Aligning heterogeneous analytical outputs—schedules, control charts, risk scores, and queue utilizations—into one consistent user workflow.',
      ],
      engineeringDecisions: [
        {
          id: 'fm-dec-1',
          challenge: 'Exact MILP scheduling struggles to scale cleanly on larger multi-machine RMG job permutations.',
          decision: 'Paired Google OR-Tools exact MIP bounds with configurable Genetic Algorithm and Simulated Annealing heuristics.',
          rationale: 'Preserves provable small-instance baselines while keeping larger what-if explorations interactive inside Streamlit.',
          tradeoff: 'Increases code surface area and parameter tuning options compared to a single-solver pipeline.',
        },
        {
          id: 'fm-dec-2',
          challenge: 'Industrial Engineering workflows rarely live in isolated silos; scheduling affects queue buffers and quality monitoring.',
          decision: 'Unified all five modules inside a single modular Streamlit dashboard rather than five separate CLI scripts.',
          rationale: 'Lowers inspection friction for IE practitioners and students testing cross-module interactions.',
          tradeoff: 'Streamlit rerun execution requires careful state boundaries compared to a dedicated decoupled React/FastAPI stack.',
        },
        {
          id: 'fm-dec-3',
          challenge: 'Separating open-source algorithmic feasibility from unverified commercial plant performance claims.',
          decision: 'Anchored examples explicitly on an illustrative Bangladesh RMG scenario without publishing unverified throughput speedup claims.',
          rationale: 'Maintains engineering credibility and invites empirical practitioner feedback prior to pilot deployment.',
          tradeoff: 'Less promotional than claiming synthetic percentage gains, but strictly accurate to repository state.',
        },
      ],
      testingValidationSummary:
        'Functional module behavior has been exercised interactively against structured Bangladesh RMG scenario parameters; automated unit testing and external factory validation remain in planned engineering scope.',
      validationRecords: [
        {
          id: 'fm-val-repo',
          method: 'Open-Source Code & Execution Walkthrough',
          scope: '5 Streamlit modules (Scheduling, Supply Chain, SPC, PdM, DES)',
          status: 'Verified',
          evidenceSummary: 'Source code publicly inspectable at github.com/Ibtasham/FactoryMind covering all five implemented Python engines.',
        },
        {
          id: 'fm-val-tests',
          method: 'Automated Solver & Simulation Unit Test Suite',
          scope: 'Regression invariants across OR-Tools MIP, GA, SA, SPC, and DES outputs',
          status: 'Planned',
          evidenceSummary: 'Planned addition of deterministic pytest fixtures to verify constraint feasibility and chart limits automatically.',
        },
        {
          id: 'fm-val-pilot',
          method: 'SME Industrial Practitioner Usability Validation',
          scope: 'RMG IE officers and floor production planners',
          status: 'Planned',
          evidenceSummary: 'No external commercial factory pilot or production time-study adoption has been conducted yet.',
        },
      ],
      currentLimitations: [
        'Live Streamlit interface screenshots are not yet attached to this portfolio gallery (conceptual illustration shown instead).',
        'Relies on local scenario inputs and illustrative RMG case parameters rather than live ERP, MES, or PLC telemetry streams.',
        'Automated pytest regression coverage and standardized runtime benchmark comparisons across instance sizes are not yet formalized.',
        'No external commercial factory validation or live manufacturing deployment has occurred.',
      ],
      currentProgress: [
        'All five core analytical modules integrated and published as an open-source repository on GitHub (Ibtasham/FactoryMind).',
        'Documented around a Bangladesh Ready-Made Garments (RMG) operational case study.',
      ],
      futureDevelopment: [
        'Attach verified Streamlit interface captures across scheduling, SPC, and simulation panels.',
        'Expand automated unit testing and reproducible benchmark presets across each analytical module.',
        'Connect tri-objective carbon-aware scheduling formulations from ongoing research into the scheduling engine.',
      ],
      impact:
        'Demonstrates end-to-end translation of core Industrial & Production Engineering methodologies into inspectable, open-source decision tooling; no commercial factory deployment or external adoption figures are claimed.',
    },
  },
  {
    id: 'forgemind-ai',
    title: 'ForgeMind AI',
    tagline: 'Uncertainty-Aware Prognostics & Maintenance Policy Research Platform',
    categories: ['Engineering', 'Research', 'AI/ML', 'Innovation'],
    categoryLabel: 'Engineering · Research · AI/ML · Innovation',
    status: 'Research Prototype · Experiments Active',
    developmentStage: 'Research Prototype',
    context: 'NASA C-MAPSS Benchmarks · Predictive Maintenance & Policy Evaluation',
    sourceNote: 'Private research codebase; source repository link not published yet.',
    oneSentenceProblem:
      'Predictive maintenance models are routinely evaluated on point error or statistical interval coverage without verifying whether uncertainty estimates actually lower maintenance cost under operating-condition shift.',
    mainContribution:
      'Pairs verified NASA C-MAPSS RUL modeling (Random Forest, XGBoost, LSTM) and SHAP sensor reduction with a structured uncertainty calibration and decision-aware maintenance policy evaluation pipeline.',
    summary:
      'A research-oriented predictive maintenance and prognostics platform built on NASA C-MAPSS turbofan degradation datasets, distinguishing baseline RUL modeling and explainability from proposed uncertainty-aware maintenance policy evaluation experiments.',
    stack: [
      'Python',
      'NASA C-MAPSS Datasets',
      'Random Forest & XGBoost',
      'LSTM Networks',
      'SHAP Attribution',
      'Probabilistic RUL Calibration',
      'Maintenance Cost Simulation',
    ],
    previewKindLabel: 'Conceptual Illustration',
    previewAlt:
      'Conceptual cutaway turbofan engine core with telemetry curves and probabilistic envelope illustration for ForgeMind AI',
    modules: [],
    caseStudy: {
      overviewSummary:
        'ForgeMind AI is an empirical predictive maintenance research platform developed alongside two undergraduate manuscripts in preparation. It strictly separates implemented NASA C-MAPSS RUL and SHAP explainability pipelines from active domain-shift uncertainty calibration experiments and proposed cost-based policy simulations.',
      problemStatement:
        'Conventional Remaining Useful Life (RUL) research often evaluates models solely on point prediction errors (such as RMSE) or statistical interval calibration metrics, without testing whether better calibration actually translates into lower realized maintenance cost under operating-condition shifts.',
      motivation:
        'Motivated by reliability engineering coursework and ongoing manuscripts on lightweight explainable turbofan prognostics (C-MAPSS FD001) and decision-aware evaluation of probabilistic prognostics under domain shift.',
      proposedSolution:
        'ForgeMind AI structures prognostics development into two disciplined stages: (1) reproducible baseline RUL prediction, SHAP attribution, and interval calibration on NASA C-MAPSS datasets, feeding (2) an experimental maintenance policy evaluation layer that connects predicted failure uncertainty directly to preventive vs. reactive cost trade-offs.',
      architectureOverview:
        'Dual-tier research architecture separating verified baseline modeling and explainability pipelines from experimental uncertainty-to-cost policy evaluation tracks.',
      architectureLayers: [
        {
          id: 'fg-ingest',
          stage: 'Stage 01',
          title: 'NASA C-MAPSS Telemetry Ingestion & Windowing',
          detail: 'Run-to-failure turbofan sensor sequences, cycle normalization, and capped/piecewise RUL target framing.',
          state: 'Implemented',
          inputs: 'NASA C-MAPSS FD001 & multi-regime sensor trajectory files',
          outputs: 'Normalized sliding windows and piecewise linear RUL targets',
          technologies: ['Python', 'NASA C-MAPSS FD001', 'Sliding-Window Preprocessing'],
          verificationNote: 'Baseline preprocessing pipeline established in active research workflow.',
        },
        {
          id: 'fg-models',
          stage: 'Stage 02',
          title: 'Comparative RUL Models & SHAP Attribution',
          detail: 'Random Forest, XGBoost, and LSTM baselines paired with SHAP feature importance and sensor reduction analysis.',
          state: 'Implemented',
          inputs: 'Windowed multi-sensor sequences and cycle indices',
          outputs: 'Point RUL predictions, SHAP sensor rankings, and reduced-sensor ablations',
          technologies: ['Random Forest', 'XGBoost', 'LSTM', 'SHAP Attribution'],
          verificationNote: 'Comparative FD001 baseline setup completed; sensor pruning sensitivity active.',
        },
        {
          id: 'fg-uncert',
          stage: 'Stage 03',
          title: 'Uncertainty Quantification & Operating-Shift Stress Tests',
          detail: 'Active evaluation of prediction interval coverage and calibration behavior when operating conditions shift across subsets.',
          state: 'Experimental',
          inputs: 'Probabilistic RUL prediction intervals across C-MAPSS and FEMTO/PRONOSTIA regimes',
          outputs: 'Empirical coverage, interval width, and calibration drift diagnostics',
          technologies: ['Probabilistic Calibration', 'Cross-Regime Splits', 'FEMTO/PRONOSTIA Bearings'],
          verificationNote: 'Currently executing active calibration sensitivity experiments prior to manuscript finalization.',
        },
        {
          id: 'fg-policy',
          stage: 'Stage 04',
          title: 'Cost-Based Maintenance Policy Simulator',
          detail: 'Proposed decision layer mapping probabilistic RUL bounds into preventive replacement thresholds and realized policy cost.',
          state: 'Proposed',
          inputs: 'Calibrated RUL intervals and asymmetric preventive-vs-failure cost ratios',
          outputs: 'Simulated replacement schedules and realized total maintenance cost rankings',
          technologies: ['Threshold Policy Simulator', 'Cost-Ratio Sensitivity Analysis'],
          verificationNote: 'Scoped for final cross-regime sweeps once ongoing calibration diagnostics settle.',
        },
      ],
      implementationSummary:
        'Built explicitly as an empirical research platform where verified baseline pipelines are cleanly separated from active domain-shift experiments and proposed policy-cost simulation hypotheses.',
      implementedHeading: 'Implemented Features & Core Foundation',
      implementedItems: [
        'NASA C-MAPSS dataset preprocessing, run-to-failure cycle indexing, and multi-sensor pipeline setup (centered on FD001 baselines).',
        'Comparative Remaining Useful Life model implementations spanning Random Forest, XGBoost, and LSTM architectures.',
        'SHAP-based feature attribution and systematic sensor footprint reduction exploration for lightweight inference.',
        'Baseline probabilistic prediction intervals and calibration/coverage metric logging.',
      ],
      secondaryHeading: 'Experimental & Proposed Research Directions',
      secondaryKind: 'proposed',
      secondaryItems: [
        'Test whether standard uncertainty calibration and coverage scores reliably rank maintenance policies by realized total cost.',
        'Evaluate probabilistic prognostics robustness under operating-condition shift across multi-regime C-MAPSS subsets and FEMTO/PRONOSTIA bearings.',
        'Benchmark threshold-based and uncertainty-aware preventive replacement policies across asymmetric failure-vs-early-replacement cost ratios.',
      ],
      coreFeatures: [
        {
          id: 'fg-feat-baselines',
          name: 'Multi-Architecture C-MAPSS FD001 Baselines',
          maturity: 'Implemented',
          description: 'Trains Random Forest, XGBoost, and LSTM baselines under consistent windowing and piecewise RUL framing.',
          technicalBasis: 'Scikit-Learn, XGBoost, sequential neural pipeline on NASA C-MAPSS FD001',
        },
        {
          id: 'fg-feat-shap',
          name: 'SHAP Explainability & Sensor Footprint Reduction',
          maturity: 'Implemented',
          description: 'Ranks turbofan sensor channels by SHAP contribution to evaluate lightweight monitoring with pruned channels.',
          technicalBasis: 'SHAP feature attribution coupled with progressive channel ablation',
        },
        {
          id: 'fg-feat-calibration',
          name: 'Operating-Shift Uncertainty Quantification',
          maturity: 'Experimental',
          description: 'Examines interval coverage and probabilistic calibration stability when operating regimes shift across test subsets.',
          technicalBasis: 'Cross-subset calibration checks across C-MAPSS & FEMTO/PRONOSTIA',
        },
        {
          id: 'fg-feat-policy',
          name: 'Decision-Aware Maintenance Policy Evaluator',
          maturity: 'Proposed',
          description: 'Translates probabilistic RUL bounds into preventive replacement triggers and measures realized cost against point baselines.',
          technicalBasis: 'Asymmetric preventive vs. unexpected-failure maintenance cost simulation',
        },
      ],
      technologyStackGroups: [
        {
          group: 'Datasets & Benchmarks',
          items: ['NASA C-MAPSS Turbofan Datasets', 'FEMTO/PRONOSTIA Bearings (Cross-Benchmark Direction)'],
        },
        {
          group: 'Implemented Modeling & XAI',
          items: ['Python', 'Random Forest', 'XGBoost', 'LSTM', 'SHAP'],
        },
        {
          group: 'Experimental & Proposed Evaluation',
          items: ['Interval Coverage & Calibration Scoring', 'Condition-Shift Analysis', 'Maintenance Policy Cost Simulation'],
        },
      ],
      screenshots: [
        {
          id: 'fg-preview',
          title: 'Turbofan Prognostics & Uncertainty Envelope Concept',
          caption:
            'Conceptual engineering illustration representing NASA C-MAPSS telemetry channels and probabilistic RUL degradation bounds. It does not depict raw experimental plot exports.',
          kind: 'Conceptual Illustration',
          useGeneratedPreview: true,
        },
        {
          id: 'fg-plots-pending',
          title: 'Experimental Figures & Policy Cost Curves',
          caption:
            'Reserved for verified SHAP summary charts, calibration reliability diagrams, and asymmetric cost sweep plots once the two companion manuscripts complete quantitative revision.',
          kind: 'Awaiting Product Screenshot',
          requirements:
            'Populated strictly from finalized reproducible notebook outputs (zero synthetic placeholder plots displayed beforehand).',
        },
      ],
      challenges: [
        'Maintaining fair hyperparameter and windowing parity between tree ensembles (Random Forest, XGBoost) and sequential models (LSTM).',
        'Bridging statistical calibration metrics (coverage/sharpness) with non-linear operational maintenance cost curves under domain shift.',
      ],
      engineeringDecisions: [
        {
          id: 'fg-dec-1',
          challenge: 'Tree ensembles natively ingest tabular aggregates while LSTMs model raw sequential windows.',
          decision: 'Standardized cycle normalization and piecewise capped RUL target definitions prior to feature-vs-sequence branching.',
          rationale: 'Prevents target-scaling leaks or inconsistent failure horizons from distorting model comparisons.',
          tradeoff: 'Requires maintaining two parallel preprocessing transformations downstream of the shared window splitter.',
        },
        {
          id: 'fg-dec-2',
          challenge: 'Deploying high-dimensional sensor arrays onto constrained industrial edge monitors is costly.',
          decision: 'Embedded SHAP sensor-importance ranking early in the pipeline rather than treating explainability solely as post-hoc visualization.',
          rationale: 'Guides principled elimination of redundant channels while monitoring predictive stability.',
          tradeoff: 'Computing TreeSHAP and Deep/Kernel SHAP approximations adds offline evaluation overhead.',
        },
        {
          id: 'fg-dec-3',
          challenge: 'Standard interval coverage metrics weight under-prediction and over-prediction symmetrically.',
          decision: 'Designed Stage 04 around asymmetric preventive-vs-reactive maintenance cost ratios.',
          rationale: 'Directly tests whether statistical calibration improvements translate into real maintenance savings.',
          tradeoff: 'Experimental outputs remain withheld from publication claims until full sensitivity sweeps finish.',
        },
      ],
      testingValidationSummary:
        'Validation is anchored in public benchmark workflows—NASA C-MAPSS (FD001 & multi-regime subsets) and FEMTO/PRONOSTIA bearings—structured cleanly across completed pipeline setup, ongoing sensitivity runs, and proposed policy sweeps. Quantitative benchmark scores remain withheld until manuscript completion rather than fabricating synthetic tables.',
      validationRecords: [
        {
          id: 'fg-val-fd001',
          method: 'NASA C-MAPSS FD001 Comparative RUL & SHAP Setup',
          scope: 'Random Forest, XGBoost, LSTM baselines + SHAP channel attribution',
          status: 'Verified',
          evidenceSummary: 'Reproducible ingestion, piecewise RUL framing, and multi-model SHAP pipeline established; sensor-reduction sensitivity active.',
        },
        {
          id: 'fg-val-shift',
          method: 'Cross-Regime Interval Calibration & Sensor Pruning Runs',
          scope: 'NASA C-MAPSS multi-condition subsets & FEMTO/PRONOSTIA direction',
          status: 'Active Experiment',
          evidenceSummary: 'Investigating calibration stability and reduced-sensor trade-offs across changing operating conditions.',
        },
        {
          id: 'fg-val-policy',
          method: 'Asymmetric Cost-Ratio Maintenance Policy Simulation',
          scope: 'Preventive replacement vs. unexpected failure cost sensitivity',
          status: 'Planned',
          evidenceSummary: 'Final cross-regime policy sweeps queued behind active calibration diagnostics; zero finalized RMSE/cost claims published prematurely.',
        },
      ],
      currentLimitations: [
        'Source repository remains private while empirical manuscripts are actively prepared.',
        'Finalized quantitative benchmark tables (RMSE curves, policy cost sensitivity plots) are not yet released.',
        'Evaluated strictly on public simulated/testbed datasets (NASA C-MAPSS, FEMTO/PRONOSTIA) rather than live plant engine fleets.',
        'Cost-based maintenance policy simulations depend on assumed preventive-to-reactive cost ratios rather than airline/plant accounting audits.',
      ],
      currentProgress: [
        'Baseline comparative modeling and SHAP interpretability work aligned with two manuscripts currently in preparation.',
        'Experimental framework scoped to isolate implemented baseline components from ongoing policy-simulation hypotheses.',
      ],
      futureDevelopment: [
        'Complete cross-condition cost simulation runs and statistical sensitivity tables across maintenance cost ratios.',
        'Publish reproducible evaluation scripts, SHAP plots, and experimental notebooks alongside companion preprints.',
      ],
      impact:
        'Supports two ongoing empirical research investigations in explainable prognostics and decision-aware maintenance evaluation; manuscripts remain in preparation with no published peer-reviewed claims or industrial deployments asserted.',
    },
  },
  {
    id: 'tikatrack',
    title: 'TikaTrack',
    tagline: 'Developing Software & Product Concept (Source & Documentation Pending)',
    categories: ['Software', 'Innovation'],
    categoryLabel: 'Software · Innovation',
    status: 'Developing Concept · Source Pending',
    developmentStage: 'Developing Concept',
    context: 'Software Product Track · Awaiting Supplied Codebase & Brief',
    sourceNote: 'Public source code and product documentation have not been supplied yet.',
    oneSentenceProblem:
      'Registered software product concept awaiting its complete codebase, README, and verified problem specification before any functional or architectural claims are published.',
    mainContribution:
      'Establishes a disciplined, audit-ready documentation slot ready to surface verified application modules, architecture contracts, and UI captures upon source release.',
    summary:
      'Software and product concept currently awaiting its complete source code and documentation in this portfolio. Functional capabilities, stack dependencies, and product screenshots remain intentionally unpopulated until verified project files are supplied.',
    stack: ['Awaiting Verified Stack Specification'],
    previewKindLabel: 'Concept Blueprint',
    previewAlt: 'Conceptual minimalist isometric software system architecture blueprint for TikaTrack (source pending)',
    modules: [],
    caseStudy: {
      overviewSummary:
        'TikaTrack is registered as an early-stage Software and Innovation project inside the portfolio. To maintain strict engineering integrity, no unverified capabilities, external APIs, user counts, or fabricated technical specifications are listed until the complete source package and documentation are reviewed.',
      problemStatement:
        'Awaiting supplied product brief and source code inspection. No assumed problem domain, operational workflow, or user claims are recorded prior to reviewing the actual codebase and specification.',
      motivation:
        'Awaiting project documentation detailing the target user challenge, domain context, and engineering motivation behind TikaTrack.',
      proposedSolution:
        'Structured case-study dossier prepared to document the verified application architecture, core modules, data flows, and UI screenshots immediately once the TikaTrack source code and README are supplied.',
      architectureOverview:
        'System architecture layers are intentionally held as source-pending verification stages until inspected repository files confirm frontend, business logic, persistence, and deployment components.',
      architectureLayers: [
        {
          id: 'tt-source',
          stage: 'Stage 01',
          title: 'Supplied Source Code & Entrypoints',
          detail: 'Pending codebase upload or repository link to extract verified UI routes, state handlers, and data models.',
          state: 'Awaiting Source',
          inputs: 'Repository files, dependency manifest, and README documentation',
          outputs: 'Verified component tree and runtime dependency inventory',
          technologies: ['Pending Inspection'],
          verificationNote: 'No framework or backend stack assumed prior to inspecting actual source manifests.',
        },
        {
          id: 'tt-domain',
          stage: 'Stage 02',
          title: 'Core Product Logic & Storage',
          detail: 'Will document only verified persistence, validation, and functional modules confirmed in source files.',
          state: 'Awaiting Source',
          inputs: 'Core application state modules, schemas, and domain rules',
          outputs: 'Verified feature specifications and edge-case constraints',
          technologies: ['Pending Inspection'],
          verificationNote: 'Zero invented endpoints, databases, or authentication schemes.',
        },
        {
          id: 'tt-docs',
          stage: 'Stage 03',
          title: 'Documentation & Product Captures',
          detail: 'Prepared to bind verified product screenshots and release notes once source documentation is finalized.',
          state: 'Awaiting Source',
          inputs: 'Live build verification and user-captured UI screenshots',
          outputs: 'Completed engineering case study dossier and gallery assets',
          technologies: ['Pending Verification'],
          verificationNote: 'Only genuine interface captures will replace the current concept blueprint slot.',
        },
      ],
      implementationSummary:
        'To maintain strict engineering accuracy, no endpoints, authentication mechanisms, database engines, or runtime features are inferred prior to inspecting supplied TikaTrack source files.',
      implementedHeading: 'Verified Information Available in Session',
      implementedItems: [
        'Project registered as TikaTrack within the Software and Innovation tracks.',
        'Structured 12-section engineering case-study template (/projects/tikatrack) prepared for verified documentation.',
      ],
      secondaryHeading: 'Pending Supplied Source Code & Documentation',
      secondaryKind: 'pending',
      secondaryItems: [
        'Attach verified codebase repository, dependency stack, and technical overview.',
        'Document core features, engineering decisions, and limitations strictly from inspected source.',
        'Bind authentic application interface captures and live/repo links if publicly released.',
      ],
      coreFeatures: [
        {
          id: 'tt-feat-pending',
          name: 'Feature Inventory Awaiting Source Package',
          maturity: 'Awaiting Source',
          description: 'Core user workflows and technical modules will be populated directly from inspected source files without speculation.',
          technicalBasis: 'Source code inspection & verified README documentation pending supply',
        },
      ],
      technologyStackGroups: [
        {
          group: 'Supplied Stack Verification',
          items: ['Awaiting source package inspection (manifest / README / runtime scripts)'],
        },
      ],
      screenshots: [
        {
          id: 'tt-blueprint',
          title: 'Concept Blueprint Slot — TikaTrack Architecture Placeholder',
          caption:
            'Conceptual blueprint illustration marking the TikaTrack case study slot while source files and genuine product UI screenshots remain pending.',
          kind: 'Concept Blueprint',
          useGeneratedPreview: true,
        },
        {
          id: 'tt-ui-pending',
          title: 'Verified Product Interface Captures',
          caption:
            'Reserved gallery slot for authentic TikaTrack application screenshots once complete project source and running captures are provided.',
          kind: 'Awaiting Product Screenshot',
          requirements: 'Will remain visibly marked as pending until real UI captures are supplied.',
        },
      ],
      challenges: [
        'Preventing premature scope assumptions before inspecting the actual repository and design artifacts.',
      ],
      engineeringDecisions: [
        {
          id: 'tt-dec-1',
          challenge: 'Portfolio visitors need clear expectations when a developing project lacks its full codebase.',
          decision: 'Published an explicit Developing Concept / Source Pending placeholder rather than synthesizing plausible software features.',
          rationale: 'Preserves full empirical trust across the portfolio so every listed capability matches inspectable evidence.',
          tradeoff: 'Displays fewer technical details today in exchange for zero misrepresentation.',
        },
      ],
      testingValidationSummary:
        'No functional tests, benchmarks, or build checks are claimed for TikaTrack until the project codebase is supplied for verification.',
      validationRecords: [
        {
          id: 'tt-val-slot',
          method: 'Portfolio Documentation Audit',
          scope: 'Case study taxonomy, asset slot readiness, and source-pending disclosures',
          status: 'Pending Source',
          evidenceSummary: 'Project record verified as intentionally awaiting full source code and technical brief.',
        },
      ],
      currentLimitations: [
        'Complete TikaTrack source code, runtime instructions, and dependency manifests have not yet been supplied to this workspace.',
        'No verified product screenshots, deployed URL, or user testing records are available.',
        'Problem domain and feature breakdown remain held pending documentation supply.',
      ],
      currentProgress: [
        'Case study structure, category taxonomy (Software, Innovation), and editable schema established.',
        'Awaiting user-supplied TikaTrack source code, documentation, and verified screenshots for detailed population.',
      ],
      futureDevelopment: [
        'Inspect supplied TikaTrack codebase and populate verified architecture, stack, and core features.',
        'Capture genuine running UI screenshots and add public GitHub or demo links if released.',
      ],
      impact:
        'Pending source verification. No user counts, adoption figures, or deployment claims are stated prior to documented evidence.',
    },
  },
];
