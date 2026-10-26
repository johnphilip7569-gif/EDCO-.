"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/auth/AuthGuard";
import { 
  ArrowLeft, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  HelpCircle, 
  Lock,
  ArrowRight,
  Code2
} from "lucide-react";
import DsaVisualizerHost from "@/components/dsa/visualizers/DsaVisualizerHost";
import DsaPracticeQuiz from "@/components/dsa/DsaPracticeQuiz";
import DsaCodeRunnerArena from "@/components/dsa/DsaCodeRunnerArena";
import { DsaTopic, DsaQuestion, getDsaTopicBySlug, getQuestionsForTopic } from "@/lib/dsa/dsa-bank";

export const dynamic = "force-dynamic";

export default function DsaTopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params?.slug as string;

  const [topic, setTopic] = useState<DsaTopic | null>(null);
  const [questions, setQuestions] = useState<DsaQuestion[]>([]);
  const [effectiveLevel, setEffectiveLevel] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"explainer" | "practice" | "arena">("explainer");
  const [loading, setLoading] = useState(true);

  // Junior Track Gating
  const isJuniorTrack = user?.ageBand === "13-15";

  useEffect(() => {
    if (isJuniorTrack) {
      setLoading(false);
      return;
    }

    const loadTopic = async () => {
      try {
        const userId = user?.uid || "";
        const res = await fetch(`/api/dsa/topics/${slug}?userId=${userId}`);
        const data = await res.json();
        const sanitizeClientQuestions = (rawList: DsaQuestion[]) =>
          rawList.map((q) => ({
            id: q.id,
            topic_id: q.topic_id,
            difficulty_level: q.difficulty_level,
            question_type: q.question_type,
            question_text: q.question_text,
            code_snippet: q.code_snippet,
            options: q.options,
            correct_answer: "",
            explanation: "",
          }));

        if (data.success && data.topic) {
          setTopic(data.topic);
          setQuestions(data.questions || []);
          setEffectiveLevel(data.effectiveLevel || data.topic.difficulty_level || 0);
        } else {
          // Fallback to in-memory bank with answers stripped
          const localTopic = getDsaTopicBySlug(slug);
          if (localTopic) {
            setTopic(localTopic);
            setQuestions(sanitizeClientQuestions(getQuestionsForTopic(localTopic.id, localTopic.difficulty_level)));
            setEffectiveLevel(localTopic.difficulty_level);
          }
        }
      } catch (err) {
        console.error("Failed to load DSA topic detail:", err);
        const localTopic = getDsaTopicBySlug(slug);
        if (localTopic) {
          setTopic(localTopic);
          const sanitized = getQuestionsForTopic(localTopic.id, localTopic.difficulty_level).map((q) => ({
            id: q.id,
            topic_id: q.topic_id,
            difficulty_level: q.difficulty_level,
            question_type: q.question_type,
            question_text: q.question_text,
            code_snippet: q.code_snippet,
            options: q.options,
            correct_answer: "",
            explanation: "",
          }));
          setQuestions(sanitized);
          setEffectiveLevel(localTopic.difficulty_level);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTopic();
  }, [slug, user, isJuniorTrack]);

  if (isJuniorTrack) {
    return (
      <AuthGuard>
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-white font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 shadow-xl p-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-black flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-black">Junior Track Gated</h1>
            <p className="text-xs text-neutral-600">
              DSA topic deep-dives are unlocked for Explorer Track (16–17) and Career Track (18+).
            </p>
            <Link href="/dashboard" className="inline-block px-4 py-2 rounded-xl bg-black text-white text-xs font-bold">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-neutral-500">Loading topic modules...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
        <h2 className="text-xl font-bold text-black">Topic Not Found</h2>
        <p className="text-xs text-neutral-500">The requested DSA module could not be located.</p>
        <Link href="/dsa" className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold">
          Back to DSA Studio
        </Link>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-5rem)] bg-white text-black pb-20 font-sans selection:bg-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8 animate-in fade-in">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/dsa"
              className="text-xs font-bold text-neutral-500 hover:text-black flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to DSA Studio</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-neutral-100 text-black border border-neutral-200">
                {topic.tier}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                topic.interview_frequency === "High"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-700 border border-neutral-200"
              }`}>
                {topic.interview_frequency} Frequency
              </span>
            </div>
          </div>

          {/* Topic Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-xs space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                Module {topic.order_index} of 20 &bull; Calibrated Level {effectiveLevel}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight">
                {topic.name}
              </h1>
            </div>

            {/* Prerequisite Guidance (Soft unlock recommendation, never hard-blocking) */}
            {topic.prerequisite_topic_ids && topic.prerequisite_topic_ids.length > 0 && (
              <div className="p-3 rounded-xl bg-white border border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-neutral-500">
                  Recommended order: Complete <strong>{topic.prerequisite_topic_ids.join(", ")}</strong> first for optimal intuition.
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-black border border-neutral-200 shrink-0">
                  Self-Paced
                </span>
              </div>
            )}
          </div>

          {/* Tab Switcher: Explainer & Visualizer vs Practice Questions vs Code Arena */}
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("explainer")}
              className={`px-4 py-2.5 min-h-[42px] rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "explainer"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-100"
              }`}
            >
              Interactive Explainer &amp; Visualizer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("practice")}
              className={`px-4 py-2.5 min-h-[42px] rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "practice"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-100"
              }`}
            >
              <span>Practice Questions ({questions.length})</span>
              <span className="w-2 h-2 rounded-full bg-black" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("arena")}
              className={`px-4 py-2.5 min-h-[42px] rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "arena"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-100"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code Arena &amp; Sandbox</span>
            </button>
          </div>

          {/* TAB 1: INTERACTIVE EXPLAINER */}
          {activeTab === "explainer" ? (
            <div className="space-y-8 animate-in fade-in">
              
              {/* Concept Triad (Concept, Why It Matters, Common Use) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    Core Concept
                  </span>
                  <h4 className="text-sm font-bold text-black">What is it?</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {topic.explainer_concept}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    Industry Impact
                  </span>
                  <h4 className="text-sm font-bold text-black">Why it matters?</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {topic.explainer_why_it_matters}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    Interview Patterns
                  </span>
                  <h4 className="text-sm font-bold text-black">Where it shows up?</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {topic.explainer_common_use}
                  </p>
                </div>
              </div>

              {/* Inline Interactive Step-Through Visualizer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-black">
                    Visual Step-Through Engine
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Deterministic Animation &bull; Zero Arbitrary Code
                  </span>
                </div>

                <DsaVisualizerHost
                  visualizerType={topic.visualizer_type}
                  topicName={topic.name}
                />
              </div>

              {/* Worked Step-By-Step Example */}
              {topic.worked_example && (
                <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                      Step-by-Step Walkthrough
                    </span>
                    <h3 className="text-lg font-bold text-black">
                      {topic.worked_example.title}
                    </h3>
                    <p className="text-xs text-neutral-600 font-mono bg-white p-3 rounded-xl border border-neutral-200">
                      <strong>Problem:</strong> {topic.worked_example.problem}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {topic.worked_example.steps.map((st) => (
                      <div key={st.step} className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-black">
                          Step {st.step}: {st.title}
                        </span>
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          {st.explanation}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs font-bold text-black pt-1">
                    &bull; Conclusion: {topic.worked_example.conclusion}
                  </p>
                </div>
              )}

              {/* Next Action Callout */}
              <div className="p-5 rounded-2xl bg-black text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">Ready to test your comprehension?</h4>
                  <p className="text-xs text-neutral-300">
                    Practice prediction drills or hop straight into the multi-language code runner with Myra AI hints.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab("practice")}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Practice Drills</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("arena")}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-neutral-700"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Open Code Arena</span>
                  </button>
                </div>
              </div>

            </div>
          ) : activeTab === "practice" ? (
            /* TAB 2: ADAPTIVE PRACTICE DRILLS */
            <div className="space-y-6 animate-in fade-in">
              <DsaPracticeQuiz
                questions={questions}
                topicId={topic.id}
                topicName={topic.name}
                userId={user?.uid}
              />
            </div>
          ) : (
            /* TAB 3: CODE ARENA & SANDBOX */
            <div className="space-y-6 animate-in fade-in">
              <DsaCodeRunnerArena
                topic={topic}
                userId={user?.uid}
              />
            </div>
          )}

        </div>
      </div>
    </AuthGuard>
  );
}
