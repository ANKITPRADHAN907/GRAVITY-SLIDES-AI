import React, { useState } from 'react';
import { GeneratePresentationRequest, StudentLevel, TemplateId } from '../types';
import { TEMPLATES, SAMPLE_TOPICS } from '../data/templates';
import { Sparkles, Search, SlidersHorizontal, BookOpen, Layers, CheckCircle2, Wand2, Globe, Cpu } from 'lucide-react';

interface TopicGeneratorFormProps {
  onGenerate: (data: GeneratePresentationRequest) => void;
  isLoading: boolean;
  selectedTemplate: TemplateId;
  onSelectTemplate: (t: TemplateId) => void;
}

export const TopicGeneratorForm: React.FC<TopicGeneratorFormProps> = ({
  onGenerate,
  isLoading,
  selectedTemplate,
  onSelectTemplate,
}) => {
  const [topic, setTopic] = useState('');
  const [studentLevel, setStudentLevel] = useState<StudentLevel>('college');
  const [slideCount, setSlideCount] = useState<number>(15);
  const [useAdvancedAiVisuals, setUseAdvancedAiVisuals] = useState<boolean>(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customNotes, setCustomNotes] = useState('');

  const currentTheme = TEMPLATES[selectedTemplate];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onGenerate({
      topic: topic.trim(),
      studentLevel,
      slideCount,
      templateId: selectedTemplate,
      customNotes: customNotes.trim(),
      useAdvancedAiVisuals,
    });
  };

  const handleSampleClick = (sample: typeof SAMPLE_TOPICS[0]) => {
    setTopic(sample.topic);
    setStudentLevel(sample.level);
    onSelectTemplate(sample.template);
  };

  return (
    <div
      id="topic-generator-container"
      className="relative w-full max-w-3xl mx-auto rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 bg-[#101018]/90"
      style={{
        boxShadow: `0 25px 60px -15px #08080C, 0 0 35px -10px ${currentTheme.primaryHex}25`,
      }}
    >
      {/* Decorative zero-g floating glow halo */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-20 blur-3xl opacity-30 pointer-events-none"
        style={{ background: `linear-gradient(90deg, ${currentTheme.primaryHex}, ${currentTheme.accentHex})` }}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Floating Search Bar Input in Artistic Flair Style */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label
              htmlFor="student-topic-input"
              className="flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-slate-300"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Student Topic to Research & Present</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Google Engine Live Sync
            </span>
          </div>

          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative flex items-center bg-[#08080C] sm:bg-[#101018] rounded-full p-1.5 sm:p-2 border border-white/10 shadow-2xl">
              <div className="pl-4 pr-1 text-slate-400">
                <Search className="w-5 h-5 text-cyan-400/80" />
              </div>
              <input
                id="student-topic-input"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="The Silk Road & Global Trade, Black Holes, Photosynthesis..."
                disabled={isLoading}
                className="bg-transparent flex-1 px-3 sm:px-4 py-3 sm:py-3.5 outline-none text-base sm:text-lg font-medium text-white placeholder:text-white/25"
              />
              <button
                id="generate-presentation-submit-btn"
                type="submit"
                disabled={!topic.trim() || isLoading}
                className="bg-white text-black px-6 sm:px-9 py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-cyan-400 hover:text-black transition-colors whitespace-nowrap shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    <span>SYNTHESIZING</span>
                  </>
                ) : (
                  <span>GENERATE</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Sample Topics Pills */}
        <div className="space-y-1.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Popular Inquiries:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TOPICS.map((item, idx) => (
              <button
                key={idx}
                id={`sample-topic-${idx}`}
                type="button"
                onClick={() => handleSampleClick(item)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-left flex items-center gap-1.5"
              >
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-cyan-300">
                  {item.badge}
                </span>
                <span className="truncate max-w-[200px]">{item.topic}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls Grid: Student Level & Slide Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Target Grade Level */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Target Student Grade Level</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#08080C] border border-white/10">
              {(
                [
                  { id: 'elementary', label: 'Elem', title: 'Elementary (Stories & Simple Words)' },
                  { id: 'middle', label: 'Middle', title: 'Middle School (Analogies & Foundations)' },
                  { id: 'high', label: 'High', title: 'High School (Structured & Engaging)' },
                  { id: 'college', label: 'B.Tech / Uni', title: 'B.Tech / University Engineering (Technical & Math Rigor)' },
                ] as const
              ).map((lvl) => (
                <button
                  key={lvl.id}
                  id={`student-level-${lvl.id}`}
                  type="button"
                  title={lvl.title}
                  onClick={() => setStudentLevel(lvl.id)}
                  disabled={isLoading}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    studentLevel === lvl.id
                      ? 'text-black bg-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slide Deck Size */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deck Capacity ({slideCount} slides)</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#08080C] border border-white/10">
              {[8, 10, 15, 20].map((count) => (
                <button
                  key={count}
                  id={`slide-count-${count}`}
                  type="button"
                  onClick={() => setSlideCount(count)}
                  disabled={isLoading}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    slideCount === count
                      ? 'text-black bg-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {count} Slides
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Use Advanced AI Visuals Toggle */}
        <div
          id="advanced-ai-visuals-card"
          className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            useAdvancedAiVisuals
              ? 'bg-[#0f1422] border-cyan-500/40 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/20'
              : 'bg-[#08080C] border-white/10'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`p-2.5 rounded-xl border transition-colors shrink-0 mt-0.5 sm:mt-0 ${
                useAdvancedAiVisuals
                  ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-inner'
                  : 'bg-white/5 border-white/10 text-slate-500'
              }`}
            >
              <Cpu className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  Use Advanced AI Visuals
                </span>
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold transition-colors ${
                    useAdvancedAiVisuals
                      ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                      : 'bg-white/10 text-slate-400 border border-white/10'
                  }`}
                >
                  {useAdvancedAiVisuals ? 'B.Tech Visuals Active' : 'Generic Search Images'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                {useAdvancedAiVisuals
                  ? 'Generates high-fidelity, B.Tech-appropriate engineering schematics, architectural block diagrams, and system state lattices for each slide.'
                  : 'Uses standard web search results and generic educational image archives for slides.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              {useAdvancedAiVisuals ? 'ENABLED' : 'DISABLED'}
            </span>
            <button
              type="button"
              role="switch"
              id="use-advanced-ai-visuals-toggle"
              aria-checked={useAdvancedAiVisuals}
              onClick={() => setUseAdvancedAiVisuals(!useAdvancedAiVisuals)}
              disabled={isLoading}
              title="Toggle between Advanced B.Tech AI Schematics and Generic Search Results"
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 ${
                useAdvancedAiVisuals ? 'bg-cyan-500' : 'bg-white/20'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  useAdvancedAiVisuals ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dedicated Topic Template Selector */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Dedicated Visual Template</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              Active: <span className="text-cyan-300 font-semibold">{currentTheme.name}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {Object.values(TEMPLATES).map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  id={`template-choice-${tmpl.id}`}
                  type="button"
                  onClick={() => onSelectTemplate(tmpl.id)}
                  disabled={isLoading}
                  className={`relative p-3 rounded-2xl border text-left transition-all overflow-hidden group ${
                    isSelected
                      ? 'border-cyan-400/60 ring-2 ring-cyan-400/30 bg-[#161622]'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {tmpl.name}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: tmpl.primaryHex }}
                    />
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: tmpl.accentHex }}
                    />
                    <span className="text-[10px] font-mono text-slate-400 truncate">{tmpl.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Instructions Accordion */}
        <div>
          <button
            id="toggle-advanced-btn"
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Teacher Guidance / Custom Notes' : '+ Add Teacher Guidance / Custom Notes'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-2">
              <textarea
                id="custom-notes-textarea"
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Emphasize James Webb Space Telescope discoveries, or include an interactive quiz on slide 5..."
                className="w-full p-3 rounded-xl bg-[#08080C] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
              />
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          id="generate-presentation-submit-btn"
          type="submit"
          disabled={!topic.trim() || isLoading}
          className="w-full py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-sm sm:text-base text-white shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.accentHex})`,
            boxShadow: `0 10px 25px -5px ${currentTheme.primaryHex}66`,
          }}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>RESEARCHING GOOGLE & GENERATING 3D DECK...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform text-cyan-200" />
              <span>LAUNCH 3D ANTIGRAVITY PRESENTATION</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
