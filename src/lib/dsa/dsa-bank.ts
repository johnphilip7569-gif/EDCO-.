export type DsaTier = "Beginner" | "Intermediate" | "Advanced";
export type InterviewFrequency = "High" | "Medium" | "Low";
export type DsaQuestionType = "trace_output" | "complexity" | "conceptual_ordering";
export type VisualizerType = "two_pointer" | "linked_list" | "tree_traversal" | "sorting" | "graph_bfs_dfs" | "dp_table" | null;

export interface WorkedExample {
  title: string;
  problem: string;
  approach: string;
  steps: Array<{ step: number; title: string; explanation: string; stateSnapshot?: string }>;
  conclusion: string;
}

export interface DsaTopic {
  id: string;
  name: string;
  slug: string;
  tier: DsaTier;
  difficulty_level: 0 | 1 | 2;
  interview_frequency: InterviewFrequency;
  prerequisite_topic_ids: string[];
  explainer_concept: string;
  explainer_why_it_matters: string;
  explainer_common_use: string;
  worked_example: WorkedExample;
  visualizer_type: VisualizerType;
  order_index: number;
}

export interface DsaQuestionOption {
  id: string;
  text: string;
}

export interface DsaQuestion {
  id: string;
  topic_id: string;
  difficulty_level: 0 | 1 | 2; // 0: Foundational, 1: Intermediate, 2: Advanced
  question_type: DsaQuestionType;
  question_text: string;
  code_snippet?: string; // Display only, never executed!
  options: DsaQuestionOption[];
  correct_answer: string;
  explanation: string;
}

