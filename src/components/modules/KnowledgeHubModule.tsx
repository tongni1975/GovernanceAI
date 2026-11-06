import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext.tsx';
import { KnowledgeArticle } from '../../types/index.ts';
import {
  BookOpen,
  Search,
  Video,
  Play,
  ExternalLink,
  Tag,
  Sparkles,
  Bot,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const KnowledgeHubModule: React.FC = () => {
  const { state, setSelectedTab, sendAgentMessage, setIsChatOpen } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<string>('ALL');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('kb-evm-01');

  const articles = state?.knowledgeBase || [];

  const filteredArticles = articles.filter((art) => {
    const matchesFramework = selectedFramework === 'ALL' || art.framework === selectedFramework;
    const matchesQuery =
      searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFramework && matchesQuery;
  });

  const activeArticle = articles.find((a) => a.id === selectedArticleId) || articles[0];

  return (
    <div className="space-y-4">
      {/* Header & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center">
                Multimedia Delivery Knowledge Hub & RAG Specialist
              </h2>
              <p className="text-xs text-slate-400">
                Authoritative standards for PMBOK 7, Scrum/Agile, DORA DevOps, ITIL 5 SVS, and GRC Dual-Ledger.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sendAgentMessage(`Explain how to apply the recommendations from ${activeArticle?.title} to Project Alpha.`, 'rag_specialist');
              setIsChatOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Consult RAG Agent</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Semantic search by topic (e.g. CPI, WIP limits, change failure rate, story slicing)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Frameworks</option>
            <option value="PMBOK">PMBOK 7 (EVM)</option>
            <option value="SCRUM_AGILE">Scrum & Agile Flow</option>
            <option value="DEVOPS_DORA">DevOps & DORA</option>
            <option value="ITIL5_SVC">ITIL 5 Service Value Chain</option>
            <option value="GRC_AUDIT">GRC & Dual-Ledger Audit</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Article Selector on Left, Interactive Reader & Multimedia on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Article Cards List */}
        <div className="lg:col-span-4 space-y-2.5">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticleId(art.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition shadow-md ${
                activeArticle?.id === art.id
                  ? 'bg-slate-800 border-cyan-500/80 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                <span className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                  {art.framework}
                </span>
                {art.videoUrl && (
                  <span className="flex items-center text-red-400">
                    <Video className="w-3 h-3 mr-1" />
                    Video Included
                  </span>
                )}
              </div>

              <h4 className="text-xs font-bold text-white leading-snug mb-1">
                {art.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {art.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {art.tags.slice(0, 3).map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Article Reader & Multimedia Player */}
        {activeArticle && (
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              {/* Header */}
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-400 mb-1">
                  <span>STANDARD SPECIFICATION</span>
                  <span>•</span>
                  <span>{activeArticle.framework}</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {activeArticle.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {activeArticle.summary}
                </p>
              </div>

              {/* Key Principles Checklist */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Core Implementation Principles:
                </span>
                <div className="space-y-1.5 text-xs text-slate-200">
                  {activeArticle.keyPrinciples.map((kp, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span className="text-cyan-400 font-mono font-bold">•</span>
                      <span>{kp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Embedded Multimedia Player (if available) */}
              {activeArticle.videoUrl && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
                      <Video className="w-4 h-4 text-red-400 mr-1.5" />
                      {activeArticle.videoTitle || 'Authoritative Masterclass'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Synchronized Chapter Markers
                    </span>
                  </div>

                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg">
                    <iframe
                      src={activeArticle.videoUrl}
                      title={activeArticle.videoTitle}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Chapter Markers */}
                  {activeArticle.chapters && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Chapters:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {activeArticle.chapters.map((ch, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-300 hover:border-slate-700 transition"
                          >
                            <span className="truncate">{ch.title}</span>
                            <span className="font-mono text-cyan-400 text-[10px] ml-2">
                              {ch.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Guide Content */}
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                {activeArticle.fullGuideMarkdown}
              </div>

              {/* Deep Links into Project Views */}
              {activeArticle.deepLinks && activeArticle.deepLinks.length > 0 && (
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400 mr-2">
                    Direct Project Artifacts:
                  </span>
                  {activeArticle.deepLinks.map((link, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTab(link.viewTarget)}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium border border-slate-700 transition"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
