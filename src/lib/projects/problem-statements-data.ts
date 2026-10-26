export type ProblemDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Industry Grade";

export type ProblemDomain = 
  | "Distributed Systems" 
  | "AI & Machine Learning" 
  | "Full-Stack Web" 
  | "DevOps & Cloud" 
  | "FinTech & Data";

export interface CompanySponsor {
  name: string;
  tag: string;
  hiringTrack: string;
  tier: "Flagship" | "Sponsored Partner" | "Industry Challenge";
}

export interface ProblemStatement {
  id: string;
  title: string;
  domain: ProblemDomain;
  difficulty: ProblemDifficulty;
  timeEstimate: string; // e.g. "3-5 Hours", "1-2 Days", "Capstone Sprint"
  summary: string;
  problemStatement: string;
  functionalRequirements: string[];
  nonFunctionalConstraints: string[];
  techStack: string[];
  industryRelevance: string;
  starterArchitecture: string;
  deliverables: string[];
  suggestedRoadmap: {
    phase: string;
    description: string;
  }[];
  companySponsor?: CompanySponsor;
}

export const PROBLEM_STATEMENTS_DATA: ProblemStatement[] = [
  {
    id: "ps-distributed-rate-limiter",
    title: "High-Throughput Distributed Rate Limiter",
    domain: "Distributed Systems",
    difficulty: "Industry Grade",
    timeEstimate: "1-2 Days",
    summary: "Build a multi-region API rate limiting service using Redis sliding-window counters with sub-millisecond evaluation latency.",
    problemStatement: `An e-commerce API platform experiences sudden traffic surges during flash sales. Upstream microservices are getting overwhelmed because the current single-instance memory throttle fails when requests route across multiple ingress nodes.\n\nYou are tasked with architecting a distributed rate-limiting middleware that evaluates request quotas across a clustered environment, enforces sliding-window rate limiting per API key and client IP, and complies with standard RFC 6585 HTTP headers without becoming a single point of failure.`,
    functionalRequirements: [
      "Implement Sliding Window Counter algorithm to prevent burst anomalies at boundary windows.",
      "Support configurable quotas: e.g., 100 requests per minute per tier, with burst capacity allowances.",
      "Return standard HTTP 429 Too Many Requests with headers: X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After.",
      "Provide fallback degraded mode: if the distributed cache is unreachable, fall back to local in-memory token buckets without crashing the API."
    ],
    nonFunctionalConstraints: [
      "Latency: Rate limit evaluation must complete in under 5ms at P99.",
      "Throughput: Capable of evaluating 25,000+ requests/sec per cluster node.",
      "Consistency: Eventual consistency across regional replicas with minimal race conditions."
    ],
    techStack: ["Go", "Node.js", "Redis", "Docker", "Prometheus"],
    industryRelevance: "Critical infrastructure problem asked in system design loops at Cloudflare, Stripe, Uber, and Amazon.",
    starterArchitecture: "Client Ingress -> Envoy / Nginx Reverse Proxy -> Rate Limiter Service Cluster -> Redis Cluster (Sliding Window Hashes) -> Upstream API Server.",
    deliverables: [
      "Rate limiter middleware package or standalone proxy service.",
      "Benchmarking script demonstrating behavior under 10k concurrent requests.",
      "Architecture diagram & failure mode post-mortem README."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: Local Algorithm", description: "Implement sliding-window counter in memory using circular buffers or timestamped z-sets." },
      { phase: "Phase 2: Redis Integration", description: "Translate logic into atomic Redis Lua scripts to eliminate race conditions." },
      { phase: "Phase 3: Fallback & Resilience", description: "Add circuit breaker and local cache fallback when Redis nodes fail." }
    ]
  },
  {
    id: "ps-rag-vector-search",
    title: "Production RAG Engine with Hybrid Vector Search",
    domain: "AI & Machine Learning",
    difficulty: "Advanced",
    timeEstimate: "2-3 Days",
    summary: "Architect a Retrieval-Augmented Generation (RAG) system with hybrid dense-sparse vector search, document chunking, and verifiable citations.",
    problemStatement: `Enterprise users require an internal AI assistant that answers technical queries based on 50,000+ internal PDF and Markdown documentation pages. Naive vector search produces hallucinated answers and misses keyword-specific acronyms and function names.\n\nYou must build a production RAG pipeline that combines dense vector embeddings with sparse BM25 keyword search, re-ranks the top results with a cross-encoder, generates grounded responses via an LLM, and embeds verifiable source citations with character-level snippet highlights.`,
    functionalRequirements: [
      "Build a document ingestion pipeline with recursive semantic chunking and metadata extraction.",
      "Implement Hybrid Retrieval combining dense vector similarity (cosine) with sparse BM25 keyword search.",
      "Re-rank candidate chunks using a lightweight cross-encoder before sending to LLM context window.",
      "Output grounded answers with clickable source citations referencing document ID, page, and chunk index.",
      "Detect when the knowledge base lacks sufficient context and honestly state inability to answer rather than hallucinating."
    ],
    nonFunctionalConstraints: [
      "Retrieval latency under 120ms for the top 5 re-ranked chunks.",
      "Strict context hygiene: prevent context poisoning and prompt injection in uploaded files.",
      "Memory footprint optimized for low-cost deployment."
    ],
    techStack: ["Python", "LangChain / LlamaIndex", "Pinecone / pgvector", "OpenAI / Gemini API", "FastAPI"],
    industryRelevance: "Essential architecture for modern AI engineers building enterprise Copilots and knowledge assistants.",
    starterArchitecture: "Document Upload -> Ingestion Worker (Unstructured Chunking) -> Dual Indexing (pgvector + BM25) -> Hybrid Query Fusion -> Cohere / BGE Re-Ranker -> LLM Generator with Citation Extraction.",
    deliverables: [
      "FastAPI server with /ingest and /query endpoints.",
      "Evaluation script calculating context recall and faithfulness metrics.",
      "Interactive web UI showing side-by-side retrieved passages and generated answers."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: Ingestion & Embeddings", description: "Set up document parsing, chunking with overlap, and store vectors in pgvector." },
      { phase: "Phase 2: Hybrid Search & Re-ranking", description: "Combine BM25 + dense search scores using Reciprocal Rank Fusion (RRF)." },
      { phase: "Phase 3: Verification & Evaluation", description: "Build citation matching and test hallucination defense benchmarks." }
    ]
  },
  {
    id: "ps-event-driven-payment-engine",
    title: "Transactional Outbox & Event-Driven Payment Engine",
    domain: "FinTech & Data",
    difficulty: "Industry Grade",
    timeEstimate: "2-3 Days",
    summary: "Build an idempotent financial ledger and event outbox ensuring zero double-spends and guaranteed message delivery.",
    problemStatement: `A neo-bank processes peer-to-peer transfer payments. Under network timeouts, mobile clients re-try transfer requests, occasionally causing duplicate deductions. Furthermore, when the database commits a transfer but the message queue crashes before emitting an event, downstream notification and analytics systems desynchronize.\n\nYour task is to build a reliable transactional ledger that supports double-entry bookkeeping, enforces idempotency keys, and utilizes the Transactional Outbox pattern with Kafka/RabbitMQ to guarantee at-least-once event delivery.`,
    functionalRequirements: [
      "Idempotent API endpoint: duplicate requests with identical idempotency keys return the original cached response without re-executing transfers.",
      "Double-entry bookkeeping: every transfer writes symmetric debit and credit ledger entries where sum(credits) == sum(debits).",
      "Transactional Outbox: ledger entry and outbox event are inserted atomically inside a single ACID database transaction.",
      "Outbox Poller / CDC Worker: asynchronously dispatches outbox events to the message broker and marks records as published."
    ],
    nonFunctionalConstraints: [
      "Zero money loss: account balances can never be negative without explicit overdraft permission.",
      "Concurrency control: pessimistic locking (SELECT FOR UPDATE) or optimistic lock versions on account balances to prevent race conditions.",
      "Auditable: every transaction has an immutable cryptographic hash chain or timestamp sequence."
    ],
    techStack: ["PostgreSQL", "Go / Java / TypeScript", "Kafka / RabbitMQ", "Docker", "SQL"],
    industryRelevance: "Foundational problem asked at Stripe, PayPal, Razorpay, Goldman Sachs, and fintech scale-ups.",
    starterArchitecture: "Client -> Payment Service -> DB Transaction [Debit Account + Credit Account + Insert Outbox Event] -> Asynchronous Debezium / Outbox Relay -> Kafka Topic -> Downstream Listeners.",
    deliverables: [
      "Core banking transaction engine with integration tests for concurrent transfers.",
      "Outbox worker daemon with automatic retries and dead-letter queue (DLQ).",
      "Chaos testing script verifying recovery after sudden broker crashes."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: Double-Entry Schema", description: "Design accounts, ledger_entries, and idempotency_keys tables with check constraints." },
      { phase: "Phase 2: Concurrency & Outbox", description: "Implement transfer transaction with SELECT FOR UPDATE and outbox event generation." },
      { phase: "Phase 3: Relay Worker", description: "Build background relay loop with exponential backoff and message publishing." }
    ]
  },
  {
    id: "ps-collaborative-doc-canvas",
    title: "Real-Time Collaborative Document Editor (CRDT)",
    domain: "Full-Stack Web",
    difficulty: "Advanced",
    timeEstimate: "2-3 Days",
    summary: "Create a multi-user real-time collaborative text editor with Conflict-free Replicated Data Types (CRDT) and live cursor presence.",
    problemStatement: `Teams working remotely need to co-author engineering specifications simultaneously. Simple WebSocket synchronization overwrites edits when two developers type in the same paragraph simultaneously during network latency spikes.\n\nYou must implement a collaborative text canvas utilizing CRDTs (such as Yjs or Automerge) over WebSockets that achieves conflict-free convergence, displays peer presence indicators (colored user cursors and selections), and supports seamless offline editing with automatic re-synchronization upon reconnection.`,
    functionalRequirements: [
      "Real-time synchronized text buffer between 5+ concurrent users.",
      "Conflict-free convergence: all participants see the identical document state regardless of operation delivery order.",
      "Live Presence: broadcast mouse cursor positions, user avatars, and text selections in real time.",
      "Offline resilience: users can continue typing while offline; reconnecting merges edits without overwriting peer changes."
    ],
    nonFunctionalConstraints: [
      "Sync latency: peer keystroke updates rendered in < 50ms over standard broadband.",
      "Memory leak prevention: cleanup disconnected peer state and orphaned WebSocket channels."
    ],
    techStack: ["Next.js", "TypeScript", "WebSockets / Socket.io", "Yjs / Automerge", "Tailwind CSS"],
    industryRelevance: "Core engineering foundation behind Google Docs, Figma, Notion, and Miro.",
    starterArchitecture: "React Client (TipTap / Monaco Editor) -> Yjs Provider -> WebSocket Server -> Persistent Document Storage (Postgres / Redis).",
    deliverables: [
      "Full-stack collaborative editor with live multi-user demo link.",
      "Awareness protocol implementation for user presence and active selections.",
      "Unit tests verifying conflict resolution when two edits occur on the exact same character index."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: Rich Text & CRDT Buffer", description: "Bind TipTap or Monaco editor to a local Yjs document instance." },
      { phase: "Phase 2: WebSocket Sync Server", description: "Build a lightweight Node.js WebSocket server broadcasting document updates." },
      { phase: "Phase 3: Presence & Offline", description: "Add cursor tracking and test offline-to-online reconnection merging." }
    ]
  },
  {
    id: "ps-blue-green-canary-orchestrator",
    title: "Zero-Downtime Blue/Green Deployment Controller",
    domain: "DevOps & Cloud",
    difficulty: "Intermediate",
    timeEstimate: "1-2 Days",
    summary: "Build an automated continuous deployment controller that shifts traffic between Blue and Green server pools with health-checked rollbacks.",
    problemStatement: `Engineering teams deploy updates multiple times a day. Rolling deployments occasionally push faulty code that causes 500 errors to propagate to all users before engineers can manually revert the release.\n\nYou are tasked with building a deployment orchestrator that maintains parallel Blue and Green server environments, gradually shifts traffic (10% -> 50% -> 100%), monitors real-time HTTP error rates and latency, and executes an automated sub-second rollback if error rates exceed 1%.`,
    functionalRequirements: [
      "Spawn and manage Blue (current) and Green (target) containerized app versions.",
      "Programmable reverse proxy (Nginx / Traefik / Envoy) supporting weighted traffic routing.",
      "Telemetry health watcher checking HTTP response codes, latency percentiles, and container CPU.",
      "Automated rollback: instantly revert 100% of traffic to the stable pool if the canary version fails 3 health probes."
    ],
    nonFunctionalConstraints: [
      "Zero dropped requests during active traffic shifting.",
      "Telemetry evaluation interval <= 2 seconds.",
      "Clean infrastructure teardown of retired instances after successful verification."
    ],
    techStack: ["Docker", "Nginx / Traefik", "Go / Python / Bash", "Prometheus", "Linux"],
    industryRelevance: "Universal DevOps competence required for SRE and Cloud Platform roles at Netflix, Meta, and modern cloud startups.",
    starterArchitecture: "Reverse Proxy -> Weighted Split -> [Blue Container Cluster v1.0] vs [Green Container Cluster v2.0] <- Health Daemon (Polls Metrics & Reconfigures Proxy).",
    deliverables: [
      "CLI or automated daemon executing canary rollout stages.",
      "Docker Compose environment simulating traffic shift and failure injection.",
      "Grafana dashboard or log stream displaying live traffic distribution."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: Reverse Proxy Configuration", description: "Configure dynamic weighted routing using Nginx or Traefik API." },
      { phase: "Phase 2: Health Monitoring Daemon", description: "Write polling service that queries health metrics from candidate containers." },
      { phase: "Phase 3: Rollout Controller", description: "Implement automated traffic stepping (10% -> 50% -> 100%) and instant abort on failure." }
    ]
  },
  {
    id: "ps-voice-agent-streaming-vad",
    title: "Real-Time Voice AI Agent with Streaming VAD",
    domain: "AI & Machine Learning",
    difficulty: "Industry Grade",
    timeEstimate: "2-3 Days",
    summary: "Implement a low-latency conversational voice agent with Voice Activity Detection, turn-taking, and bidirectional WebSocket audio.",
    problemStatement: `Traditional voice bots feel robotic because they require users to press a button to speak and wait several seconds for a full audio response to synthesize. If the user interrupts, the bot continues talking over them.\n\nBuild a natural, low-latency duplex conversational agent that processes streaming PCM audio, uses Voice Activity Detection (Silero VAD) to detect when the user starts and stops talking, streams responses back with minimal latency (<800ms time-to-first-audio), and immediately cancels playback when the user interrupts.`,
    functionalRequirements: [
      "Capture microphone audio chunks in the browser and stream over WebSockets as raw PCM16.",
      "Server-side Voice Activity Detection to accurately segment speech frames without clipping end words.",
      "Streaming Speech-to-Text -> LLM generation with streaming tokens -> Text-to-Speech audio chunk generation.",
      "Interruption handling: immediately halt audio playback and clear server response queues when user speech resumes."
    ],
    nonFunctionalConstraints: [
      "Time-to-First-Audio (TTFA) latency under 800ms from user silence to first synthesized audio packet.",
      "Resilient audio buffering: prevent buffer underruns and audio clicks.",
      "Low CPU usage on the client side."
    ],
    techStack: ["TypeScript", "WebSockets", "Web Audio API", "Python / Node.js", "Whisper", "ElevenLabs / Deepgram"],
    industryRelevance: "Cutting-edge voice AI engineering as seen in OpenAI Advanced Voice, Hume AI, and customer service automation.",
    starterArchitecture: "Browser Mic (AudioWorklet) -> WebSocket -> Audio Ingest Buffer -> VAD Classifier -> Streaming STT -> Gemini/Claude Streaming -> Streaming TTS -> Audio Output Buffer.",
    deliverables: [
      "Working web voice canvas with real-time waveform visualization.",
      "WebSocket streaming server with audio turn-taking logic.",
      "Latency breakdown benchmarks (STT, LLM TTFT, TTS)."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: Audio Streaming Canvas", description: "Build AudioWorklet capturing 16kHz PCM audio and WebSocket pipeline." },
      { phase: "Phase 2: VAD & Turn-Taking", description: "Implement server-side silence detection and speech boundary framing." },
      { phase: "Phase 3: Streaming Generation & Barge-in", description: "Chain streaming LLM to TTS and wire instantaneous cancellation on interruption." }
    ]
  },
  {
    id: "ps-multitenant-rbac-engine",
    title: "Multi-Tenant RBAC & Attribute Authorization Engine",
    domain: "Distributed Systems",
    difficulty: "Intermediate",
    timeEstimate: "1-2 Days",
    summary: "Design a high-speed authorization engine supporting nested roles, tenant isolation, and custom permission policies.",
    problemStatement: `A B2B SaaS platform serves thousands of corporate clients. Each company has custom roles (Admin, Editor, Billing Manager, Viewer) with fine-grained resource permissions. Hardcoding 'if (user.role === admin)' checks in every API route has caused security regressions and data leaks between tenants.\n\nDesign an extensible, centralized authorization engine that evaluates permissions based on Tenant ID, Role Hierarchies, and Resource Attributes, caching permission decisions in memory for ultra-fast middleware evaluation.`,
    functionalRequirements: [
      "Tenant Isolation: zero possibility of User from Tenant A querying or mutating data belonging to Tenant B.",
      "Role Inheritance: e.g., 'Org Admin' inherits all permissions of 'Team Lead', which inherits from 'Member'.",
      "Attribute-Based Access Control (ABAC): support conditional rules, e.g., 'Can edit document IF document.status == draft AND document.author_id == user.id'.",
      "Middleware Guard: single clean decorator/middleware `can(action, resource)` for Next.js and API route handlers."
    ],
    nonFunctionalConstraints: [
      "Authorization check execution time under 1ms per request.",
      "Secure by default: unmapped routes default to 403 Forbidden.",
      "Comprehensive audit trail recording denied access attempts."
    ],
    techStack: ["TypeScript", "PostgreSQL", "Redis", "Next.js", "Zod"],
    industryRelevance: "Mandatory enterprise architectural pattern implemented at Auth0, Okta, WorkOS, and AWS IAM.",
    starterArchitecture: "HTTP Request -> Auth Middleware -> JWT Claims Extractor -> In-Memory Permission Tree Evaluator -> Policy Cache -> Route Handler.",
    deliverables: [
      "Reusable RBAC/ABAC authorization engine library.",
      "PostgreSQL schema with roles, permissions, role_inheritance, and tenant_policies tables.",
      "Test suite verifying 20+ edge cases including cross-tenant access attempts."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: Policy Data Model", description: "Design relational schema and JSON policy syntax for role inheritance." },
      { phase: "Phase 2: Evaluation Engine", description: "Build recursive role resolver and ABAC condition evaluator." },
      { phase: "Phase 3: Middleware & Cache", description: "Integrate with Next.js middleware and optimize with in-memory caching." }
    ]
  },
  {
    id: "ps-inmemory-orderbook-matcher",
    title: "Low-Latency In-Memory Order Book & Matching Engine",
    domain: "FinTech & Data",
    difficulty: "Industry Grade",
    timeEstimate: "2-3 Days",
    summary: "Develop a deterministic price-time priority order matching engine capable of executing limit and market orders under high concurrency.",
    problemStatement: `Cryptocurrency and stock trading platforms require sub-millisecond trade execution. Traditional database transactions are far too slow to match incoming bids and asks during heavy market volatility.\n\nConstruct an in-memory matching engine implementing the Price-Time Priority (FIFO) algorithm that processes incoming Limit Orders and Market Orders, maintains an active Bid and Ask book, generates trade execution receipts, and publishes a live Level-2 market depth feed.`,
    functionalRequirements: [
      "Maintain active Order Book with Bids (sorted descending by price) and Asks (sorted ascending by price).",
      "Support Order Types: Limit Order, Market Order, and Cancel Order.",
      "Price-Time Priority: orders with better prices execute first; equal prices execute in chronological arrival order.",
      "Emit trade execution events containing buyer_id, seller_id, matched_price, and matched_quantity.",
      "Generate live Level-2 market depth snapshots (top 10 price levels with aggregated quantities)."
    ],
    nonFunctionalConstraints: [
      "Throughput: process 50,000+ orders per second in a single worker thread without locks.",
      "Deterministic state: replayable transaction log capable of reconstructing the exact order book state after a restart.",
      "Zero floating-point inaccuracies: utilize integer cents or fixed-point arithmetic for currency."
    ],
    techStack: ["Go / Rust / C++ / TypeScript", "Red-Black Trees / Binary Heaps", "WebSockets", "Docker"],
    industryRelevance: "Quintessential technical challenge asked in Quant Finance, Crypto Exchanges, and HFT firms (Jane Street, Citadel, Binance).",
    starterArchitecture: "Order Ingress Queue -> Single-Threaded Matching Core (Double-Ended Priority Queues) -> Trade Output Stream -> Persistence Journal & WebSocket Broadcaster.",
    deliverables: [
      "Standalone matching engine executable with CLI benchmark.",
      "Stress test suite verifying matching correctness under randomized order flow.",
      "WebSocket stream broadcasting trade ticks and depth changes."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: Order Book Data Structure", description: "Implement Limit, Order, and PriceLevel structs using Doubly Linked Lists and Red-Black Trees." },
      { phase: "Phase 2: Matching Logic", description: "Implement cross-order matching loop with partial fills and remaining quantities." },
      { phase: "Phase 3: Benchmarks & Journaling", description: "Optimize memory allocation and write WAL (Write-Ahead Log) for crash recovery." }
    ],
    companySponsor: {
      name: "Citadel / Jane Street Quant Labs",
      tag: "Trading Systems",
      hiringTrack: "Low-Latency C++/Rust Developer",
      tier: "Industry Challenge"
    }
  },
  {
    id: "ps-stripe-webhook-engine",
    title: "Stripe-Grade Webhook Orchestrator & Replay Engine",
    domain: "FinTech & Data",
    difficulty: "Industry Grade",
    timeEstimate: "2-3 Days",
    summary: "Architect a resilient webhook dispatch and delivery engine with cryptographic signature verification (HMAC-SHA256), exponential backoff retries, dead-letter queues, and idempotent event deduplication.",
    problemStatement: `Third-party developers rely on webhooks for payment state transitions (e.g., payment_intent.succeeded). In unreliable client networks, endpoints drop requests or fail with 5xx status codes. Without reliable delivery and deduplication, merchant transactions get out-of-sync or trigger double charges.\n\nYou are tasked with building a production-grade webhook dispatch orchestrator that batches, signs, dispatches events with exponential backoff (1s, 5s, 30s, 5m, 1h), manages circuit breakers for failing merchant servers, and provides a developer portal for inspecting request payloads and triggering manual re-deliveries.`,
    functionalRequirements: [
      "HMAC-SHA256 Signature Header (Stripe-Signature): clients verify timestamp and secret hash to guard against replay attacks.",
      "Exponential backoff retry policy with jitter across 5 escalating retry windows.",
      "Dead Letter Queue (DLQ): route persistently failing endpoints to an inspection queue after max retries.",
      "Developer replay UI: self-service interface to view delivery status, HTTP status codes, latency, and 1-click manual re-dispatch."
    ],
    nonFunctionalConstraints: [
      "Throughput: capable of queueing and fanning out 10,000+ webhook deliveries per minute.",
      "Security: endpoint URLs validated to prevent Server-Side Request Forgery (SSRF) targeting internal IPs (127.0.0.1, 169.254.169.254).",
      "Isolation: slow merchant endpoints do not starve concurrent deliveries to healthy merchants."
    ],
    techStack: ["Node.js / Go", "PostgreSQL", "Redis / BullMQ", "Docker", "Next.js"],
    industryRelevance: "Direct replica of webhook delivery infrastructure powering Stripe, GitHub, Shopify, and Svix.",
    starterArchitecture: "Event Trigger -> Event Ledger (DB) -> BullMQ Priority Queues -> Dispatcher Worker Pool -> SSRF-Guarded HTTP Client -> Retry / DLQ Ledger -> Developer Portal.",
    deliverables: [
      "Webhook dispatcher server with HMAC signing middleware.",
      "Developer portal dashboard with live delivery logs, status filters, and replay trigger.",
      "Integration test suite simulating merchant server timeouts, 503 errors, and signature validation."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: Ingestion & HMAC Signer", description: "Design event payload schema, generate SHA256 timestamped signatures, and build client verification library." },
      { phase: "Phase 2: Queue Worker & Retry Scheduler", description: "Implement worker concurrency pools with BullMQ or Redis streams, handling jittered backoff." },
      { phase: "Phase 3: Security & Replay Console", description: "Implement SSRF IP blocking and develop the web log inspector with 1-click manual event retry." }
    ],
    companySponsor: {
      name: "Stripe Alumni / FinTech Syndicate",
      tag: "Payment Infra",
      hiringTrack: "Staff Backend / Systems Engineer",
      tier: "Flagship"
    }
  },
  {
    id: "ps-uber-geospatial-dispatch",
    title: "Uber-Scale Geospatial Driver Dispatch & Geohash Matcher",
    domain: "Distributed Systems",
    difficulty: "Industry Grade",
    timeEstimate: "3-4 Days",
    summary: "Build a real-time driver dispatch matching system using Uber H3 / Google S2 spatial indexing, dynamic surge pricing calculations, and low-latency nearest-neighbor WebSocket tracking.",
    problemStatement: `Urban mobility platforms process telemetry from 50,000+ active drivers emitting latitude/longitude coordinates every 4 seconds. When a rider requests a pickup, traditional SQL 'ST_DWithin' queries lock the database and time out under peak commute hours.\n\nYou must architect a distributed dispatch engine that partitions cities into discrete hexagonal geospatial cells (Uber H3 or Geohash), updates driver positions in an in-memory spatial index (Redis GEO / Tile38), dynamically calculates surge multipliers based on real-time cell supply vs. demand, and matches riders to the optimal driver in under 150ms.`,
    functionalRequirements: [
      "Stream continuous GPS driver telemetry over WebSockets and ingest into Redis GEO spatial index.",
      "H3 / Geohash Spatial Partitioning: group drivers and trip requests into resolution-8 hexagonal cells (~460m radius).",
      "Dynamic Surge Engine: compute localized surge multiplier based on cell-level driver-to-rider ratio updated every 15 seconds.",
      "Dispatch Matchmaker: find k-nearest available drivers within a 3km radius and propose ride requests with a 15-second acceptance countdown."
    ],
    nonFunctionalConstraints: [
      "Dispatch Latency: nearest-neighbor driver ranking returned in < 100ms for 99% of requests.",
      "Telemetry Ingest: support 20,000 coordinate updates/sec with zero memory leaks.",
      "Resilience: gracefully handle driver disconnections and re-route offers to next closest driver."
    ],
    techStack: ["Go / Python / Node.js", "Redis GEO / Tile38", "Uber H3", "WebSockets", "Mapbox / Leaflet"],
    industryRelevance: "Core algorithmic problem tested in staff-level system design at Uber, Lyft, DoorDash, and Grab.",
    starterArchitecture: "Driver App (WebSocket) -> Ingress Gateway -> Redis GEO Spatial Cache & H3 Aggregator -> Dynamic Surge Worker -> Dispatch Match Engine -> Rider App.",
    deliverables: [
      "Real-time geospatial dispatch service with WebSocket ingest and match endpoints.",
      "Live interactive web map showing driver clusters, H3 hexagonal heatmap overlays, and simulated ride matches.",
      "Benchmark report demonstrating sub-100ms dispatch under 10,000 simulated concurrent drivers."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: Spatial Ingestion", description: "Set up Redis GEO index and H3 resolution mapping for simulated vehicle streams." },
      { phase: "Phase 2: Surge & Supply Heatmaps", description: "Build background aggregation calculating demand/supply ratios and dynamic pricing factors." },
      { phase: "Phase 3: Dispatch & Interactive Map", description: "Implement nearest-neighbor dispatching and connect to a Leaflet/Mapbox frontend canvas." }
    ],
    companySponsor: {
      name: "Mobility Systems Scaleup",
      tag: "Geospatial",
      hiringTrack: "Distributed Systems Engineer",
      tier: "Industry Challenge"
    }
  },
  {
    id: "ps-epic-fhir-gateway",
    title: "Epic Systems FHIR Healthcare Interoperability Gateway & HIPAA Audit Trail",
    domain: "Full-Stack Web",
    difficulty: "Advanced",
    timeEstimate: "2-3 Days",
    summary: "Implement an HL7 / FHIR R4 clinical data translation gateway with end-to-end field-level encryption, tamper-proof cryptographically verifiable audit logs, and HIPAA consent rule validation.",
    problemStatement: `Modern healthcare networks must securely share Electronic Health Records (EHR) between hospitals, patient portals, and diagnostic labs under strict HIPAA compliance rules. Legacy hospital servers store records in proprietary formats (HL7 v2.x pipe-delimited strings) that cannot be consumed by modern web or mobile applications.\n\nYou are tasked with building a modern HL7 FHIR (Fast Healthcare Interoperability Resources) R4 gateway that ingests legacy patient data, validates and normalizes schemas into JSON FHIR Patient/Observation/Encounter resources, enforces granular patient consent policies, encrypts Protected Health Information (PHI) at rest, and generates an immutable, tamper-evident audit ledger compliant with HIPAA § 164.312.`,
    functionalRequirements: [
      "HL7 to FHIR R4 Parser: transform legacy pipe-delimited ADT messages into standardized JSON FHIR resources.",
      "Granular Patient Consent Engine: restrict access to sensitive mental health or genetic lab records based on explicit patient opt-ins.",
      "Field-Level PHI Encryption: encrypt sensitive fields (SSN, MRN, diagnoses) with envelope encryption (AES-256-GCM) using per-tenant keys.",
      "HIPAA Tamper-Evident Audit Trail: log every record read/export into an immutable SHA-256 hash-chained ledger."
    ],
    nonFunctionalConstraints: [
      "Zero plain-text PHI leaked into application log files or APM traces.",
      "Audit trail tamper detection: any modified audit record breaks the cryptographic chain and raises an automated alert.",
      "P95 query latency under 200ms on 100,000+ patient records."
    ],
    techStack: ["TypeScript / Node.js", "PostgreSQL", "FHIR R4 Schema", "AES-256-GCM", "Next.js"],
    industryRelevance: "Essential architecture for healthtech software engineers at Epic Systems, Cerner, Flatiron Health, and Ro.",
    starterArchitecture: "Hospital Ingest -> HL7 v2 Pipeline -> FHIR Validation -> Patient Consent Check -> PHI Field Encryption -> PostgreSQL + Hash-Chained Audit Ledger -> REST FHIR API.",
    deliverables: [
      "FHIR R4 compliant REST API server with /Patient, /Observation, and /Bundle endpoints.",
      "HIPAA compliance audit explorer UI verifying tamper-free cryptographic hash chains.",
      "Automated test suite demonstrating PHI masking, consent denial, and validation errors."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: FHIR R4 Schema & Ingestion", description: "Build Zod schemas for FHIR Patient and Observation models and parse incoming sample hospital records." },
      { phase: "Phase 2: PHI Encryption & Consent Engine", description: "Implement envelope encryption for sensitive fields and enforce patient access rules." },
      { phase: "Phase 3: Cryptographic Audit Chain", description: "Build hash-chained audit logging and patient portal viewer with export protections." }
    ],
    companySponsor: {
      name: "Digital Health Consortium",
      tag: "HealthTech",
      hiringTrack: "Full-Stack Health Tech Engineer",
      tier: "Sponsored Partner"
    }
  },
  {
    id: "ps-cloudflare-edge-reverse-proxy",
    title: "Cloudflare-Style Edge Reverse Proxy & DDoS Rate-Limiting Mesh",
    domain: "DevOps & Cloud",
    difficulty: "Industry Grade",
    timeEstimate: "2-3 Days",
    summary: "Construct a high-performance reverse proxy with SNI TLS termination, zero-copy HTTP/2 proxying, edge cache purge via Redis Pub/Sub, and eBPF/IP-hash DDoS mitigation.",
    problemStatement: `Modern web infrastructure requires edge reverse proxies that shield origin web servers from malicious traffic spikes, terminate TLS certificates dynamically, and serve cached static assets with sub-5ms time-to-first-byte (TTFB).\n\nYour assignment is to build a high-performance reverse proxy daemon that inspects incoming HTTP/HTTPS traffic, performs dynamic host-based routing to configured origin upstreams, manages an in-memory LRU cache with instant stale-while-revalidate purging, and throttles suspicious IP subnets using token-bucket rate limiting before traffic reaches customer backends.`,
    functionalRequirements: [
      "Dynamic Host Routing: proxy traffic based on Host header mapping to multi-region upstream origin pools.",
      "Edge Caching with Cache-Control: respect max-age, s-maxage, and implement instantaneous cache invalidation via Webhooks / Redis Pub/Sub.",
      "IP Reputation & Sliding Rate Limiter: track request frequencies per /24 subnet and issue JS challenges or 429 responses to abusive bots.",
      "Live Edge Telemetry: stream request logs, cache hit/miss ratios, and bandwidth metrics to a Prometheus exporter."
    ],
    nonFunctionalConstraints: [
      "Zero-Copy Proxying: pass response streams directly to clients with minimal memory buffering.",
      "Proxy Overhead: add less than 2ms latency on cache misses, and serve cache hits in < 1ms.",
      "High Concurrency: maintain stable memory consumption under 5,000 persistent HTTP keep-alive connections."
    ],
    techStack: ["Go / Rust / Node.js", "Redis Pub/Sub", "Docker", "Prometheus", "TLS / OpenSSL"],
    industryRelevance: "Core competency for Cloud Infrastructure, CDN, and Edge Network engineering roles at Cloudflare, Fastly, and AWS CloudFront.",
    starterArchitecture: "Client -> Edge Proxy Ingress -> IP Throttle & TLS Inspector -> In-Memory Edge Cache (Hit -> Instant Return) -> Upstream Origin Pool -> Telemetry Exporter.",
    deliverables: [
      "Standalone reverse proxy binary or container with YAML configuration.",
      "Cache benchmarking test comparing origin response latency vs. edge cache hit latency.",
      "Live analytics dashboard showing request volume, cache hit rates, and blocked IP counts."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: HTTP Reverse Proxy Core", description: "Implement HTTP reverse proxying with upstream connection pooling and health checks." },
      { phase: "Phase 2: Edge Caching & Instant Purge", description: "Build in-memory LRU cache respecting Cache-Control headers with Redis Pub/Sub invalidation." },
      { phase: "Phase 3: Rate Limiting & Metrics", description: "Add token bucket subnet throttling, Prometheus metrics endpoints, and Grafana dashboard." }
    ],
    companySponsor: {
      name: "Edge Computing Labs",
      tag: "Cloud Infrastructure",
      hiringTrack: "Platform & SRE Engineer",
      tier: "Flagship"
    }
  },
  {
    id: "ps-agentic-workflow-orchestrator",
    title: "Autonomous Multi-Agent Workflow Engine with Human Safeguards",
    domain: "AI & Machine Learning",
    difficulty: "Advanced",
    timeEstimate: "2-3 Days",
    summary: "Build a DAG-based LLM agent orchestration platform supporting asynchronous tool calling, branching execution trees, checkpointing state recovery, and mandatory human authorization gates for destructive actions.",
    problemStatement: `Autonomous AI agents capable of executing code, executing database queries, and sending emails often fail in production because they get stuck in infinite retry loops or execute irreversible operations (such as dropping a table or emailing clients) without human confirmation.\n\nYou must build a Directed Acyclic Graph (DAG) agent workflow execution engine that breaks complex user goals into atomic tasks, routes tasks to specialized agent personas (e.g. Researcher, Coder, Reviewer), enforces structured JSON tool calling, creates durable state checkpoints after every turn, and pauses execution with a Human-in-the-Loop (HITL) approval webhook before any high-risk action executes.`,
    functionalRequirements: [
      "DAG Workflow Planner: break high-level user instructions into a dependency-ordered task graph.",
      "Specialized Multi-Agent Personas: orchestrator dispatches tasks to Researcher, Planner, and Executing subagents.",
      "State Checkpointing & Replay: persist turn-by-turn workflow state in PostgreSQL; resume interrupted workflows from the last valid checkpoint.",
      "Human-in-the-Loop (HITL) Gate: high-risk actions (payment dispatch, database mutation, file deletion) pause execution and notify the user for 1-click Approval/Rejection."
    ],
    nonFunctionalConstraints: [
      "Strict Token Budgeting: enforce hard spending caps per workflow run to avoid runaway loop costs.",
      "Deterministic Recovery: recovering from a server crash reproduces the exact uncompleted execution graph.",
      "Structured output validation with Zod schemas to guarantee zero unparseable model responses."
    ],
    techStack: ["TypeScript / Python", "Gemini / OpenAI API", "PostgreSQL", "Next.js", "Zod", "Tailwind CSS"],
    industryRelevance: "Cutting-edge agent engineering pattern required for frontier AI developers building autonomous enterprise copilots.",
    starterArchitecture: "User Goal -> Planner Agent -> DAG Task Engine -> Subagent Pool (Tool Calls) -> [Risk Evaluator] -> (Safe: Execute | Risky: HITL Approval Gate) -> Checkpoint DB -> Result Aggregator.",
    deliverables: [
      "DAG agent orchestration framework with pluggable tool definitions.",
      "Interactive visual workflow UI rendering live node states (Pending, Running, Paused for HITL, Done).",
      "Benchmark test demonstrating error recovery and token cap enforcement."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: DAG Engine & Tool Calling", description: "Design node dependency graph evaluator with structured tool dispatch and Zod output validation." },
      { phase: "Phase 2: State Checkpointing & HITL", description: "Implement database persistence of graph execution state and human approval suspension logic." },
      { phase: "Phase 3: Visual Execution Canvas", description: "Build React flow / canvas frontend displaying real-time agent thoughts, tool payloads, and HITL prompt." }
    ],
    companySponsor: {
      name: "Frontier AI Systems",
      tag: "Applied AI",
      hiringTrack: "AI Systems & Agents Engineer",
      tier: "Flagship"
    }
  },
  {
    id: "ps-spatial-audio-whiteboard",
    title: "Real-Time Collaborative Whiteboard with WebRTC Spatial Audio",
    domain: "Full-Stack Web",
    difficulty: "Intermediate",
    timeEstimate: "1-2 Days",
    summary: "Develop an infinite canvas vector whiteboard with 60 FPS multi-user cursor sync, pressure-sensitive pen strokes, and proximity-based WebRTC 3D spatial audio.",
    problemStatement: `Remote engineering teams brainstorming system architectures struggle with disjointed video calls where everyone talks over each other while sharing a static screen. They need an interactive digital canvas where developers can gather in small clusters, sketch diagrams with low latency, and hear teammates naturally based on their physical distance on the canvas.\n\nYou are tasked with building an infinite collaborative whiteboard that renders smooth vector strokes (HTML5 Canvas / SVG), synchronizes multi-user elements via WebSockets, and integrates WebRTC peer-to-peer audio with a Web Audio PannerNode that attenuates voice volume and pans stereo audio based on the 2D distance between user cursors.`,
    functionalRequirements: [
      "Infinite 2D Canvas with smooth zoom, pan, and pressure-sensitive freehand drawing using Bezier curves.",
      "Multi-user synchronization: shapes, sticky notes, and drawing paths synchronized in real time with optimistic local rendering.",
      "WebRTC Mesh Audio: peer-to-peer audio streaming between teammates in the room.",
      "3D Spatial Audio: use Web Audio API PannerNode to calculate distance-based volume attenuation and stereo panning (left/right) relative to peer cursor positions."
    ],
    nonFunctionalConstraints: [
      "Drawing latency under 30ms for local strokes and under 80ms across remote peers.",
      "Audio clarity: echo cancellation and noise suppression enabled via getUserMedia constraints.",
      "Support up to 12 simultaneous collaborators on a single board without UI stutter (60 FPS)."
    ],
    techStack: ["Next.js", "TypeScript", "HTML5 Canvas / Fabric.js", "WebRTC", "Web Audio API", "Tailwind CSS"],
    industryRelevance: "Direct implementation of collaborative technologies powering Miro, Figma, FigJam, and Gather.town.",
    starterArchitecture: "Canvas Client (Pointer Events) -> WebSocket State Sync -> WebRTC Signaling Server -> Web Audio API Spatial Panner -> Spatial Audio Output.",
    deliverables: [
      "Complete interactive collaborative whiteboard web application.",
      "Spatial audio canvas with visual proximity circle indicators around teammates.",
      "Documentation on spatial audio mathematics and WebRTC peer connection management."
    ],
    suggestedRoadmap: [
      { phase: "Phase 1: Infinite Canvas & Pen Engine", description: "Build 2D canvas with panning, zooming, and smooth curve smoothing algorithms." },
      { phase: "Phase 2: WebSocket State Synchronization", description: "Broadcast user stroke chunks, cursor coordinates, and board elements." },
      { phase: "Phase 3: WebRTC Audio & Spatial Panning", description: "Wire peer audio streams and dynamically update PannerNode coordinates based on canvas distance." }
    ],
    companySponsor: {
      name: "Modern Collab Suite",
      tag: "Product Eng",
      hiringTrack: "Frontend & WebRTC Engineer",
      tier: "Sponsored Partner"
    }
  }
];