export const DSA_TOPICS: DsaTopic[] = [
  // ==========================================
  // BEGINNER (FOUNDATIONS)
  // ==========================================
  {
    id: "big-o",
    name: "Time & Space Complexity (Big-O)",
    slug: "big-o",
    tier: "Beginner",
    difficulty_level: 0,
    interview_frequency: "High",
    prerequisite_topic_ids: [],
    explainer_concept: "Big-O notation describes the limiting behavior of a function when the argument tends towards infinity. In engineering, it quantifies how an algorithm's execution time or memory footprint scales relative to input size N.",
    explainer_why_it_matters: "Every technical interviewer assesses whether your solution scales or blows up in production. Choosing an O(N) approach over O(N²) can turn an 11-day batch job into a 2-second API response.",
    explainer_common_use: "Evaluating trade-offs between hash map lookups (O(1) time, O(N) memory) versus nested loop comparisons (O(N²) time, O(1) memory).",
    worked_example: {
      title: "Analyzing a Search Function",
      problem: "Given an unsorted list of N user IDs, what is the worst-case time complexity of finding a specific target ID?",
      approach: "Linear scan from index 0 to N-1.",
      steps: [
        { step: 1, title: "Best Case", explanation: "The target is at index 0. Requires 1 comparison: O(1)." },
        { step: 2, title: "Worst Case", explanation: "The target is at index N-1 or not present. Requires N comparisons: O(N)." },
        { step: 3, title: "Memory Allocation", explanation: "Only uses a single iterator pointer variable: O(1) auxiliary space." }
      ],
      conclusion: "Linear search operates in O(N) time and O(1) space."
    },
    visualizer_type: null,
    order_index: 1,
  },
  {
    id: "arrays-strings",
    name: "Arrays & Strings",
    slug: "arrays-strings",
    tier: "Beginner",
    difficulty_level: 0,
    interview_frequency: "High",
    prerequisite_topic_ids: ["big-o"],
    explainer_concept: "Contiguous blocks of memory holding elements of uniform size. Provides O(1) random access via index calculation `base_address + index * element_size`.",
    explainer_why_it_matters: "Arrays are the foundational hardware-efficient data structure with optimal CPU cache locality. Nearly 40% of coding interview drills use arrays or strings.",
    explainer_common_use: "Buffer manipulation, in-place string reversals, two-pointer filtering, and prefix-sum cache tables.",
    worked_example: {
      title: "In-Place Array Reversal",
      problem: "Reverse an array of numbers [1, 2, 3, 4, 5] without allocating a second array.",
      approach: "Two pointers starting at boundary edges swapping inwards until they meet in the middle.",
      steps: [
        { step: 1, title: "Initialize Pointers", explanation: "Left pointer at index 0 (val 1), Right pointer at index 4 (val 5)." },
        { step: 2, title: "First Swap", explanation: "Swap elements at 0 and 4: [5, 2, 3, 4, 1]. Advance left to 1, decrement right to 3." },
        { step: 3, title: "Second Swap", explanation: "Swap elements at 1 and 3: [5, 4, 3, 2, 1]. Advance left to 2, decrement right to 2." },
        { step: 4, title: "Termination", explanation: "Left == Right (index 2). Array is completely reversed." }
      ],
      conclusion: "Takes N/2 swaps: O(N) time and O(1) auxiliary space."
    },
    visualizer_type: "two_pointer",
    order_index: 2,
  },
  {
    id: "searching",
    name: "Searching Algorithms",
    slug: "searching",
    tier: "Beginner",
    difficulty_level: 0,
    interview_frequency: "High",
    prerequisite_topic_ids: ["arrays-strings"],
    explainer_concept: "Techniques for retrieving elements from a collection. While Linear Search checks every item, Binary Search repeatedly halves the search interval on sorted data.",
    explainer_why_it_matters: "Binary Search reduces search overhead from 1,000,000 operations to just 20 comparisons. It is the backbone of database indexing (B-Trees) and range queries.",
    explainer_common_use: "Finding target IDs in sorted database indexes, locating peak elements, and search-in-rotated-sorted-array problems.",
    worked_example: {
      title: "Binary Search on Sorted Array",
      problem: "Search for target 23 in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91].",
      approach: "Calculate middle index `mid = left + (right - left) / 2`. Narrow search window by half each iteration.",
      steps: [
        { step: 1, title: "Window [0..9]", explanation: "mid = 4 (value 16). Since 23 > 16, discard left half. New left = 5." },
        { step: 2, title: "Window [5..9]", explanation: "mid = 7 (value 56). Since 23 < 56, discard right half. New right = 6." },
        { step: 3, title: "Window [5..6]", explanation: "mid = 5 (value 23). Match found at index 5!" }
      ],
      conclusion: "Found in 3 steps on 10 elements: O(log N) time, O(1) space."
    },
    visualizer_type: "two_pointer",
    order_index: 3,
  },
  {
    id: "sorting-intuition",
    name: "Sorting Foundations",
    slug: "sorting-intuition",
    tier: "Beginner",
    difficulty_level: 0,
    interview_frequency: "Medium",
    prerequisite_topic_ids: ["arrays-strings"],
    explainer_concept: "Elementary sorting algorithms (Bubble, Selection, Insertion) systematically organize elements into monotonic order by repeatedly comparing adjacent or minimum elements.",
    explainer_why_it_matters: "While slower than Merge or Quick Sort for huge datasets, they form the bedrock of algorithmic intuition and are optimal for small or nearly sorted arrays.",
    explainer_common_use: "Insertion sort is used inside production hybrid sorting engines (e.g. Python's Timsort and Java's Dual-Pivot Quicksort) for small partitions (N < 32).",
    worked_example: {
      title: "Bubble Sort Pass",
      problem: "Sort [5, 1, 4, 2, 8] using adjacent pair comparisons.",
      approach: "Pass through array, compare adjacent pairs, swap if left > right. Largest unsorted element floats to end.",
      steps: [
        { step: 1, title: "Compare (5, 1)", explanation: "5 > 1 -> Swap to [1, 5, 4, 2, 8]." },
        { step: 2, title: "Compare (5, 4)", explanation: "5 > 4 -> Swap to [1, 4, 5, 2, 8]." },
        { step: 3, title: "Compare (5, 2)", explanation: "5 > 2 -> Swap to [1, 4, 2, 5, 8]." },
        { step: 4, title: "Compare (5, 8)", explanation: "5 < 8 -> Keep order. First pass finished with 8 locked in place." }
      ],
      conclusion: "After all passes: sorted in O(N²) worst-case time, O(1) space."
    },
    visualizer_type: "sorting",
    order_index: 4,
  },
  {
    id: "recursion-basics",
    name: "Recursion Basics",
    slug: "recursion-basics",
    tier: "Beginner",
    difficulty_level: 0,
    interview_frequency: "Medium",
    prerequisite_topic_ids: ["big-o"],
    explainer_concept: "A technique where a function solves a problem by calling itself with smaller subproblems until hitting a terminating base condition.",
    explainer_why_it_matters: "Recursion is the engine behind Tree traversals, Graph DFS, and Dynamic Programming. Understanding the call stack prevents stack overflow crashes in production.",
    explainer_common_use: "DOM tree traversal, JSON serialization, directory structure walking, and Divide-and-Conquer algorithms.",
    worked_example: {
      title: "Recursive Factorial",
      problem: "Compute factorial of N = 4: `4! = 4 * 3 * 2 * 1`.",
      approach: "Base case: if N <= 1 return 1. Recursive case: return N * fact(N - 1).",
      steps: [
        { step: 1, title: "Call Stack Push", explanation: "fact(4) calls fact(3) calls fact(2) calls fact(1)." },
        { step: 2, title: "Base Case Hit", explanation: "fact(1) returns 1 without further recursion." },
        { step: 3, title: "Unwinding Stack", explanation: "fact(2) = 2*1=2. fact(3) = 3*2=6. fact(4) = 4*6=24." }
      ],
      conclusion: "Returns 24. Takes O(N) time and O(N) call-stack memory space."
    },
    visualizer_type: null,
    order_index: 5,
  },
  {
    id: "basic-math",
    name: "Basic Math for DSA",
    slug: "basic-math",
    tier: "Beginner",
    difficulty_level: 0,
    interview_frequency: "Low",
    prerequisite_topic_ids: ["big-o"],
    explainer_concept: "Essential mathematical principles for competitive coding: Euclidean GCD/LCM, Sieve of Eratosthenes prime checks, and fundamental bit manipulation (`&`, `|`, `^`, `<<`, `>>`).",
    explainer_why_it_matters: "Recognizing number theory and bitwise tricks allows solving problems in O(1) or O(log N) where naive brute force takes O(N²).",
    explainer_common_use: "Checking if a number is power of 2 with `n & (n - 1) == 0`, finding single unique element with XOR in O(N).",
    worked_example: {
      title: "Euclidean GCD Algorithm",
      problem: "Find the Greatest Common Divisor of 48 and 18.",
      approach: "Repeatedly compute `gcd(b, a % b)` until remainder is 0.",
      steps: [
        { step: 1, title: "Iteration 1", explanation: "48 % 18 = 12. Next compute gcd(18, 12)." },
        { step: 2, title: "Iteration 2", explanation: "18 % 12 = 6. Next compute gcd(12, 6)." },
        { step: 3, title: "Iteration 3", explanation: "12 % 6 = 0. Remainder is 0, so GCD is 6." }
      ],
      conclusion: "GCD is 6. Computes in O(log(min(A, B))) time."
    },
    visualizer_type: null,
    order_index: 6,
  },

  // ==========================================
  // INTERMEDIATE
  // ==========================================
  {
    id: "linked-lists",
    name: "Linked Lists",
    slug: "linked-lists",
    tier: "Intermediate",
    difficulty_level: 1,
    interview_frequency: "High",
    prerequisite_topic_ids: ["arrays-strings"],
    explainer_concept: "Linear collection of data nodes linked via reference pointers rather than contiguous memory slots. Supports O(1) insertions/deletions at known positions.",
    explainer_why_it_matters: "Crucial for building LRU caches, memory allocators, and operating system kernels. Interviewers love pointer manipulation because it tests clean edge-case handling.",
    explainer_common_use: "LRU Cache (doubly linked list + hash map), undo/redo stacks, and streaming data buffers.",
    worked_example: {
      title: "In-Place Singly Linked List Reversal",
      problem: "Reverse list: 1 -> 2 -> 3 -> NULL to 3 -> 2 -> 1 -> NULL.",
      approach: "Use three pointers: `prev = null`, `curr = head`, and `next = null`.",
      steps: [
        { step: 1, title: "Store Next", explanation: "next = curr.next (save node 2 so reference isn't lost)." },
        { step: 2, title: "Reverse Pointer", explanation: "curr.next = prev (node 1 now points to null)." },
        { step: 3, title: "Advance Pointers", explanation: "prev = curr (node 1), curr = next (node 2). Repeat until curr is null." }
      ],
      conclusion: "List reversed in O(N) time and O(1) space."
    },
    visualizer_type: "linked_list",
    order_index: 7,
  },
  {
    id: "stacks-queues",
    name: "Stacks & Queues",
    slug: "stacks-queues",
    tier: "Intermediate",
    difficulty_level: 1,
    interview_frequency: "High",
    prerequisite_topic_ids: ["arrays-strings", "linked-lists"],
    explainer_concept: "Constrained abstract data types: Stacks follow LIFO (Last-In, First-Out), while Queues follow FIFO (First-In, First-Out). Includes monotonic stacks and double-ended queues (deque).",
    explainer_why_it_matters: "Powers browser history, parenthesis matching, job dispatchers, and Next Greater Element interview questions.",
    explainer_common_use: "Parsing compiler syntax trees, message queues (RabbitMQ/Kafka consumer queues), and BFS graph explorations.",
    worked_example: {
      title: "Valid Parentheses Verification",
      problem: "Determine if string `{[()]}` is valid.",
      approach: "Push opening brackets onto stack. For each closing bracket, check if top of stack matches.",
      steps: [
        { step: 1, title: "Push Openings", explanation: "Encounter '{', '[', '('. Stack: ['{', '[', '(']." },
        { step: 2, title: "Match ')'", explanation: "Top of stack is '('. Match succeeds; pop '('." },
        { step: 3, title: "Match ']' and '}'", explanation: "Top is '['; pop. Top is '{'; pop. Stack empty." }
      ],
      conclusion: "Stack is empty at end: string is valid. O(N) time, O(N) space."
    },
    visualizer_type: null,
    order_index: 8,
  },
  {
    id: "hashing",
    name: "Hashing & Hash Tables",
    slug: "hashing",
    tier: "Intermediate",
    difficulty_level: 1,
    interview_frequency: "High",
    prerequisite_topic_ids: ["arrays-strings"],
    explainer_concept: "A data structure implementing an associative array mapping keys to values using a mathematical hash function. Achieves average O(1) search, insertion, and deletion.",
    explainer_why_it_matters: "The most widely used data structure in software engineering. Transforms costly O(N²) nested lookups into blazing fast O(N) linear solutions.",
    explainer_common_use: "Two-sum problems, caching database records, tracking frequencies, and detecting duplicate streams.",
    worked_example: {
      title: "Two Sum in O(N) Time",
      problem: "Given nums = [2, 7, 11, 15] and target = 9, find indices that sum to 9.",
      approach: "Iterate through nums. For each x, check if complement `(target - x)` exists in hash map.",
      steps: [
        { step: 1, title: "Index 0 (val 2)", explanation: "Complement is 7. Map is empty. Store {2: 0} in map." },
        { step: 2, title: "Index 1 (val 7)", explanation: "Complement is 2. 2 is found in map at index 0!" },
        { step: 3, title: "Return Result", explanation: "Return [0, 1] immediately." }
      ],
      conclusion: "Solved in single pass: O(N) time and O(N) space."
    },
    visualizer_type: null,
    order_index: 9,
  },
  {
    id: "trees",
    name: "Trees & Binary Search Trees",
    slug: "trees",
    tier: "Intermediate",
    difficulty_level: 1,
    interview_frequency: "High",
    prerequisite_topic_ids: ["recursion-basics", "stacks-queues"],
    explainer_concept: "Hierarchical non-linear data structures consisting of parent-child nodes with a single root. A Binary Search Tree (BST) maintains the invariant: left child < parent < right child.",
    explainer_why_it_matters: "Enables logarithmic search, insertion, and deletion. Standard BST traversals (In-order, Pre-order, Post-order, Level-order) appear in over 30% of tier-1 tech interviews.",
    explainer_common_use: "Filesystem directories, HTML DOM hierarchy, database indexing, and autocomplete suggestions.",
    worked_example: {
      title: "BST In-Order Traversal",
      problem: "Perform In-Order traversal on BST with root 4, left child 2, right child 6.",
      approach: "Visit left subtree, process current node, visit right subtree.",
      steps: [
        { step: 1, title: "Traverse Left", explanation: "Move to left child (node 2). Its left is null. Output 2." },
        { step: 2, title: "Process Root", explanation: "Backtrack to root (node 4). Output 4." },
        { step: 3, title: "Traverse Right", explanation: "Move to right child (node 6). Output 6." }
      ],
      conclusion: "Produces sorted sequence: [2, 4, 6] in O(N) time."
    },
    visualizer_type: "tree_traversal",
    order_index: 10,
  },
  {
    id: "heaps",
    name: "Heaps & Priority Queues",
    slug: "heaps",
    tier: "Intermediate",
    difficulty_level: 1,
    interview_frequency: "Medium",
    prerequisite_topic_ids: ["trees", "arrays-strings"],
    explainer_concept: "A specialized tree-based data structure satisfying the heap invariant: in a Min-Heap, parent is always <= children; in a Max-Heap, parent is always >= children. Provides O(1) access to min/max and O(log N) insert/extract.",
    explainer_why_it_matters: "Optimal for streaming top-K problems, task scheduling, and Dijkstra's shortest path algorithm.",
    explainer_common_use: "OS process priority schedulers, finding the median of a data stream, and top-K frequent elements.",
    worked_example: {
      title: "Top K Largest Elements",
      problem: "Find 2 largest numbers in [3, 2, 1, 5, 6, 4] with K = 2.",
      approach: "Maintain a Min-Heap of size K = 2. Push elements; if size > K, pop minimum.",
      steps: [
        { step: 1, title: "Insert 3, 2", explanation: "Min-Heap contains [2, 3]." },
        { step: 2, title: "Insert 1, 5", explanation: "Insert 1, pop 1 (heap has [2, 3]). Insert 5, pop 2 (heap has [3, 5])." },
        { step: 3, title: "Insert 6, 4", explanation: "Insert 6, pop 3 (heap has [5, 6]). Insert 4, pop 4 (heap has [5, 6])." }
      ],
      conclusion: "Top 2 largest elements are 5 and 6. O(N log K) time, O(K) space."
    },
    visualizer_type: null,
    order_index: 11,
  },
  {
    id: "merge-quick-sort",
    name: "Merge Sort & Quick Sort",
    slug: "merge-quick-sort",
    tier: "Intermediate",
    difficulty_level: 1,
    interview_frequency: "High",
    prerequisite_topic_ids: ["sorting-intuition", "recursion-basics"],
    explainer_concept: "Divide-and-Conquer sorting algorithms that achieve optimal O(N log N) comparison sort performance. Merge Sort divides recursively and merges sorted halves; Quick Sort partitions around a pivot.",
    explainer_why_it_matters: "The real-world workhorses of modern programming language standard libraries (`Array.sort`, `std::sort`). Frequently tested in system design and algorithmic rounds.",
    explainer_common_use: "External sorting of massive multi-gigabyte files (Merge Sort), in-memory fast sorting (Quick Sort).",
    worked_example: {
      title: "Merge Step of Merge Sort",
      problem: "Merge two sorted halves [2, 5] and [1, 4] into a single sorted array.",
      approach: "Use two pointers comparing head elements and placing the smaller into the output buffer.",
      steps: [
        { step: 1, title: "Compare 2 and 1", explanation: "1 < 2 -> Take 1. Output: [1]." },
        { step: 2, title: "Compare 2 and 4", explanation: "2 < 4 -> Take 2. Output: [1, 2]." },
        { step: 3, title: "Compare 5 and 4", explanation: "4 < 5 -> Take 4. Output: [1, 2, 4]." },
        { step: 4, title: "Append Remaining", explanation: "Append 5. Output: [1, 2, 4, 5]." }
      ],
      conclusion: "Linear merge in O(N) time and O(N) auxiliary space."
    },
    visualizer_type: "sorting",
    order_index: 12,
  },
  {
    id: "two-pointer-sliding-window",
    name: "Two-Pointer & Sliding Window",
    slug: "two-pointer-sliding-window",
    tier: "Intermediate",
    difficulty_level: 1,
    interview_frequency: "High",
    prerequisite_topic_ids: ["arrays-strings"],
    explainer_concept: "A core pattern where two pointers iterate across an array or string in coordinated fashion, either moving towards each other (Two-Pointer) or forming a dynamic contiguous subsegment (Sliding Window).",
    explainer_why_it_matters: "Reduces quadratic O(N²) substring and subarray brute-force approaches down to linear O(N) time.",
    explainer_common_use: "Longest substring without repeating characters, container with most water, minimum window substring.",
    worked_example: {
      title: "Container With Most Water",
      problem: "Find max area enclosed between vertical lines with heights [1, 8, 6, 2, 5, 4, 8, 3, 7].",
      approach: "Pointers at both ends. Compute area = `min(height[L], height[R]) * (R - L)`. Move pointer with smaller height inward.",
      steps: [
        { step: 1, title: "Initialize Boundaries", explanation: "L = 0 (h=1), R = 8 (h=7). Area = min(1, 7)*8 = 8." },
        { step: 2, title: "Advance Smaller", explanation: "L advances to 1 (h=8). Area = min(8, 7)*7 = 49." },
        { step: 3, title: "Converge Inward", explanation: "Continue shrinking until pointers meet, tracking max area (49)." }
      ],
      conclusion: "Finds global maximum in O(N) time and O(1) space."
    },
    visualizer_type: "two_pointer",
    order_index: 13,
  },
  {
    id: "backtracking",
    name: "Recursion & Backtracking",
    slug: "backtracking",
    tier: "Intermediate",
    difficulty_level: 1,
    interview_frequency: "Medium",
    prerequisite_topic_ids: ["recursion-basics"],
    explainer_concept: "An algorithmic technique for finding all (or some) solutions to computational problems by incrementally building candidates and abandoning ('backtracking') a candidate as soon as it cannot lead to a valid solution.",
    explainer_why_it_matters: "Essential for solving combinatorial search problems (subsets, permutations, Sudoku solver, N-Queens).",
    explainer_common_use: "Route planning with constraints, game AI exploration trees, constraint satisfaction engines.",
    worked_example: {
      title: "Generating All Subsets (Power Set)",
      problem: "Generate all subsets of [1, 2].",
      approach: "At each index, choose to either include the current element or exclude it, then recurse.",
      steps: [
        { step: 1, title: "Index 0 (val 1)", explanation: "Branch A: include 1. Branch B: exclude 1." },
        { step: 2, title: "Index 1 (val 2)", explanation: "For both branches, test including or excluding 2." },
        { step: 3, title: "Leaf Nodes", explanation: "Leaves produce: [], [2], [1], [1, 2]." }
      ],
      conclusion: "Generates 2^N subsets: O(2^N) time and O(N) stack space."
    },
    visualizer_type: null,
    order_index: 14,
  },

  // ==========================================
  // ADVANCED
  // ==========================================
  {
    id: "graphs",
    name: "Graphs (Representations & Traversals)",
    slug: "graphs",
    tier: "Advanced",
    difficulty_level: 2,
    interview_frequency: "High",
    prerequisite_topic_ids: ["trees", "stacks-queues"],
    explainer_concept: "A non-linear data structure comprising vertices (nodes) connected by edges. Can be directed or undirected, weighted or unweighted. Stored via Adjacency List (memory efficient) or Adjacency Matrix (O(1) edge lookup).",
    explainer_why_it_matters: "Models social networks, computer networks, road maps, and dependency resolution. BFS and DFS traversals are fundamental technical interview requirements.",
    explainer_common_use: "Social network friend connections, shortest path in unweighted grids, web crawlers, cycle detection.",
    worked_example: {
      title: "Breadth-First Search (BFS)",
      problem: "Explore all nodes reachable from node A in graph: A-B, A-C, B-D.",
      approach: "Use a FIFO queue and a visited set to explore nodes level-by-level.",
      steps: [
        { step: 1, title: "Initialize", explanation: "Queue: [A]. Visited: {A}." },
        { step: 2, title: "Pop A", explanation: "Visit neighbors B and C. Queue: [B, C]. Visited: {A, B, C}." },
        { step: 3, title: "Pop B", explanation: "Visit neighbor D. Queue: [C, D]. Visited: {A, B, C, D}." },
        { step: 4, title: "Pop C & D", explanation: "No new unvisited neighbors. Queue empty." }
      ],
      conclusion: "Traversed in O(V + E) time and O(V) space."
    },
    visualizer_type: "graph_bfs_dfs",
    order_index: 15,
  },
  {
    id: "graph-algorithms",
    name: "Advanced Graph Algorithms",
    slug: "graph-algorithms",
    tier: "Advanced",
    difficulty_level: 2,
    interview_frequency: "High",
    prerequisite_topic_ids: ["graphs", "heaps"],
    explainer_concept: "Specialized graph algorithms: Dijkstra's Shortest Path for weighted graphs, Union-Find (Disjoint Set) for dynamic connectivity, and Topological Sort for directed acyclic graph (DAG) dependency orders.",
    explainer_why_it_matters: "Asked in senior and high-bar placement rounds. Powers GPS navigation, package dependency builders (npm/pip), and network routing protocols (OSPF).",
    explainer_common_use: "Course schedule prerequisites (Topological Sort), map navigation (Dijkstra), minimum spanning trees (Kruskal/Prim).",
    worked_example: {
      title: "Topological Sort on Course Schedule",
      problem: "Order courses where Math 101 must precede Math 201, and Math 201 precedes Math 301.",
      approach: "Compute in-degrees for each node. Use Kahn's algorithm with a queue of in-degree 0 nodes.",
      steps: [
        { step: 1, title: "In-Degree Counts", explanation: "Math 101: 0, Math 201: 1, Math 301: 1." },
        { step: 2, title: "Process 0 in-degree", explanation: "Queue Math 101. Decrement Math 201 in-degree to 0." },
        { step: 3, title: "Process Math 201", explanation: "Queue Math 201. Decrement Math 301 in-degree to 0." },
        { step: 4, title: "Process Math 301", explanation: "All courses scheduled: [101, 201, 301]." }
      ],
      conclusion: "Valid linear ordering found in O(V + E) time."
    },
    visualizer_type: "graph_bfs_dfs",
    order_index: 16,
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming (DP)",
    slug: "dynamic-programming",
    tier: "Advanced",
    difficulty_level: 2,
    interview_frequency: "High",
    prerequisite_topic_ids: ["recursion-basics", "arrays-strings"],
    explainer_concept: "An optimization technique that solves complex problems by breaking them into overlapping subproblems with optimal substructure, caching subproblem solutions (memoization or tabulation) to prevent redundant work.",
    explainer_why_it_matters: "The single most dreaded and revered technical interview topic. Transforms exponential O(2^N) brute-force algorithms into polynomial O(N) or O(N²) solutions.",
    explainer_common_use: "DNA sequence alignment (Needleman-Wunsch), text diff tools (Longest Common Subsequence), financial portfolio optimization (Knapsack).",
    worked_example: {
      title: "Climbing Stairs (1D DP)",
      problem: "You can climb 1 or 2 steps at a time. In how many distinct ways can you climb N = 4 stairs?",
      approach: "Optimal substructure: `dp[i] = dp[i - 1] + dp[i - 2]`.",
      steps: [
        { step: 1, title: "Base Cases", explanation: "dp[1] = 1 way. dp[2] = 2 ways." },
        { step: 2, title: "Compute step 3", explanation: "dp[3] = dp[2] + dp[1] = 2 + 1 = 3 ways." },
        { step: 3, title: "Compute step 4", explanation: "dp[4] = dp[3] + dp[2] = 3 + 2 = 5 ways." }
      ],
      conclusion: "Total 5 distinct ways. Computed in O(N) time and O(1) space."
    },
    visualizer_type: "dp_table",
    order_index: 17,
  },
  {
    id: "greedy-algorithms",
    name: "Greedy Algorithms",
    slug: "greedy-algorithms",
    tier: "Advanced",
    difficulty_level: 2,
    interview_frequency: "Medium",
    prerequisite_topic_ids: ["sorting-intuition"],
    explainer_concept: "An algorithmic paradigm that makes the locally optimal choice at each stage with the hope of finding a global optimum. Only works when the problem possesses the Greedy-Choice Property and Optimal Substructure.",
    explainer_why_it_matters: "Executes significantly faster than Dynamic Programming when applicable. Proving correctness requires mathematical rigor (exchange arguments).",
    explainer_common_use: "Interval scheduling, Huffman coding data compression, Kruskal's minimum spanning tree, coin change with standard denominations.",
    worked_example: {
      title: "Interval Scheduling Maximization",
      problem: "Select maximum number of non-overlapping meetings from [(1, 3), (2, 4), (3, 5)].",
      approach: "Greedy strategy: always pick the meeting with earliest end time.",
      steps: [
        { step: 1, title: "Sort by End Time", explanation: "Sorted: (1, 3), (2, 4), (3, 5)." },
        { step: 2, title: "Pick First", explanation: "Select (1, 3). End time is now 3." },
        { step: 3, title: "Evaluate Remaining", explanation: "(2, 4) starts at 2 < 3 (conflict, skip). (3, 5) starts at 3 >= 3 (select!)." }
      ],
      conclusion: "Maximum 2 meetings selected in O(N log N) time."
    },
    visualizer_type: null,
    order_index: 18,
  },
  {
    id: "tries",
    name: "Tries (Prefix Trees)",
    slug: "tries",
    tier: "Advanced",
    difficulty_level: 2,
    interview_frequency: "Medium",
    prerequisite_topic_ids: ["trees", "hashing"],
    explainer_concept: "A tree-like data structure used for storing a dynamic set or associative array where the keys are usually strings. Each node represents a single character, with edges defining transitions.",
    explainer_why_it_matters: "Enables prefix search in O(L) time where L is word length, completely independent of the dictionary size N.",
    explainer_common_use: "Search engine autocomplete, spell-checkers, IP routing table lookup (longest prefix match).",
    worked_example: {
      title: "Prefix Search in Trie",
      problem: "Check if any word starts with 'ca' given dictionary ['cat', 'car', 'dog'].",
      approach: "Traverse tree from root: root -> 'c' -> 'a'.",
      steps: [
        { step: 1, title: "Root to 'c'", explanation: "Child 'c' exists. Advance." },
        { step: 2, title: "'c' to 'a'", explanation: "Child 'a' exists. Advance." },
        { step: 3, title: "Evaluate Subtree", explanation: "Node 'a' exists and has children ('t', 'r'). Prefix exists!" }
      ],
      conclusion: "Prefix verified in O(L = 2) operations."
    },
    visualizer_type: null,
    order_index: 19,
  },
  {
    id: "advanced-trees",
    name: "Advanced Trees (AVL, Red-Black & Segment Trees)",
    slug: "advanced-trees",
    tier: "Advanced",
    difficulty_level: 2,
    interview_frequency: "Low",
    prerequisite_topic_ids: ["trees"],
    explainer_concept: "Self-balancing binary search trees (AVL, Red-Black Trees) that maintain O(log N) height via rotations to prevent degenerate O(N) linked-list skewing. Also covers Segment Trees and Fenwick Trees (Binary Indexed Trees) for dynamic range queries.",
    explainer_why_it_matters: "Explains how production databases (Postgres, MySQL) and standard library sets (`std::set`, `TreeSet`) guarantee O(log N) operations in the worst case.",
    explainer_common_use: "Database index balancing, range minimum queries (RMQ), live leaderboard updates.",
    worked_example: {
      title: "Segment Tree Range Sum Query",
      problem: "Given array [1, 3, 5, 7, 9, 11], find sum of elements in range [1..4] in O(log N) time.",
      approach: "Build tree where parent holds sum of children. Query intersects only overlapping intervals.",
      steps: [
        { step: 1, title: "Tree Root", explanation: "Root represents range [0..5] with sum 36." },
        { step: 2, title: "Query Partition", explanation: "Range [1..4] decomposes into segment [1..2] (sum 8) and segment [3..4] (sum 16)." },
        { step: 3, title: "Sum Combinations", explanation: "8 + 16 = 24. Target sum is 24." }
      ],
      conclusion: "Solved in O(log N) time compared to O(N) linear sum."
    },
    visualizer_type: null,
    order_index: 20,
  },
];

