export type StudioModelId =
  | 'forgemind-turbofan'
  | 'factorymind-cell'
  | 'femto-bearing'
  | 'carbon-cnc'
  | 'supply-asrs';

export type CameraPresetId = 'isometric' | 'front' | 'top' | 'closeup';

export type MaterialFinishId = 'titanium' | 'cobalt' | 'bronze' | 'graphite';

export type LightingPresetId = 'dark-lab' | 'daylight' | 'thermal';

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
}

export interface RelatedWorkLink {
  label: string;
  kind: 'Project' | 'Research';
  to: string;
}

export interface SubsystemMeta {
  id: string;
  name: string;
  shortLabel: string;
  stageTag: string;
  description: string;
  engineeringPurpose: string;
  workingPrinciple: string;
  industrialApplication: string;
  ipeConcepts: string[];
  relatedRecords: RelatedWorkLink[];
  cameraFocus: CameraPose;
}

export interface GuidedTourStep {
  stepNumber: number;
  title: string;
  subsystemId: string;
  recommendedExplode?: number;
  takeaway: string;
}

export interface StudioModelSpec {
  id: StudioModelId;
  shortTitle: string;
  title: string;
  projectRef: string;
  projectRoute: string;
  subtitle: string;
  conceptualNotice: string;
  ipeRelevance: string;
  ipeDomains: string[];
  subsystems: SubsystemMeta[];
  guidedTour: GuidedTourStep[];
  cameraPresets: Record<CameraPresetId, CameraPose>;
}

export interface MaterialFinishSpec {
  id: MaterialFinishId;
  label: string;
  swatchHex: string;
  primaryHex: number;
  secondaryHex: number;
  metalness: number;
  roughness: number;
  clearcoat: number;
}

export const CONCEPTUAL_STUDIO_DISCLAIMER =
  'Conceptual procedural assembly built for spatial engineering education. Geometry proportions, rotational kinematics, and visual states are illustrative and are not calibrated to physical hardware dimensions or tolerances.';

