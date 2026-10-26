"use client";

import React, { useState, useEffect } from "react";
import { 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ArrowRight, 
  Briefcase, 
  Layers, 
  X,
  Search,
  Check,
  Loader2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface CareerPath {
  id: string;
  name: string;
  category: string;
  description: string;
  typical_skills: string[];
  active?: boolean;
}

const DEFAULT_CAREER_PATHS: CareerPath[] = [
  {
    id: "sde",
    name: "Software Development Engineer (SDE)",
    category: "Engineering",
    description: "Build robust, scalable distributed systems, cloud services, and production web applications.",
    typical_skills: ["Data Structures & Algorithms", "System Design", "Node.js/Go", "PostgreSQL", "Cloud"],
  },
  {
    id: "ai-engineer",
    name: "AI & Machine Learning Engineer",
    category: "Artificial Intelligence",
    description: "Design LLM applications, retrieval-augmented systems (RAG), and deploy production ML pipelines.",
    typical_skills: ["Python", "PyTorch", "LangChain/LlamaIndex", "Vector DBs", "Model Fine-Tuning"],
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps Engineer",
    category: "Infrastructure",
    description: "Architect automated CI/CD deployment pipelines, container orchestration, and multi-cloud resilience.",
    typical_skills: ["Docker", "Kubernetes", "AWS/GCP", "Terraform", "Linux Internals"],
  },
  {
    id: "product-manager",
    name: "Associate Product Manager (APM)",
    category: "Product & Strategy",
    description: "Drive product lifecycle from customer research, roadmapping, UX prototyping, to metrics delivery.",
    typical_skills: ["Product Strategy", "User Research", "Agile/Scrum", "A/B Testing", "Data Analytics"],
  },
  {
    id: "data-scientist",
    name: "Data Scientist & Analyst",
    category: "Data & Analytics",
    description: "Extract actionable predictive insights from complex datasets using statistics, SQL, and modeling.",
    typical_skills: ["SQL", "Python/Pandas", "Hypothesis Testing", "Tableau/PowerBI", "Statistical Modeling"],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity Analyst",
    category: "Security",
    description: "Safeguard cloud infrastructure, identify security vulnerabilities, and perform penetration auditing.",
    typical_skills: ["Network Security", "Ethical Hacking", "OWASP Top 10", "SOC Analysis", "Cryptography"],
  },
];

export default function CareerPathSelectorWidget() {
  const { user, profile } = useAuth();
  const [allPaths, setAllPaths] = useState<CareerPath[]>(DEFAULT_CAREER_PATHS);
  const [selectedPath, setSelectedPath] = useState<CareerPath>(DEFAULT_CAREER_PATHS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch career paths from API
  useEffect(() => {
    let isMounted = true;
    async function loadPaths() {
      try {
        const res = await fetch("/api/career/paths");
        if (res.ok) {
          const data = await res.json();
          if (data.paths && data.paths.length > 0 && isMounted) {
            setAllPaths(data.paths);
          }
        }
      } catch (err) {
        console.warn("Using default career paths fallback:", err);
      }

      // Load user selected path
      try {
        const userRes = await fetch("/api/user/career-paths");
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.primaryPath && isMounted) {
            const matched = {
              id: userData.primaryPath.career_path_id || userData.primaryPath.id,
              name: userData.primaryPath.name,
              category: userData.primaryPath.category,
              description: userData.primaryPath.description,
              typical_skills: userData.primaryPath.typical_skills || [],
            };
            setSelectedPath(matched);
          }
        }
      } catch (err) {
        // Fallback to profile targetRole
        const userTargetRole = profile?.targetRole;
        if (userTargetRole && isMounted) {
          const match = DEFAULT_CAREER_PATHS.find(
            (p) => p.name.toLowerCase().includes(userTargetRole.toLowerCase())
          );
          if (match) setSelectedPath(match);
        }
      }
    }

    loadPaths();
    return () => {
      isMounted = false;
    };
  }, [profile?.targetRole]);

  // Handle switching path
  const handleSelectPath = async (path: CareerPath) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/career-paths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPathIds: [path.id],
          primaryPathId: path.id,
        }),
      });

      setSelectedPath(path);
      setIsModalOpen(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e) {
      console.error("Failed to update career path:", e);
      setSelectedPath(path);
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter paths for modal
  const categories = ["All", ...Array.from(new Set(allPaths.map((p) => p.category)))];
  const filteredPaths = allPaths.filter((path) => {
    const matchesSearch =
      path.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.typical_skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || path.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
              Career Trajectory
            </span>
            <span className="text-xs font-medium text-[#6B7280]">Primary Specialization</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
            Selected Career Path
          </h2>
        </div>

        {/* Change Career Path Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-[#111827] bg-[#F7F8FA] hover:bg-gray-100 border border-[#E5E7EB] rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Compass className="w-4 h-4 text-[#2563EB]" />
          <span>Switch Career Path</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Career trajectory successfully updated to <strong>{selectedPath.name}</strong>. Timetable and practice tracks adjusted.</span>
        </div>
      )}

      {/* Primary Selected Path Card */}
      <div className="p-6 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-700 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                {selectedPath.category}
              </span>
              <span className="text-[11px] font-medium text-[#6B7280]">Target Specialization</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#111827]">
              {selectedPath.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-normal">
              {selectedPath.description}
            </p>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg">
              <Check className="w-3.5 h-3.5" />
              <span>Active Target</span>
            </span>
          </div>
        </div>

        {/* Required Skills & Competencies */}
        <div className="pt-3 border-t border-[#E5E7EB]">
          <span className="text-xs font-semibold text-[#111827] block mb-2">
            Core Competencies &amp; Learning Modules:
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedPath.typical_skills && selectedPath.typical_skills.length > 0 ? (
              selectedPath.typical_skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-white border border-[#E5E7EB] text-[#111827] shadow-xs"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#6B7280]">Curriculum modules initialized</span>
            )}
          </div>
        </div>
      </div>

      {/* Career Path Picker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden text-[#111827]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  Select Your Career Path
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Pick your primary target. Myra AI and your timetable will tailor modules and question sets accordingly.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#6B7280] hover:text-[#111827] p-1.5 rounded-lg hover:bg-[#F7F8FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Category Filter */}
            <div className="p-4 border-b border-[#E5E7EB] space-y-3 bg-[#F7F8FA]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by role name or skill (e.g. Python, Product, DevOps)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] text-[#111827]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-[#111827] text-white"
                        : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Paths List */}
            <div className="p-4 space-y-2.5 overflow-y-auto max-h-[50vh]">
              {filteredPaths.map((path) => {
                const isCurrent = selectedPath.id === path.id;

                return (
                  <div
                    key={path.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrent
                        ? "bg-blue-50/50 border-[#2563EB]/40 ring-1 ring-[#2563EB]/20"
                        : "bg-white border-[#E5E7EB] hover:border-gray-400 hover:bg-[#F7F8FA]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                          {path.category}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-[#2563EB] bg-[#2563EB]/10 px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#111827]">{path.name}</h4>
                      <p className="text-xs text-[#6B7280] line-clamp-2">{path.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {path.typical_skills.slice(0, 4).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-[#6B7280]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      disabled={isSaving}
                      onClick={() => handleSelectPath(path)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors inline-flex items-center gap-1.5 ${
                        isCurrent
                          ? "bg-emerald-600 text-white cursor-default"
                          : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer"
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </>
                      ) : isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Choose Path</span>
                      )}
                    </button>
                  </div>
                );
              })}

              {filteredPaths.length === 0 && (
                <div className="p-8 text-center text-xs text-[#6B7280]">
                  No career paths matched "{searchQuery}".
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-[#E5E7EB] bg-[#F7F8FA] flex items-center justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-[#111827] hover:bg-[#E5E7EB] rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
