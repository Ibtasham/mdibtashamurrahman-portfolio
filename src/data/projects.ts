import type { ProjectEntry } from "../types/portfolio";

export const PROJECTS: ProjectEntry[] = [
  {
    id: 'factorymind',
    title: 'FactoryMind',
    tagline: 'Browser-Based Inventory & Production Engineering Workbench',
    categories: ['Engineering', 'Research', 'AI/ML', 'Software'],
    categoryLabel: 'Engineering · Research · AI/ML · Software',
    status: 'Active Prototype · v1 Open-Source Workbench',
    developmentStage: 'Active Prototype',
    context: 'Industrial & Production Engineering · 17-SKU Electromechanical Workbench (Illustrative Data)',
    githubUrl: 'https://github.com/Ibtasham/FactoryMind',
    liveDemoUrl: 'https://ibtasham.github.io/FactoryMind/',
    sourceNote: 'Live demo deployed on GitHub Pages; full source & 12 test suites inspectable at github.com/Ibtasham/FactoryMind.',
    roleAndContribution:
      'Sole Author & Lead Engineer ("Made by Md Ibtashamur Rahman") — architected all DOM-free TypeScript quantitative/DES engines, React 19 workbench across 20+ routes, Three.js 3D Digital Twin, jsPDF exporter, and 12 unit/integration test suites.',
    implementedHighlights: [
      'Wilson EOQ, EPQ, Quantity Discounts, OLS-detrended ROP & ABC/Pareto portfolio advisor',
      '12-model rolling-origin forecast engine, multi-level MRP explosion & 5 assembly line-balancing solvers',
      'Binary-heap Discrete-Event Production Line Simulator (blocking/starvation, MTBF/MTTR, OEE) & queueing suite',
      'Shewhart X-bar/R, EWMA, CUSUM SPC charts, Three.js 3D BOM/Plant Twin & deterministic Decision Assistant',
    ],
    scopeDistinctionNote:
      'All client math engines, 3D twin, Scenario Studio, and jsPDF exports run offline on GitHub Pages; optional Gemini narrative synthesis (/api/assistant/explain) requires backend GEMINI_API_KEY, and preloaded 17-SKU series are illustrative demo data (CSV/JSON import supported).',
    oneSentenceProblem:
      'Production planners and IPE practitioners typically juggle inventory control, multi-level MRP, 12-model demand forecasting, line balancing, SPC charts, and discrete-event simulation across fragmented spreadsheets with zero counterfactual traceability.',
    mainContribution:
      'Built an offline-first browser workbench in pure TypeScript + React 19 uniting deterministic EOQ/MRP/line-balancing solvers, binary-heap DES simulation, SPC drift charts, an interactive Three.js 3D Plant Twin, and an approval-gated Decision Intelligence Assistant verified by 12 automated test suites.',
    summary:
      'An interactive Industrial & Production Engineering workbench executing pure TypeScript solvers—from classical EOQ/EPQ, multi-level MRP, and 5 assembly line-balancing algorithms to 12-model cross-validated forecasting, Shewhart/EWMA/CUSUM SPC, binary-heap Discrete-Event Simulation, and a Three.js 3D Digital Twin—with zero backend required in static demo mode.',
    stack: [
      'React 19',
      'TypeScript',
      'Vite 8',
      'Tailwind CSS v4',
      'Three.js',
      'Pure TS DES & OR Solvers',
      'jsPDF',
      'Express 5 (Optional AI Proxy)',
    ],
    previewKindLabel: 'Verified Product Screenshot',
    previewAlt:
      'Live browser interface capture of the FactoryMind Inventory & Production Engineering Workbench showing the 17-SKU electromechanical plant telemetry and workbench navigation',
    modules: [
      {
        id: 'inventory-eoq',
        name: 'Inventory Control, EOQ/EPQ & Portfolio Advisor',
        methods: ['Wilson EOQ & Finite-Rate EPQ', 'Quantity Discount Breaks', 'OLS-Detrended ROP & ABC/Pareto'],
        description:
          'Computes optimal order quantities, safety stocks, and working-capital reallocation across SKUs using OLS-detrended residual demand variance (`dailyStats`) and Portfolio Advisor simulations (`src/engine/ipe.ts`, `advisor.ts`).',
        domainContext: 'Working-capital sizing & SKU replenishment policy optimization (17 illustrative SKUs, $82,828 demo stock).',
      },
      {
        id: 'forecast-alerts',
        name: '12-Model Demand Forecasting & Smart Alerts',
        methods: ['Rolling-Origin Cross-Validation', 'Holt-Winters, Croston & SBA', 'Horizon-Widened 95% Intervals'],
        description:
          'Benchmarks 12 forecasting models—SMA, WMA, SES, Holt Linear, Additive/Multiplicative Holt-Winters, Seasonal Naive, Linear Trend, Croston, SBA, Naive, and Mean—surfacing stockout Smart Alerts synced across Dashboard and Header (`src/engine/forecast.ts`).',
        domainContext: 'Intermittent and trend-seasonal industrial demand planning with predictive reorder warnings.',
      },
      {
        id: 'mrp-linebal',
        name: 'Multi-Level MRP & 5-Solver Line Balancing',
        methods: ['Low-Level Coded BOM Explosion (L4L/FOQ/EOQ/POQ)', 'RPW, LCR, Kilbridge & Wester', 'COMSOAL & Exact Branch & Bound'],
        description:
          'Explodes 5 multi-level BOM assemblies with scheduled receipts and ceiling lead-time offsetting (`mrp.ts`), paired with 5 comparative assembly line-balancing solvers persisted across routes (`linebal.ts`).',
        domainContext: 'Component requirement scheduling and precedence-constrained workstation takt balancing.',
      },
      {
        id: 'spc',
        name: 'Statistical Process Control (SPC)',
        methods: ['Shewhart X-bar & R Charts', 'Western Electric Rules 1–3', 'EWMA & CUSUM Drift Charts'],
        description:
          'Monitors subgroup capability across Phase I & OOC-excluded Phase II estimates (Cp, Cpk, Pp, Ppk) alongside finite-horizon EWMA and tabular CUSUM drift rules (`src/engine/ipe.ts`, `SpcPage.tsx`).',
        domainContext: 'Shop-floor dimensional variance detection prior to batch scrap escalation.',
      },
      {
        id: 'des-queueing',
        name: 'Discrete-Event Simulation, Monte Carlo & Queueing',
        methods: ['Binary Min-Heap Priority Queue DES', 'Monte Carlo (Q, R) Grid Search', 'M/M/c Erlang-C, M/M/c/K & M/G/1'],
        description:
          'Simulates serial workstations under finite inter-station buffers (blocking/starvation), shift calendars, and MTBF/MTTR failures—enforcing OEE decomposition and Little’s Law (`L = lambda W`) alongside Scenario Studio counterfactual comparisons (`desEngine.ts`, `scenarioStudio.ts`).',
        domainContext: 'Bottleneck starvation/blocking analysis across 3 workstations and stochastic policy evaluation.',
      },
      {
        id: 'twin-decision',
        name: '3D Digital Twin & Approval-Gated Decision Lab',
        methods: ['Code-Split Three.js BOM & Plant Twin', 'Deterministic NL Decision Engine', 'Field-Level Approval Gates & jsPDF'],
        description:
          'Links live ROP exceptions and DES queue bottlenecks to an interactive Three.js 3D warehouse/plant twin (`threeModels.ts`, `digitalTwin.ts`) plus a natural-language Decision Intelligence Assistant with preview diffs and optional server-side `/api/assistant/explain` Gemini narrative synthesis.',
        domainContext: 'Spatial plant diagnostics, explainable solver recommendations, and multi-page PDF operations dossiers.',
      },
    ],
    caseStudy: {
      overviewSummary:
        'FactoryMind is an open-source, browser-based Industrial & Production Engineering workbench live at ibtasham.github.io/FactoryMind. All quantitative engines execute locally in pure TypeScript with zero DOM coupling across 20+ interactive routes and are verified by 12 unit and integration test suites (`tsx --test`), preloaded with an illustrative 17-SKU electromechanical plant catalog ($82,828 demo stock value, 5 BOM assemblies, 34 ledger transactions, 3 workstations).',
      problemStatement:
        'Industrial engineering teams and learners commonly analyze inventory sizing, multi-level BOM explosions, demand forecasting, assembly line balancing, SPC quality limits, and discrete-event throughput queues in isolated spreadsheets without shared state or reversible policy testing.',
      motivation:
        'Created during undergraduate Industrial & Production Engineering studies at SUST to turn classical IPE algorithms—from EOQ, MRP, and Exact Branch & Bound line balancing to binary-heap DES and Shewhart/EWMA control charts—into an inspectable, deterministic software workbench anyone can test straight in the browser.',
      proposedSolution:
        'Unified all core analytical disciplines inside a React 19 + TypeScript client engine layer backed by strict math tests, pairing tabular/chart solvers with Scenario Studio counterfactuals, an interactive Three.js 3D Digital Twin, CSV/JSON catalog import, multi-page jsPDF reporting, and an approval-gated Decision Intelligence Assistant.',
      architectureOverview:
        'Cleanly decoupled three-layer client architecture—Pure TypeScript Mathematical & DES Engines (`src/engine/`, zero DOM imports) fed by the persisted plant store (`src/store/`), powering 20+ React workbench views, a lazy-loaded Three.js 3D Studio, and an optional Express 5 Gemini narrative endpoint (`/api/assistant/explain`).',
      architectureLayers: [
        {
          id: 'fm-input',
          stage: 'Layer 01',
          title: 'Catalog Store, Ledger & CSV/JSON Ingestion',
          detail: 'Holds the 17-SKU electromechanical seed catalog, 5 BOM structures, 34 ledger movements, 3-station routing specs, and custom CSV/JSON imports with formula-injection hardening.',
          state: 'Implemented',
          inputs: 'Seeded plant catalog, ledger transactions, user policy overrides, or imported CSV/JSON catalogs',
          outputs: 'Validated immutable plant state snapshots consumed identically across workbench pages',
          technologies: ['TypeScript Store', 'CSV/JSON Importer', 'localStorage Persistence'],
          verificationNote: 'Seed dataset explicitly labeled as illustrative engineering demo data; tested via store.test.ts.',
        },
        {
          id: 'fm-opt',
          stage: 'Layer 02',
          title: 'Pure TypeScript Optimization & DES Core',
          detail: 'Runs deterministic EOQ/EPQ, multi-level MRP explosion, 5 line-balancing solvers, 12-model rolling-origin forecast CV, Monte Carlo (Q,R), M/M/c queueing, and binary min-heap Discrete-Event Simulation.',
          state: 'Implemented',
          inputs: 'BOM structures, lead times, shift calendars, MTBF/MTTR parameters, and historical demand series',
          outputs: 'Schedules, balanced line assignments, cross-validated forecast intervals, and Little’s Law verified DES telemetry',
          technologies: ['Pure TypeScript Solvers', 'Binary Min-Heap DES', 'Branch & Bound', 'Monte Carlo Simulation'],
          verificationNote: 'DOM-free modules in src/engine/ verified by 11 engine test files + mathValidation.test.ts.',
        },
        {
          id: 'fm-analytics',
          stage: 'Layer 03',
          title: 'SPC Diagnostics, 3D Twin & Approval-Gated Assistant',
          detail: 'Executes Shewhart/EWMA/CUSUM SPC rules, synchronizes ROP & bottleneck status onto Three.js 3D assemblies, and previews field-by-field mutations inside the Decision Assistant.',
          state: 'Implemented',
          inputs: 'Subgroup inspection samples, stock exception states, DES bottlenecks, and natural-language queries',
          outputs: 'Western Electric alerts, color-coded 3D factory twin telemetry, and user-approved state mutations',
          technologies: ['Three.js WebGL', 'Shewhart / EWMA / CUSUM', 'Deterministic NL Assistant', 'jsPDF'],
          verificationNote: 'Optional Express 5 Gemini synthesis (/api/assistant/explain) is cleanly optional and gracefully bypassed on static GitHub Pages.',
        },
        {
          id: 'fm-ui',
          stage: 'Layer 04',
          title: 'React 19 Workbench & Multi-Page Exports',
          detail: 'Presents 20+ specialized engineering views—Dashboard, Factory Sim Lab, Scenario Studio, Inventory, MRP/Production, Line Balance, Forecast, SPC, 3D Twin, Decision Lab—plus Markdown/CSV/jsPDF exports.',
          state: 'Implemented',
          inputs: 'Engine outputs, Scenario Studio counterfactual comparisons, and Quick Search (Cmd+K) commands',
          outputs: 'Interactive multi-route workbench deployed live on GitHub Pages with offline local execution',
          technologies: ['React 19', 'Vite 8', 'Tailwind CSS v4', 'Lucide Icons', 'jsPDF-AutoTable'],
          verificationNote: 'Verified by static check, TypeScript tsc, production build, and live GitHub Pages deployment.',
        },
      ],
      implementationSummary:
        'Engineered as a deterministic, zero-signup browser application where mathematical integrity comes first: all inventory, forecasting, MRP, line balancing, SPC, and discrete-event calculations run locally in TypeScript modules audited by automated numerical and integration tests.',
      implementedHeading: 'Implemented Capabilities (Verified in Source & Live Build)',
      implementedItems: [
        'Inventory & Policy Engine: Wilson EOQ, finite-rate EPQ, quantity discounts, OLS-detrended ROP/safety stock, ABC/Pareto classification, and Portfolio Advisor.',
        '12-Model Forecasting & Smart Alerts: Rolling-origin cross-validation (SMA, WMA, SES, Holt, Holt-Winters Add/Mult, Seasonal Naive, Linear Trend, Croston, SBA, Naive, Mean) with 95% intervals.',
        'Multi-Level MRP & 5 Line-Balancing Solvers: Low-level BOM explosion (L4L/FOQ/EOQ/POQ) plus RPW, LCR, Kilbridge & Wester, COMSOAL, and Exact Branch & Bound balancing.',
        'Statistical Process Control (SPC): Shewhart X-bar/R, Western Electric Rules 1–3, Phase I/II Cp/Cpk/Pp/Ppk, and exact finite-horizon EWMA & CUSUM drift charts.',
        'Binary Min-Heap Discrete-Event Simulation, Queueing & Scenario Studio: Blocking/starvation buffers, MTBF/MTTR downtime, OEE decomposition, Little’s Law verification, Monte Carlo (Q,R), Newsvendor, and M/M/c / M/M/c/K / M/G/1 models.',
        'Code-Split Three.js 3D Digital Twin, Approval-Gated Decision Assistant (deterministic engine + optional Express Gemini /api/assistant/explain), CSV/JSON import, and formula-hardened CSV/Markdown/jsPDF exports.',
      ],
      secondaryHeading: 'Optional Backend Layer & Scope Boundaries',
      secondaryKind: 'proposed',
      secondaryItems: [
        'Optional Express 5 Gemini explanation endpoint (/api/assistant/explain) stays dormant in the static GitHub Pages demo unless deployed with a server-side GEMINI_API_KEY.',
        'Seeded 17-SKU electromechanical catalog and demand curves are illustrative demo datasets; real operational use relies on CSV/JSON catalog import rather than live PLC/MES telemetry.',
        'Planned future direction: automated ERP/WMS connector adapters and external industrial time-study validation on SME manufacturing lines.',
      ],
      coreFeatures: [
        {
          id: 'fm-feat-eoq',
          name: 'Inventory Control (EOQ/EPQ/Discounts) & ABC Portfolio Advisor',
          maturity: 'Implemented',
          description: 'Computes Wilson EOQ, finite-rate EPQ, quantity-discount breaks, OLS-detrended ROP, and working-capital reallocation tradeoffs.',
          technicalBasis: 'src/engine/ipe.ts & src/engine/advisor.ts verified by mathValidation.test.ts',
        },
        {
          id: 'fm-feat-forecast',
          name: '12-Model Cross-Validated Forecasting & Smart Alerts',
          maturity: 'Implemented',
          description: 'Evaluates 12 classical and intermittent forecasting methods via rolling-origin cross-validation with 95% prediction intervals and stockout triggers.',
          technicalBasis: 'src/engine/forecast.ts & src/engine/smartAlerts.ts',
        },
        {
          id: 'fm-feat-mrp-lb',
          name: 'Multi-Level BOM MRP & 5-Solver Assembly Line Balancing',
          maturity: 'Implemented',
          description: 'Runs low-level-coded MRP explosions alongside RPW, LCR, Kilbridge & Wester, COMSOAL, and Exact Branch & Bound balancing solvers.',
          technicalBasis: 'src/engine/mrp.ts & src/engine/linebal.ts verified by engines.test.ts',
        },
        {
          id: 'fm-feat-spc',
          name: 'Shewhart, EWMA & CUSUM Statistical Process Control',
          maturity: 'Implemented',
          description: 'Detects Western Electric rule violations, OOC-excluded capability indices (Cp/Cpk/Pp/Ppk), and sustained small process shifts.',
          technicalBasis: 'src/engine/ipe.ts SPC routines & SpcPage.tsx',
        },
        {
          id: 'fm-feat-des',
          name: 'Binary Min-Heap DES Simulator, Queueing & Scenario Studio',
          maturity: 'Implemented',
          description: 'Models serial stations, finite buffer blocking/starvation, MTBF/MTTR failures, OEE vs utilization, Little’s Law checks, Monte Carlo (Q,R), and counterfactual comparisons.',
          technicalBasis: 'src/engine/desEngine.ts, prodsim.ts, inventory.ts & scenarioStudio.ts verified by desEngine.test.ts',
        },
        {
          id: 'fm-feat-twin',
          name: 'Three.js 3D Digital Twin & Approval-Gated Decision Assistant',
          maturity: 'Implemented',
          description: 'Synchronizes SKU ROP alerts and DES bottleneck queues into an interactive 3D warehouse/BOM viewer plus natural-language queries with explicit approval diffs and jsPDF export.',
          technicalBasis: 'src/engine/threeModels.ts, digitalTwin.ts, decisionAssistant.ts & pdfReport.ts',
        },
        {
          id: 'fm-feat-gemini',
          name: 'Server-Proxied Gemini Narrative Synthesis (/api/assistant/explain)',
          maturity: 'Proposed',
          description: 'Optional narrative layer synthesizing numerical Decision Assistant dossiers via Express 5 + @google/genai when GEMINI_API_KEY is supplied.',
          technicalBasis: 'server.ts & server.test.ts (gracefully bypassed on static GitHub Pages deployment)',
        },
        {
          id: 'fm-feat-erp',
          name: 'Direct Live Plant ERP / MES / PLC Stream Connector',
          maturity: 'Planned',
          description: 'Current version ingests real data via hardened CSV/JSON import rather than automated OPC-UA, MQTT, or commercial ERP API synchronization.',
          technicalBasis: 'Planned integration layer beyond standalone browser simulation scope',
        },
      ],
      technologyStackGroups: [
        {
          group: 'Frontend & 3D Visualization',
          items: ['React 19', 'TypeScript', 'Vite 8', 'Tailwind CSS v4', 'Three.js (Code-Split)', 'Lucide Icons', 'jsPDF & AutoTable'],
        },
        {
          group: 'Pure TS Quantitative & DES Core',
          items: ['Binary Min-Heap DES Engine', '12-Model Rolling CV Forecaster', 'MRP Explosion & 5 Line-Balance Solvers', 'Shewhart / EWMA / CUSUM SPC', 'M/M/c / M/G/1 Queueing'],
        },
        {
          group: 'Testing & Optional Backend',
          items: ['12 tsx --test Unit & Integration Suites', 'Static & Typecheck Gate (npm run verify)', 'Express 5 & @google/genai (Optional Server)', 'GitHub Pages Static Build'],
        },
      ],
      screenshots: [
        {
          id: 'fm-live-home',
          title: 'FactoryMind Live Workbench Interface (GitHub Pages Capture)',
          caption:
            'Authentic screenshot captured directly from https://ibtasham.github.io/FactoryMind/ displaying the 17-SKU electromechanical catalog telemetry, $82,828 illustrative stock summary, 5 BOM assemblies, and quick workbench navigation.',
          kind: 'Verified Screenshot',
          useGeneratedPreview: true,
        },
        {
          id: 'fm-preview-concept',
          title: 'Smart Manufacturing Workcell Architecture Illustration',
          caption:
            'Conceptual industrial engineering illustration pairing workstation material flow, SPC optical inspection, and simulation framing. Clearly labeled conceptual artwork separate from the live UI capture.',
          kind: 'Conceptual Illustration',
          useGeneratedPreview: true,
          previewSource: 'conceptual',
        },
      ],
      challenges: [
        'Keeping every optimization and simulation solver strictly deterministic, browser-instant, and testable without server round-trips or DOM coupling.',
        'Synchronizing shared plant state across 20+ analytical views—ensuring an inventory or routing change propagates faithfully into MRP explosions, DES queues, Smart Alerts, and the 3D Digital Twin.',
      ],
      engineeringDecisions: [
        {
          id: 'fm-dec-1',
          challenge: 'Browser simulators can silently freeze the UI or produce unverified heuristics if coupled directly to React components.',
          decision: 'Isolated all math—EOQ/EPQ, forecasting CV, MRP, 5 line-balancing solvers, SPC, and binary-heap DES—into pure DOM-free TypeScript files under src/engine/.',
          rationale: 'Enables millisecond Node/tsx automated math verification (`mathValidation.test.ts`, `desEngine.test.ts`) and instant client execution on static GitHub Pages.',
          tradeoff: 'Requires maintaining strict pure-function interfaces instead of calling heavier Python native solvers inside the static browser build.',
        },
        {
          id: 'fm-dec-2',
          challenge: 'Natural-language AI assistants risk mutating inventory quantities or policy parameters unpredictably.',
          decision: 'Built a deterministic NL Decision Engine with explicit User Approval Gates showing field-by-field preview diffs before any store update, while making Gemini narrative synthesis strictly optional.',
          rationale: 'Ensures all quantitative recommendations remain auditable, reproducible, and 100% functional offline even without API keys.',
          tradeoff: 'Requires more upfront structured solver mapping than delegating raw JSON mutations to an LLM.',
        },
        {
          id: 'fm-dec-3',
          challenge: 'Presenting a 17-SKU industrial showcase without implying live commercial plant deployment.',
          decision: 'Explicitly labeled the preloaded electromechanical dataset as seeded illustrative data across the live UI, README, and portfolio dossier while supporting real CSV/JSON catalog imports.',
          rationale: 'Preserves full engineering credibility for academic, research, and internship evaluations.',
          tradeoff: 'Visitors evaluating live ERP streams must import their own CSV/JSON catalog first.',
        },
      ],
      testingValidationSummary:
        'Verified through 12 automated TypeScript unit and integration test suites (`npm test` using `tsx --test`), strict `tsc --noEmit` checking, `static-check.ts`, production Vite build, and live interactive inspection at ibtasham.github.io/FactoryMind.',
      validationRecords: [
        {
          id: 'fm-val-math',
          method: '12 Unit & Integration Test Suites (tsx --test)',
          scope: 'DES flow conservation (L = lambda W), EOQ/MRP invariants, 3D Digital Twin sync, Decision Assistant gates, Scenario Studio & Store',
          status: 'Verified',
          evidenceSummary: 'Publicly runnable via `npm run verify` on github.com/Ibtasham/FactoryMind across 11 src/ test suites plus server.test.ts.',
        },
        {
          id: 'fm-val-live',
          method: 'Live GitHub Pages Interactive Build Verification',
          scope: 'Static offline deployment across 20+ workbench routes and 3D Three.js twin viewport',
          status: 'Verified',
          evidenceSummary: 'Running live at https://ibtasham.github.io/FactoryMind/ with HTTP 200 and clean client execution.',
        },
        {
          id: 'fm-val-pilot',
          method: 'External Manufacturing Plant Deployment Study',
          scope: 'Live shop-floor ERP/PLC integration and multi-month plant time study',
          status: 'Planned',
          evidenceSummary: 'No external commercial plant deployment or production ERP live hookup claimed; seeded catalog is illustrative.',
        },
      ],
      currentLimitations: [
        'Preloaded 17-SKU electromechanical catalog, BOM structures, and demand curves are illustrative demo scenarios (users upload custom CSV/JSON files for external plant data).',
        'Optional Gemini narrative synthesis (/api/assistant/explain) is inactive in the static GitHub Pages deployment without a server-side GEMINI_API_KEY; deterministic decision analysis remains fully active.',
        'Direct live ERP, MES, or PLC hardware telemetry streaming is not yet implemented.',
        'No commercial plant pilot or external industrial adoption metrics are claimed.',
      ],
      currentProgress: [
        'Full React 19 + TypeScript + Three.js workbench live at ibtasham.github.io/FactoryMind and documented on GitHub.',
        '12 unit/integration test suites (`npm run verify`) validating mathematical accuracy, DES flow conservation, MRP bounds, and UI store contracts.',
      ],
      futureDevelopment: [
        'Add standardized ERP/WMS API connectors alongside CSV/JSON import for SME production floors.',
        'Pair empirical manufacturing practitioner usability studies across Bangladesh industrial teams.',
        'Extend Scenario Studio with multi-period capacity, shift-cost, and energy-tariff scheduling constraints.',
      ],
      impact:
        'Translates breadth across Inventory Control, Forecasting, MRP, Line Balancing, SPC, Queueing, Discrete-Event Simulation, and 3D Digital Twinning into an offline-capable, unit-tested interactive browser platform; no live factory deployment or commercial adoption figures are asserted.',
    },
  },
  {
    id: 'forgemind-ai',
    title: 'ForgeMind AI',
    tagline: 'Uncertainty-Aware Predictive Maintenance & Decision Simulation Workbench',
    categories: ['Engineering', 'Research', 'AI/ML', 'Software', 'Innovation'],
    categoryLabel: 'Engineering · Research · AI/ML · Software · Innovation',
    status: 'Active Prototype · Live Vercel Workbench',
    developmentStage: 'Active Prototype',
    context: 'Predictive Maintenance Workbench · FD001–FD004 Synthetic C-MAPSS · 10 Modules',
    githubUrl: 'https://github.com/ibta10/ForgeMind-Ai',
    liveDemoUrl: 'https://forge-mind-ai-wheat.vercel.app/?subset=FD002&model=gradient_boosting',
    sourceNote: 'Live interactive workbench deployed on Vercel (MIT License); full source & 32 unit tests inspectable at github.com/ibta10/ForgeMind-Ai.',
    roleAndContribution:
      'Sole Author & Lead Engineer — designed the pure TypeScript simulation engine (`src/engine/*`), split conformal calibrator, 5-policy episode replay, D3.js 3D cost surface projection, jsPDF 3-page report builder, and 32 unit/invariant tests.',
    implementedHighlights: [
      'Deterministic mulberry32 C-MAPSS-shaped synthetic fleets (48 units/subset, 21 sensors s1–s21, OS1–OS3) with strict 45/20/15/20% disjoint splits',
      'Four browser-native TypeScript RUL surrogates (Ridge OLS, Quantile RF, 28-stage HistGBDT, Causal Sequence ELM w=30) scored on MAE, RMSE & PHM08',
      'Finite-sample split conformal quantiles (global & RUL-binned [0–30, 31–60, 61–90, 91+]) + 12-iteration fit-only k-means regime scaling',
      'Cycle-by-cycle episode replay across 5 maintenance policies (Run-to-Fail, Fixed, Threshold, Risk-Aware Lower-Bound, Oracle) + D3 3D cost surface & JSON/jsPDF exports',
    ],
    scopeDistinctionNote:
      'Runs deterministic synthetic C-MAPSS-shaped trajectories and browser TypeScript surrogates for methodological exploration—does NOT load raw NASA .txt files, train offline PyTorch/TensorFlow weights, or expose unreleased numbers from the unpublished companion manuscripts.',
    oneSentenceProblem:
      'Point Remaining Useful Life (RUL) forecasts ignore multi-regime sensor variance and asymmetric unplanned failure penalties (Cf >> Cp), causing late or poorly calibrated preventive maintenance triggers.',
    mainContribution:
      'Deployed an interactive React 19 + TypeScript + D3.js v7 research workbench coupling engine-disjoint TypeScript RUL surrogates with finite-sample split conformal bounds, 5-policy episode cost replay (with 350-resample bootstrap 95% CIs), rotatable 3D D3 cost surfaces, and 32 automated tests.',
    summary:
      'An open-source, MIT-licensed predictive maintenance and decision simulation workbench live on Vercel—spanning 10 interactive modules from multi-regime C-MAPSS synthetic fleet inspection and split conformal uncertainty calibration to economic maintenance policy simulation and 3D cost sensitivity mapping.',
    stack: [
      'React 19',
      'TypeScript',
      'Vite 8',
      'Tailwind CSS v4',
      'D3.js v7 (2D & 3D)',
      'Split Conformal Quantiles',
      'jsPDF',
      '32 tsx Engine Tests',
    ],
    previewKindLabel: 'Verified Product Screenshot',
    previewAlt:
      'Live browser capture of ForgeMind AI on Vercel showing the FD002 Multi-Regime Mission Overview, Split Conformal workbench navigation, turbofan telemetry schematic, and Synthetic Simulation disclosure',
    modules: [
      {
        id: 'fg-cohort-regimes',
        name: 'Synthetic Cohort & Operating-Regime Explorer',
        methods: ['Mulberry32 48-Unit/Subset Generator', '12-Iteration Fit-Only k-Means (OS1–OS3)', 'Strict 45/20/15/20% Engine-Disjoint Splits'],
        description:
          'Synthesizes deterministic FD001–FD004 turbofan cohorts across 21 sensor channels (s1–s21) with exponential degradation and zero fit/calibration/tuning/evaluation unit overlap (`cmapss.ts`, `prng.ts`).',
        domainContext: 'Single-regime (FD001/FD003) vs. 6-regime altitude/Mach condition normalization (`FD002`/`FD004`).',
      },
      {
        id: 'fg-fleet-machine',
        name: 'Fleet Triage & Machine Cycle Playback',
        methods: ['Fleet Stress Scatter (RUL vs. Cycles)', '15-Cycle Rolling Volatility & Alerts', '10-Point OLS End-of-Life Projection'],
        description:
          'Flags high-risk, high-uncertainty units across the 48-engine fleet matrix and replays cycle-by-cycle degradation trajectories overlaid with conformal uncertainty bands (`fleetHealth.ts`, `playback.ts`).',
        domainContext: 'Asset-level reliability triage and degradation-stage progression inspection.',
      },
      {
        id: 'fg-surrogates',
        name: '4-Model Surrogate Benchmark & PHM08 Scoring',
        methods: ['Ridge Linear OLS & Quantile Random Forest', '28-Stage Histogram GBDT & Causal Seq ELM (w=30)', '125-Cycle RUL Cap & Asymmetric PHM08 Score'],
        description:
          'Compares inductive biases across four client-side TypeScript surrogates under MAE, RMSE, PHM08 late-prediction penalty scoring, and downstream policy cost A/B deltas (`models.ts`, `abComparison.ts`).',
        domainContext: 'Benchmarking linear, bagged tree, boosted tree, and causal sequence memory estimators in the browser.',
      },
      {
        id: 'fg-conformal',
        name: 'Split Conformal Uncertainty Calibration',
        methods: ['Finite-Sample ceil((n+1)(1-α))/n Quantiles', 'RUL Horizon Bins [0–30, 31–60, 61–90, 91+]', 'Empirical Coverage vs. Width Diagnostics'],
        description:
          'Calibrates distribution-free prediction intervals [L, U] on the held-out 9-unit calibration split and tracks adaptive interval half-widths q̂ near low RUL (`conformal.ts`, `rulDistribution.ts`).',
        domainContext: 'Distribution-free prediction interval calibration conditioned on RUL proximity.',
      },
      {
        id: 'fg-policy-sim',
        name: '5-Policy Episode Maintenance Simulator',
        methods: ['Risk-Aware Conformal max(0, ŷ - q̂_bin) <= τ', 'Run-to-Fail, Fixed, Threshold & Oracle Replay', '350-Resample Unit Bootstrap 95% CIs'],
        description:
          'Replays cycle-by-cycle maintenance triggers across configurable preventive (Cp) vs. unplanned failure (Cf) penalties, alpha confidence levels, and threshold sweeps (`maintenance.ts`).',
        domainContext: 'Economic decision simulation translating conformal lower confidence bounds into replacement triggers.',
      },
      {
        id: 'fg-surface-repro',
        name: 'D3 3D Cost Surface & Repro Audit Exports',
        methods: ['D3.js 2D Heatmap & Rotatable 3D Surface', 'Schema-Validated JSON Import/Export', '3-Page jsPDF Audit Report & LinkedIn Kit'],
        description:
          'Isolates minimum-cost basins across (Cp, τ) parameters with an interactive D3 3D projection while exporting provenance-tagged JSON artifacts, BibTeX, and multi-page PDF dossiers (`surface3d.ts`, `pdfReport.ts`, `provenance.ts`).',
        domainContext: 'Transparent research reproducibility, URL deep-linking, and provenance-audited reporting.',
      },
    ],
    caseStudy: {
      overviewSummary:
        'ForgeMind AI is a live, MIT-licensed React 19 + TypeScript + D3.js v7 simulation workbench deployed on Vercel and open-sourced on GitHub (`ibta10/ForgeMind-Ai`). Across 10 analytical views, 3 Guided Investigation Scenarios, and 32 deterministic unit tests, it couples synthetic C-MAPSS-shaped turbofan fleets (48 units/subset) with split conformal prediction bounds and cycle-by-cycle maintenance cost simulation—while explicitly marking synthetic demo boundaries separately from ongoing offline Python research manuscripts.',
      problemStatement:
        'Point RUL forecasts ignore multi-regime sensor variance and heavy asymmetric failure penalties (Cf >> Cp). Simply minimizing point RMSE—or reporting ungrounded statistical interval coverage—does not verify whether calibrated lower confidence bounds actually prevent late unplanned failures and reduce total maintenance cost.',
      motivation:
        'Built alongside undergraduate reliability engineering and predictive maintenance research at SUST to create an inspectable, zero-signup interactive workbench where anyone can manipulate subsets (FD001–FD004), surrogate families, significance level α, and failure cost ratios Cp/Cf straight in the browser.',
      proposedSolution:
        'Implemented an engine-disjoint 4-cohort browser simulation pipeline (45% Fit / 20% Calibration / 15% Policy Tuning / 20% Blind Evaluation) backed by fit-only 12-iteration k-means regime scaling, split conformal quantile calibration across horizon bins, and 5-policy episode replay with D3 2D/3D cost surface mapping.',
      architectureOverview:
        'Client-side TypeScript numerical kernel (`src/engine/`) enforcing strict zero-leakage cohort splits, driving 10 React 19 analytical views, interactive D3.js 3D sensitivity surfaces, schema-validated JSON import/export, and 3-page jsPDF technical reporting.',
      architectureLayers: [
        {
          id: 'fg-ingest',
          stage: 'Stage 01',
          title: 'Synthetic Fleet Synthesis & Disjoint Cohort Splits',
          detail: 'Mulberry32 deterministic generator producing 48 engines/subset across FD001–FD004 with 21 sensors (s1–s21), OS1–OS3 regimes, and strict unit-ID splits.',
          state: 'Implemented',
          inputs: 'Subset selection (FD001–FD004), deterministic seed, and piecewise 125-cycle RUL cap',
          outputs: 'Partitioned Fit (22 u.), Calibration (9 u.), Tuning (7 u.), and Evaluation (10 u.) trajectories',
          technologies: ['TypeScript', 'Mulberry32 PRNG', 'C-MAPSS-Shaped Trajectories'],
          verificationNote: 'Leakage guards & unit disjointness verified inside src/engine/engine.test.ts.',
        },
        {
          id: 'fg-models',
          stage: 'Stage 02',
          title: 'Fit-Only k-Means Scaling & 4 Surrogate Estimators',
          detail: '12-iteration k-means operating-regime clustering and min-max scaling fit solely on fit units, feeding Ridge OLS, Quantile RF, 28-stage HistGBDT, and Causal Sequence ELM.',
          state: 'Implemented',
          inputs: 'Operating settings (OS1–OS3) and 15-cycle causal trailing window statistics',
          outputs: 'Point RUL estimates, MAE/RMSE, and asymmetric PHM08 scores on blind evaluation units',
          technologies: ['Fit-Only k-Means', 'HistGBDT (28)', 'Quantile RF', 'Causal Seq ELM (w=30)'],
          verificationNote: 'Interactive subset + model URL state persisted via `?subset=...&model=...`.',
        },
        {
          id: 'fg-uncert',
          stage: 'Stage 03',
          title: 'RUL-Binned Split Conformal Quantile Calibration',
          detail: 'Calibrates exact finite-sample residual quantiles q̂ globally and across [0–30, 31–60, 61–90, 91+] RUL bins on held-out calibration engines.',
          state: 'Implemented',
          inputs: 'Absolute residuals on the 9-unit calibration cohort and target confidence (1 - α)',
          outputs: 'Distribution-free prediction intervals [L, U] and empirical coverage vs. sharpness curves',
          technologies: ['Split Conformal Prediction', 'Horizon-Binned q̂', 'Conformal Diagnostics'],
          verificationNote: 'Coverage bounds and quantile math covered by deterministic invariant tests.',
        },
        {
          id: 'fg-policy',
          stage: 'Stage 04',
          title: '5-Policy Episode Replay, D3 3D Surface & Exports',
          detail: 'Evaluates Run-to-Failure, Fixed Interval, RUL Threshold, Risk-Aware Lower-Bound, and Oracle policies with 350-resample bootstrap CIs, rotatable D3 3D cost surfaces, and jsPDF reports.',
          state: 'Implemented',
          inputs: 'Preventive cost Cp, failure cost Cf, threshold τ, α, and evaluation episodes',
          outputs: 'Cycle-normalized cost comparisons, D3 2D/3D cost topologies, JSON ledgers, and 3-page PDF audits',
          technologies: ['Episode Cost Replay', '350x Unit Bootstrap CI', 'D3.js v7 3D Surface', 'jsPDF'],
          verificationNote: 'Supports schema-validated external artifact JSON import for summary metric overlays.',
        },
      ],
      implementationSummary:
        'Built cleanly in React 19, TypeScript, Vite 8, Tailwind CSS v4, D3.js v7, and jsPDF—strictly separating live browser synthetic simulations (`synthetic_demo` provenance) from offline Python research notebooks (`imported_file` schema validation) with 32 passing tests.',
      implementedHeading: 'Implemented Workbench Modules & Verified Features (10 Views)',
      implementedItems: [
        'Mission Overview, Dataset Explorer, Fleet Health Stress Matrix & Single-Machine Cycle Playback with rolling RUL volatility and 10-point OLS End-of-Life projections.',
        'Feature Analytics (12-iteration fit-only k-means regime scaling) & 4-Model Surrogate Benchmark (Ridge, Quantile RF, 28-stage HistGBDT, Causal Sequence ELM w=30) with PHM08 & policy A/B scoring.',
        'Robustness & Split Conformal Diagnostics calibrating global and RUL-binned [0–30, 31–60, 61–90, 91+] quantile intervals against target coverage (1 - α).',
        'Interactive Decision Simulator & D3 Sensitivity Analysis (2D cost heatmap + rotatable D3 3D maintenance cost basin), 3 Guided Investigation Scenarios, Guided Tour, schema-validated JSON import/export, and 3-page jsPDF technical audit generator.',
      ],
      secondaryHeading: 'Scientific Transparency & Companion Research Boundaries',
      secondaryKind: 'proposed',
      secondaryItems: [
        'Live workbench uses deterministic 48-unit/subset synthetic C-MAPSS-shaped fleets and TypeScript model-family surrogates—not raw NASA .txt telemetry or offline PyTorch/LSTM training.',
        'Explicitly labeled Non-Operational Research Prototype; must never be used to authorize aircraft dispatch, inspection intervals, or safety-critical maintenance actions.',
        'Companion offline Python & PyTorch manuscripts covering full NASA C-MAPSS (FD001/FD003) SHAP sensor reduction and FEMTO/PRONOSTIA cross-regime DAPE remain unpublished pending formal review.',
      ],
      coreFeatures: [
        {
          id: 'fg-feat-cohort',
          name: 'Deterministic 48-Unit Synthetic Fleets & Disjoint Splits',
          maturity: 'Implemented',
          description: 'Generates seeded C-MAPSS-shaped trajectories (21 sensors, OS1–OS3) partitioned strictly 45% Fit / 20% Cal / 15% Tune / 20% Eval with zero unit overlap.',
          technicalBasis: 'src/engine/cmapss.ts & prng.ts audited by leakage-free invariants',
        },
        {
          id: 'fg-feat-baselines',
          name: '4 TypeScript RUL Surrogates & PHM08 Benchmarking',
          maturity: 'Implemented',
          description: 'Fits Ridge Linear, Quantile RF, 28-stage HistGBDT, and Causal Sequence ELM (w=30) on fit splits after 12-iteration k-means regime normalization.',
          technicalBasis: 'src/engine/models.ts & abComparison.ts with URL-persisted subset/model selection',
        },
        {
          id: 'fg-feat-calibration',
          name: 'RUL-Binned Split Conformal Uncertainty Calibration',
          maturity: 'Implemented',
          description: 'Computes finite-sample residual quantiles across [0–30, 31–60, 61–90, 91+] horizon bins and evaluates empirical coverage vs. interval width q̂.',
          technicalBasis: 'src/engine/conformal.ts & rulDistribution.ts',
        },
        {
          id: 'fg-feat-policy',
          name: '5-Policy Maintenance Simulator & 350x Bootstrap CIs',
          maturity: 'Implemented',
          description: 'Replays Run-to-Failure, Fixed Interval, RUL Threshold, Risk-Aware Lower-Bound (max(0, ŷ - q̂_bin) <= τ), and Oracle episodes across Cp/Cf ratios.',
          technicalBasis: 'src/engine/maintenance.ts with 350-resample evaluation-unit bootstrap CIs',
        },
        {
          id: 'fg-feat-surface3d',
          name: 'D3 2D Heatmaps & Rotatable 3D Cost Surface',
          maturity: 'Implemented',
          description: 'Maps cycle-normalized expected maintenance cost across (Cp, τ) combinations with interactive 3D rotation to inspect minimum-cost basins.',
          technicalBasis: 'D3.js v7 projection engine in src/engine/surface3d.ts',
        },
        {
          id: 'fg-feat-repro',
          name: 'Provenance Ledger, Schema JSON Import & 3-Page jsPDF Audit',
          maturity: 'Implemented',
          description: 'Exports 3-page PDF technical reports, BibTeX citations, LinkedIn cards, and validates external artifact JSON imports with explicit provenance tags.',
          technicalBasis: 'src/engine/provenance.ts & pdfReport.ts',
        },
        {
          id: 'fg-feat-offline-sync',
          name: 'Offline Python/PyTorch Benchmark Artifact Synchronization',
          maturity: 'Experimental',
          description: 'Supports schema-validated JSON import (`imported_file` provenance) for offline C-MAPSS and FEMTO/PRONOSTIA manuscript summaries once published.',
          technicalBasis: 'Provenance JSON validator awaiting finalized peer-reviewed manuscript tables',
        },
        {
          id: 'fg-feat-fleet-ops',
          name: 'Live Industrial Telemetry & Fleet Dispatch Integration',
          maturity: 'Planned',
          description: 'Explicitly out of scope for this non-operational research prototype; live sensor buses, ERP logistics delays, and aviation dispatch remain excluded.',
          technicalBasis: 'Non-operational research boundary disclosed across UI and README',
        },
      ],
      technologyStackGroups: [
        {
          group: 'Interface & Visualization',
          items: ['React 19', 'TypeScript (Strict)', 'Vite 8', 'Tailwind CSS v4', 'D3.js v7 (2D/3D)', 'Lucide Icons', 'jsPDF'],
        },
        {
          group: 'Simulation & Uncertainty Engine',
          items: ['Mulberry32 48-Unit Cohorts', 'Fit-Only 12-Iter k-Means', 'Ridge / RF / HistGBDT / Seq ELM', 'Split Conformal RUL-Binned Quantiles', '350x Unit Bootstrap CIs'],
        },
        {
          group: 'Verification & Deployment',
          items: ['32 Engine & Conformal Tests (tsx --test)', 'Strict Typecheck (tsc --noEmit)', 'Schema-Validated JSON Provenance', 'Vercel Static Build (MIT License)'],
        },
      ],
      screenshots: [
        {
          id: 'fg-live-home',
          title: 'ForgeMind AI Live Workbench — FD002 Multi-Regime Overview (Vercel)',
          caption:
            'Authentic screenshot captured directly from https://forge-mind-ai-wheat.vercel.app/?subset=FD002&model=gradient_boosting showing Mission Overview navigation across 10 modules, Synthetic Simulation disclosure banner, core conformal engineering framing, and turbofan telemetry schematic.',
          kind: 'Verified Screenshot',
          useGeneratedPreview: true,
        },
        {
          id: 'fg-preview',
          title: 'Turbofan Prognostics & Uncertainty Envelope Architecture',
          caption:
            'Conceptual engineering illustration complementing the live workbench, depicting turbofan degradation channels feeding calibrated RUL envelopes.',
          kind: 'Conceptual Illustration',
        },
      ],
      challenges: [
        'Running multi-subset synthetic simulation, k-means regime scaling, 4 surrogate models, conformal quantiles, and 350-resample policy bootstraps interactively in sub-second browser execution.',
        'Preventing cross-unit leakage across Fit, Calibration, Policy Tuning, and Evaluation splits while communicating synthetic vs. raw NASA benchmark boundaries transparently.',
      ],
      engineeringDecisions: [
        {
          id: 'fg-dec-1',
          challenge: 'Browser responsiveness limits full-scale 260-unit FD002/FD004 PyTorch training cycles.',
          decision: 'Built deterministic 48-unit/subset synthetic fleets and fast TypeScript model-family surrogates (Ridge, RF, 28-stage HistGBDT, Causal Seq ELM) paired with persistent synthetic disclosures.',
          rationale: 'Lets engineers inspect genuine conformal math and policy cost trade-offs interactively in 0ms server latency without misrepresenting browser surrogates as production ML.',
          tradeoff: 'Smaller 10-unit blind eval cohorts shift discrete failure-rate metrics in 10% increments, documented directly inside Methodology & Limitations.',
        },
        {
          id: 'fg-dec-2',
          challenge: 'Multi-condition profiles (FD002/FD004) distort global normalization if fitted on combined cohorts.',
          decision: 'Executed 12-iteration OS1–OS3 k-means clustering and min-max scaling bounds strictly on the 45% Fit cohort.',
          rationale: 'Preserves strict zero-leakage experimental hygiene matching best practices in RUL research.',
          tradeoff: 'Held-out evaluation units under rare regimes rely on nearest-fit-centroid extrapolation.',
        },
        {
          id: 'fg-dec-3',
          challenge: 'Constant global conformal widths over-trigger early preventive replacement when remaining life is actually near 0–30 cycles.',
          decision: 'Calibrated split conformal residual quantiles q̂ both globally and across horizon bins [0–30, 31–60, 61–90, 91+].',
          rationale: 'Adaptive intervals near end-of-life protect against asymmetric Cf failures while avoiding wasteful early removals.',
          tradeoff: 'Horizon binning subdivides the 9-unit calibration cohort into smaller conditional pools.',
        },
      ],
      testingValidationSummary:
        'Verified through 32 deterministic unit and invariant tests in `src/engine/engine.test.ts` (`npx --yes tsx --test src/engine/engine.test.ts`) checking fit/cal/tune/eval unit disjointness, fit-only regime scaling leakage guards, split conformal quantile ordering, and episode cost accounting, alongside strict `tsc --noEmit` and live Vercel deployment.',
      validationRecords: [
        {
          id: 'fg-val-engine',
          method: '32 Deterministic Engine & Conformal Unit Tests (`engine.test.ts`)',
          scope: 'Disjoint cohorts, leakage guards, conformal quantiles & policy cost invariants',
          status: 'Verified',
          evidenceSummary: 'Publicly runnable via `npx --yes tsx --test src/engine/engine.test.ts` on github.com/ibta10/ForgeMind-Ai.',
        },
        {
          id: 'fg-val-vercel',
          method: 'Live Interactive Vercel Deployment (10 Modules + URL State)',
          scope: 'FD001–FD004 switching, surrogate benchmarks, D3 3D surface & jsPDF export',
          status: 'Verified',
          evidenceSummary: 'Confirmed live at https://forge-mind-ai-wheat.vercel.app/?subset=FD002&model=gradient_boosting with 0 console errors.',
        },
        {
          id: 'fg-val-offline',
          method: 'Companion Offline Python C-MAPSS / FEMTO Benchmark Studies',
          scope: 'Unpublished research manuscripts (held offline pending peer review)',
          status: 'Active Experiment',
          evidenceSummary: 'Unpublished numerical manuscript tables remain withheld externally while ForgeMind AI showcases the open simulation methodology.',
        },
      ],
      currentLimitations: [
        'Generates 48-unit/subset deterministic C-MAPSS-shaped synthetic trajectories rather than bundling raw NASA .txt files.',
        'Evaluates lightweight TypeScript model-family surrogates (Ridge, Quantile RF, HistGBDT, Causal Seq ELM) rather than offline GPU-trained LSTM/Transformer models.',
        '10-unit blind evaluation cohorts create discrete 10% failure-rate steps; conformal guarantees rely on calibration-to-evaluation residual exchangeability.',
        'Simplified single-asset preventive (Cp) vs. failure (Cf) cost model excludes fleet dispatch, turnaround lead times, and spare-parts logistics.',
      ],
      currentProgress: [
        'Deployed full 10-module MIT-licensed workbench live on Vercel (`forge-mind-ai-wheat.vercel.app`) and published source + 32 tests at `github.com/ibta10/ForgeMind-Ai`.',
        'Supports FD001–FD004 subset & surrogate deep-linking (`?subset=FD002&model=gradient_boosting`), 3 Guided Investigation Scenarios, JSON artifact import/export, and 3-page jsPDF audits.',
      ],
      futureDevelopment: [
        'Import finalized Python C-MAPSS & FEMTO/PRONOSTIA experimental summaries via the schema-validated JSON artifact ledger after companion manuscript review.',
        'Expand multi-asset hangar constraint scheduling beyond single-unit Cp/Cf episode replay.',
      ],
      impact:
        'Provides a transparent, zero-signup browser workbench for exploring uncertainty-aware predictive maintenance while rigorously distinguishing synthetic simulation demos from ongoing offline research.',
    },
  },
  {
    id: 'tikatrack',
    title: 'TikaTrack',
    tagline: 'Bilingual (EN/BN) Lifespan Immunization PWA & Verifiable QR Health Companion',
    categories: ['Software', 'AI/ML', 'Innovation'],
    categoryLabel: 'Software · AI/ML · Innovation',
    status: 'Active Prototype · v12.0.0 Open-Source PWA',
    developmentStage: 'Active Prototype',
    context: 'Public-Health Software · 90 Vaccines · 175 Verified Centres across 64 Districts',
    githubUrl: 'https://github.com/Ibtasham/TikaTrack',
    liveDemoUrl: 'https://ibtasham.github.io/TikaTrack/',
    sourceNote: 'Live offline-first PWA at ibtasham.github.io/TikaTrack; full MIT codebase & 46 test suites at github.com/Ibtasham/TikaTrack.',
    roleAndContribution:
      'Sole Author & Full-Stack Developer — built the bilingual React 19 offline-first clinical PWA, VaccinationEvent ledger, ECDSA P-256/HMAC QR cryptographic passport, Three.js cold-chain lab, offline BM25 TikaBot RAG, and 46 Vitest test suites.',
    implementedHighlights: [
      '90 documented vaccines & 196 tracked doses across 16 life stages (DGHS EPI to seniors) in English & বাংলা',
      '175 verified Bangladesh vaccination centres across all 64 districts & 8 divisions + Google Maps locator',
      'WHO 0–60 mo growth & 5–19 yr BMI-for-age charts + ECDSA P-256 / HMAC QR digital passports (jsQR)',
      'Offline bilingual BM25 RAG TikaBot + Three.js WHO PQS cold-chain simulator & custom SW caching',
    ],
    scopeDistinctionNote:
      'GitHub Pages runs 100% offline-first via browser localStorage & PBKDF2-SHA256 local auth; optional Gemini streaming/Live Voice, Web Push, and Firebase/Cloud SQL/Supabase sync require server env keys. Informational record-keeping only—does not replace official DGHS EPI cards.',
    oneSentenceProblem:
      'Families navigating Bangladesh’s DGHS EPI schedules, catch-up doses, childhood growth milestones, and geographically scattered vaccination centres rely heavily on fragile paper cards with no bilingual offline digital ledger or verifiable QR record.',
    mainContribution:
      'Built an offline-first bilingual (English & বাংলা) React 19 Progressive Web App combining a 90-vaccine lifespan scheduler, WHO growth charting, cryptographically signed ECDSA P-256 QR vaccination passports, a 175-centre 64-district locator, Three.js cold-chain explorer, and 46 Vitest suites.',
    summary:
      'A bilingual (English & বাংলা) offline-first Progressive Web App supporting Bangladesh DGHS EPI and lifelong immunization tracking across 16 life stages, pairing WHO growth percentile charts, cryptographically signed QR passports (HMAC & ECDSA P-256), a 175-centre locator across 64 districts, offline BM25 TikaBot RAG, and Three.js cold-chain inspection.',
    stack: [
      'React 19',
      'TypeScript',
      'React Router v7',
      'Tailwind CSS v4',
      'Recharts',
      'Three.js',
      'ECDSA P-256 & jsQR',
      'Offline PWA & BM25 RAG',
      'Firebase / Drizzle / Express 4 (Optional Cloud)',
    ],
    previewKindLabel: 'Verified Product Screenshot',
    previewAlt:
      'Live browser capture of the TikaTrack bilingual immunization PWA displaying 90 documented vaccines, 175 verified centres across 64 districts and 8 divisions, and offline-ready PWA status',
    modules: [
      {
        id: 'tt-mod-schedule',
        name: 'Lifespan Immunization & Family Dose Ledger',
        methods: ['VaccinationEvent Multi-Dose Ledger', '16 Life Stages & Catch-Up Planner', 'PBKDF2-SHA256 Local Vault'],
        description:
          'Tracks individual dose events across birth, DGHS EPI childhood series, school boosters, HPV, pregnancy (TT/Tdap/RSV), Hajj, and 65+ senior schedules—migrating legacy profiles cleanly and keeping zero-signup localStorage persistence (`profileStore`).',
        domainContext: '90 documented vaccines & 196 tracked doses in full English and Unicode বাংলা localisation.',
      },
      {
        id: 'tt-mod-passport',
        name: 'Cryptographic QR Passport & Portable Exports',
        methods: ['TIKAPASS2 Per-Device HMAC', 'TIKAPASS3 Cross-Device ECDSA P-256', 'Live jsQR Scanner & .ics Export'],
        description:
          'Issues tamper-detectable offline QR certificates verified in real time via camera `jsqr` decoding, alongside printable SVG/PDF vaccination cards with Unicode Bangla glyph rendering and `.ics` calendar reminders (`digitalPassport.ts`, `qrScanner.ts`).',
        domainContext: 'Cryptographically verifiable personal vaccination certificates working without internet connectivity.',
      },
      {
        id: 'tt-mod-growth',
        name: 'WHO Growth Charts, 64-District Map & 3D Cold-Chain',
        methods: ['WHO 0–60 mo Weight/Height Percentiles', 'WHO 2007 BMI-for-Age (5–19 yrs)', 'Three.js PQS Carrier + Google Maps'],
        description:
          'Overlays child growth trajectories onto WHO reference curves with immunization milestone pins (`whoGrowth.ts`), maps 175 verified Bangladesh centres across 64 districts (`CentresMap.tsx`), and inspects `+2°C to +8°C` VVM excursions in a Three.js cold-chain lab (`ColdChainScene.ts`).',
        domainContext: 'Paediatric monitoring, regional facility discovery, and cold-chain vaccine viability education.',
      },
      {
        id: 'tt-mod-tikabot',
        name: 'Bilingual TikaBot RAG, PWA Worker & Cloud Sync',
        methods: ['Offline Bilingual BM25 RAG & Triage', 'Hashed Precaching SW + VAPID Push', 'Optional Firebase / Cloud SQL / Gemini Live'],
        description:
          'Answers clinical-reference immunization questions offline via curated BM25 retrieval (`ragEngine.ts`) backed by a custom precaching service worker (`sw.template.js`), plus optional Express 4 Gemini Live Voice (`/ws/live-voice`) and Firebase/Drizzle PostgreSQL sync.',
        domainContext: 'Resilient health guidance in low-connectivity districts with optional cross-device cloud backup.',
      },
    ],
    caseStudy: {
      overviewSummary:
        'TikaTrack (v12.0.0, MIT License) is a live, offline-first bilingual immunization PWA serving English and বাংলা families across Bangladesh. Built with React 19, TypeScript, Recharts, Three.js, and Web Crypto / jsQR, it spans 90 documented vaccines, 196 doses across 16 life stages, and 175 verified centres across all 64 districts—verified by 46 Vitest unit, cryptographic, service-worker runtime, and component suites. Explicitly operates as an informational personal record tool rather than a clinical replacement or official DGHS EPI card.',
      problemStatement:
        'Immunization records in many households rely on vulnerable paper EPI booklets without multi-child catch-up logic, WHO child growth correlation, bilingual clinical reference access in low-connectivity rural areas, or portable QR-verifiable certificates.',
      motivation:
        'Designed to demonstrate how privacy-preserving local-first software architecture, public-key Web Crypto signatures, and bilingual progressive web engineering can make lifespan vaccination readiness reliable even completely offline.',
      proposedSolution:
        'Engineered a zero-signup local-vault PWA anchored on an atomic VaccinationEvent ledger paired with WHO anthropometric percentile charts, offline BM25 medical-source RAG with emergency triage, Three.js PQS cold-chain inspection, and dual HMAC/ECDSA P-256 QR verification.',
      architectureOverview:
        'Local-first four-stage PWA architecture: PBKDF2-protected browser dose/growth state drives clinical scheduling & WHO charts, feeds bilingual BM25 RAG + Three.js cold-chain visualization, signs offline QR passports via Web Crypto, and optionally synchronizes via Firebase Firestore, Cloud SQL (PostgreSQL + Drizzle ORM), or Supabase.',
      architectureLayers: [
        {
          id: 'tt-schedule',
          stage: 'Layer 01',
          title: 'Local-First Family Vault & Lifespan Scheduler',
          detail: 'Zero-signup browser localStorage persistence with PBKDF2-SHA256 local auth, 16-stage scheduler, catch-up rules, and atomic multi-dose VaccinationEvent tracking.',
          state: 'Implemented',
          inputs: 'Family member profiles, birthdates, dose timestamps, centres, and WHO growth measurements',
          outputs: 'Due/overdue dose queues, readiness scores, and bilingual English/বাংলা schedule cards',
          technologies: ['React 19', 'TypeScript (Strict)', 'PBKDF2-SHA256', 'i18n EN/BN Dictionaries'],
          verificationNote: 'Validated via doseRegression, welcome, and multi-route App smoke suites in UTC and Asia/Dhaka timezones.',
        },
        {
          id: 'tt-analytics',
          stage: 'Layer 02',
          title: 'WHO Growth Charts, Cold-Chain 3D & 175-Centre Locator',
          detail: 'Interactive Recharts WHO 0–60 mo weight/height & 5–19 yr BMI curves, 175 verified Bangladesh centres across 64 districts, and Three.js WHO PQS +2°C–+8°C cold-chain explorer.',
          state: 'Implemented',
          inputs: 'Anthropometric child measurements, district/division filters, and thermal excursion parameters',
          outputs: 'Percentile trajectories with vaccine pins, facility markers, and 3D VVM excursion simulations',
          technologies: ['Recharts', 'Three.js (ColdChainScene)', 'Google Maps Platform', 'WHO Reference Tables'],
          verificationNote: 'Centres database and WHO reference tables verified against documented sources inside evidence.test.ts.',
        },
        {
          id: 'tt-passport',
          stage: 'Layer 03',
          title: 'Cryptographic QR Passport & Offline TikaBot RAG',
          detail: 'Issues HMAC (TIKAPASS2) and cross-device ECDSA P-256 (TIKAPASS3) QR passports scanned via jsQR, printable PDF/SVG cards, `.ics` exports, and offline BM25 RAG TikaBot.',
          state: 'Implemented',
          inputs: 'Verified dose history, Web Crypto keypairs, camera QR stream, and user immunization queries',
          outputs: 'Tamper-evident offline certificates, calendar invites, and cited bilingual BM25 triage responses',
          technologies: ['Web Crypto ECDSA P-256 / HMAC', 'jsQR', 'BM25 Offline RAG', 'Printable Unicode SVG/PDF'],
          verificationNote: 'digitalPassport, qrScanner, botContext, ics, and evidence suites enforce zero uncited responses.',
        },
        {
          id: 'tt-sync',
          stage: 'Layer 04',
          title: 'PWA Worker & Optional Cloud / Gemini Server',
          detail: 'Custom service worker (`sw.template.js`) with hashed precaching runs offline on GitHub Pages; optional Express 4 server adds Gemini Live Voice (`/ws/live-voice`), VAPID Web Push, and Firebase/Cloud SQL/Supabase sync.',
          state: 'Experimental',
          inputs: 'Build manifest cache hashes, VAPID subscriptions, optional API/DB credentials, and WebSocket audio',
          outputs: 'Offline app availability, 48-hour push notifications, and tombstone-merged multi-device sync',
          technologies: ['Custom SW Runtime', 'Express 4 & ws', 'Firebase / Firestore Rules', 'Drizzle ORM PostgreSQL', 'web-push'],
          verificationNote: 'SW runtime tested offline via swRuntime suite; server sync & Gemini voice require optional deployment env vars.',
        },
      ],
      implementationSummary:
        'Built around offline reliability and strict evidence safety: static GitHub Pages runs every core tracker, WHO chart, 175-centre search, ECDSA QR passport, 3D cold-chain explorer, and BM25 TikaBot locally in the browser, while optional Express/Firebase/Cloud SQL services extend multi-device sync and live voice Q&A when configured.',
      implementedHeading: 'Implemented Capabilities (Verified in Source & Live Build)',
      implementedItems: [
        '90 documented vaccines & 196 tracked doses across 16 life stages (DGHS EPI childhood schedule, catch-up logic, maternal, travel/Hajj, and 65+ seniors) in full English and বাংলা.',
        'Atomic `VaccinationEvent` multi-dose ledger with zero-signup `localStorage` storage and PBKDF2-SHA256 local profile protection.',
        'Interactive Recharts WHO growth percentile & 5–19 yr BMI-for-age charts pinned with vaccination milestones.',
        '175 verified Bangladesh vaccination centres across all 64 districts & 8 divisions with Google Maps explorer.',
        'Dual cryptographic digital vaccination passport: `TIKAPASS2` (HMAC) and `TIKAPASS3` (ECDSA P-256 public-key verified across devices), live `jsQR` camera scanner, `.ics` exports, and printable Unicode Bangla cards.',
        'Offline bilingual BM25 RAG TikaBot with emergency symptom triage, Three.js WHO PQS `+2°C–+8°C` 3D cold-chain explorer, custom build-hashed precaching Service Worker, and 46 Vitest test suites + ESLint Firebase rules check.',
      ],
      secondaryHeading: 'Optional Full-Stack Sync, AI Voice & Scope Boundaries',
      secondaryKind: 'proposed',
      secondaryItems: [
        'Optional Express 4 server extensions—Gemini Live Voice WebSocket (/ws/live-voice), streaming TikaBot LLM, VAPID 48-hour Web Push, and Firebase Firestore / Drizzle PostgreSQL / Supabase sync—require configuring server secrets and are inactive on the static GitHub Pages demo.',
        'Clinical Disclaimer: Explicitly an informational and personal record-keeping assistant—not clinical medical advice, diagnosis, or an official DGHS EPI card.',
      ],
      coreFeatures: [
        {
          id: 'tt-feat-schedule',
          name: '90-Vaccine Bilingual Lifespan Scheduler & Atomic Dose Ledger',
          maturity: 'Implemented',
          description: 'Tracks individual multi-dose histories across 16 life stages in English and বাংলা with offline-first localStorage + PBKDF2 local protection.',
          technicalBasis: 'profileStore, i18n EN/BN parity suite & 6 dose-regression invariants',
        },
        {
          id: 'tt-feat-qr',
          name: 'ECDSA P-256 & HMAC Signed QR Passport + Live jsQR Scanner',
          maturity: 'Implemented',
          description: 'Generates offline tamper-evident digital certificates verifiable across independent devices via Web Crypto signatures and camera QR scanning.',
          technicalBasis: 'src/lib/digitalPassport.ts (TIKAPASS2/TIKAPASS3) & qrScanner.ts',
        },
        {
          id: 'tt-feat-who',
          name: 'WHO Child Growth Curves, 3D Cold-Chain Lab & 175 Centres Map',
          maturity: 'Implemented',
          description: 'Charts WHO percentiles alongside vaccine milestones, explores WHO PQS +2°C–+8°C cold-chain excursion limits in Three.js, and searches 175 verified Bangladesh centres across 64 districts.',
          technicalBasis: 'whoGrowth.ts, Recharts, Three.js ColdChainScene & CentresMap.tsx',
        },
        {
          id: 'tt-feat-rag',
          name: 'Offline Bilingual BM25 RAG TikaBot & Hashed Service Worker',
          maturity: 'Implemented',
          description: 'Retrieves verified clinical/EPI citations offline using BM25 + emergency symptom triage, cached via a custom build-hashed PWA service worker.',
          technicalBasis: 'src/lib/ragEngine.ts & sw.template.js tested in swRuntime suite',
        },
        {
          id: 'tt-feat-cloud',
          name: 'Firebase / Cloud SQL PostgreSQL Sync & Gemini Live Voice Server',
          maturity: 'Experimental',
          description: 'Optional multi-device cloud synchronization (Firebase Firestore, Drizzle PostgreSQL, or Supabase), VAPID Web Push, and Gemini WebSocket voice when deployed with backend credentials.',
          technicalBasis: 'server.ts, src/db/ & ESLint Firebase security rules validation',
        },
        {
          id: 'tt-feat-dghs',
          name: 'Direct Official DGHS Institutional Registry API Integration',
          maturity: 'Planned',
          description: 'Currently maintains strictly personal household records and curated centre metadata without official government health registry API synchronization.',
          technicalBasis: 'Planned institutional interoperability milestone beyond independent student release',
        },
      ],
      technologyStackGroups: [
        {
          group: 'Frontend PWA & Visual Labs',
          items: ['React 19', 'TypeScript (Strict)', 'React Router v7', 'Tailwind CSS v4', 'Motion', 'Recharts', 'Three.js'],
        },
        {
          group: 'Cryptography, Offline AI & PWA',
          items: ['Web Crypto ECDSA P-256 & HMAC', 'jsQR Camera Scanner', 'Custom BM25 Bilingual RAG', 'Hashed Precaching Service Worker', 'ICS Calendar Export'],
        },
        {
          group: 'Testing & Optional Full-Stack Server',
          items: ['46 Vitest + Testing Library Suites', 'ESLint Firebase Security Rules', 'Express 4, ws & @google/genai', 'Firebase / Drizzle PostgreSQL / Supabase', 'VAPID web-push'],
        },
      ],
      screenshots: [
        {
          id: 'tt-live-home',
          title: 'TikaTrack Live PWA Home & Family Command View (GitHub Pages)',
          caption:
            'Authentic screenshot captured from https://ibtasham.github.io/TikaTrack/ showing 90 documented vaccines, 175 verified centres across 64 districts and 8 divisions, 196 tracked doses, English/বাংলা switchability, and Offline Ready SW status.',
          kind: 'Verified Screenshot',
          useGeneratedPreview: true,
        },
        {
          id: 'tt-concept-arch',
          title: 'Immunization Cryptographic & Offline Flow Illustration',
          caption:
            'Conceptual software architecture illustration depicting multi-stage vaccination tracking and offline record flow alongside the live PWA capture.',
          kind: 'Conceptual Illustration',
          useGeneratedPreview: true,
          previewSource: 'conceptual',
        },
      ],
      challenges: [
        'Preventing multi-dose tracking corruptions (such as marking OPV-1 complete erroneously closing OPV-2/3 or deleting single dose records) while preserving offline localStorage speed.',
        'Ensuring full offline resilience and verifiable certificate integrity in rural/low-connectivity contexts without requiring paid servers or third-party cloud lock-in.',
      ],
      engineeringDecisions: [
        {
          id: 'tt-dec-1',
          challenge: 'Paper records or external servers lock out households without reliable connectivity or accounts.',
          decision: 'Built a zero-signup local-first browser vault paired with a custom build-hashed Service Worker and offline bilingual BM25 RAG engine.',
          rationale: 'Guarantees instant utility, zero-connectivity scheduling, and verified clinical-source Q&A anywhere, while keeping Firebase/PostgreSQL sync cleanly opt-in.',
          tradeoff: 'Device storage clears if browser site data is wiped without exporting a QR passport, JSON backup, or enabling cloud sync.',
        },
        {
          id: 'tt-dec-2',
          challenge: 'Simple QR codes storing plain JSON strings are trivially forged across independent verifier devices.',
          decision: 'Implemented dual `TIKAPASS2` (HMAC) and `TIKAPASS3` (ECDSA P-256 asymmetric signature) certificate verification via native Web Crypto APIs.',
          rationale: 'Allows cross-device offline verification via `jsQR` without shipping private keys or central verification servers.',
          tradeoff: 'Requires disciplined keypair storage and strict payload compactness inside standard QR density limits.',
        },
        {
          id: 'tt-dec-3',
          challenge: 'Medical misinformation risk when pairing conversational interfaces with public-health data.',
          decision: 'Constrained TikaBot strictly to cited reviewed sources via `evidence.test.ts` gates, built explicit emergency symptom triage, and published prominent DGHS non-replacement disclaimers.',
          rationale: 'Prioritizes clinical safety boundaries over unconstrained free-form LLM generation.',
          tradeoff: 'Live Gemini voice synthesis requires server-side API keys and stays inactive on the static GitHub Pages host.',
        },
      ],
      testingValidationSummary:
        'Audited across 46 Vitest unit, cryptographic, dose-regression, i18n EN/BN parity, offline Service Worker runtime, evidence-gating, and React route smoke tests—executed across UTC and Asia/Dhaka timezones alongside ESLint Firebase security rules verification.',
      validationRecords: [
        {
          id: 'tt-val-suites',
          method: '46 Vitest Suites + TZ=UTC & TZ=Asia/Dhaka Runs',
          scope: 'ECDSA/HMAC QR signing, 6 dose-regression guarantees, i18n parity, SW offline fetch/cache, evidence gating & multi-route smoke tests',
          status: 'Verified',
          evidenceSummary: 'Reproducible in github.com/Ibtasham/TikaTrack via `npm run test:run`, `npm run lint`, and Firebase rules ESLint check.',
        },
        {
          id: 'tt-val-pwa',
          method: 'Live GitHub Pages Offline-Ready PWA Capture',
          scope: 'Static precaching service worker, 90 vaccines, 175 verified Bangladesh centres across 64 districts',
          status: 'Verified',
          evidenceSummary: 'Confirmed live at https://ibtasham.github.io/TikaTrack/ with HTTP 200 and active "Offline ready" cache confirmation.',
        },
        {
          id: 'tt-val-clinical',
          method: 'Institutional Clinical Trial & DGHS Official Issuance',
          scope: 'Hospital EMR deployment or official government vaccination booklet equivalence',
          status: 'Planned',
          evidenceSummary: 'Explicitly positioned as an informational personal record tool; not clinically deployed or officially affiliated with DGHS.',
        },
      ],
      currentLimitations: [
        'Explicitly an informational & personal record-keeping PWA—does not replace official Directorate General of Health Services (DGHS) EPI booklets or licensed physician advice.',
        'GitHub Pages static demo runs exclusively in browser localStorage; optional cross-device Firebase/Cloud SQL/Supabase sync, 48-hour VAPID Web Push, and Gemini Live Voice require backend deployment env keys.',
        'Google Maps vaccination centres locator relies on client Maps API configuration where full interactive tiles are enabled.',
        'No hospital field trial or active commercial user-base metrics are claimed.',
      ],
      currentProgress: [
        'v12.0.0 live at ibtasham.github.io/TikaTrack with 90 documented vaccines, 175 Bangladesh centres, WHO growth tracker, Three.js cold-chain explorer, and ECDSA QR passports.',
        '46 automated test suites (`src/tests/`) covering cryptography, dose integrity, offline Service Worker runtime, and bilingual EN/BN parity.',
      ],
      futureDevelopment: [
        'Connect institutional clinic pilot evaluations with pediatric & maternal health practitioners in Bangladesh.',
        'Expand optional hospital-hosted Cloud SQL & Web Push notification deployments for community health camps.',
        'Broaden WHO growth curve export formats and offline voice synthesis accessibility.',
      ],
      impact:
        'Demonstrates full-stack offline-first systems engineering combining clinical health UX, bilingual typography, Web Crypto digital passports, Three.js cold-chain modeling, and rigorous automated testing; zero fabricated adoption metrics or official clinical approvals claimed.',
    },
  },
];
