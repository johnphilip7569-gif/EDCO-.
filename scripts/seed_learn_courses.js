const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

let dbUrl = '';
try {
  const envText = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
  for (const line of envText.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=')) {
      dbUrl = trimmed.substring('DATABASE_URL='.length).trim().replace(/^["']|["']$/g, '');
    }
  }
} catch (e) {
  console.log('Could not read .env.local, using fallback');
}

if (!dbUrl) {
  dbUrl = 'postgres://postgres.wgyscapdywroefsjenno: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@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres';
}

console.log('Pooler configured:', dbUrl.split('@')[1]);

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

const COURSES_CATALOG = [
  // 1. Tech & AI
  {
    slug: 'fullstack-nextjs-typescript',
    title: 'Full-Stack Next.js 14 & TypeScript Engineering',
    tagline: 'Master modern server-driven web architecture, Server Components, PostgreSQL, and scalable production deployment.',
    category: 'Tech & AI',
    level: 'Intermediate',
    duration_weeks: 8,
    skills: ['Next.js 14 App Router', 'TypeScript', 'Server Actions', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    icon_name: 'Layers',
    display_order: 1,
    roadmap: [
      {
        phase: 'Phase 1: Foundations & Architecture',
        duration: 'Weeks 1-2',
        milestones: [
          { id: 'fs-1', title: 'React 18 Concurrency & Server Components (RSC)', details: 'Understand server vs client boundary, hydration, and streaming with Suspense.' },
          { id: 'fs-2', title: 'Type-Safe Data Contracts with TypeScript', details: 'Generic constraints, Zod schema validation, and end-to-end API type guarantees.' }
        ]
      },
      {
        phase: 'Phase 2: Database & Backend Services',
        duration: 'Weeks 3-4',
        milestones: [
          { id: 'fs-3', title: 'PostgreSQL Relational Modeling & Indexing', details: 'Design normalized schemas, foreign key constraints, connection pooling, and EXPLAIN plans.' },
          { id: 'fs-4', title: 'Server Actions & Secure Mutations', details: 'Mutate data without separate API routes, handle CSRF protection, and optimistic UI updates.' }
        ]
      },
      {
        phase: 'Phase 3: Production Engineering & Cloud',
        duration: 'Weeks 5-8',
        milestones: [
          { id: 'fs-5', title: 'Edge Middleware, Auth & Session Cookies', details: 'JWT verification, stateless session management, and role-based access control (RBAC).' },
          { id: 'fs-6', title: 'Containerization & CI/CD Pipeline', details: 'Multi-stage Docker builds, Kubernetes manifests, and zero-downtime deployment.' }
        ]
      }
    ],
    resources: [
      { title: 'Official Next.js 14 Documentation', type: 'Docs', url: 'https://nextjs.org/docs', desc: 'Authoritative App Router and Server Actions reference.' },
      { title: 'TypeScript Deep Dive & Handbook', type: 'Cheatsheet', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', desc: 'Comprehensive typing patterns and utility types.' },
      { title: 'PostgreSQL High Performance Manual', type: 'Article', url: 'https://www.postgresql.org/docs/current/performance-tips.html', desc: 'Query planning, indexing strategies, and pool optimization.' }
    ],
    quiz_spec: {
      passing_score: 75,
      questions: [
        {
          id: 'q1',
          question: 'What is the primary architectural benefit of React Server Components (RSC) in Next.js 14?',
          options: [
            'They eliminate the need for any CSS styling in the project.',
            'They reduce clientside JavaScript bundle size by rendering solely on the server.',
            'They automatically convert all SQL queries into GraphQL schemas.',
            'They force all components to run on the browser window object.'
          ],
          correct_index: 1,
          explanation: 'React Server Components execute strictly on the server and do not ship their component code or dependencies to the client browser bundle, dramatically reducing initial bundle size.'
        },
        {
          id: 'q2',
          question: 'When using Server Actions in Next.js 14, which directive is required at the top of the function or file?',
          options: [
            '"use client"',
            '"use server"',
            '"use backend"',
            '"use mutation"'
          ],
          correct_index: 1,
          explanation: 'The "use server" directive marks an async function or module as a callable Server Action accessible from client or server components.'
        },
        {
          id: 'q3',
          question: 'Why is connection pooling essential when connecting serverless Next.js functions to PostgreSQL?',
          options: [
            'Because serverless instances create ephemeral connections that can rapidly exhaust PostgreSQL max_connections.',
            'Because PostgreSQL does not support TCP/IP connections directly.',
            'Because connection poolers automatically compress SQL statements into gzip format.',
            'Because connection poolers replace all primary key indexes.'
          ],
          correct_index: 0,
          explanation: 'Serverless functions spin up dynamically and open individual database connections. Without a connection pooler (like PgBouncer or Supabase Pooler), PostgreSQL can easily hit its maximum connection limit and drop queries.'
        },
        {
          id: 'q4',
          question: 'Which HTTP header is standard for protecting against Cross-Site Request Forgery (CSRF) in modern web APIs?',
          options: [
            'X-Frame-Options',
            'SameSite cookie attribute and Origin verification',
            'X-Powered-By',
            'Accept-Encoding'
          ],
          correct_index: 1,
          explanation: 'Using the SameSite=Lax/Strict cookie attribute combined with server-side Origin / Referer header validation provides robust protection against CSRF.'
        }
      ]
    }
  },

  // 2. Data & AI
  {
    slug: 'machine-learning-ai-systems',
    title: 'Machine Learning & AI Systems Engineering',
    tagline: 'Architect end-to-end ML pipelines, retrieval-augmented generation (RAG), vector embeddings, and LLM evaluation.',
    category: 'Tech & AI',
    level: 'Advanced',
    duration_weeks: 10,
    skills: ['Python', 'PyTorch', 'Vector Databases', 'RAG Pipelines', 'LangChain / LlamaIndex', 'Model Evaluation'],
    icon_name: 'Cpu',
    display_order: 2,
    roadmap: [
      {
        phase: 'Phase 1: Deep Learning & Representation',
        duration: 'Weeks 1-3',
        milestones: [
          { id: 'ai-1', title: 'Embeddings & High-Dimensional Vector Spaces', details: 'Dense vectors, cosine similarity, HNSW indexing, and chunking trade-offs.' },
          { id: 'ai-2', title: 'Transformer Architecture & Attention Mechanisms', details: 'Multi-head self-attention, positional encoding, and KV cache mechanics.' }
        ]
      },
      {
        phase: 'Phase 2: RAG & Knowledge Systems',
        duration: 'Weeks 4-7',
        milestones: [
          { id: 'ai-3', title: 'Hybrid Retrieval (Dense + BM25 Lexical)', details: 'Combine semantic vector search with keyword matching and reciprocal rank fusion (RRF).' },
          { id: 'ai-4', title: 'Hallucination Mitigation & Grounding', details: 'Context window management, citation verification, and Aegis Sentinel prompt security.' }
        ]
      },
      {
        phase: 'Phase 3: Production LLM Evaluation',
        duration: 'Weeks 8-10',
        milestones: [
          { id: 'ai-5', title: 'RAG Triad & Synthetic Benchmarks', details: 'Context relevance, groundedness, and answer relevance automated scoring.' },
          { id: 'ai-6', title: 'Latency, Quantization & Edge Deployment', details: 'vLLM, Ollama, INT4/INT8 quantization, and token streaming optimizations.' }
        ]
      }
    ],
    resources: [
      { title: 'Attention Is All You Need (Vaswani et al.)', type: 'Article', url: 'https://arxiv.org/abs/1706.03762', desc: 'The seminal foundation paper on transformer architectures.' },
      { title: 'Vector Database & Embedding Cheatsheet', type: 'Cheatsheet', url: 'https://pgvector.org', desc: 'pgvector syntax, cosine distance, and IVFFlat vs HNSW indexing.' },
      { title: 'RAG Triad Evaluation Guide', type: 'Docs', url: 'https://docs.ragas.io', desc: 'Metrics for evaluating retrieval precision and factual faithfulness.' }
    ],
    quiz_spec: {
      passing_score: 75,
      questions: [
        {
          id: 'q1',
          question: 'What is the mathematical purpose of Cosine Similarity when comparing text embeddings?',
          options: [
            'It measures the geometric angle between two vector directions regardless of their magnitudes.',
            'It calculates the Euclidean distance in miles between data centers.',
            'It measures the frequency of punctuation characters in a sentence.',
            'It counts how many syllables exist in the prompt.'
          ],
          correct_index: 0,
          explanation: 'Cosine similarity measures the cosine of the angle between two multi-dimensional vectors, evaluating semantic alignment independently of vector magnitude.'
        },
        {
          id: 'q2',
          question: 'In a modern RAG system, what does Reciprocal Rank Fusion (RRF) do?',
          options: [
            'It randomly shuffles search results to reduce bias.',
            'It combines ranked results from multiple search methods (e.g., dense vector + BM25 keyword) into a single unified ranking score.',
            'It encrypts documents before sending them to the LLM.',
            'It compresses image files into JPEG format.'
          ],
          correct_index: 1,
          explanation: 'RRF is an algorithm that combines the rank positions from diverse retrieval passes (such as semantic embeddings and BM25 lexical search) to produce a superior combined result set.'
        },
        {
          id: 'q3',
          question: 'Which of the following describes the KV (Key-Value) Cache in LLM inference?',
          options: [
            'A Redis instance used for website session authentication.',
            'Caching previously computed key and value tensors so subsequent tokens do not recompute past attention weights.',
            'A disk-based cache for storing raw training datasets.',
            'A browser cookie used for user preferences.'
          ],
          correct_index: 1,
          explanation: 'The KV cache retains the intermediate key and value matrices calculated during auto-regressive generation, preventing the model from re-evaluating preceding prompt tokens on every generated token.'
        },
        {
          id: 'q4',
          question: 'What is the primary risk addressed by Prompt Injection defenses like Aegis Sentinel?',
          options: [
            'Preventing malicious user prompts from overriding system instructions and exfiltrating private context or tools.',
            'Speeding up GPU hardware clock rates.',
            'Compressing JSON responses to gzip.',
            'Fixing CSS layout rendering glitches.'
          ],
          correct_index: 0,
          explanation: 'Prompt injection occurs when an untrusted user input tricks the LLM into discarding its system prompt, executing unauthorized commands, or revealing confidential data.'
        }
      ]
    }
  },

  // 3. Computer Science & Algorithms
  {
    slug: 'advanced-data-structures-algorithms',
    title: 'Advanced Data Structures & Algorithm Mastery',
    tagline: 'Master technical problem solving, graph algorithms, dynamic programming, and asymptotic computational complexity.',
    category: 'Computer Science',
    level: 'Advanced',
    duration_weeks: 10,
    skills: ['Dynamic Programming', 'Graph Theory', 'Trees & Tries', 'Bit Manipulation', 'Time & Space Complexity', 'System Optimization'],
    icon_name: 'Binary',
    display_order: 3,
    roadmap: [
      {
        phase: 'Phase 1: Linear & Hierarchical Structures',
        duration: 'Weeks 1-3',
        milestones: [
          { id: 'dsa-1', title: 'Bit Manipulation & Two-Pointer Mechanics', details: 'Bitwise masking, sliding window optimization, and cycle detection.' },
          { id: 'dsa-2', title: 'Binary Search Trees & AVL/Red-Black Balancing', details: 'Tree traversals, invariant preservation, and logarithmic guarantees.' }
        ]
      },
      {
        phase: 'Phase 2: Graph Theory & Shortest Path',
        duration: 'Weeks 4-6',
        milestones: [
          { id: 'dsa-3', title: 'BFS, DFS & Topological Sorting', details: 'Dependency graphs, cycle detection in DAGs, and connected components.' },
          { id: 'dsa-4', title: 'Dijkstra, Bellman-Ford & A* Pathfinding', details: 'Priority queues, edge relaxations, and heuristic shortest path algorithms.' }
        ]
      },
      {
        phase: 'Phase 3: Dynamic Programming & Hard Optimization',
        duration: 'Weeks 7-10',
        milestones: [
          { id: 'dsa-5', title: 'Memoization vs Tabulation Paradigms', details: 'Subproblem overlap, optimal substructure, and state space reduction.' },
          { id: 'dsa-6', title: 'Interval, Knapsack & Tree DP Patterns', details: 'Advanced DP formulations and memory optimization techniques.' }
        ]
      }
    ],
    resources: [
      { title: 'Introduction to Algorithms (CLRS)', type: 'Docs', url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/', desc: 'The gold standard theoretical reference on data structures and algorithms.' },
      { title: 'Big-O Complexity Chart & Cheatsheet', type: 'Cheatsheet', url: 'https://www.bigocheatsheet.com/', desc: 'Comparative time and space complexities for all standard structures and sorting routines.' },
      { title: 'Visualgo Algorithm Visualizer', type: 'Code', url: 'https://visualgo.net', desc: 'Interactive step-by-step animations of graphs, sorting, and tree structures.' }
    ],
    quiz_spec: {
      passing_score: 75,
      questions: [
        {
          id: 'q1',
          question: 'What is the worst-case time complexity of searching for an element in an unaugmented Binary Search Tree (BST)?',
          options: [
            'O(1)',
            'O(log N)',
            'O(N)',
            'O(N log N)'
          ],
          correct_index: 2,
          explanation: 'In an unaugmented BST, if inserted elements arrive in sorted order, the tree degenerates into a single linked list of depth N, yielding O(N) worst-case search complexity.'
        },
        {
          id: 'q2',
          question: 'Which algorithm is designed to find the shortest path in a weighted graph with non-negative edge weights using a priority queue?',
          options: [
            'Kruskals Algorithm',
            'Dijkstras Algorithm',
            'Floyd-Warshall Algorithm',
            'Depth First Search (DFS)'
          ],
          correct_index: 1,
          explanation: 'Dijkstras algorithm finds single-source shortest paths in weighted directed or undirected graphs with non-negative edge weights in O((V + E) log V) time.'
        },
        {
          id: 'q3',
          question: 'What are the two mandatory properties a problem must possess to be solvable via Dynamic Programming?',
          options: [
            'Optimal Substructure and Overlapping Subproblems',
            'Sorted Array Input and Odd Number of Elements',
            'Positive Integers and Linked List representation',
            'Asymmetric matrices and Continuous functions'
          ],
          correct_index: 0,
          explanation: 'Dynamic Programming requires both Optimal Substructure (an optimal solution contains optimal solutions to subproblems) and Overlapping Subproblems (subproblems are computed repeatedly).'
        },
        {
          id: 'q4',
          question: 'What is the average time complexity of QuickSelect to find the kth smallest element in an unordered array?',
          options: [
            'O(N)',
            'O(N^2)',
            'O(log N)',
            'O(N log N)'
          ],
          correct_index: 0,
          explanation: 'By partitioning the array and only recursing into the partition containing index k, QuickSelect achieves O(N) average time complexity.'
        }
      ]
    }
  },

  // 4. Core Engineering & Robotics
  {
    slug: 'embedded-systems-iot-robotics',
    title: 'Embedded Systems, IoT & Robotics Architecture',
    tagline: 'Design real-time microcontroller firmware, RTOS architectures, sensor fusion, and industrial automation.',
    category: 'Core Engineering',
    level: 'Intermediate',
    duration_weeks: 8,
    skills: ['C/C++', 'FreeRTOS', 'ARM Cortex-M', 'I2C / SPI / UART', 'Sensor Fusion', 'CAN Bus Protocol'],
    icon_name: 'Bot',
    display_order: 4,
    roadmap: [
      {
        phase: 'Phase 1: Hardware Abstraction & Low-Level C',
        duration: 'Weeks 1-3',
        milestones: [
          { id: 'emb-1', title: 'Bare-Metal Register Manipulation & Memory Maps', details: 'Bitwise register writes, memory-mapped I/O, and clock tree configuration.' },
          { id: 'emb-2', title: 'Communication Busses (I2C, SPI, UART, CAN)', details: 'Timing diagrams, pull-up resistors, packet framing, and DMA transfers.' }
        ]
      },
      {
        phase: 'Phase 2: Real-Time Operating Systems (RTOS)',
        duration: 'Weeks 4-6',
        milestones: [
          { id: 'emb-3', title: 'Task Scheduling, Queues & Semaphores', details: 'Preemptive priority scheduling, race conditions, and priority inversion mitigation.' },
          { id: 'emb-4', title: 'Interrupt Service Routines (ISR) & Latency', details: 'Context switching, volatile variables, and deterministic response times.' }
        ]
      },
      {
        phase: 'Phase 3: Sensor Fusion & Control Systems',
        duration: 'Weeks 7-8',
        milestones: [
          { id: 'emb-5', title: 'IMU Sensor Fusion & Kalman Filtering', details: 'Filtering accelerometer and gyroscope drift for stable attitude estimation.' },
          { id: 'emb-6', title: 'PID Motor Speed & Position Control', details: 'Proportional, integral, and derivative gain tuning for closed-loop robotics.' }
        ]
      }
    ],
    resources: [
      { title: 'FreeRTOS Official Kernel Guide', type: 'Docs', url: 'https://www.freertos.org/Documentation/RTOS_book.html', desc: 'Reference for multitasking, inter-task communication, and memory management.' },
      { title: 'ARM Cortex-M Architecture Manual', type: 'Article', url: 'https://developer.arm.com/documentation', desc: 'Exception handling, NVIC interrupts, and low-power sleep modes.' },
      { title: 'PID Controller Tuning Cheatsheet', type: 'Cheatsheet', url: 'https://controlguru.com', desc: 'Ziegler-Nichols method and anti-windup implementation patterns.' }
    ],
    quiz_spec: {
      passing_score: 75,
      questions: [
        {
          id: 'q1',
          question: 'Why must variables shared between an Interrupt Service Routine (ISR) and normal execution be declared with the "volatile" keyword in C?',
          options: [
            'To tell the compiler not to optimize away reads of the variable into CPU registers.',
            'To store the variable on an external flash drive.',
            'To encrypt the memory address from hardware hackers.',
            'To make the variable automatically convert to floating-point.'
          ],
          correct_index: 0,
          explanation: 'The volatile keyword informs the compiler that the variables value can change asynchronously outside the current instruction flow, preventing compiler caching optimization.'
        },
        {
          id: 'q2',
          question: 'What is "Priority Inversion" in a Real-Time Operating System (RTOS)?',
          options: [
            'When high-priority tasks run faster than low-priority tasks.',
            'When a medium-priority task preempts a low-priority task that is holding a lock needed by a high-priority task, stalling the high-priority task.',
            'When all tasks are assigned the same priority number.',
            'When memory is freed in reverse order of allocation.'
          ],
          correct_index: 1,
          explanation: 'Priority inversion happens when a high-priority task is blocked waiting for a resource held by a low-priority task, while intermediate-priority tasks prevent the low-priority task from running and releasing the lock.'
        },
        {
          id: 'q3',
          question: 'Which serial protocol uses two shared bus lines (SDA and SCL) with pull-up resistors and device addressing?',
          options: [
            'SPI',
            'UART',
            'I2C',
            'USB 3.0'
          ],
          correct_index: 2,
          explanation: 'I2C (Inter-Integrated Circuit) relies on two open-drain bidirectional lines (Serial Data and Serial Clock) pulled high by external resistors, using 7-bit or 10-bit device addresses.'
        },
        {
          id: 'q4',
          question: 'In a PID controller, what is the role of the "Integral" term (I)?',
          options: [
            'To eliminate steady-state error by accumulating past error over time.',
            'To predict future errors based on the rate of change.',
            'To provide immediate raw output proportional only to current error.',
            'To turn off the motor when temperature rises.'
          ],
          correct_index: 0,
          explanation: 'The integral component sums past errors over time to provide a driving corrective action that drives the system steady-state error to zero.'
        }
      ]
    }
  },

  // 5. Business & Management
  {
    slug: 'product-management-growth-strategy',
    title: 'Product Management, Agile & Growth Strategy',
    tagline: 'Define product vision, run customer discovery interviews, build PRDs, design metric funnels, and scale retention.',
    category: 'Business & Management',
    level: 'Intermediate',
    duration_weeks: 6,
    skills: ['Product Discovery', 'PRD Writing', 'A/B Testing', 'North Star Metric', 'Agile Scrum', 'Cohort Analysis'],
    icon_name: 'Briefcase',
    display_order: 5,
    roadmap: [
      {
        phase: 'Phase 1: Discovery & Problem Validation',
        duration: 'Weeks 1-2',
        milestones: [
          { id: 'pm-1', title: 'The Mom Test: Unbiased Customer Interviews', details: 'Extract true behavioral data rather than hypothetical customer opinions.' },
          { id: 'pm-2', title: 'Jobs-to-be-Done (JTBD) & Persona Framing', details: 'Identify functional, emotional, and social dimensions of user pain points.' }
        ]
      },
      {
        phase: 'Phase 2: Product Specs & Agile Execution',
        duration: 'Weeks 3-4',
        milestones: [
          { id: 'pm-3', title: 'Writing Bulletproof PRDs with Edge Cases', details: 'Define functional requirements, success metrics, and acceptance criteria.' },
          { id: 'pm-4', title: 'Sprint Planning, Story Points & Backlog Grooming', details: 'Balance technical debt, velocity, and high-impact business features.' }
        ]
      },
      {
        phase: 'Phase 3: Growth, Metrics & Monetization',
        duration: 'Weeks 5-6',
        milestones: [
          { id: 'pm-5', title: 'AARRR Pirate Funnel & North Star Metric', details: 'Acquisition, Activation, Retention, Referral, and Revenue optimization.' },
          { id: 'pm-6', title: 'Designing Controlled A/B Experiments', details: 'Sample size calculations, p-values, minimum detectable effect (MDE).' }
        ]
      }
    ],
    resources: [
      { title: 'Inspired: How to Create Tech Products Customers Love', type: 'Docs', url: 'https://svpg.com/inspired-how-to-create-products-customers-love/', desc: 'Marty Cagans foundational guide to modern product teams.' },
      { title: 'The Lean Product Playbook', type: 'Article', url: 'https://dan-olsen.com', desc: 'Product-market fit framework and value proposition design.' },
      { title: 'Product Metrics & Cohort Cheatsheet', type: 'Cheatsheet', url: 'https://amplitude.com/retention-playbook', desc: 'Formulas for LTV, CAC, churn rate, and N-day retention cohorts.' }
    ],
    quiz_spec: {
      passing_score: 75,
      questions: [
        {
          id: 'q1',
          question: 'According to "The Mom Test" philosophy, how should you formulate customer discovery questions?',
          options: [
            'Ask customers if they would buy your idea if it existed for $10/month.',
            'Ask about their past specific behavior and real challenges they already faced and spent money to solve.',
            'Show them a high-fidelity prototype and ask if they like the color palette.',
            'Ask your friends and family if they think your startup idea is cool.'
          ],
          correct_index: 1,
          explanation: 'Good discovery questions probe concrete past events and real spent effort/money, because hypothetical future questions yield polite false validation.'
        },
        {
          id: 'q2',
          question: 'What defines a genuine "North Star Metric" for a software product?',
          options: [
            'Total cumulative registered user count since company inception.',
            'The single metric that best captures the core customer value delivered and correlates with long-term business sustainability.',
            'The number of code commits pushed to the main branch each day.',
            'The count of positive app store reviews received.'
          ],
          correct_index: 1,
          explanation: 'A North Star Metric aligns customer value and business growth, serving as the guiding benchmark across all cross-functional teams.'
        },
        {
          id: 'q3',
          question: 'In statistical A/B testing, what is the purpose of setting a p-value threshold (typically p < 0.05)?',
          options: [
            'To ensure that the observed difference between variants has less than a 5% probability of occurring purely by random chance.',
            'To guarantee 5% conversion growth every month.',
            'To limit testing to 5% of web visitors.',
            'To make the test run 5 days longer.'
          ],
          correct_index: 0,
          explanation: 'The p-value threshold (alpha = 0.05) measures statistical significance, controlling the False Positive (Type I error) rate.'
        },
        {
          id: 'q4',
          question: 'What is the primary indicator of authentic Product-Market Fit (PMF) in a SaaS product?',
          options: [
            'Winning a design competition award.',
            'A flattening retention curve where a substantial cohort of users continues active usage over time.',
            'A high number of initial social media followers.',
            'Having 100 features on your roadmap.'
          ],
          correct_index: 1,
          explanation: 'Retention is the truest test of PMF. When cohort retention curves flatten horizontally rather than dropping to zero, users find recurring indispensable value.'
        }
      ]
    }
  },

  // 6. Finance & Accounting
  {
    slug: 'financial-modeling-valuation-fintech',
    title: 'Financial Modeling, Valuation & Fintech Systems',
    tagline: 'Build dynamic 3-statement models, DCF valuations, ledger architecture, and payment gateway risk analysis.',
    category: 'Finance & Accounting',
    level: 'Intermediate',
    duration_weeks: 7,
    skills: ['Discounted Cash Flow (DCF)', '3-Statement Modeling', 'WACC Calculation', 'Double-Entry Accounting', 'Fintech Ledgers', 'Capital Budgeting'],
    icon_name: 'TrendingUp',
    display_order: 6,
    roadmap: [
      {
        phase: 'Phase 1: Financial Statements & Linkages',
        duration: 'Weeks 1-2',
        milestones: [
          { id: 'fin-1', title: 'Income Statement, Balance Sheet & Cash Flows', details: 'Master non-cash adjustments, working capital changes, and depreciation schedules.' },
          { id: 'fin-2', title: 'Double-Entry Ledger Design for Software Engineers', details: 'Debits, credits, immutable balance tables, and audit trail consistency.' }
        ]
      },
      {
        phase: 'Phase 2: Corporate Valuation Techniques',
        duration: 'Weeks 3-5',
        milestones: [
          { id: 'fin-3', title: 'Discounted Cash Flow (DCF) & WACC Calculation', details: 'Calculate Cost of Equity (CAPM), Cost of Debt, Terminal Value, and Enterprise Value.' },
          { id: 'fin-4', title: 'Comparable Company Analysis (Trading & Transaction Comps)', details: 'EV/EBITDA, P/E multiples, revenue multiples, and peer benchmarking.' }
        ]
      },
      {
        phase: 'Phase 3: Fintech Architecture & Risk',
        duration: 'Weeks 6-7',
        milestones: [
          { id: 'fin-5', title: 'Payment Gateways, Reconciliation & Settlements', details: 'T+1 settlement mechanics, interchange fees, chargebacks, and idempotency keys.' },
          { id: 'fin-6', title: 'Financial Risk, VaR & Stress Testing', details: 'Monte Carlo simulations, Value-at-Risk modeling, and regulatory capital adequacy.' }
        ]
      }
    ],
    resources: [
      { title: 'Aswath Damodaran Online Valuation Resource', type: 'Docs', url: 'https://pages.stern.nyu.edu/~adamodar/', desc: 'Prof. Damodarans world-renowned corporate finance and valuation database.' },
      { title: 'Corporate Finance Institute 3-Statement Guide', type: 'Article', url: 'https://corporatefinanceinstitute.com', desc: 'Dynamic financial statement linking and balance sheet checks.' },
      { title: 'Financial Ratios & Multiples Cheatsheet', type: 'Cheatsheet', url: 'https://www.investopedia.com/financial-ratios-4689817', desc: 'Quick formulas for liquidity, solvency, profitability, and valuation ratios.' }
    ],
    quiz_spec: {
      passing_score: 75,
      questions: [
        {
          id: 'q1',
          question: 'In a Discounted Cash Flow (DCF) valuation model, what does the Weighted Average Cost of Capital (WACC) represent?',
          options: [
            'The total dollar amount of debt owed to commercial banks.',
            'The required rate of return that investors and debt-holders demand for providing capital to the company.',
            'The annual depreciation fee of company hardware assets.',
            'The statutory corporate tax rate.'
          ],
          correct_index: 1,
          explanation: 'WACC reflects the blended minimum return required by all capital providers (equity holders and lenders), weighted by their proportions in the capital structure.'
        },
        {
          id: 'q2',
          question: 'Which financial statement reports a companys financial position as of a specific point in time rather than over a period?',
          options: [
            'Income Statement',
            'Balance Sheet',
            'Statement of Cash Flows',
            'Statement of Retained Earnings'
          ],
          correct_index: 1,
          explanation: 'The Balance Sheet captures assets, liabilities, and equity at a specific freeze moment (e.g., Dec 31), whereas Income and Cash Flow statements cover an elapsed period.'
        },
        {
          id: 'q3',
          question: 'Why is an Idempotency Key mandatory when submitting charges through a fintech payment gateway API?',
          options: [
            'To ensure that network timeouts or user retries do not result in duplicate customer charges for the same transaction.',
            'To format credit card numbers into international currency.',
            'To calculate exchange rates between EUR and USD.',
            'To encrypt the customer telephone number.'
          ],
          correct_index: 0,
          explanation: 'Idempotency keys ensure that if a request is retried due to a transient network error, the payment processor recognizes it as identical and executes it exactly once.'
        },
        {
          id: 'q4',
          question: 'What is Free Cash Flow to Firm (FCFF)?',
          options: [
            'The cash flow available to all capital providers after operating expenses, taxes, working capital investments, and capital expenditures.',
            'Cash that the company can give away for marketing campaigns.',
            'Money stored in checking accounts with zero interest.',
            'Revenue before deducting cost of goods sold.'
          ],
          correct_index: 0,
          explanation: 'FCFF measures the discretionary cash generated by core operations that remains available to service debt, pay dividends, or execute buybacks after funding ongoing CapEx.'
        }
      ]
    }
  },

  // 7. Design & Creative
  {
    slug: 'ui-ux-design-systems-research',
    title: 'UI/UX Design, Design Systems & Human-Centered Research',
    tagline: 'Craft intuitive user interfaces, design component libraries in Figma, run usability audits, and ensure accessibility (a11y).',
    category: 'Design & Creative',
    level: 'Intermediate',
    duration_weeks: 6,
    skills: ['Figma Design Systems', 'User Research', 'Usability Auditing', 'WCAG 2.1 AA Accessibility', 'Micro-Interactions', 'Prototyping'],
    icon_name: 'Palette',
    display_order: 7,
    roadmap: [
      {
        phase: 'Phase 1: Human-Centered Design & Architecture',
        duration: 'Weeks 1-2',
        milestones: [
          { id: 'des-1', title: 'Information Architecture & Mental Models', details: 'Sitemaps, card sorting, wireframing, and user task flows.' },
          { id: 'des-2', title: 'Visual Hierarchy, Typography & Spatial Grids', details: '8pt spatial grid, scale-calibrated typographic rhythm, and contrast ratios.' }
        ]
      },
      {
        phase: 'Phase 2: Scalable Design Systems in Figma',
        duration: 'Weeks 3-4',
        milestones: [
          { id: 'des-3', title: 'Atomic Tokens & Component Architecture', details: 'Color tokens, typography styles, auto-layout variants, and component properties.' },
          { id: 'des-4', title: 'Design Token Handoff to Code (Tailwind/CSS)', details: 'Variable exports, JSON design tokens, and developer handoff documentation.' }
        ]
      },
      {
        phase: 'Phase 3: Usability Testing & Accessibility (a11y)',
        duration: 'Weeks 5-6',
        milestones: [
          { id: 'des-5', title: 'WCAG 2.1 AA Compliance & Screen Readers', details: 'Semantic ARIA roles, keyboard focus navigation, and 4.5:1 text contrast minimums.' },
          { id: 'des-6', title: 'Moderated Usability Testing & Heuristic Audits', details: 'Nielsen-Norman 10 Usability Heuristics and system usability scale (SUS).' }
        ]
      }
    ],
    resources: [
      { title: 'Nielsen Norman Group UX Heuristics', type: 'Docs', url: 'https://www.nngroup.com/articles/ten-usability-heuristics/', desc: 'The industry-standard 10 usability heuristics for user interface design.' },
      { title: 'WCAG 2.1 Quick Reference & Accessibility Checklist', type: 'Cheatsheet', url: 'https://www.w3.org/WAI/WCAG21/quickref/', desc: 'How to meet accessibility guidelines across contrast, focus, and screen readers.' },
      { title: 'Figma Auto-Layout & Component Best Practices', type: 'Article', url: 'https://help.figma.com/hc/en-us/articles/360040451373-Explore-auto-layout-properties', desc: 'Comprehensive auto-layout guide for building scalable design systems.' }
    ],
    quiz_spec: {
      passing_score: 75,
      questions: [
        {
          id: 'q1',
          question: 'According to WCAG 2.1 Level AA standards, what is the minimum required contrast ratio for regular body text against its background?',
          options: [
            '2.5:1',
            '3.0:1',
            '4.5:1',
            '7.0:1'
          ],
          correct_index: 2,
          explanation: 'WCAG 2.1 AA mandates a minimum color contrast ratio of 4.5:1 for standard body text (below 18pt or 14pt bold) to ensure readability for users with moderate visual impairments.'
        },
        {
          id: 'q2',
          question: 'Which of the following illustrates "Jakobs Law" of User Experience?',
          options: [
            'Users spend most of their time on other websites, so they expect your site to work like the ones they already know.',
            'Every additional form input field doubles the time to convert.',
            'Users always prefer blue buttons over black buttons.',
            'Computer processing speeds double every 18 months.'
          ],
          correct_index: 0,
          explanation: 'Jakobs Law states that users transfer behavioral expectations from all the other products they frequently use to your application.'
        },
        {
          id: 'q3',
          question: 'Why is an 8-point spatial grid system favored in modern digital design systems?',
          options: [
            'Because standard screen resolutions are easily divisible by 8, preventing subpixel blur and rendering artifacts.',
            'Because 8 is considered a lucky number in typography.',
            'Because CSS can only accept multiples of 8 for margins.',
            'Because Figma only has an 8px ruler.'
          ],
          correct_index: 0,
          explanation: 'An 8px grid provides a consistent mathematical cadence that scales cleanly across common screen pixel densities (@1x, @2x, @3x) without fractional subpixel blurring.'
        },
        {
          id: 'q4',
          question: 'What is the purpose of an accessible "Focus State" on interactive elements like buttons and links?',
          options: [
            'To show a tooltip explaining what the button does.',
            'To provide a clear visual indicator for keyboard navigation and assistive technology users showing which element is currently active.',
            'To prevent the user from clicking the button twice.',
            'To dim the background whenever the mouse hovers over it.'
          ],
          correct_index: 1,
          explanation: 'Visible focus states (such as rings or borders) allow users navigating via keyboard (Tab/Shift+Tab) or switch controls to track their active location on the page.'
        }
      ]
    }
  },

  // 8. Healthcare & Science
  {
    slug: 'bioinformatics-healthcare-data-analytics',
    title: 'Bioinformatics & Healthcare Data Analytics',
    tagline: 'Analyze genomics datasets, clinical trials records, molecular structures, and HIPAA-compliant data pipelines.',
    category: 'Healthcare & Science',
    level: 'Advanced',
    duration_weeks: 8,
    skills: ['Biopython', 'Genomic Variant Analysis', 'ClinicalTrials.gov API', 'HIPAA Compliance', 'Pandas & R', 'Molecular Modeling'],
    icon_name: 'Activity',
    display_order: 8,
    roadmap: [
      {
        phase: 'Phase 1: Biological Data Formats & Genomics',
        duration: 'Weeks 1-3',
        milestones: [
          { id: 'bio-1', title: 'FASTA, FASTQ, BAM & VCF File Processing', details: 'Sequence quality scores, read alignment, and single nucleotide variant (SNP) annotation.' },
          { id: 'bio-2', title: 'Pairwise & Multiple Sequence Alignment (MSA)', details: 'Needleman-Wunsch global alignment, Smith-Waterman local alignment, and BLAST searching.' }
        ]
      },
      {
        phase: 'Phase 2: Structural Biology & Drug Targets',
        duration: 'Weeks 4-6',
        milestones: [
          { id: 'bio-3', title: 'Protein Data Bank (PDB) & 3D Structures', details: 'Atomic coordinates, residue chains, secondary structure, and Mol* visualization.' },
          { id: 'bio-4', title: 'ChEMBL & PubChem Bioactivity Analysis', details: 'SMILES chemical notations, IC50/Ki target potency, and pharmacophore modeling.' }
        ]
      },
      {
        phase: 'Phase 3: Clinical Health Informatics & Security',
        duration: 'Weeks 7-8',
        milestones: [
          { id: 'bio-5', title: 'FHIR (Fast Healthcare Interoperability Resources)', details: 'RESTful patient resources, observation endpoints, and EHR data exchange.' },
          { id: 'bio-6', title: 'HIPAA Security Rule & Patient De-identification', details: 'Safe Harbor method, expert determination, and protected health information (PHI) safeguards.' }
        ]
      }
    ],
    resources: [
      { title: 'NCBI BLAST & GenBank Guide', type: 'Docs', url: 'https://blast.ncbi.nlm.nih.gov/Blast.cgi', desc: 'Sequence matching algorithm, score statistics, and E-value interpretation.' },
      { title: 'HL7 FHIR Specification & API Reference', type: 'Docs', url: 'https://hl7.org/fhir/', desc: 'Standard data schemas for interoperable electronic health records.' },
      { title: 'Biopython Tutorial and Cookbook', type: 'Cheatsheet', url: 'https://biopython.org/DIST/docs/tutorial/Tutorial.html', desc: 'Code patterns for parsing PDB, VCF, and GenBank files in Python.' }
    ],
    quiz_spec: {
      passing_score: 75,
      questions: [
        {
          id: 'q1',
          question: 'In a BLAST sequence alignment report, what does a very low "E-value" (e.g., E = 1e-50) signify?',
          options: [
            'The match is purely random noise and should be discarded.',
            'There is an exceptionally high probability that the sequence match is statistically significant and shares biological homology, rather than occurring by chance.',
            'The protein has fifty amino acids.',
            'The sequence was sequenced in 1950.'
          ],
          correct_index: 1,
          explanation: 'The Expectation value (E-value) represents the number of expected random hits. An E-value close to zero confirms a statistically rigorous match with high evolutionary significance.'
        },
        {
          id: 'q2',
          question: 'What is the purpose of the FHIR standard (HL7 Fast Healthcare Interoperability Resources)?',
          options: [
            'To establish open, modern RESTful JSON/XML data formats for seamless data exchange between disparate healthcare software systems.',
            'To create digital prescriptions for retail pharmacies only.',
            'To store patient medical records on public blockchain ledgers.',
            'To replace human doctors with AI chat bots.'
          ],
          correct_index: 0,
          explanation: 'FHIR standardizes healthcare information modeling into granular modular resources (Patient, Observation, Condition) accessible via modern REST APIs.'
        },
        {
          id: 'q3',
          question: 'Under the HIPAA Privacy Rule Safe Harbor method, how many designated identifiers of the individual (or relatives) must be removed for health data to be considered de-identified?',
          options: [
            '5 identifiers',
            '10 identifiers',
            '18 identifiers',
            '50 identifiers'
          ],
          correct_index: 2,
          explanation: 'The HIPAA Safe Harbor de-identification protocol mandates the removal of 18 specific categories of personal identifiers (including names, exact geographic data, dates, phone numbers, and IP addresses).'
        },
        {
          id: 'q4',
          question: 'In structural bioinformatics, what coordinate format is the industry standard for 3D biomolecular structures in the Protein Data Bank?',
          options: [
            'PDB and mmCIF (macromolecular Crystallographic Information Framework)',
            'MP4 video file',
            'CSV spreadsheet with only gene names',
            'WAV audio recording'
          ],
          correct_index: 0,
          explanation: 'Macromolecular 3D structures are archived in PDB format and mmCIF files containing 3D Cartesian coordinates (X, Y, Z), B-factors, and occupancy numbers.'
        }
      ]
    }
  },

  // 9. Law & Governance
  {
    slug: 'tech-law-cyber-governance-compliance',
    title: 'Technology Law, Cyber Governance & Compliance',
    tagline: 'Navigate software copyright, open-source licensing, GDPR/DPDP privacy frameworks, and AI governance.',
    category: 'Law & Governance',
    level: 'Intermediate',
    duration_weeks: 6,
    skills: ['Open Source Licensing (GPL vs MIT)', 'GDPR & DPDP Act 2023', 'AI Ethics & Regulations', 'IP Law for Software', 'Data Protection', 'SaaS Contracts'],
    icon_name: 'ShieldCheck',
    display_order: 9,
    roadmap: [
      {
        phase: 'Phase 1: Intellectual Property & Open Source Software',
        duration: 'Weeks 1-2',
        milestones: [
          { id: 'law-1', title: 'Copyright, Patents & Trade Secrets in Software', details: 'Source code protection, patentability boundaries, and API fair use.' },
          { id: 'law-2', title: 'Permissive vs Copyleft Licensing (MIT vs GPLv3)', details: 'License compatibility, viral clauses, derivative works, and dual-licensing business models.' }
        ]
      },
      {
        phase: 'Phase 2: Global Privacy & Data Sovereignty',
        duration: 'Weeks 3-4',
        milestones: [
          { id: 'law-3', title: 'GDPR & Digital Personal Data Protection (DPDP Act)', details: 'Lawful basis for processing, consent architectures, right to be forgotten, and cross-border transfers.' },
          { id: 'law-4', title: 'Data Protection Officer (DPO) & Breach Notification', details: 'Mandatory 72-hour reporting windows, impact assessments (DPIA), and regulatory fines.' }
        ]
      },
      {
        phase: 'Phase 3: AI Governance, Liability & Tech Contracts',
        duration: 'Weeks 5-6',
        milestones: [
          { id: 'law-5', title: 'EU AI Act & Risk Categorization', details: 'Prohibited, high-risk, limited-risk, and minimal-risk AI compliance requirements.' },
          { id: 'law-6', title: 'Enterprise SaaS Service Level Agreements (SLAs)', details: 'Limitation of liability, indemnification, warranty disclaimers, and termination rights.' }
        ]
      }
    ],
    resources: [
      { title: 'Open Source Initiative (OSI) License Guide', type: 'Docs', url: 'https://opensource.org/licenses/', desc: 'Legal breakdown of Apache 2.0, MIT, BSD, GPL, and AGPL licensing.' },
      { title: 'Official Text of EU General Data Protection Regulation (GDPR)', type: 'Article', url: 'https://gdpr-info.eu/', desc: 'Complete articles, recitals, and compliance guidelines.' },
      { title: 'EU AI Act Risk Classification Cheatsheet', type: 'Cheatsheet', url: 'https://artificialintelligenceact.eu/', desc: 'Harmonized rules on artificial intelligence governance.' }
    ],
    quiz_spec: {
      passing_score: 75,
      questions: [
        {
          id: 'q1',
          question: 'What is the key legal difference between a permissive license (like MIT) and a copyleft license (like GNU GPLv3)?',
          options: [
            'MIT software cannot be used for commercial applications.',
            'Copyleft licenses require derivative works and modifications to also be released under the same open-source license, whereas permissive licenses do not.',
            'GPLv3 software can only run on Linux computers.',
            'MIT requires payment of royalty fees to MIT University.'
          ],
          correct_index: 1,
          explanation: 'Copyleft licenses (GPLv3) carry a reciprocity obligation requiring modified derivative software to stay open-source under identical terms, whereas permissive licenses (MIT/BSD/Apache) allow proprietary redistribution.'
        },
        {
          id: 'q2',
          question: 'Under GDPR Article 33, within what timeframe must a data controller report a serious personal data breach to the supervisory authority?',
          options: [
            'Within 24 hours',
            'Within 72 hours of becoming aware of the breach',
            'Within 30 calendar days',
            'At the end of the fiscal quarter'
          ],
          correct_index: 1,
          explanation: 'GDPR mandates that supervisory authorities must be notified of qualifying personal data breaches without undue delay and, where feasible, not later than 72 hours after discovery.'
        },
        {
          id: 'q3',
          question: 'In the Indian Digital Personal Data Protection (DPDP) Act 2023, what is the entity that determines the purpose and means of data processing termed?',
          options: [
            'Data Fiduciary',
            'Data Miner',
            'Data Broker',
            'Data Sheriff'
          ],
          correct_index: 0,
          explanation: 'The DPDP Act 2023 uses the term "Data Fiduciary" for the entity that decides why and how personal data is processed (analogous to GDPRs Data Controller).'
        },
        {
          id: 'q4',
          question: 'Under the EU AI Act, which class of AI systems is subject to the strictest mandatory conformity assessments, audit trails, and human oversight?',
          options: [
            'Minimal Risk AI',
            'High-Risk AI Systems (e.g., biometric identification, critical infrastructure, credit scoring)',
            'Spam filters and video games',
            'Open-source text editors'
          ],
          correct_index: 1,
          explanation: 'High-risk AI systems undergo strict pre-market conformity testing, continuous risk management systems, high-quality training datasets, and mandatory human oversight.'
        }
      ]
    }
  },

  // 10. Entrepreneurship & Venture
  {
    slug: 'startup-venture-building-fundraising',
    title: 'Startup Building, Zero-to-One Venture Strategy & Fundraising',
    tagline: 'Validate startup ideas, engineer initial traction, model cap tables, pitch angel investors, and navigate venture capital (VC).',
    category: 'Entrepreneurship',
    level: 'Intermediate',
    duration_weeks: 6,
    skills: ['Zero-to-One Validation', 'Pitch Deck Design', 'SAFE & Convertible Notes', 'Cap Table Modeling', 'Customer Acquisition Cost (CAC)', 'Unit Economics'],
    icon_name: 'Rocket',
    display_order: 10,
    roadmap: [
      {
        phase: 'Phase 1: Idea Invalidation & Zero-to-One Validation',
        duration: 'Weeks 1-2',
        milestones: [
          { id: 'ent-1', title: 'Hair-on-Fire Problems vs Vitamin Ideas', details: 'Assessing willingness-to-pay, market urgency, and founder-market fit.' },
          { id: 'ent-2', title: 'Concierge & Wizard-of-Oz MVPs', details: 'Delivering core customer value manually before writing thousands of lines of code.' }
        ]
      },
      {
        phase: 'Phase 2: Unit Economics & Go-to-Market (GTM)',
        duration: 'Weeks 3-4',
        milestones: [
          { id: 'ent-3', title: 'CAC, LTV, Payback Period & Gross Margins', details: 'Sustainable unit economics, churn sensitivity, and magic number calculations.' },
          { id: 'ent-4', title: 'Organic Flywheels vs Paid Acquisition', details: 'Product-led growth (PLG), content flywheels, referral loops, and sales cycles.' }
        ]
      },
      {
        phase: 'Phase 3: Venture Financing & Cap Tables',
        duration: 'Weeks 5-6',
        milestones: [
          { id: 'ent-5', title: 'Y Combinator Post-Money SAFE Notes', details: 'Valuation caps, discount rates, pro-rata rights, and dilution mechanics.' },
          { id: 'ent-6', title: 'Building a 12-Slide Winning Pitch Deck', details: 'Problem, solution, market size (TAM/SAM/SOM), business model, traction, and ask.' }
        ]
      }
    ],
    resources: [
      { title: 'Y Combinator Startup Library & Playbook', type: 'Docs', url: 'https://www.ycombinator.com/library', desc: 'Essays on finding co-founders, launching MVPs, and raising seed rounds.' },
      { title: 'YC Standard Post-Money SAFE Agreement', type: 'Cheatsheet', url: 'https://www.ycombinator.com/documents/', desc: 'Standard legal investment template for early-stage angel and seed rounds.' },
      { title: 'Venture Capital Cap Table Modeling Spreadsheet', type: 'Article', url: 'https://avc.com/archive/', desc: 'Fred Wilsons insights on dilution, stock options, and liquidation preferences.' }
    ],
    quiz_spec: {
      passing_score: 75,
      questions: [
        {
          id: 'q1',
          question: 'What is the primary advantage of a Y Combinator Post-Money SAFE note over a priced equity funding round for a pre-seed startup?',
          options: [
            'It enables fast, low-cost capital raising without negotiating complex corporate governance documents, board seats, or formal legal fees.',
            'It guarantees the investor will never dilute.',
            'It forces the company to pay 20% annual cash interest.',
            'It prevents the founders from issuing employee stock options.'
          ],
          correct_index: 0,
          explanation: 'Post-Money SAFEs (Simple Agreement for Future Equity) allow startups to quickly close investments without incurring thousands of dollars in legal fees and shareholder negotiations typical of priced rounds.'
        },
        {
          id: 'q2',
          question: 'What does a Healthy LTV to CAC ratio (Lifetime Value to Customer Acquisition Cost) look like for a scaling SaaS company?',
          options: [
            '0.5x (LTV is half of CAC)',
            '3x or higher (LTV is at least three times CAC with a payback period under 12 months)',
            'Exactly 1x (Break-even on day 1)',
            'Negative LTV'
          ],
          correct_index: 1,
          explanation: 'An LTV:CAC ratio of 3x or greater with a customer acquisition payback period under 12 months signifies strong, scalable unit economics.'
        },
        {
          id: 'q3',
          question: 'What is the difference between TAM, SAM, and SOM in market sizing?',
          options: [
            'TAM is Total Addressable Market, SAM is Serviceable Addressable Market, and SOM is Serviceable Obtainable Market (the realistic near-term target).',
            'They refer to three venture capital firms based in San Francisco.',
            'They are metrics measuring server CPU usage.',
            'They measure the three tiers of employee equity grants.'
          ],
          correct_index: 0,
          explanation: 'TAM represents total global demand, SAM is the segment within your reach, and SOM represents the portion of the market your startup can realistically capture in the short term.'
        },
        {
          id: 'q4',
          question: 'What is a "Concierge MVP"?',
          options: [
            'Hiring hotel concierges to advertise your website.',
            'Manually providing the service to customers yourself by hand to validate value and learn requirements before building software automation.',
            'Buying an existing business with bank loans.',
            'A fully automated mobile app built with artificial intelligence.'
          ],
          correct_index: 1,
          explanation: 'In a Concierge MVP, founders manually deliver the service behind the scenes, observing user problems directly without wasting months writing software for unvalidated features.'
        }
      ]
    }
  },

  // 11. Media & Communications
  {
    slug: 'technical-writing-content-strategy',
    title: 'Technical Writing, Content Strategy & Brand Storytelling',
    tagline: 'Write world-class developer documentation, API references, narrative case studies, and engineering blogs.',
    category: 'Media & Creative',
    level: 'Beginner',
    duration_weeks: 5,
    skills: ['API Documentation', 'Markdown & MDX', 'Docs-as-Code', 'Technical Copywriting', 'SEO for Tech', 'Style Guides'],
    icon_name: 'FileText',
    display_order: 11,
    roadmap: [
      {
        phase: 'Phase 1: Clear Engineering Communication',
        duration: 'Weeks 1-2',
        milestones: [
          { id: 'tw-1', title: 'The Diátaxis Framework for Documentation', details: 'Tutorials, How-To Guides, Technical Reference, and Conceptual Explanation.' },
          { id: 'tw-2', title: 'Plain Language, Active Voice & Conciseness', details: 'Eliminating passive voice, ambiguous antecedents, and developer jargon.' }
        ]
      },
      {
        phase: 'Phase 2: Modern Docs-as-Code & Open Source',
        duration: 'Weeks 3-4',
        milestones: [
          { id: 'tw-3', title: 'Docs-as-Code with Git, Markdown & Linting', details: 'Vale style linters, automated broken link checks, and versioned doc releases.' },
          { id: 'tw-4', title: 'Writing Flawless OpenAPI/Swagger References', details: 'Request parameters, JSON response schemas, HTTP status codes, and curl examples.' }
        ]
      },
      {
        phase: 'Phase 3: Distribution, SEO & Brand Storytelling',
        duration: 'Weeks 5',
        milestones: [
          { id: 'tw-5', title: 'Engineering Blogs that Drive High Traffic', details: 'Post-mortem narratives, architectural tear-downs, and viral developer writing.' },
          { id: 'tw-6', title: 'Developer Relations (DevRel) & Community Docs', details: 'Contributing guides, code of conduct, and feedback triage.' }
        ]
      }
    ],
    resources: [
      { title: 'The Diátaxis Documentation Framework', type: 'Docs', url: 'https://diataxis.fr/', desc: 'A systematic approach to creating effective software documentation.' },
      { title: 'Google Technical Writing Course', type: 'Article', url: 'https://developers.google.com/tech-writing', desc: 'Google engineering guide to clear, professional technical documentation.' },
      { title: 'OpenAPI 3.1 Specification Quick Guide', type: 'Cheatsheet', url: 'https://swagger.io/specification/', desc: 'REST API documentation schema standard.' }
    ],
    quiz_spec: {
      passing_score: 75,
      questions: [
        {
          id: 'q1',
          question: 'According to the Diátaxis framework, what are the four distinct types of documentation?',
          options: [
            'Tutorials (learning-oriented), How-To Guides (task-oriented), Reference (information-oriented), and Explanation (understanding-oriented).',
            'Header, Body, Footer, and Sidebar.',
            'Marketing, Sales, Accounting, and Legal.',
            'Beginner, Medium, Hard, and Expert.'
          ],
          correct_index: 0,
          explanation: 'Diátaxis separates technical content into four distinct quadrants based on user intent (learning, solving a specific task, looking up reference specs, or gaining conceptual understanding).'
        },
        {
          id: 'q2',
          question: 'Why is active voice preferred over passive voice in technical documentation?',
          options: [
            'Active voice clearly identifies the actor performing the action and results in shorter, more direct sentences.',
            'Passive voice is forbidden by HTML syntax.',
            'Active voice requires less computer memory to display.',
            'Active voice makes articles longer so they rank higher on Google.'
          ],
          correct_index: 0,
          explanation: 'Active voice specifies who or what performs the action ("Click Submit" vs "The Submit button should be clicked"), reducing ambiguity.'
        },
        {
          id: 'q3',
          question: 'What is the "Docs-as-Code" methodology?',
          options: [
            'Writing documentation in binary machine code.',
            'Treating documentation with the same tools and workflows as software code (using Git, Markdown, pull requests, automated CI linting, and continuous deployment).',
            'Allowing only software developers to read the documentation.',
            'Auto-generating all documentation with random code comments.'
          ],
          correct_index: 1,
          explanation: 'Docs-as-Code applies standard software development workflows—version control, peer reviews, automated CI tests, and static site generators—to technical writing.'
        },
        {
          id: 'q4',
          question: 'In an API reference documentation page, what is the single most important element a developer looks for first?',
          options: [
            'A copy-pasteable code sample showing a successful request and its response.',
            'The biography of the company CEO.',
            'The color scheme of the API servers.',
            'A list of the companys financial investors.'
          ],
          correct_index: 0,
          explanation: 'Developers prioritize quick time-to-first-call, relying on realistic, copy-pasteable request examples and expected responses to integrate quickly.'
        }
      ]
    }
  }
];

async function seed() {
  const client = await pool.connect();
  console.log('Connected to PostgreSQL. Running schema migration...');

  try {
    const migrationSql = fs.readFileSync(
      path.join(__dirname, '..', 'supabase', 'migrations', '20261019000000_learn_courses_and_certificates.sql'),
      'utf8'
    );
    await client.query(migrationSql);
    console.log('Schema migration applied successfully.');

    console.log(`Seeding ${COURSES_CATALOG.length} diverse courses across all major fields...`);

    for (const c of COURSES_CATALOG) {
      await client.query(
        `INSERT INTO public.courses (
          slug, title, tagline, category, level, duration_weeks, skills, icon_name, roadmap, resources, quiz_spec, display_order, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          tagline = EXCLUDED.tagline,
          category = EXCLUDED.category,
          level = EXCLUDED.level,
          duration_weeks = EXCLUDED.duration_weeks,
          skills = EXCLUDED.skills,
          icon_name = EXCLUDED.icon_name,
          roadmap = EXCLUDED.roadmap,
          resources = EXCLUDED.resources,
          quiz_spec = EXCLUDED.quiz_spec,
          display_order = EXCLUDED.display_order,
          is_active = EXCLUDED.is_active;`,
        [
          c.slug,
          c.title,
          c.tagline,
          c.category,
          c.level,
          c.duration_weeks,
          c.skills,
          c.icon_name,
          JSON.stringify(c.roadmap),
          JSON.stringify(c.resources),
          JSON.stringify(c.quiz_spec),
          c.display_order
        ]
      );
      console.log(`  [OK] Course: ${c.title} (${c.category})`);
    }

    const { rows } = await client.query('SELECT count(*) FROM public.courses WHERE is_active = true;');
    console.log(`\nAll courses seeded successfully! Total active courses in DB: ${rows[0].count}`);
  } catch (err) {
    console.error('Migration / Seed Error:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