export const DSA_QUESTIONS: DsaQuestion[] = [
  // BIG-O QUESTIONS
  {
    id: "q-bigo-0",
    topic_id: "big-o",
    difficulty_level: 0,
    question_type: "complexity",
    question_text: "What is the time complexity of accessing an array element at a known index i?",
    code_snippet: "function getElement(arr, i) {\n  return arr[i];\n}",
    options: [
      { id: "A", text: "O(1) constant time" },
      { id: "B", text: "O(log N) logarithmic time" },
      { id: "C", text: "O(N) linear time" },
      { id: "D", text: "O(N²) quadratic time" },
    ],
    correct_answer: "A",
    explanation: "Array elements are stored in contiguous memory slots. Accessing index i uses a direct memory offset formula: base_address + i * size, executing in O(1) constant time.",
  },
  {
    id: "q-bigo-1",
    topic_id: "big-o",
    difficulty_level: 1,
    question_type: "complexity",
    question_text: "What is the time complexity of the following nested loop function?",
    code_snippet: "function analyze(n) {\n  let count = 0;\n  for (let i = 0; i < n; i++) {\n    for (let j = 0; j < i; j++) {\n      count++;\n    }\n  }\n  return count;\n}",
    options: [
      { id: "A", text: "O(N)" },
      { id: "B", text: "O(N log N)" },
      { id: "C", text: "O(N²)" },
      { id: "D", text: "O(2^N)" },
    ],
    correct_answer: "C",
    explanation: "The inner loop runs 0 + 1 + 2 + ... + (n-1) times, which equals n*(n-1)/2. Dropping constants and lower-order terms yields O(N²).",
  },
  {
    id: "q-bigo-2",
    topic_id: "big-o",
    difficulty_level: 2,
    question_type: "trace_output",
    question_text: "What does this logarithmic loop print for n = 16?",
    code_snippet: "function logLoop(n) {\n  let steps = 0;\n  while (n > 1) {\n    n = Math.floor(n / 2);\n    steps++;\n  }\n  return steps;\n}",
    options: [
      { id: "A", text: "16" },
      { id: "B", text: "8" },
      { id: "C", text: "4" },
      { id: "D", text: "5" },
    ],
    correct_answer: "C",
    explanation: "16 -> 8 (1 step) -> 4 (2 steps) -> 2 (3 steps) -> 1 (4 steps). The loop halts with steps = 4 (log2(16) = 4).",
  },

  // ARRAYS & STRINGS QUESTIONS
  {
    id: "q-arr-0",
    topic_id: "arrays-strings",
    difficulty_level: 0,
    question_type: "trace_output",
    question_text: "What will this array reversal function output?",
    code_snippet: "let arr = [10, 20, 30];\nlet left = 0, right = 2;\nlet temp = arr[left];\narr[left] = arr[right];\narr[right] = temp;\nconsole.log(arr);",
    options: [
      { id: "A", text: "[30, 20, 10]" },
      { id: "B", text: "[10, 20, 30]" },
      { id: "C", text: "[30, 10, 20]" },
      { id: "D", text: "[20, 30, 10]" },
    ],
    correct_answer: "A",
    explanation: "Swapping index 0 (10) and index 2 (30) results in [30, 20, 10].",
  },
  {
    id: "q-arr-1",
    topic_id: "arrays-strings",
    difficulty_level: 1,
    question_type: "conceptual_ordering",
    question_text: "Which approach solves the 'Two Sum in a Sorted Array' problem in O(N) time without extra memory?",
    options: [
      { id: "A", text: "Two pointers at opposite ends moving inward" },
      { id: "B", text: "Nested loops checking every pair" },
      { id: "C", text: "Converting the array to a binary tree" },
      { id: "D", text: "Bubble sort on the elements" },
    ],
    correct_answer: "A",
    explanation: "Because the array is already sorted, two pointers at left=0 and right=n-1 can adjust the sum up (left++) or down (right--) in O(N) time and O(1) space.",
  },
  {
    id: "q-arr-2",
    topic_id: "arrays-strings",
    difficulty_level: 2,
    question_type: "complexity",
    question_text: "What is the amortized time complexity of inserting N elements sequentially into a dynamic array (like std::vector or ArrayList)?",
    options: [
      { id: "A", text: "O(1) amortized per insertion, O(N) overall" },
      { id: "B", text: "O(N) per insertion, O(N²) overall" },
      { id: "C", text: "O(log N) per insertion" },
      { id: "D", text: "O(N log N) overall" },
    ],
    correct_answer: "A",
    explanation: "Dynamic arrays double their capacity when full. While the resizing step takes O(N), it occurs infrequently. Amortized across N insertions, each insertion is O(1).",
  },

  // SEARCHING QUESTIONS
  {
    id: "q-search-0",
    topic_id: "searching",
    difficulty_level: 0,
    question_type: "complexity",
    question_text: "What is the worst-case time complexity of Binary Search on a sorted array of length N?",
    options: [
      { id: "A", text: "O(1)" },
      { id: "B", text: "O(log N)" },
      { id: "C", text: "O(N)" },
      { id: "D", text: "O(N log N)" },
    ],
    correct_answer: "B",
    explanation: "Binary search cuts the remaining search space in half at each comparison, yielding O(log2 N) worst-case time.",
  },
  {
    id: "q-search-1",
    topic_id: "searching",
    difficulty_level: 1,
    question_type: "trace_output",
    question_text: "How many comparisons does binary search make to locate target 56 in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]?",
    options: [
      { id: "A", text: "1" },
      { id: "B", text: "2" },
      { id: "C", text: "4" },
      { id: "D", text: "8" },
    ],
    correct_answer: "B",
    explanation: "1st comparison: mid = index 4 (16). 56 > 16. Right half [5..9]. 2nd comparison: mid = index 7 (56). Found in 2 comparisons!",
  },
  {
    id: "q-search-2",
    topic_id: "searching",
    difficulty_level: 2,
    question_type: "conceptual_ordering",
    question_text: "What prerequisite condition MUST hold before binary search can be safely applied?",
    options: [
      { id: "A", text: "Elements must be monotonically sorted or possess a monotonic predicate" },
      { id: "B", text: "The array must contain only positive integers" },
      { id: "C", text: "The array size must be a power of two" },
      { id: "D", text: "Elements must be stored in a linked list" },
    ],
    correct_answer: "A",
    explanation: "Binary search requires that the search space is monotonic so that checking the midpoint decisively eliminates one half.",
  },

  // LINKED LISTS QUESTIONS
  {
    id: "q-ll-0",
    topic_id: "linked-lists",
    difficulty_level: 0,
    question_type: "complexity",
    question_text: "What is the time complexity to insert a new node at the head of a Singly Linked List?",
    options: [
      { id: "A", text: "O(1)" },
      { id: "B", text: "O(N)" },
      { id: "C", text: "O(log N)" },
      { id: "D", text: "O(N²)" },
    ],
    correct_answer: "A",
    explanation: "Inserting at the head simply updates: new_node.next = head; head = new_node. It requires no traversal, running in O(1) time.",
  },
  {
    id: "q-ll-1",
    topic_id: "linked-lists",
    difficulty_level: 1,
    question_type: "conceptual_ordering",
    question_text: "Floyd's Cycle Finding Algorithm ('Tortoise and Hare') detects linked list cycles using which pointer speeds?",
    options: [
      { id: "A", text: "Slow moves 1 step, Fast moves 2 steps" },
      { id: "B", text: "Slow moves 1 step, Fast moves 1 step" },
      { id: "C", text: "Slow moves 2 steps, Fast moves 4 steps" },
      { id: "D", text: "Slow is stationary, Fast moves to the tail" },
    ],
    correct_answer: "A",
    explanation: "Moving slow by 1 node and fast by 2 nodes guarantees that if a cycle exists, the relative distance between them decreases by 1 each step, catching the cycle in O(N) time.",
  },
  {
    id: "q-ll-2",
    topic_id: "linked-lists",
    difficulty_level: 2,
    question_type: "trace_output",
    question_text: "What does this linked list pointer reversal snippet do?",
    code_snippet: "let next = curr.next;\ncurr.next = prev;\nprev = curr;\ncurr = next;",
    options: [
      { id: "A", text: "Reverses curr's pointer to point to prev and advances both" },
      { id: "B", text: "Deletes curr from the list" },
      { id: "C", text: "Inserts a node between prev and curr" },
      { id: "D", text: "Doubles the length of the list" },
    ],
    correct_answer: "A",
    explanation: "This is the classic 4-line in-place linked list reversal step: cache next, reverse curr.next, advance prev, advance curr.",
  },

  // TREES QUESTIONS
  {
    id: "q-tree-0",
    topic_id: "trees",
    difficulty_level: 0,
    question_type: "conceptual_ordering",
    question_text: "Which tree traversal order yields elements of a Binary Search Tree in sorted ascending order?",
    options: [
      { id: "A", text: "In-Order (Left, Root, Right)" },
      { id: "B", text: "Pre-Order (Root, Left, Right)" },
      { id: "C", text: "Post-Order (Left, Right, Root)" },
      { id: "D", text: "Level-Order (Breadth-First)" },
    ],
    correct_answer: "A",
    explanation: "Because BST invariants mandate Left < Root < Right, an In-Order traversal visits all smaller elements first, then the root, then larger elements, generating sorted order.",
  },
  {
    id: "q-tree-1",
    topic_id: "trees",
    difficulty_level: 1,
    question_type: "trace_output",
    question_text: "In a BST with root 10, left child 5, right child 15, where will 12 be inserted?",
    options: [
      { id: "A", text: "Left child of 15" },
      { id: "B", text: "Right child of 15" },
      { id: "C", text: "Right child of 5" },
      { id: "D", text: "Left child of 5" },
    ],
    correct_answer: "A",
    explanation: "12 > 10 (move right to 15). 12 < 15 (move left). 15's left child is empty, so 12 becomes 15's left child.",
  },
  {
    id: "q-tree-2",
    topic_id: "trees",
    difficulty_level: 2,
    question_type: "complexity",
    question_text: "What is the worst-case search time complexity in an un-balanced Binary Search Tree?",
    options: [
      { id: "A", text: "O(N) (degenerate linked list)" },
      { id: "B", text: "O(log N)" },
      { id: "C", text: "O(1)" },
      { id: "D", text: "O(N log N)" },
    ],
    correct_answer: "A",
    explanation: "When sorted data is inserted into an unbalanced BST, every node has only one child, forming a degenerate linked list with O(N) height and O(N) search time.",
  },

  // GRAPHS QUESTIONS
  {
    id: "q-graph-0",
    topic_id: "graphs",
    difficulty_level: 0,
    question_type: "conceptual_ordering",
    question_text: "Which data structure is used to implement Breadth-First Search (BFS) on a graph?",
    options: [
      { id: "A", text: "FIFO Queue" },
      { id: "B", text: "LIFO Stack" },
      { id: "C", text: "Binary Heap" },
      { id: "D", text: "Hash Table only" },
    ],
    correct_answer: "A",
    explanation: "BFS explores nodes level-by-level, which requires a FIFO queue to process nodes in the exact order they were discovered.",
  },
  {
    id: "q-graph-1",
    topic_id: "graphs",
    difficulty_level: 1,
    question_type: "complexity",
    question_text: "What is the time complexity of Breadth-First Search on a graph with V vertices and E edges using an Adjacency List?",
    options: [
      { id: "A", text: "O(V + E)" },
      { id: "B", text: "O(V * E)" },
      { id: "C", text: "O(V²)" },
      { id: "D", text: "O(E log V)" },
    ],
    correct_answer: "A",
    explanation: "BFS visits every vertex once (O(V)) and inspects every incident edge once (O(E)), summing to O(V + E) time.",
  },
  {
    id: "q-graph-2",
    topic_id: "graphs",
    difficulty_level: 2,
    question_type: "trace_output",
    question_text: "In an unweighted graph, which algorithm guarantees finding the shortest path (minimum edge count) between two nodes?",
    options: [
      { id: "A", text: "Breadth-First Search (BFS)" },
      { id: "B", text: "Depth-First Search (DFS)" },
      { id: "C", text: "Quick Sort" },
      { id: "D", text: "In-Order Tree Traversal" },
    ],
    correct_answer: "A",
    explanation: "Because BFS explores edges in increasing distance from the source, the first time a target node is visited is guaranteed to be the shortest path in unweighted graphs.",
  },

  // DYNAMIC PROGRAMMING QUESTIONS
  {
    id: "q-dp-0",
    topic_id: "dynamic-programming",
    difficulty_level: 0,
    question_type: "conceptual_ordering",
    question_text: "What are the two foundational properties required for Dynamic Programming to apply?",
    options: [
      { id: "A", text: "Overlapping Subproblems and Optimal Substructure" },
      { id: "B", text: "Sorted inputs and Binary Trees" },
      { id: "C", text: "Constant memory and Tail recursion" },
      { id: "D", text: "Adjacency matrix and Greedy choice" },
    ],
    correct_answer: "A",
    explanation: "DP applies when a problem breaks down into overlapping subproblems (same calculations reoccur) and possesses optimal substructure (optimal solution composed of optimal solutions to subproblems).",
  },
  {
    id: "q-dp-1",
    topic_id: "dynamic-programming",
    difficulty_level: 1,
    question_type: "trace_output",
    question_text: "Given recurrence dp[i] = dp[i-1] + dp[i-2] with dp[0]=1 and dp[1]=1, what is dp[4]?",
    code_snippet: "let dp = [1, 1];\nfor (let i = 2; i <= 4; i++) {\n  dp[i] = dp[i-1] + dp[i-2];\n}\nconsole.log(dp[4]);",
    options: [
      { id: "A", text: "5" },
      { id: "B", text: "3" },
      { id: "C", text: "8" },
      { id: "D", text: "4" },
    ],
    correct_answer: "A",
    explanation: "dp[2] = 1+1 = 2. dp[3] = 2+1 = 3. dp[4] = 3+2 = 5.",
  },
  {
    id: "q-dp-2",
    topic_id: "dynamic-programming",
    difficulty_level: 2,
    question_type: "complexity",
    question_text: "What is the time complexity of the 0/1 Knapsack problem with N items and capacity W using tabulation?",
    options: [
      { id: "A", text: "O(N * W) pseudo-polynomial time" },
      { id: "B", text: "O(2^N) exponential time" },
      { id: "C", text: "O(N log W)" },
      { id: "D", text: "O(N + W)" },
    ],
    correct_answer: "A",
    explanation: "A table of size (N+1) x (W+1) is filled, taking O(1) work per cell. Total time is O(N * W), which is pseudo-polynomial in the input values.",
  },
];