export const STUDIO_MODELS: Record<StudioModelId, StudioModelSpec> = {
  'forgemind-turbofan': {
    id: 'forgemind-turbofan',
    shortTitle: 'Turbofan',
    title: 'ForgeMind AI · Turbofan Prognostics Assembly',
    projectRef: 'NASA C-MAPSS Degradation Architecture',
    projectRoute: '/projects/forgemind-ai',
    subtitle:
      'Multi-stage axial turbofan rig modeled to inspect sensor placement across fan, high-pressure compressor, combustor, and low-pressure turbine sections.',
    conceptualNotice: CONCEPTUAL_STUDIO_DISCLAIMER,
    ipeRelevance:
      'Industrial & Production Engineering connects mechanical degradation to fleet maintenance economics. Instead of scheduling fixed-interval teardowns or reacting to failures, prognostic health indicators across compressor and turbine stages inform condition-based maintenance policies, spare-parts inventory planning, and risk-calibrated overhaul intervals.',
    ipeDomains: [
      'Condition-Based Maintenance',
      'Reliability & Survival Modeling',
      'Sensor Telemetry Attribution',
      'Maintenance Policy Optimization',
    ],
    subsystems: [
      {
        id: 'spinner-fan',
        name: 'Inlet Spinner & Fan Stage',
        shortLabel: 'Fan Stage',
        stageTag: 'Stage 01 · N1 Rotor',
        description:
          'Conical intake spinner and 18 swept titanium fan blades handling primary bypass airflow and N1 rotational speed sensing.',
        engineeringPurpose:
          'Captures incoming ambient air, provides clean aerodynamic flow division between core and bypass ducts, and anchors low-pressure spool speed monitoring.',
        workingPrinciple:
          'The rotating conical nose deflects airflow radially while swept airfoil blades accelerate a high mass flow rate through the bypass annulus and first core compression stage.',
        industrialApplication:
          'High-bypass aviation propulsion test cells and industrial gas-turbine intake monitoring benches used for blade-balance and foreign-object signature baselines.',
        ipeConcepts: [
          'Rotating Asset Condition Monitoring',
          'Operating Regime Segmentation (Mach / Altitude)',
          'Preventive Inspection Scheduling',
        ],
        relatedRecords: [
          {
            label: 'ForgeMind AI · C-MAPSS Prognostics Platform',
            kind: 'Project',
            to: '/projects/forgemind-ai',
          },
        ],
        cameraFocus: { position: [3.2, 2.0, 3.8], target: [0, 1.5, 0.9] },
      },
      {
        id: 'nacelle-shroud',
        name: 'Outer Nacelle & Acoustic Cowl',
        shortLabel: 'Nacelle Cowl',
        stageTag: 'Structural Envelope',
        description:
          'Contoured aerodynamic outer bypass duct with split bolted flange rings and top-mounted instrumentation pylon.',
        engineeringPurpose:
          'Contains bypass airflow, isolates blade tip dynamics, dampens acoustic emissions, and provides structural mounting and inspection access via split cowling halves.',
        workingPrinciple:
          'Segmented upper and lower semi-cylindrical shells mate along bolted structural flanges; separating them vertically in exploded view exposes internal rotor stages.',
        industrialApplication:
          'Modular gas-turbine enclosures and MRO shop maintainability architectures designed to minimize disassembly time (MTTR) during borescope inspections.',
        ipeConcepts: [
          'Maintainability & Design for Serviceability',
          'Mean Time to Repair (MTTR) Reduction',
          'Standardized Inspection Access',
        ],
        relatedRecords: [
          {
            label: 'ForgeMind AI · Case Study',
            kind: 'Project',
            to: '/projects/forgemind-ai',
          },
        ],
        cameraFocus: { position: [4.6, 2.9, 4.3], target: [0, 1.7, 0.15] },
      },
      {
        id: 'compressor-core',
        name: 'High-Pressure Compressor (HPC)',
        shortLabel: 'HPC Core',
        stageTag: 'Stage 02 · P30 / T30',
        description:
          'Multi-row axial compressor rotor drums paired with external fuel and pressure-tap conduits.',
        engineeringPurpose:
          'Raises core air pressure and temperature sequentially prior to combustion while housing high-sensitivity pressure and temperature telemetry taps.',
        workingPrinciple:
          'Progressive rotor-stator stages compress gas into a shrinking annulus volume; compressor fouling or tip clearance wear shifts downstream P30/T30 ratios modeled in C-MAPSS.',
        industrialApplication:
          'Petrochemical centrifugal compressors, power-generation gas turbines, and aircraft engine health-monitoring pipelines tracking efficiency drift.',
        ipeConcepts: [
          'Multivariate Process Drift Detection',
          'Feature Attribution (SHAP)',
          'Uncertainty-Aware Remaining Useful Life',
        ],
        relatedRecords: [
          {
            label: 'Uncertainty-Aware & Explainable RUL Manuscript',
            kind: 'Research',
            to: '/research/rul-explainable',
          },
          {
            label: 'ForgeMind AI · Experimentation',
            kind: 'Project',
            to: '/projects/forgemind-ai',
          },
        ],
        cameraFocus: { position: [2.7, 1.85, 2.2], target: [0, 1.5, 0.1] },
      },
      {
        id: 'combustor-turbine',
        name: 'Combustor & Turbine Hot Section',
        shortLabel: 'Hot Section',
        stageTag: 'Stage 03 · T50 / EGT',
        description:
          'Annular thermal core and low-pressure turbine blades representing the primary thermal-fatigue degradation zone tracked in C-MAPSS.',
        engineeringPurpose:
          'Converts chemical energy into expanding high-enthalpy gas that drives turbine discs connected back to the front fan and compressor shafts.',
        workingPrinciple:
          'Continuous constant-pressure thermal expansion drives angled turbine airfoils; elevated Exhaust Gas Temperature (EGT) signals upstream efficiency losses or blade thermal fatigue.',
        industrialApplication:
          'Thermal asset life-consumption tracking in combined-cycle power turbines and aerospace fleet prognostics where thermal excursions shorten overhaul intervals.',
        ipeConcepts: [
          'Thermal Fatigue Hazard Modeling',
          'Conformal Prediction Safety Intervals',
          'Cost-Optimal Replacement Thresholds',
        ],
        relatedRecords: [
          {
            label: 'Uncertainty-Aware & Explainable RUL Manuscript',
            kind: 'Research',
            to: '/research/rul-explainable',
          },
        ],
        cameraFocus: { position: [2.8, 1.9, -2.1], target: [0, 1.5, -0.65] },
      },
      {
        id: 'exhaust-nozzle',
        name: 'Core Exhaust Nozzle & Test Plinth',
        shortLabel: 'Exhaust & Mount',
        stageTag: 'Mount & Exhaust',
        description:
          'Convergent exhaust cone and rigid test-cell support cradle anchored to the studio turntable.',
        engineeringPurpose:
          'Accelerates expanded core gas smoothly around the central tail cone while transmitting structural thrust and test-bench mounting loads to the cradle.',
        workingPrinciple:
          'A converging annular duct guides wake flow evenly; twin lower support struts and semi-circular saddles isolate rig weight onto the stationary base plate.',
        industrialApplication:
          'Static propulsion test stands, turbine balancing beds, and heavy rotating equipment structural foundations.',
        ipeConcepts: [
          'Test-Cell Instrumentation Layout',
          'Vibration Isolation & Structural Safety',
          'Asset Lifecycle Traceability',
        ],
        relatedRecords: [
          {
            label: 'ForgeMind AI · Architecture & Decision Policy',
            kind: 'Project',
            to: '/projects/forgemind-ai',
          },
        ],
        cameraFocus: { position: [-3.3, 1.8, -3.5], target: [0, 1.2, -0.9] },
      },
    ],
    guidedTour: [
      {
        stepNumber: 1,
        title: 'Airflow Intake & N1 Monitoring',
        subsystemId: 'spinner-fan',
        recommendedExplode: 0,
        takeaway:
          'Begin at the inlet spinner and 18-blade fan rotor where rotational speed regimes establish baseline operating conditions.',
      },
      {
        stepNumber: 2,
        title: 'Split Nacelle for MRO Inspection',
        subsystemId: 'nacelle-shroud',
        recommendedExplode: 0.45,
        takeaway:
          'Separating the upper and lower cowling illustrates how modular housing design improves maintenance turnaround time.',
      },
      {
        stepNumber: 3,
        title: 'Inspecting the High-Pressure Compressor',
        subsystemId: 'compressor-core',
        recommendedExplode: 0.72,
        takeaway:
          'Exposed HPC stages and sensor conduits reflect where P30/T30 telemetry captures gradual efficiency degradation.',
      },
      {
        stepNumber: 4,
        title: 'Thermal Core & RUL Risk Drivers',
        subsystemId: 'combustor-turbine',
        recommendedExplode: 0.72,
        takeaway:
          'Combustor and turbine thermal stress drives EGT rise—linking deep-learning RUL intervals directly to inspection timing.',
      },
      {
        stepNumber: 5,
        title: 'Convergent Exhaust & Testbed Cradle',
        subsystemId: 'exhaust-nozzle',
        recommendedExplode: 0.25,
        takeaway:
          'Complete the gas path at the exhaust cone and test cradle that stabilize instrumentation during run-to-failure evaluation.',
      },
    ],
    cameraPresets: {
      isometric: { position: [5.4, 3.1, 5.8], target: [0, 1.45, 0] },
      front: { position: [0.1, 1.7, 7.2], target: [0, 1.45, 0] },
      top: { position: [0, 7.6, 1.6], target: [0, 1.2, 0] },
      closeup: { position: [2.9, 1.9, 2.3], target: [0, 1.45, -0.35] },
    },
  },
  'factorymind-cell': {
    id: 'factorymind-cell',
    shortTitle: 'Workcell',
    title: 'FactoryMind · 6-Axis Smart Manufacturing Cell',
    projectRef: 'FactoryMind · DES, Line Balancing & SPC Twin',
    projectRoute: '/projects/factorymind',
    subtitle:
      'Articulated robotic handling arm, precision roller conveyor, and optical statistical process control portal executing automated part inspection.',
    conceptualNotice: CONCEPTUAL_STUDIO_DISCLAIMER,
    ipeRelevance:
      'Smart manufacturing cells unite core Industrial & Production Engineering disciplines: kinematic work-cycle optimization (takt time), conveyor buffer balancing, Statistical Process Control (SPC), and shop-floor discrete-event simulation modeled in FactoryMind.',
    ipeDomains: [
      'Cell Cycle & Takt Balancing',
      'Statistical Process Control (SPC)',
      'Production Flow Simulation',
      'Automated Material Handling',
    ],
    subsystems: [
      {
        id: 'robot-base',
        name: 'Cast Pedestal & Waist Turret (J1)',
        shortLabel: 'J1 Pedestal',
        stageTag: 'Axis J1 · Base',
        description:
          'Heavy-duty bolted machine base supporting the 360-degree rotary turret and servo drive manifold.',
        engineeringPurpose:
          'Anchors overturning moments during rapid arm acceleration and provides continuous angular slewing between upstream and downstream cell stations.',
        workingPrinciple:
          'A cast cylindrical column decouples floor vibration while a central slew bearing driven by an AC servo rotates the J1 turret axis over the conveyor envelope.',
        industrialApplication:
          'Machine-tending workcells, palletizing stations, and automotive sub-assembly lines requiring compact floor footprints.',
        ipeConcepts: [
          'Cellular Manufacturing Layout',
          'Workstation Ergonomics & Reach Envelope',
          'Equipment Utilization (OEE)',
        ],
        relatedRecords: [
          {
            label: 'FactoryMind · Engineering Workbench',
            kind: 'Project',
            to: '/projects/factorymind',
          },
        ],
        cameraFocus: { position: [1.9, 1.8, 3.3], target: [-0.9, 0.7, 0.25] },
      },
      {
        id: 'robot-arm',
        name: 'Twin-Spar Articulated Arm (J2–J3)',
        shortLabel: 'J2–J3 Arm',
        stageTag: 'Kinematics · J2/J3',
        description:
          'Beveled dual-spar lower arm, harmonic servo housings, flexible cable dress pack, and overhead forearm link.',
        engineeringPurpose:
          'Delivers rigid multi-axis reach across vertical and horizontal planes so parts transfer smoothly without colliding with fixtures.',
        workingPrinciple:
          'Coupled shoulder (J2) and elbow (J3) rotational joints move through synchronized sinusoidal trajectories while an umbilical dress pack prevents cable snagging.',
        industrialApplication:
          'Automated CNC loading/unloading, pick-and-place packaging, and synchronized discrete-part transfer in high-mix job shops.',
        ipeConcepts: [
          'Motion Economy & Cycle-Time Study',
          'Bottleneck Station Pacing',
          'Job-Shop Dispatch Integration',
        ],
        relatedRecords: [
          {
            label: 'FactoryMind · Scheduling & OEE Engine',
            kind: 'Project',
            to: '/projects/factorymind',
          },
        ],
        cameraFocus: { position: [2.1, 2.8, 3.6], target: [-0.5, 1.8, 0.15] },
      },
      {
        id: 'gripper-billet',
        name: 'Parallel Jaw Gripper & Workpiece',
        shortLabel: 'EOAT Gripper',
        stageTag: 'End-of-Arm Tooling',
        description:
          'Precision two-jaw parallel end-effector transferring machined aluminum workpieces between conveyor stations.',
        engineeringPurpose:
          'Maintains repeatable workpiece datum alignment during transfer without marring finished cylindrical surfaces.',
        workingPrinciple:
          'Synchronized opposed fingers close symmetrically around the billet centerline while wrist pitch (J5) keeps the part horizontal throughout arm articulation.',
        industrialApplication:
          'High-repeatability lathe tending, inspection fixture loading, and clean-room batch handling.',
        ipeConcepts: [
          'Mistake-Proofing (Poka-Yoke) Fixtures',
          'Datum Repeatability & Yield',
          'Changeover & SMED Tooling',
        ],
        relatedRecords: [
          {
            label: 'FactoryMind · Manufacturing Analytics',
            kind: 'Project',
            to: '/projects/factorymind',
          },
        ],
        cameraFocus: { position: [2.2, 2.35, 2.4], target: [0.35, 1.45, 0.2] },
      },
      {
        id: 'conveyor-bed',
        name: 'Indexed Roller Conveyor Line',
        shortLabel: 'Roller Conveyor',
        stageTag: 'Material Flow',
        description:
          '24-roller modular conveyor track guiding raw and inspected parts through automated cycle stations.',
        engineeringPurpose:
          'Connects discrete processing stages with buffered, low-friction WIP indexing between cell entry and outbound staging.',
        workingPrinciple:
          'Workpiece pallets travel linearly over evenly spaced steel rollers driven at constant throughput speed, buffering WIP flow into the metrology zone.',
        industrialApplication:
          'Assembly-line pacing corridors, palletized machining transfer lines, and fulfillment sortation feeds.',
        ipeConcepts: [
          'Work-in-Process (WIP) & Little’s Law',
          'Line Balancing & Buffer Sizing',
          'Supply-Material Flow Coordination',
        ],
        relatedRecords: [
          {
            label: 'FactoryMind · Production Scheduling Module',
            kind: 'Project',
            to: '/projects/factorymind',
          },
        ],
        cameraFocus: { position: [3.2, 2.1, 3.6], target: [0.85, 0.85, -0.15] },
      },
      {
        id: 'spc-portal',
        name: 'Optical SPC Inspection Portal',
        shortLabel: 'SPC Portal',
        stageTag: 'Quality Control Gate',
        description:
          'Overhead metrology arch scanning passing workpieces for dimensional tolerance and surface conformance.',
        engineeringPurpose:
          'Performs non-contact in-line quality verification at 100% inspection coverage so out-of-control shifts trigger immediate alarms before scrap accumulates.',
        workingPrinciple:
          'As indexed pallets pass under the bridge, the optical emitter projects a structured scan curtain, feeding real-time subgroup measurements to X-bar / R control charts.',
        industrialApplication:
          'Automated inline metrology gates in precision machining, electronics assembly, and Six Sigma defect prevention lines.',
        ipeConcepts: [
          'Statistical Process Control (X-bar & R Charts)',
          'Process Capability (Cp / Cpk)',
          'Zero-Defect Inline Quality Assurance',
        ],
        relatedRecords: [
          {
            label: 'FactoryMind · Live Engineering Workbench',
            kind: 'Project',
            to: '/projects/factorymind',
          },
        ],
        cameraFocus: { position: [2.9, 2.2, 2.8], target: [1.3, 1.25, -0.15] },
      },
    ],
    guidedTour: [
      {
        stepNumber: 1,
        title: 'Rigid Cell Foundation & Waist Slew',
        subsystemId: 'robot-base',
        recommendedExplode: 0,
        takeaway:
          'Station placement and pedestal geometry define reachable cell zones and keep cycle motions inside safe bounds.',
      },
      {
        stepNumber: 2,
        title: 'Synchronized Arm Kinematics & Dress Pack',
        subsystemId: 'robot-arm',
        recommendedExplode: 0.35,
        takeaway:
          'Balanced shoulder/elbow speeds control cell takt time while cable routing ensures continuous high-duty operation.',
      },
      {
        stepNumber: 3,
        title: 'Self-Centering Gripper Handoff',
        subsystemId: 'gripper-billet',
        recommendedExplode: 0.5,
        takeaway:
          'Wrist compensation keeps billets level across pick-and-place moves, demonstrating Poka-Yoke fixture alignment.',
      },
      {
        stepNumber: 4,
        title: 'Buffered WIP on the Roller Line',
        subsystemId: 'conveyor-bed',
        recommendedExplode: 0.45,
        takeaway:
          'Pallets indexed along 24 rollers regulate Work-in-Process flow and protect downstream stations from starvation.',
      },
      {
        stepNumber: 5,
        title: '100% Inline Optical SPC Gate',
        subsystemId: 'spc-portal',
        recommendedExplode: 0.3,
        takeaway:
          'Every workpiece passes the optical arch, turning physical inspection data into statistical process control charts.',
      },
    ],
    cameraPresets: {
      isometric: { position: [5.8, 3.8, 5.9], target: [0, 1.35, 0] },
      front: { position: [0, 2.1, 7.4], target: [0, 1.35, 0] },
      top: { position: [0, 8.2, 1.2], target: [0, 1.0, 0] },
      closeup: { position: [2.4, 2.25, 2.6], target: [0.35, 1.35, 0.25] },
    },
  },
  'femto-bearing': {
    id: 'femto-bearing',
    shortTitle: 'Bearing Rig',
    title: 'Prognostics Lab · FEMTO Bearing Degradation Testbed',
    projectRef: 'PRONOSTIA Vibration & Uncertainty Study',
    projectRoute: '/research/decision-aware-prognostics',
    subtitle:
      'Accelerated rolling-element bearing test bench with radial hydraulic loading, split inspection raceway, and biaxial piezoelectric vibration instrumentation.',
    conceptualNotice: CONCEPTUAL_STUDIO_DISCLAIMER,
    ipeRelevance:
      'Inspired by accelerated run-to-failure bearing testbeds (PRONOSTIA / FEMTO), this assembly bridges mechanical tribology with Industrial Engineering maintenance optimization: converting raw high-frequency vibration envelopes and confidence intervals into cost-aware replacement timing.',
    ipeDomains: [
      'Accelerated Degradation Testing',
      'Vibration Signal Processing (FFT)',
      'Decision-Aware Maintenance',
      'Epistemic Uncertainty Modeling',
    ],
    subsystems: [
      {
        id: 'drive-motor',
        name: 'VFD Drive Motor & Flexible Spider Coupling',
        shortLabel: 'VFD Motor',
        stageTag: 'Drive Train · RPM',
        description:
          'Finned induction motor coupled to a precision stepped rotor shaft via an elastomer torque-isolating jaw coupling.',
        engineeringPurpose:
          'Supplies controllable rotational shaft excitation while isolating motor electromagnetic torque ripple from the test bearing assembly.',
        workingPrinciple:
          'An elastomeric spider insert transmits shaft torque across jaw hubs while dampening parasitic misalignment vibration before it reaches the test specimen.',
        industrialApplication:
          'Variable-speed conveyor drives, industrial pumps, and accelerated endurance rigs requiring repeatable shaft speed profiles.',
        ipeConcepts: [
          'Controlled Experimental Design (DOE)',
          'Isolation of Noise Factors',
          'Rotating Drivetrain Reliability',
        ],
        relatedRecords: [
          {
            label: 'Decision-Aware Prognostics Study',
            kind: 'Research',
            to: '/research/decision-aware-prognostics',
          },
        ],
        cameraFocus: { position: [-2.8, 1.9, 2.8], target: [-0.8, 1.05, 0] },
      },
      {
        id: 'bearing-housing',
        name: 'Split Pillow-Block & 16-Ball Bearing Complement',
        shortLabel: 'Test Bearing',
        stageTag: 'Test Specimen · FEMTO',
        description:
          'Machined cutaway housing exposing the bronze outer cage and 16 orbiting chrome steel balls undergoing accelerated contact fatigue.',
        engineeringPurpose:
          'Holds the rolling-element test specimen under radial load while allowing fast cap removal to measure spalling, pitting, or cage wear.',
        workingPrinciple:
          'As the stepped inner shaft rotates, the ball complement orbits inside the raceway at epicyclic speed; surface micro-spalls generate periodic impact harmonics (BPFO/BPFI).',
        industrialApplication:
          'Gearboxes, spindle heads, wind turbine main shafts, and rolling mills where unexpected bearing seizure causes expensive downtime.',
        ipeConcepts: [
          'Failure Modes & Effects Analysis (FMEA)',
          'Rolling-Element Fault Frequencies',
          'Run-to-Failure Survival Analysis',
        ],
        relatedRecords: [
          {
            label: 'Decision-Aware Prognostics Manuscript',
            kind: 'Research',
            to: '/research/decision-aware-prognostics',
          },
          {
            label: 'Uncertainty-Aware RUL Research',
            kind: 'Research',
            to: '/research/rul-explainable',
          },
        ],
        cameraFocus: { position: [2.0, 1.65, 2.3], target: [0.32, 1.08, 0] },
      },
      {
        id: 'load-actuator',
        name: 'Radial Hydraulic Load Actuator & Gauge',
        shortLabel: 'Load Actuator',
        stageTag: 'Radial Force · kN',
        description:
          'Side-mounted pneumatic-hydraulic loading ram applying controlled radial stress with an analog calibrated pressure dial.',
        engineeringPurpose:
          'Accelerates rolling-contact fatigue predictably by applying controlled radial loading perpendicular to the shaft axis.',
        workingPrinciple:
          'Pressurized cylinder fluid advances a piston rod against the bearing housing saddle, compressing the Hertzian contact zone while the dial gauge displays manifold pressure.',
        industrialApplication:
          'Accelerated life testing (ALT) laboratories validating bearing endurance ratings under high-load industrial duty cycles.',
        ipeConcepts: [
          'Accelerated Life Testing (ALT)',
          'Stress-Life Degradation Acceleration',
          'Multi-Regime Prognostic Generalization',
        ],
        relatedRecords: [
          {
            label: 'Decision-Aware Prognostics Manuscript',
            kind: 'Research',
            to: '/research/decision-aware-prognostics',
          },
        ],
        cameraFocus: { position: [1.8, 1.9, -2.5], target: [0.32, 1.25, -0.5] },
      },
      {
        id: 'vibration-daq',
        name: 'Biaxial Piezo Accelerometers & FFT Analyzer',
        shortLabel: 'Vibration DAQ',
        stageTag: 'DAQ · High-Frequency',
        description:
          'Coaxially wired X/Y vibration transducers feeding an onboard spectral telemetry monitor for degradation envelope tracking.',
        engineeringPurpose:
          'Captures high-frequency orthogonal acceleration waveforms to detect incipient micro-cracking long before audible noise or seizure.',
        workingPrinciple:
          'Orthogonal piezoelectric crystals strain with housing acceleration and output proportional charge signals across shielded coax leads to an FFT spectral analyzer.',
        industrialApplication:
          'Automated Condition-Based Monitoring (CBM) racks in smart factories, turbines, and critical rotating assets.',
        ipeConcepts: [
          'Time-Frequency & Envelope Features',
          'Condition-Based Maintenance Triggers',
          'Asymmetric Cost of Early vs. Late Replacement',
        ],
        relatedRecords: [
          {
            label: 'Decision-Aware Prognostics Study',
            kind: 'Research',
            to: '/research/decision-aware-prognostics',
          },
        ],
        cameraFocus: { position: [2.6, 1.75, 2.2], target: [0.95, 1.2, 0.25] },
      },
    ],
    guidedTour: [
      {
        stepNumber: 1,
        title: 'Isolated Drive Torque Delivery',
        subsystemId: 'drive-motor',
        recommendedExplode: 0.35,
        takeaway:
          'Flexible coupling isolates motor harmonics so vibration data reflects true bearing health rather than drive noise.',
      },
      {
        stepNumber: 2,
        title: 'Inspecting the 16-Ball Bearing Raceway',
        subsystemId: 'bearing-housing',
        recommendedExplode: 0.65,
        takeaway:
          'Lifting the upper pillow-block cap exposes the bronze cage and orbiting steel balls where Hertzian contact fatigue initiates.',
      },
      {
        stepNumber: 3,
        title: 'Controlled Radial Stress Acceleration',
        subsystemId: 'load-actuator',
        recommendedExplode: 0.45,
        takeaway:
          'Applying radial load compresses fatigue timelines from years into experimental hours for prognostics benchmarking.',
      },
      {
        stepNumber: 4,
        title: 'Biaxial Piezo DAQ & Maintenance Decisions',
        subsystemId: 'vibration-daq',
        recommendedExplode: 0.2,
        takeaway:
          'X/Y accelerometers translate physical impacts into spectral health trajectories used to trigger cost-optimal replacements.',
      },
    ],
    cameraPresets: {
      isometric: { position: [5.2, 3.3, 5.4], target: [0, 1.05, 0] },
      front: { position: [0.2, 1.45, 6.6], target: [0, 1.0, 0] },
      top: { position: [0, 7.2, 1.1], target: [0, 0.85, 0] },
      closeup: { position: [2.1, 1.75, 2.3], target: [0.25, 0.95, 0.05] },
    },
  },
  'carbon-cnc': {
    id: 'carbon-cnc',
    shortTitle: 'Carbon CNC',
    title: 'Operations Research · Carbon-Aware 3-Axis CNC Center',
    projectRef: 'Sustainable Scheduling & Power-Aware Operations',
    projectRoute: '/projects/factorymind',
    subtitle:
      'Vertical machining center paired with a real-time grid tariff & carbon-intensity metering cabinet modeling power-aware job-shop execution.',
    conceptualNotice: CONCEPTUAL_STUDIO_DISCLAIMER,
    ipeRelevance:
      'Sustainable manufacturing requires scheduling CNC cutting passes not only for minimum makespan, but also for Time-of-Use electricity tariffs and hourly grid carbon intensity (gCO2/kWh) alongside shop-floor dispatch inside FactoryMind.',
    ipeDomains: [
      'Sustainable Manufacturing',
      'Multi-Objective Job-Shop Scheduling',
      'Time-of-Use Tariff Optimization',
      'Machining Energy Demand Modeling',
    ],
    subsystems: [
      {
        id: 'cnc-enclosure',
        name: 'Sloped Safety Enclosure & Optical Viewport',
        shortLabel: 'Safety Canopy',
        stageTag: 'Machine Guarding',
        description:
          'Chamfered steel machining hood with optical glass observation window, chip collection pan, and leveled bed.',
        engineeringPurpose:
          'Contains coolant mist, flying metal chips, and acoustic energy during cutting while giving operators unobstructed line-of-sight inspection.',
        workingPrinciple:
          'Sheet-metal side shrouds and an angled laminated safety viewport seal onto the rigid cast bed supported on four precision leveling pads.',
        industrialApplication:
          'Automated 3-axis and 5-axis vertical machining centers in aerospace, mold-making, and discrete component factories.',
        ipeConcepts: [
          'Industrial Safety & Machine Guarding',
          'Human-Machine Interface Visibility',
          'Standby vs. Active Enclosure Power States',
        ],
        relatedRecords: [
          {
            label: 'FactoryMind Operations Workbench',
            kind: 'Project',
            to: '/projects/factorymind',
          },
        ],
        cameraFocus: { position: [4.2, 2.7, 4.4], target: [-0.35, 1.4, 0] },
      },
      {
        id: 'xy-worktable',
        name: 'Precision T-Slot XY Table & Vise Fixture',
        shortLabel: 'XY Worktable',
        stageTag: 'Workholding · X/Y Axes',
        description:
          'Reciprocating T-slot machine bed with rigid precision vise clamping a brushed alloy billet during contour passes.',
        engineeringPurpose:
          'Positions raw stock smoothly under the cutter across X/Y axes while clamping workpieces rigidly against multi-directional cutting forces.',
        workingPrinciple:
          'Precision T-slots align the modular vise along machine coordinates while reciprocating feed drives move the billet under programmed toolpaths.',
        industrialApplication:
          'Flexible machining fixtures, rapid-changeover job shops, and batch fixture design.',
        ipeConcepts: [
          'Fixture Rigidity & Setup Time (SMED)',
          'Feed-Rate vs. Power Draw Trade-offs',
          'Batch Workholding Standardization',
        ],
        relatedRecords: [
          {
            label: 'FactoryMind Operations Workbench',
            kind: 'Project',
            to: '/projects/factorymind',
          },
        ],
        cameraFocus: { position: [2.1, 1.9, 2.9], target: [-0.35, 0.9, 0.25] },
      },
      {
        id: 'spindle-head',
        name: 'Vertical Z-Column & ER-32 High-Speed Spindle',
        shortLabel: 'Spindle Head',
        stageTag: 'Spindle · kW Load',
        description:
          'Twin-rail vertical column driving a high-speed spindle nose cone, multi-flute carbide endmill, and coolant nozzle.',
        engineeringPurpose:
          'Delivers rotational cutting torque and vertical Z-axis plunge control—representing the dominant active electrical power load during material removal.',
        workingPrinciple:
          'Linear guideways stabilize vertical carriage plunges while the collet-held cutter engages alloy stock under directed flood coolant lubrication.',
        industrialApplication:
          'High-speed aluminum milling, die/mold profiling, and variable-speed machining centers.',
        ipeConcepts: [
          'Machine Power States (Idle / Cutting / Rapid)',
          'Tool-Life vs. Cutting Speed Economics',
          'Peak kW Demand Suppression',
        ],
        relatedRecords: [
          {
            label: 'FactoryMind Operations Workbench',
            kind: 'Project',
            to: '/projects/factorymind',
          },
        ],
        cameraFocus: { position: [2.2, 2.05, 2.3], target: [-0.35, 1.45, -0.1] },
      },
      {
        id: 'energy-cabinet',
        name: 'Grid Tariff & Carbon-Intensity Metering Cabinet',
        shortLabel: 'Carbon Telemetry',
        stageTag: 'Tri-Objective Telemetry',
        description:
          'Armored-conduit power analyzer monitoring instantaneous kW draw against hourly electricity tariff and gCO2/kWh curves.',
        engineeringPurpose:
          'Measures machine-level active and idle electrical load so scheduling optimizers can shift heavy cuts into cleaner, lower-tariff grid hours.',
        workingPrinciple:
          'Current transformers inside the side cabinet sample power bus harmonics over the overhead conduit and visualize cost-carbon telemetry on the HMI.',
        industrialApplication:
          'ISO 50001 energy-management factories, smart microgrids, and Scope-2 carbon accounting in discrete manufacturing.',
        ipeConcepts: [
          'Tri-Objective Pareto Scheduling (Makespan / Cost / CO2)',
          'Time-of-Use Demand Shifting',
          'Smart Grid & Sustainable Operations Research',
        ],
        relatedRecords: [
          {
            label: 'FactoryMind · OEE & Power Scheduling',
            kind: 'Project',
            to: '/projects/factorymind',
          },
        ],
        cameraFocus: { position: [3.6, 2.1, 2.7], target: [1.3, 1.25, -0.1] },
      },
    ],
    guidedTour: [
      {
        stepNumber: 1,
        title: 'Machine Enclosure & Clean Observation',
        subsystemId: 'cnc-enclosure',
        recommendedExplode: 0.48,
        takeaway:
          'Raising the outer canopy separates structural guarding from internal X/Y/Z axes, revealing energy-consuming subsystems.',
      },
      {
        stepNumber: 2,
        title: 'Workholding & XY Feed Motion',
        subsystemId: 'xy-worktable',
        recommendedExplode: 0.55,
        takeaway:
          'Table feed acceleration and clamping setup determine non-cutting idle windows where machines still consume standby power.',
      },
      {
        stepNumber: 3,
        title: 'Spindle Plunge — Primary kW Demand Driver',
        subsystemId: 'spindle-head',
        recommendedExplode: 0.55,
        takeaway:
          'High-load roughing cuts spike instantaneous kW draw—making operation timing critical under dynamic electricity tariffs.',
      },
      {
        stepNumber: 4,
        title: 'Closing the Loop with Carbon Telemetry',
        subsystemId: 'energy-cabinet',
        recommendedExplode: 0.25,
        takeaway:
          'Live grid intensity and tariff monitoring lets job-shop schedulers trade off makespan, energy cost, and Scope-2 emissions.',
      },
    ],
    cameraPresets: {
      isometric: { position: [5.9, 3.6, 5.9], target: [0, 1.35, 0] },
      front: { position: [0, 1.85, 7.4], target: [0, 1.35, 0] },
      top: { position: [0, 8.2, 1.4], target: [0, 1.1, 0] },
      closeup: { position: [2.5, 2.1, 2.9], target: [-0.15, 1.25, 0.15] },
    },
  },
  'supply-asrs': {
    id: 'supply-asrs',
    shortTitle: 'AS/RS Bay',
    title: 'Operations Research · Automated AS/RS Bay',
    projectRef: 'Inventory Flow & Replenishment Modeling',
    projectRoute: '/research/decision-centric-demand',
    subtitle:
      'High-density multi-tier storage rack and rail-guided shuttle crane demonstrating unit-load retrieval kinematics and warehouse buffer allocation.',
    conceptualNotice: CONCEPTUAL_STUDIO_DISCLAIMER,
    ipeRelevance:
      'Automated Storage & Retrieval Systems sit at the intersection of Facilities Planning, Warehousing, and Supply Chain Operations Research. Better demand forecasting is only valuable when translated into downstream inventory replenishment, slot allocation, and aisle shuttle cycle dispatch.',
    ipeDomains: [
      'Warehouse Slotting & Storage Policy',
      'Decision-Centric Inventory Control',
      'Single- & Dual-Command AS/RS Cycles',
      'Facilities Layout & Material Flow',
    ],
    subsystems: [
      {
        id: 'rack-frame',
        name: 'Structural Steel Racking Bay',
        shortLabel: 'Rack Matrix',
        stageTag: '3-Tier Matrix',
        description:
          'Braced vertical steel uprights and cross-beams forming a 3x5 high-density unit-load storage grid.',
        engineeringPurpose:
          'Maximizes volumetric cube utilization inside warehouse bays by stacking standardized storage tiers tightly along vertical frames.',
        workingPrinciple:
          'Five upright frame columns transfer pallet dead-weight directly to the slab while horizontal load beams create discrete address coordinates for automated retrieval.',
        industrialApplication:
          'Cold-chain distribution hubs, e-commerce fulfillment centers, and high-bay WIP supermarkets adjacent to assembly plants.',
        ipeConcepts: [
          'Cube Utilization & Vertical Warehousing',
          'Dedicated vs. Class-Based (ABC) Storage',
          'Rack Bay Addressing',
        ],
        relatedRecords: [
          {
            label: 'Decision-Centric Demand Forecasting Manuscript',
            kind: 'Research',
            to: '/research/decision-centric-demand',
          },
        ],
        cameraFocus: { position: [4.8, 3.0, 4.2], target: [0, 1.5, -0.78] },
      },
      {
        id: 'pallet-bins',
        name: 'Unit-Load Tote Inventory',
        shortLabel: 'Unit-Load Totes',
        stageTag: 'Buffer Slots',
        description:
          'Instanced modular industrial totes arranged across rack levels with distinct batch color coding.',
        engineeringPurpose:
          'Standardizes heterogeneous SKU quantities into uniform unit loads so shuttle forks handle every slot reliably without manual repacking.',
        workingPrinciple:
          'Color-coded tote batches occupy indexed bay cells; fast-moving SKUs cluster near the staging dock to shorten average retrieval travel distance.',
        industrialApplication:
          'Kitting supermarkets, pharmacy auto-dispensaries, and parts distribution buffers.',
        ipeConcepts: [
          'Safety Stock & Replenishment Decisions',
          'Turnover-Based Slotting (COI Index)',
          'Newsvendor / Inventory Cost Asymmetry',
        ],
        relatedRecords: [
          {
            label: 'Decision-Centric Demand Study',
            kind: 'Research',
            to: '/research/decision-centric-demand',
          },
        ],
        cameraFocus: { position: [3.6, 2.2, 3.8], target: [0, 1.4, -0.65] },
      },
      {
        id: 'shuttle-crane',
        name: 'Rail-Guided AS/RS Shuttle',
        shortLabel: 'Shuttle Crane',
        stageTag: 'Automated Retrieval',
        description:
          'Dual-rail floor shuttle carrying a telescoping vertical mast and load carriage along the retrieval aisle.',
        engineeringPurpose:
          'Executes simultaneous horizontal aisle travel and vertical hoist elevation to store or retrieve unit loads rapidly in narrow aisles.',
        workingPrinciple:
          'Chebyshev (max-of-X-and-Y) dual-axis motion drives the bogie along steel guide rails while the fork tray positions the active cargo tote at target rack elevation.',
        industrialApplication:
          'Unit-load stacker cranes, mini-load tote AS/RS aisles, and lights-out automated buffer warehouses.',
        ipeConcepts: [
          'Chebyshev Travel-Time Modeling',
          'Dual-Command Sequencing (Store + Retrieve)',
          'Warehouse Throughput Bottleneck Analysis',
        ],
        relatedRecords: [
          {
            label: 'Decision-Centric Demand & Replenishment Study',
            kind: 'Research',
            to: '/research/decision-centric-demand',
          },
          {
            label: 'FactoryMind · Supply Chain Concepts',
            kind: 'Project',
            to: '/projects/factorymind',
          },
        ],
        cameraFocus: { position: [3.2, 2.3, 3.5], target: [0, 1.5, 0.72] },
      },
      {
        id: 'transfer-dock',
        name: 'Staging Dock & Safety Gantry',
        shortLabel: 'Staging Dock',
        stageTag: 'I/O Interface',
        description:
          'Floor guide rails, end-stop buffers, and top cable gantry aligning inbound/outbound material handoff.',
        engineeringPurpose:
          'Provides precise rail guidance, over-travel protection, and stabilized overhead guidance across the entire aisle stroke.',
        workingPrinciple:
          'Dual bottom rails constrain lateral bogie wander while the overhead box gantry guides the upper crane mast during rapid deceleration.',
        industrialApplication:
          'AS/RS I/O pickup/deposit stations, AGV docks, and automated plant logistics corridors.',
        ipeConcepts: [
          'Pickup & Deposit (P/D) Point Placement',
          'Material Handling System Interfaces',
          'Queueing & Dispatch Coordination',
        ],
        relatedRecords: [
          {
            label: 'Decision-Centric Demand Study',
            kind: 'Research',
            to: '/research/decision-centric-demand',
          },
        ],
        cameraFocus: { position: [4.0, 2.0, 4.4], target: [0, 1.0, 0.75] },
      },
    ],
    guidedTour: [
      {
        stepNumber: 1,
        title: 'High-Density Cube Architecture',
        subsystemId: 'rack-frame',
        recommendedExplode: 0,
        takeaway:
          'Multi-tier racking maximizes warehouse floor productivity by indexing buffer capacity vertically along narrow aisles.',
      },
      {
        stepNumber: 2,
        title: 'Decision-Centric Inventory Allocation',
        subsystemId: 'pallet-bins',
        recommendedExplode: 0.45,
        takeaway:
          'Separating the tote array illustrates ABC slotting and replenishment buffers calibrated against asymmetric stockout costs.',
      },
      {
        stepNumber: 3,
        title: 'Dual-Axis Shuttle Cycle Kinematics',
        subsystemId: 'shuttle-crane',
        recommendedExplode: 0.5,
        takeaway:
          'Simultaneous aisle traversal and vertical lifting govern single- and dual-command retrieval cycle times.',
      },
      {
        stepNumber: 4,
        title: 'P/D Interface & Track Stabilization',
        subsystemId: 'transfer-dock',
        recommendedExplode: 0.2,
        takeaway:
          'Floor guide rails and overhead gantry alignment anchor reliable P/D handoffs between racks and shop-floor transport.',
      },
    ],
    cameraPresets: {
      isometric: { position: [6.4, 3.9, 6.2], target: [0, 1.55, 0] },
      front: { position: [0, 2.0, 8.1], target: [0, 1.55, 0] },
      top: { position: [0, 8.8, 1.8], target: [0, 1.3, 0] },
      closeup: { position: [2.8, 2.2, 2.9], target: [0, 1.4, 0.7] },
    },
  },
};

