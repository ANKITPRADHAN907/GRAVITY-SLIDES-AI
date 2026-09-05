import React, { useState } from 'react';
import { PresentationData, Slide, TemplateId, TemplateTheme } from '../types';
import { TEMPLATES } from '../data/templates';
import { SlideCard3D } from './SlideCard3D';
import { exportToPowerPoint } from '../utils/pptxExport';
import confetti from 'canvas-confetti';
import {
  Download,
  Play,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Palette,
  Check,
  FileText,
  RotateCcw,
  Plus,
  BookOpen,
  Loader2,
  Wand2,
  Cpu,
} from 'lucide-react';

interface PresentationViewerProps {
  presentation: PresentationData;
  onUpdatePresentation: (updated: PresentationData) => void;
  onReset: () => void;
  onOpenPresenterMode: (initialIndex: number) => void;
  onOpenCitations: () => void;
  is3DView: boolean;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  presentation,
  onUpdatePresentation,
  onReset,
  onOpenPresenterMode,
  onOpenCitations,
  is3DView,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

  const activeTheme = TEMPLATES[presentation.templateId] || TEMPLATES.space;

  // Generate AI images for all slides in the presentation based on slide data
  const handleGenerateAllAiVisuals = async () => {
    if (isBatchGenerating) return;
    setIsBatchGenerating(true);
    setBatchProgress({ current: 0, total: presentation.slides.length });

    try {
      const currentDeck = [...presentation.slides];
      for (let i = 0; i < currentDeck.length; i++) {
        setBatchProgress({ current: i + 1, total: currentDeck.length });
        const s = currentDeck[i];
        try {
          const res = await fetch('/api/generate-slide-ai-visual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              topic: presentation.topic,
              title: s.title,
              subtitle: s.subtitle,
              bullets: s.bullets,
              prompt: s.imagePrompt || `${s.title} visual schematic`,
              mode: 'diagram',
              templateId: presentation.templateId,
              studentLevel: presentation.studentLevel || 'college',
              slideNumber: i + 1,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.imageUrl) {
              currentDeck[i] = {
                ...s,
                imageUrl: data.imageUrl,
                svgCode: data.svgCode || s.svgCode,
                aiVisualType: 'ai-diagram',
                aiGeneratedImageUrl: data.imageUrl,
                imagePrompt: data.imagePrompt || s.imagePrompt,
              };
              onUpdatePresentation({
                ...presentation,
                slides: [...currentDeck],
              });
            }
          }
        } catch (e) {
          console.log('[Batch AI Visuals] Skip slide error:', e);
        }
      }

      // Celebrate completion
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#00FFFF', '#8A2BE2', '#FFFFFF'],
      });
    } finally {
      setIsBatchGenerating(false);
      setBatchProgress(null);
    }
  };

  // Change presentation theme dynamically
  const handleChangeTheme = (newTemplateId: TemplateId) => {
    onUpdatePresentation({
      ...presentation,
      templateId: newTemplateId,
      theme: TEMPLATES[newTemplateId],
    });
    setShowThemePicker(false);
  };

  // Update a single slide
  const handleUpdateSlide = (updatedSlide: Slide) => {
    const updatedSlides = presentation.slides.map((s) =>
      s.id === updatedSlide.id ? updatedSlide : s
    );
    onUpdatePresentation({
      ...presentation,
      slides: updatedSlides,
    });
  };

  // PowerPoint download handler
  const handleExportPPTX = async () => {
    setIsExporting(true);
    try {
      await exportToPowerPoint(presentation, activeTheme);

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: [activeTheme.primaryHex, activeTheme.accentHex, '#ffffff'],
      });
    } catch (error) {
      console.log('[PowerPoint Export] Notice:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Markdown presentation notes
  const handleCopyMarkdown = () => {
    let md = `# ${presentation.title}\n${presentation.subtitle}\n\n`;
    presentation.slides.forEach((s) => {
      md += `## Slide ${s.slideNumber}: ${s.title}\n`;
      if (s.subtitle) md += `*${s.subtitle}*\n\n`;
      s.bullets.forEach((b) => (md += `- ${b}\n`));
      if (s.callout) md += `\n> **Note**: ${s.callout}\n`;
      if (s.speakerNotes) md += `\n**Speaker Script**: "${s.speakerNotes}"\n`;
      md += `\n---\n\n`;
    });
    navigator.clipboard.writeText(md);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Add a new slide to the deck
  const handleAddSlide = () => {
    const newSlideNum = presentation.slides.length + 1;
    const newSlide: Slide = {
      id: `slide-${newSlideNum}-${Date.now()}`,
      slideNumber: newSlideNum,
      title: `Key Exploration Point #${newSlideNum}`,
      subtitle: 'Additional student concept or investigation',
      bullets: [
        '**New Discovery**: Highlight an exciting classroom discovery.',
        '**Connection**: How this builds upon previous slides.',
        '**Takeaway**: What the student audience should remember.',
      ],
      speakerNotes: 'Here is an additional insight to expand our understanding.',
      imagePrompt: presentation.topic,
      imageUrl: presentation.slides[0]?.imageUrl || '',
      callout: 'Classroom Tip: Connect this to real life examples.',
      layoutType: 'split-right',
    };

    onUpdatePresentation({
      ...presentation,
      slideCount: newSlideNum,
      slides: [...presentation.slides, newSlide],
    });
    setCurrentSlideIndex(presentation.slides.length);
  };

  const currentSlide = presentation.slides[currentSlideIndex] || presentation.slides[0];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 relative z-10 animate-fadeIn">
      {/* Top Deck Banner & Controls Bar */}
      <div
        className="rounded-3xl border border-white/10 shadow-2xl p-5 sm:p-6 backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all bg-[#101018]/90"
        style={{
          boxShadow: `0 20px 50px -15px #08080C, 0 0 30px -10px ${activeTheme.primaryHex}25`,
        }}
      >
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-white/5 border border-white/15 text-cyan-300"
            >
              {presentation.studentLevel.toUpperCase()} LEVEL
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              {presentation.slides.length} Slides
            </span>
            <button
              id="deck-citations-badge"
              type="button"
              onClick={onOpenCitations}
              className="text-[11px] font-mono text-cyan-300 hover:text-cyan-200 underline underline-offset-4 flex items-center gap-1 ml-1"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{presentation.sources.length} Google Sources</span>
            </button>

            <button
              id="generate-all-ai-visuals-btn"
              type="button"
              onClick={handleGenerateAllAiVisuals}
              disabled={isBatchGenerating}
              className="px-3 py-1 rounded-full text-[11px] font-mono border border-cyan-400/40 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
              title="Generate tailored AI diagrams for each slide based on its content"
            >
              {isBatchGenerating ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                  <span>Generating AI Visuals ({batchProgress?.current}/{batchProgress?.total})...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3 h-3 text-cyan-400" />
                  <span>Generate AI Images for All Slides</span>
                </>
              )}
            </button>
          </div>

          <h2
            className="text-xl sm:text-2xl font-bold text-white tracking-tight line-clamp-1"
            style={{ fontFamily: activeTheme.fontHeading }}
          >
            {presentation.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#E0E0FF]/70 line-clamp-1">
            {presentation.audienceTakeaway}
          </p>
        </div>

        {/* Action Buttons: Download PPTX, Present, Theme, Reset */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Theme Switcher Dropdown */}
          <div className="relative">
            <button
              id="theme-picker-btn"
              type="button"
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Theme:</span>
              <span>{activeTheme.name}</span>
            </button>

            {showThemePicker && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl border p-2 shadow-2xl z-50 backdrop-blur-2xl bg-[#08080C]/95 border-white/15 animate-fadeIn"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 text-slate-400">
                  Select Visual Template
                </div>
                {Object.values(TEMPLATES).map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleChangeTheme(tmpl.id)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-left text-xs text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: tmpl.primaryHex }}
                      />
                      <span>{tmpl.name}</span>
                    </div>
                    {activeTheme.id === tmpl.id && (
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Copy Markdown */}
          <button
            id="copy-markdown-btn"
            type="button"
            onClick={handleCopyMarkdown}
            title="Copy presentation text as Markdown"
            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
          >
            {copiedNotification ? (
              <Check className="w-4 h-4 text-cyan-400" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
          </button>

          {/* Fullscreen Presenter Mode */}
          <button
            id="launch-presenter-btn"
            type="button"
            onClick={() => onOpenPresenterMode(currentSlideIndex)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 shadow-md transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current text-cyan-300" />
            <span>Present Mode</span>
          </button>

          {/* Download PowerPoint (.pptx) */}
          <button
            id="export-pptx-download-btn"
            type="button"
            onClick={handleExportPPTX}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-black bg-white hover:bg-cyan-400 hover:text-black shadow-xl transition-all transform active:scale-95 disabled:opacity-50 group"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                <span>BUILDING .PPTX...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>DOWNLOAD .PPTX</span>
              </>
            )}
          </button>

          {/* New Presentation */}
          <button
            id="create-new-pres-btn"
            type="button"
            onClick={onReset}
            title="Create a new presentation"
            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Carousel Stage */}
      <div className="relative">
        {/* Navigation Arrows on sides */}
        <button
          id="prev-slide-arrow"
          type="button"
          onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentSlideIndex === 0}
          className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full border shadow-2xl transition-all disabled:opacity-20 disabled:cursor-not-allowed bg-[#101018]/90 text-white border-white/15 hover:bg-white/10 hover:border-cyan-400/50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          id="next-slide-arrow"
          type="button"
          onClick={() => setCurrentSlideIndex((prev) => Math.min(presentation.slides.length - 1, prev + 1))}
          disabled={currentSlideIndex === presentation.slides.length - 1}
          className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full border shadow-2xl transition-all disabled:opacity-20 disabled:cursor-not-allowed bg-[#101018]/90 text-white border-white/15 hover:bg-white/10 hover:border-cyan-400/50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* 3D Slide Card */}
        <div
          className={`transition-all duration-500 ${
            is3DView
              ? 'perspective-1000 transform hover:rotate-y-3 hover:scale-[1.01]'
              : ''
          }`}
        >
          <SlideCard3D
            slide={currentSlide}
            totalSlides={presentation.slides.length}
            theme={activeTheme}
            isCurrent={true}
            onUpdateSlide={handleUpdateSlide}
          />
        </div>
      </div>

      {/* Slide Thumbnails & Deck Navigator */}
      <div
        className="rounded-2xl border p-3 backdrop-blur-2xl bg-[#101018]/90 border-white/10 flex items-center justify-between gap-3 overflow-x-auto"
      >
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-1">
          {presentation.slides.map((slide, idx) => {
            const isSelected = currentSlideIndex === idx;
            return (
              <button
                key={slide.id}
                id={`thumb-slide-${idx + 1}`}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`relative px-3 py-2 rounded-xl text-left border transition-all shrink-0 min-w-[130px] max-w-[160px] group ${
                  isSelected
                    ? 'border-cyan-400/60 ring-2 ring-cyan-400/30 bg-[#161622]'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>SLIDE {idx + 1}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm" />
                  )}
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  {slide.title}
                </div>
              </button>
            );
          })}

          {/* Add Slide Button */}
          <button
            id="add-slide-btn"
            type="button"
            onClick={handleAddSlide}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-white/20 hover:border-cyan-400/50 text-slate-400 hover:text-white transition-colors shrink-0 text-xs font-mono uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slide</span>
          </button>
        </div>

        <div className="shrink-0 text-xs font-mono text-slate-400 px-2 hidden sm:block">
          {currentSlideIndex + 1} / {presentation.slides.length}
        </div>
      </div>
    </div>
  );
};
