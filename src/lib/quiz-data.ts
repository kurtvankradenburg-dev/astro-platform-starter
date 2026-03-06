export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    topic: string;
}

export const QUIZ_TOPICS = [
    "Human Anatomy",
    "Muscle Physiology",
    "Biomechanics",
    "Exercise Science",
    "Nervous System & Motor Unit Recruitment",
    "Recovery & Adaptation",
] as const;

export const STATIC_QUESTIONS: QuizQuestion[] = [
    {
        topic: "Muscle Physiology",
        question: "During muscle contraction, calcium ions (Ca²⁺) are released from which organelle?",
        options: [
            "Mitochondria",
            "Sarcoplasmic reticulum",
            "Golgi apparatus",
            "Rough endoplasmic reticulum",
        ],
        correctIndex: 1,
        explanation: "When an action potential reaches the T-tubules, it triggers the release of Ca²⁺ from the sarcoplasmic reticulum (SR) via ryanodine receptors. These calcium ions bind to troponin C on the thin filament, causing a conformational change in the troponin-tropomyosin complex that exposes myosin-binding sites on actin, enabling cross-bridge cycling and muscle contraction.",
    },
    {
        topic: "Nervous System & Motor Unit Recruitment",
        question: "According to Henneman's Size Principle, motor units are recruited in which order?",
        options: [
            "Largest to smallest",
            "Randomly based on muscle fiber type",
            "Smallest to largest (by motoneuron size)",
            "Alternating between fast and slow motor units",
        ],
        correctIndex: 2,
        explanation: "Henneman's Size Principle states that motor units are recruited in order from smallest to largest based on the size of the alpha motoneuron. Smaller motoneurons have lower recruitment thresholds and innervate Type I (slow-twitch) fibers. As force demand increases, larger motoneurons with higher thresholds are recruited, activating Type IIa and then Type IIx (fast-twitch) fibers. This orderly recruitment optimizes metabolic efficiency and allows for smooth force gradation.",
    },
    {
        topic: "Biomechanics",
        question: "In a bicep curl, the elbow joint acts as which class of lever?",
        options: [
            "First-class lever (fulcrum between effort and load)",
            "Second-class lever (load between fulcrum and effort)",
            "Third-class lever (effort between fulcrum and load)",
            "It alternates between classes during the movement",
        ],
        correctIndex: 2,
        explanation: "The elbow during a bicep curl functions as a third-class lever: the fulcrum is the elbow joint, the effort (biceps insertion on the radial tuberosity) is between the fulcrum and the load (weight in hand). Third-class levers sacrifice mechanical advantage for increased speed and range of motion—the biceps must generate force greater than the load because its moment arm (~4-5 cm) is much shorter than the resistance moment arm (~35 cm to the hand).",
    },
    {
        topic: "Exercise Science",
        question: "What is the primary mechanism by which mechanical tension drives muscle hypertrophy?",
        options: [
            "Increased blood flow and nutrient delivery",
            "Mechanotransduction activating mTOR signaling pathway",
            "Direct damage to satellite cells",
            "Accumulation of metabolic byproducts",
        ],
        correctIndex: 1,
        explanation: "Mechanical tension is considered the primary driver of muscle hypertrophy (Schoenfeld, 2010). When muscle fibers are subjected to mechanical tension, mechanosensors (integrins, costameres) detect the mechanical stimulus and convert it into biochemical signals—a process called mechanotransduction. This activates the mTOR (mechanistic target of rapamycin) signaling pathway, which upregulates muscle protein synthesis (MPS) and promotes hypertrophic adaptation.",
    },
    {
        topic: "Human Anatomy",
        question: "The rotator cuff consists of four muscles. Which of the following is NOT a rotator cuff muscle?",
        options: [
            "Supraspinatus",
            "Infraspinatus",
            "Teres major",
            "Subscapularis",
        ],
        correctIndex: 2,
        explanation: "The four rotator cuff muscles are: Supraspinatus (initiates abduction), Infraspinatus (external rotation), Teres minor (external rotation and adduction), and Subscapularis (internal rotation). Teres major, while located nearby, is NOT part of the rotator cuff. It originates from the inferior angle of the scapula and inserts on the medial lip of the bicipital groove, functioning primarily as a shoulder adductor, medial rotator, and extensor.",
    },
    {
        topic: "Recovery & Adaptation",
        question: "During which sleep stage is growth hormone (GH) secretion at its highest?",
        options: [
            "REM (rapid eye movement) sleep",
            "N1 (light sleep transition)",
            "N2 (sleep spindle stage)",
            "N3 (slow-wave sleep / deep sleep)",
        ],
        correctIndex: 3,
        explanation: "The largest pulse of growth hormone (GH) secretion occurs during N3 sleep, also known as slow-wave sleep (SWS) or deep sleep. Approximately 70% of daily GH secretion occurs during sleep, with the greatest pulse in the first N3 cycle of the night. GH is critical for muscle protein synthesis, tissue repair, and recovery. This is why sleep quality and duration (7-9 hours) are essential for training adaptation and recovery.",
    },
    {
        topic: "Biomechanics",
        question: "Which exercise best targets the long head of the triceps due to its moment arm at the shoulder?",
        options: [
            "Close-grip bench press",
            "Overhead triceps extension",
            "Triceps kickback",
            "Diamond push-up",
        ],
        correctIndex: 1,
        explanation: "The long head of the triceps is unique because it crosses both the elbow AND shoulder joints (origin: infraglenoid tubercle of the scapula). It functions in both elbow extension and shoulder extension. Overhead triceps extensions place the shoulder in flexion, which stretches the long head and places it at a mechanical advantage—the long head's moment arm for elbow extension is maximized when the shoulder is flexed. Research shows greater long head EMG activation in overhead positions compared to neutral positions.",
    },
    {
        topic: "Muscle Physiology",
        question: "What primarily determines whether a muscle fiber is classified as Type I or Type II?",
        options: [
            "The muscle's location in the body",
            "The type of myosin heavy chain (MHC) isoform expressed",
            "The number of mitochondria per fiber",
            "The blood supply to the muscle",
        ],
        correctIndex: 1,
        explanation: "Muscle fiber type classification is primarily determined by the myosin heavy chain (MHC) isoform expressed. Type I fibers express MHC-I (slow isoform), Type IIa express MHC-IIa, and Type IIx express MHC-IIx (fastest isoform). The MHC isoform determines the ATPase activity rate, which directly affects contraction velocity. While mitochondrial density, capillary supply, and metabolic enzyme profiles differ between fiber types, these are secondary characteristics that correlate with—but don't define—the fiber type.",
    },
    {
        topic: "Exercise Science",
        question: "Why is a 2-3 minute rest interval recommended between heavy compound sets for strength development?",
        options: [
            "To allow complete muscle glycogen resynthesis",
            "To allow phosphocreatine (PCr) resynthesis and neural recovery",
            "To prevent excessive muscle damage",
            "To maximize metabolic stress accumulation",
        ],
        correctIndex: 1,
        explanation: "For heavy compound lifts targeting strength (>85% 1RM), 2-3 minute rest intervals are recommended to allow adequate phosphocreatine (PCr) resynthesis (~85-95% recovery in 3 minutes) and neural recovery. The phosphagen system (ATP-PCr) is the primary energy system for high-intensity, short-duration efforts. Insufficient rest leads to premature fatigue, reduced force output, and compromised motor unit recruitment. Research by de Salles et al. (2009) and Schoenfeld et al. (2016) supports longer rest periods for strength and hypertrophy outcomes.",
    },
    {
        topic: "Nervous System & Motor Unit Recruitment",
        question: "Rate coding refers to:",
        options: [
            "The speed at which nerve impulses travel along axons",
            "The frequency of action potentials sent to a motor unit to increase force",
            "The rate at which new motor units are created through training",
            "The coding system used to classify different nerve fiber types",
        ],
        correctIndex: 1,
        explanation: "Rate coding is a mechanism for increasing muscle force output by modulating the frequency of action potentials (firing rate) sent to already-recruited motor units. At low firing rates, individual twitches are separated; as firing rate increases, twitches summate (temporal summation) until reaching tetanus—a fused, maximal contraction. Rate coding works alongside recruitment (adding new motor units) to control force. In smaller muscles (hand), rate coding is dominant; in larger muscles (quadriceps), recruitment plays a proportionally larger role.",
    },
    {
        topic: "Human Anatomy",
        question: "Which muscle fiber orientation allows for the greatest force production?",
        options: [
            "Parallel (fusiform) fibers",
            "Pennate fibers",
            "Circular fibers",
            "Convergent fibers",
        ],
        correctIndex: 1,
        explanation: "Pennate muscles (unipennate, bipennate, multipennate) can generate greater force than parallel-fibered muscles of the same volume because pennation allows more muscle fibers to be packed into a given cross-sectional area—increasing the physiological cross-sectional area (PCSA). While individual pennate fibers produce less force (due to the angle of pull), the total force is greater due to more fibers acting in parallel. The trade-off is reduced range of motion and contraction velocity. Examples: rectus femoris (bipennate), deltoid (multipennate).",
    },
    {
        topic: "Recovery & Adaptation",
        question: "The repeated bout effect refers to:",
        options: [
            "Muscles getting weaker with repeated training sessions",
            "Reduced muscle damage response after initial exposure to a novel stimulus",
            "The need to constantly vary exercises to prevent adaptation",
            "The accumulative fatigue from successive training sessions",
        ],
        correctIndex: 1,
        explanation: "The repeated bout effect (RBE) describes the phenomenon where muscles exhibit a reduced damage response, less soreness (DOMS), and faster recovery when exposed to the same eccentric exercise stimulus a second time. The mechanisms include neural adaptations (improved motor unit coordination), mechanical adaptations (increased sarcomere number, remodeled connective tissue), and cellular adaptations (strengthened cytoskeleton, heat shock proteins). The RBE is a key reason why progressive overload and periodization are necessary for continued adaptation.",
    },
];