export const STUDIO_MODEL_ORDER: StudioModelId[] = [
  'forgemind-turbofan',
  'factorymind-cell',
  'femto-bearing',
  'carbon-cnc',
  'supply-asrs',
];

export const MATERIAL_FINISHES: Record<MaterialFinishId, MaterialFinishSpec> = {
  titanium: {
    id: 'titanium',
    label: 'Titanium',
    swatchHex: '#cbd5e1',
    primaryHex: 0xcbd5e1,
    secondaryHex: 0x334155,
    metalness: 0.9,
    roughness: 0.24,
    clearcoat: 0.2,
  },
  cobalt: {
    id: 'cobalt',
    label: 'Cobalt',
    swatchHex: '#2563eb',
    primaryHex: 0x2563eb,
    secondaryHex: 0x1e293b,
    metalness: 0.82,
    roughness: 0.22,
    clearcoat: 0.65,
  },
  bronze: {
    id: 'bronze',
    label: 'Bronze',
    swatchHex: '#d97706',
    primaryHex: 0xd97706,
    secondaryHex: 0x292524,
    metalness: 0.88,
    roughness: 0.26,
    clearcoat: 0.35,
  },
  graphite: {
    id: 'graphite',
    label: 'Graphite',
    swatchHex: '#475569',
    primaryHex: 0x334155,
    secondaryHex: 0x0f172a,
    metalness: 0.48,
    roughness: 0.56,
    clearcoat: 0.1,
  },
};