// Helper functions for curriculum access
export function getAllDsaTopics(): DsaTopic[] {
  return [...DSA_TOPICS].sort((a, b) => a.order_index - b.order_index);
}

export function getDsaTopicBySlug(slug: string): DsaTopic | undefined {
  return DSA_TOPICS.find((t) => t.slug === slug || t.id === slug);
}

export function getQuestionsForTopic(topicId: string, effectiveLevel: number = 0): DsaQuestion[] {
  const filtered = DSA_QUESTIONS.filter((q) => q.topic_id === topicId);
  if (filtered.length === 0) {
    // Fallback topic question if topic has custom questions pending
    return [
      {
        id: `gen-${topicId}-${effectiveLevel}`,
        topic_id: topicId,
        difficulty_level: (effectiveLevel % 3) as 0 | 1 | 2,
        question_type: "conceptual_ordering",
        question_text: `What is the optimal algorithmic property when implementing ${topicId.replace("-", " ")}?`,
        options: [
          { id: "A", text: "Ensuring minimal time complexity and invariant consistency" },
          { id: "B", text: "Allocating unbounded memory buffers" },
          { id: "C", text: "Using random polling iterations" },
          { id: "D", text: "Suppressing runtime boundary checks" },
        ],
        correct_answer: "A",
        explanation: `Proper algorithmic implementation of ${topicId.replace("-", " ")} requires enforcing structural invariants and respecting complexity bounds.`,
      },
    ];
  }

  // Return questions matching or closest to effective level
  const levelMatched = filtered.filter((q) => q.difficulty_level === effectiveLevel);
  return levelMatched.length > 0 ? levelMatched : filtered;
}
