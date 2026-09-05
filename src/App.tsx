import React, { useState } from 'react';
import {
  AntigravityMode,
  GeneratePresentationRequest,
  PresentationData,
  TemplateId,
} from './types';
import { TEMPLATES } from './data/templates';
import { AntigravityCanvas3D } from './components/AntigravityCanvas3D';
import { AntigravityControls } from './components/AntigravityControls';
import { TopicGeneratorForm } from './components/TopicGeneratorForm';
import { PresentationViewer } from './components/PresentationViewer';
import { CitationsModal } from './components/CitationsModal';
import { PresenterModal } from './components/PresenterModal';
import { Orbit, Sparkles, Globe, Download, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

export default function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('space');
  const [antigravityMode, setAntigravityMode] = useState<AntigravityMode>('zero-g');
  const [is3DView, setIs3DView] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [showCitations, setShowCitations] = useState<boolean>(false);
  const [presenterSlideIndex, setPresenterSlideIndex] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState<string>(() => {
    return localStorage.getItem('site_author_name') || 'Creator';
  });
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const currentTheme = TEMPLATES[selectedTemplate];

  // Handle presentation generation from Google Search + Gemini API
  const handleGenerate = async (requestData: GeneratePresentationRequest) => {
    setIsLoading(true);
    setLoadingStep('Activating Zero-G Research Engine...');

    try {
      const stepTimer1 = setTimeout(() => {
        setLoadingStep('Scraping & Grounding Latest Data from Google Search...');
      }, 1200);

      const stepTimer2 = setTimeout(() => {
        setLoadingStep(`Translating Technical Jargon to ${requestData.studentLevel.toUpperCase()} Student Language...`);
      }, 2800);

      const stepTimer3 = setTimeout(() => {
        if (requestData.useAdvancedAiVisuals) {
          setLoadingStep('Synthesizing High-Fidelity B.Tech AI Schematics & Architecture Visuals...');
        } else {
          setLoadingStep('Sourcing Educational Web Search Images & Formatting Slides...');
        }
      }, 4500);

      const response = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (!response.ok) {
        throw new Error(`Generation failed with status ${response.status}`);
      }

      const data: PresentationData = await response.json();
      setPresentation(data);

      if (data.templateId && TEMPLATES[data.templateId]) {
        setSelectedTemplate(data.templateId);
      }
    } catch (error) {
      console.log('[Presentation Client] Error handled cleanly:', error);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08080C] text-[#E0E0FF] flex flex-col font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Artistic Flair Atmospheric Ambient Glows */}
      <div className="fixed inset-0 w-full h-full opacity-40 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/20 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-purple-900/25 blur-[160px] rounded-full"></div>
      </div>

      {/* 3D Antigravity Three.js Background Canvas */}
      <AntigravityCanvas3D
        mode={antigravityMode}
        theme={currentTheme}
        interactive={true}
      />

      {/* Main App Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-between">
        {/* Top Header & Brand Bar */}
        <header className="w-full px-6 sm:px-10 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-xl bg-[#08080C]/70">
          <div
            id="brand-logo-container"
            onClick={() => setPresentation(null)}
            className="flex items-center gap-4 cursor-pointer group"
          >
            {/* Geometric Diamond Mark from Artistic Flair */}
            <div className="w-10 h-10 border-2 border-cyan-400 rotate-45 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <div className="w-6 h-6 bg-cyan-400/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-cyan-400"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-white">
                  GravitySlides <span className="text-cyan-400">AI</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:gap-10 text-[10px] tracking-widest uppercase opacity-70 font-mono">
            <span className="hidden md:inline text-slate-300">Research Engine v4.2</span>
            <span className="hidden sm:inline text-slate-300">Zero-G Interface</span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Live Sync: Active
            </span>

            {presentation && (
              <button
                id="reset-topic-header-btn"
                type="button"
                onClick={() => setPresentation(null)}
                className="px-4 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors tracking-wider uppercase"
              >
                New Topic
              </button>
            )}
          </div>
        </header>

        {/* Content Zone */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col justify-center relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center animate-fadeIn">
              {/* Floating zero-g loader animation */}
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: `${currentTheme.primaryHex}44`, borderTopColor: currentTheme.primaryHex }}
                />
                <div className="absolute inset-0 m-auto w-8 h-8 border-2 border-cyan-400 rotate-45 flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-cyan-400/40"></div>
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Zero-G Presentation Synthesis
                </h3>
                <p className="text-sm font-mono text-cyan-300 animate-pulse">
                  {loadingStep}
                </p>
                <div className="pt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Cross-referencing live sources & formatting slides for students</span>
                </div>
              </div>
            </div>
          ) : presentation ? (
            /* Active Presentation Deck Viewer */
            <PresentationViewer
              presentation={presentation}
              onUpdatePresentation={(updated) => setPresentation(updated)}
              onReset={() => setPresentation(null)}
              onOpenPresenterMode={(idx) => setPresenterSlideIndex(idx)}
              onOpenCitations={() => setShowCitations(true)}
              is3DView={is3DView}
            />
          ) : (
            /* Initial Generator View: Hero & Search Input with Artistic Flair Floating Elements */
            <div className="relative space-y-8 my-auto">
              {/* Floating Spatial Cards from Artistic Flair Design (hidden on small screens, glorious on desktop) */}
              <div className="hidden 2xl:block absolute -top-4 -left-28 w-64 p-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl transform -rotate-6 shadow-2xl pointer-events-none z-0 animate-fadeIn">
                <div className="text-[10px] text-cyan-400 font-mono mb-2 uppercase tracking-tight">Slide 01: The Dawn of Trade</div>
                <div className="h-24 bg-gradient-to-br from-amber-500/20 to-orange-900/40 rounded-lg mb-3 border border-white/10 p-2 flex flex-col justify-end">
                  <div className="w-1/2 h-1 bg-white/40 mb-1 rounded-full"></div>
                  <div className="w-1/3 h-1 bg-white/20 rounded-full"></div>
                </div>
                <p className="text-[11px] leading-relaxed opacity-70 text-slate-300">
                  The Silk Road wasn't just one path, but a network of merchants connecting civilizations...
                </p>
              </div>

              <div className="hidden 2xl:block absolute top-1/2 -left-28 w-56 p-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl transform rotate-12 shadow-xl pointer-events-none z-0 animate-fadeIn">
                <div className="text-[10px] text-purple-400 font-mono mb-2 uppercase tracking-tight">Slide 04: Geography</div>
                <div className="h-20 bg-gradient-to-br from-emerald-500/20 to-teal-900/40 rounded-lg mb-2"></div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[70%] h-full bg-emerald-400/50"></div>
                </div>
              </div>

              <div className="hidden 2xl:block absolute -top-4 -right-28 w-64 p-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl transform rotate-3 shadow-2xl pointer-events-none z-0 animate-fadeIn">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-[10px] text-orange-400 font-mono uppercase tracking-tight">Live Asset Search</div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square bg-white/5 rounded-lg border border-white/5 flex items-center justify-center text-[9px] uppercase font-mono opacity-50 text-center p-1">Diagram_01.png</div>
                  <div className="aspect-square bg-white/5 rounded-lg border border-white/5 flex items-center justify-center text-[9px] uppercase font-mono opacity-50 text-center p-1">Orbit_3D.obj</div>
                  <div className="aspect-square bg-white/5 rounded-lg border border-white/5 flex items-center justify-center text-[9px] uppercase font-mono opacity-50 text-center p-1">Astronomy.jpg</div>
                  <div className="aspect-square bg-white/5 rounded-lg border border-white/5 flex items-center justify-center text-[9px] uppercase font-mono opacity-50 text-center p-1">Spacetime.jpg</div>
                </div>
              </div>

              {/* Hero Title with Artistic Flair Typography */}
              <div className="text-center space-y-4 max-w-3xl mx-auto relative z-10">
                <h1 className="text-5xl sm:text-7xl font-light tracking-tighter leading-none text-white">
                  FLOAT THROUGH <br />
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 italic">
                    KNOWLEDGE
                  </span>
                </h1>

                <p className="text-base sm:text-lg opacity-70 font-light max-w-md mx-auto text-[#E0E0FF]">
                  Enter a topic. Watch the world's data coalesce into a stunning 3D presentation.
                </p>
              </div>

              {/* Topic Generator Form */}
              <div className="relative z-10">
                <TopicGeneratorForm
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={(t) => setSelectedTemplate(t)}
                />
              </div>

              {/* Badges / Feature Highlights from Artistic Flair */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 max-w-3xl mx-auto relative z-10">
                <span className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] tracking-widest uppercase opacity-70 font-mono text-[#E0E0FF]">
                  GOOGLE SEARCH ENGINE v4.2
                </span>
                <span className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] tracking-widest uppercase opacity-70 font-mono text-[#E0E0FF]">
                  STUDENT LEVEL SIMPLIFICATION
                </span>
                <span className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] tracking-widest uppercase opacity-70 font-mono text-[#E0E0FF]">
                  POWERPOINT .PPTX EXPORT
                </span>
                <span className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] tracking-widest uppercase opacity-70 font-mono text-[#E0E0FF]">
                  ZERO-G 3D PHYSICS
                </span>
              </div>
            </div>
          )}
        </main>

        {/* Artistic Flair Telemetry Footer */}
        <footer className="relative z-10 px-6 sm:px-10 py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/10 bg-[#08080C]/80 backdrop-blur-xl">
          <div className="flex flex-col gap-1 text-left">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] uppercase tracking-widest text-[#E0E0FF] font-mono">Engine Status: Floating</span>
            </div>
            <div className="text-[10px] opacity-40 font-mono text-slate-400">LAT: 34.05 // LONG: -118.24 // AI GRID: READY</div>
          </div>

          {/* User Name Attribution Badge */}
          <div className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-cyan-500/20 px-4 py-2 rounded-full transition-all duration-300 shadow-lg shadow-cyan-950/20 backdrop-blur-md">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Created by:</span>
            {isEditingName ? (
              <input
                type="text"
                autoFocus
                value={authorName}
                onChange={(e) => {
                  setAuthorName(e.target.value);
                  localStorage.setItem('site_author_name', e.target.value);
                }}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingName(false);
                }}
                placeholder="Type your name..."
                className="bg-black/80 border border-cyan-400 text-cyan-200 text-xs px-2.5 py-1 rounded-md outline-none w-36 font-medium shadow-inner"
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                title="Click to customize your name"
                className="group flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="underline decoration-cyan-500/40 decoration-dashed underline-offset-4">{authorName}</span>
                <span className="text-[11px] opacity-50 group-hover:opacity-100 transition-opacity">✎</span>
              </button>
            )}
          </div>

          <div className="flex flex-col items-center sm:items-end gap-3">
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-white/10 rounded-full"></div>
              <div className="w-12 h-1 bg-cyan-400/60 rounded-full"></div>
              <div className="w-12 h-1 bg-white/10 rounded-full"></div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.4em] font-light text-center sm:text-right opacity-60 leading-tight text-[#E0E0FF]">
              GravitySlides AI <br /> Beyond the Slide Deck
            </div>
          </div>
        </footer>

        {/* Antigravity HUD Controls Bar */}
        <AntigravityControls
          mode={antigravityMode}
          onChangeMode={(m) => setAntigravityMode(m)}
          is3DView={is3DView}
          onToggle3DView={() => setIs3DView(!is3DView)}
          theme={currentTheme}
          hasCitations={Boolean(presentation?.sources && presentation.sources.length > 0)}
          citationsCount={presentation?.sources?.length || 0}
          onOpenCitations={() => setShowCitations(true)}
        />
      </div>

      {/* Google Search Citations Modal */}
      {presentation && (
        <CitationsModal
          isOpen={showCitations}
          onClose={() => setShowCitations(false)}
          sources={presentation.sources || []}
          topic={presentation.topic}
          theme={currentTheme}
        />
      )}

      {/* Fullscreen Classroom Presenter Modal */}
      {presentation && presenterSlideIndex !== null && (
        <PresenterModal
          isOpen={presenterSlideIndex !== null}
          onClose={() => setPresenterSlideIndex(null)}
          presentation={presentation}
          theme={currentTheme}
          initialSlideIndex={presenterSlideIndex}
        />
      )}
    </div>
  );
}