export const MATERIAL_FINISH_ORDER: MaterialFinishId[] = [
  'titanium',
  'cobalt',
  'bronze',
  'graphite',
];

export interface LightingSpec {
  id: LightingPresetId;
  label: string;
}

export const LIGHTING_PRESETS: LightingSpec[] = [
  { id: 'dark-lab', label: 'Studio Rig' },
  { id: 'daylight', label: 'Daylight' },
  { id: 'thermal', label: 'Thermal Core' },
];

export function dampScalar(
  current: number,
  target: number,
  lambda: number,
  dt: number,
): number {
  const safeDt = Math.max(0, Math.min(dt, 0.25));
  const factor = 1 - Math.exp(-lambda * safeDt);
  return current + (target - current) * factor;
}

export function clampExplodeAmount(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function computeExplodedCoordinate(
  baseCoord: number,
  axisOffset: number,
  explodeProgress: number,
): number {
  return baseCoord + axisOffset * clampExplodeAmount(explodeProgress);
}

export function findSubsystemMeta(
  modelId: StudioModelId,
  subsystemId: string | null,
): SubsystemMeta | null {
  if (!subsystemId) return null;
  const spec = STUDIO_MODELS[modelId];
  return spec.subsystems.find((item) => item.id === subsystemId) ?? null;
}

export function getAdjacentStudioModel(
  currentId: StudioModelId,
  direction: 'prev' | 'next',
): StudioModelId {
  const idx = STUDIO_MODEL_ORDER.indexOf(currentId);
  const safeIdx = idx === -1 ? 0 : idx;
  const offset = direction === 'next' ? 1 : -1;
  const nextIdx =
    (safeIdx + offset + STUDIO_MODEL_ORDER.length) % STUDIO_MODEL_ORDER.length;
  return STUDIO_MODEL_ORDER[nextIdx];
}

export function resolveWalkthroughStep(
  modelId: StudioModelId,
  requestedIndex: number,
): {
  stepIndex: number;
  totalSteps: number;
  step: GuidedTourStep;
  subsystem: SubsystemMeta;
} {
  const spec = STUDIO_MODELS[modelId];
  const totalSteps = spec.guidedTour.length;
  const normalized = Number.isFinite(requestedIndex)
    ? ((Math.trunc(requestedIndex) % totalSteps) + totalSteps) % totalSteps
    : 0;
  const step = spec.guidedTour[normalized];
  const subsystem =
    findSubsystemMeta(modelId, step.subsystemId) ?? spec.subsystems[0];
  return {
    stepIndex: normalized,
    totalSteps,
    step,
    subsystem,
  };
}

export function projectNdcPointToViewport(
  ndcX: number,
  ndcY: number,
  ndcZ: number,
  width: number,
  height: number,
): { x: number; y: number; visible: boolean } {
  if (
    !Number.isFinite(ndcX) ||
    !Number.isFinite(ndcY) ||
    !Number.isFinite(ndcZ) ||
    width <= 0 ||
    height <= 0
  ) {
    return { x: 0, y: 0, visible: false };
  }
  // Behind camera or beyond clip plane
  if (ndcZ < -1 || ndcZ > 1 || Math.abs(ndcX) > 1.05 || Math.abs(ndcY) > 1.05) {
    return { x: 0, y: 0, visible: false };
  }
  const rawX = ((ndcX + 1) * 0.5) * width;
  const rawY = ((-ndcY + 1) * 0.5) * height;
  const padX = Math.min(84, width * 0.14);
  const padTop = Math.min(138, Math.max(92, height * 0.18));
  const padBottom = Math.min(148, Math.max(96, height * 0.22));
  const clampedX = Math.max(padX, Math.min(width - padX, rawX));
  const clampedY = Math.max(padTop, Math.min(height - padBottom, rawY));
  return {
    x: Math.round(clampedX * 10) / 10,
    y: Math.round(clampedY * 10) / 10,
    visible: true,
  };
}

export function resolveStudioModelId(raw: string | null | undefined): StudioModelId {
  if (
    raw === 'forgemind-turbofan' ||
    raw === 'factorymind-cell' ||
    raw === 'femto-bearing' ||
    raw === 'carbon-cnc' ||
    raw === 'supply-asrs'
  ) {
    return raw;
  }
  if (raw === 'factorymind') return 'factorymind-cell';
  if (raw === 'forgemind-ai' || raw === 'rul-explainable') {
    return 'forgemind-turbofan';
  }
  if (raw === 'decision-aware-prognostics') return 'femto-bearing';
  if (raw === 'carbon-aware-jss') return 'carbon-cnc';
  if (raw === 'decision-centric-demand') return 'supply-asrs';
  return 'forgemind-turbofan';
}

export interface NormalizedTransform {
  scale: number;
  position: [number, number, number];
}

export function computeModelNormalizeTransform(
  size: { x: number; y: number; z: number },
  center: { x: number; y: number; z: number },
  minY: number,
  targetMaxSpan = 3.2,
): NormalizedTransform {
  const maxSpan = Math.max(size.x, size.y, size.z, 0.0001);
  const scale = targetMaxSpan / maxSpan;
  const posX = -center.x * scale || 0;
  const posY = -minY * scale || 0;
  const posZ = -center.z * scale || 0;
  return {
    scale,
    position: [posX, posY, posZ],
  };
}
