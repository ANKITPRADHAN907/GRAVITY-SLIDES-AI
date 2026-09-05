import React, { useState } from 'react';
import { Slide, TemplateTheme } from '../types';
import {
  Mic,
  Lightbulb,
  Edit3,
  Check,
  Image as ImageIcon,
  Sparkles,
  Volume2,
  Loader2,
  Wand2,
  RefreshCw,
  SlidersHorizontal,
  Compass,
  Cpu,
} from 'lucide-react';

interface SlideCard3DProps {
  slide: Slide;
  totalSlides: number;
  theme: TemplateTheme;
  isCurrent?: boolean;
  onUpdateSlide?: (updatedSlide: Slide) => void;
  spatialIndex?: number;
}

export const SlideCard3D: React.FC<SlideCard3DProps> = ({
  slide,
  totalSlides,
  theme,
  isCurrent = false,
  onUpdateSlide,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [editedTitle, setEditedTitle] = useState(slide.title);
  const [editedSubtitle, setEditedSubtitle] = useState(slide.subtitle || '');
  const [editedBullets, setEditedBullets] = useState(slide.bullets.join('\n'));
  const [editedNotes, setEditedNotes] = useState(slide.speakerNotes);
  const [editedPrompt, setEditedPrompt] = useState(slide.imagePrompt);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(slide.imagePrompt);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleSave = () => {
    if (onUpdateSlide) {
      onUpdateSlide({
        ...slide,
        title: editedTitle,
        subtitle: editedSubtitle,
        bullets: editedBullets.split('\n').filter((b) => b.trim().length > 0),
        speakerNotes: editedNotes,
        imagePrompt: editedPrompt,
      });
    }
    setIsEditing(false);
  };

  // Generate or regenerate AI visual tailored specifically to this slide's data
  const handleGenerateAiVisual = async (mode: 'diagram' | 'sourced' = 'diagram', promptOverride?: string) => {
    if (isGeneratingVisual) return;
    setIsGeneratingVisual(true);
    setGenerationError(null);
    try {
      const activePrompt = promptOverride || customPrompt || slide.imagePrompt;
      const res = await fetch('/api/generate-slide-ai-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: slide.title,
          title: slide.title,
          subtitle: slide.subtitle,
          bullets: slide.bullets,
          prompt: activePrompt,
          mode,
          templateId: theme.id,
          studentLevel: 'college',
          slideNumber: slide.slideNumber,
        }),
      });
      if (!res.ok) throw new Error('Visual generation failed');
      const data = await res.json();
      if (data.imageUrl && onUpdateSlide) {
        const isDiagram = data.aiVisualType === 'ai-diagram' || !!data.svgCode;
        onUpdateSlide({
          ...slide,
          imageUrl: data.imageUrl,
          svgCode: data.svgCode || slide.svgCode,
          imagePrompt: data.imagePrompt || activePrompt,
          aiVisualType: isDiagram ? 'ai-diagram' : 'sourced',
          aiGeneratedImageUrl: isDiagram ? data.imageUrl : slide.aiGeneratedImageUrl,
          sourcedImageUrl: !isDiagram ? data.imageUrl : slide.sourcedImageUrl,
        });
      }
    } catch (e: any) {
      setGenerationError('Visual generation timed out. Please retry.');
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  // Switch between AI Vector Diagram and Sourced Educational Visual
  const handleSwitchVisualType = (targetType: 'ai-diagram' | 'sourced') => {
    if (targetType === slide.aiVisualType) return;
    if (targetType === 'ai-diagram') {
      if (slide.aiGeneratedImageUrl) {
        onUpdateSlide?.({
          ...slide,
          imageUrl: slide.aiGeneratedImageUrl,
          aiVisualType: 'ai-diagram',
        });
      } else {
        handleGenerateAiVisual('diagram');
      }
    } else {
      if (slide.sourcedImageUrl) {
        onUpdateSlide?.({
          ...slide,
          imageUrl: slide.sourcedImageUrl,
          aiVisualType: 'sourced',
        });
      } else {
        handleGenerateAiVisual('sourced');
      }
    }
  };

  // Text to speech for student rehearsal
  const handleSpeakNotes = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(slide.speakerNotes);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      id={`slide-card-${slide.slideNumber}`}
      className={`relative w-full rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-2xl transition-all duration-300 bg-[#101018]/95 ${
        isCurrent ? 'ring-2 ring-cyan-400/50' : 'opacity-95'
      }`}
      style={{
        borderColor: isCurrent ? `${theme.primaryHex}88` : 'rgba(255, 255, 255, 0.1)',
        boxShadow: `0 20px 50px -15px #08080C, 0 0 30px -10px ${theme.primaryHex}25`,
      }}
    >
      {/* Decorative colored top strip */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${theme.primaryHex}, ${theme.accentHex})`,
        }}
      />

      {/* Card Header & Controls */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white/5 border border-white/15 text-cyan-300"
          >
            SLIDE {slide.slideNumber} / {totalSlides}
          </span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block uppercase tracking-wider">
            // {theme.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Practice speech toggle */}
          {slide.speakerNotes && (
            <button
              id={`slide-speak-btn-${slide.slideNumber}`}
              type="button"
              onClick={handleSpeakNotes}
              title="Listen to student speech rehearsal"
              className={`px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                isSpeaking
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Rehearse'}</span>
            </button>
          )}

          {/* Notes toggle */}
          <button
            id={`slide-notes-btn-${slide.slideNumber}`}
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              showNotes
                ? 'bg-purple-500/20 text-purple-300 border-purple-400/50'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Speaker Script</span>
          </button>

          {/* In-place edit toggle */}
          <button
            id={`slide-edit-btn-${slide.slideNumber}`}
            type="button"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              isEditing
                ? 'bg-white text-black border-white font-bold'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 text-black" />
                <span className="hidden sm:inline">Save</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Slide Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Title & Subtitle */}
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-lg font-bold text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
            <input
              type="text"
              value={editedSubtitle}
              onChange={(e) => setEditedSubtitle(e.target.value)}
              placeholder="Subtitle"
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <h3
              className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white"
              style={{ fontFamily: theme.fontHeading }}
            >
              {slide.title}
            </h3>
            {slide.subtitle && (
              <p
                className="text-sm sm:text-base font-medium"
                style={{ color: theme.subtextHex }}
              >
                {slide.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content Layout: Responsive Split with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Bullets List (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            {isEditing ? (
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono">
                  Bullet Points (1 per line, use **keyword** for bold)
                </label>
                <textarea
                  rows={4}
                  value={editedBullets}
                  onChange={(e) => setEditedBullets(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-400"
                />

                <div className="space-y-1 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Visual Prompt (What AI visual depicts)</span>
                    <button
                      type="button"
                      onClick={() => handleGenerateAiVisual('diagram', editedPrompt)}
                      disabled={isGeneratingVisual}
                      className="text-cyan-400 hover:text-cyan-300 text-[10px] uppercase font-bold tracking-wider hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Generate Visual</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editedPrompt}
                    onChange={(e) => setEditedPrompt(e.target.value)}
                    placeholder="AI visual prompt representing this slide's data"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>
            ) : (
              <ul className="space-y-3.5">
                {slide.bullets.map((bullet, bIdx) => {
                  // Parse **bold** parts
                  const parts = bullet.split(/(\*\*.*?\*\*)/g);
                  return (
                    <li key={bIdx} className="flex items-start gap-3 group">
                      <div
                        className="mt-1.5 w-2 h-2 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                        style={{ backgroundColor: theme.primaryHex }}
                      />
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                        {parts.map((part, pIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong
                                key={pIdx}
                                className="font-bold mr-1"
                                style={{ color: theme.primaryHex }}
                              >
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return <span key={pIdx}>{part}</span>;
                        })}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Fun Fact / Key Takeaway Callout Pill */}
            {slide.callout && (
              <div
                className="flex items-start gap-2.5 p-3.5 rounded-2xl border text-xs sm:text-sm mt-4 backdrop-blur-sm"
                style={{
                  backgroundColor: `${theme.bgHex}bb`,
                  borderColor: `${theme.accentHex}44`,
                }}
              >
                <Lightbulb
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: theme.accentHex }}
                />
                <div>
                  <span className="font-bold text-white mr-1.5">Classroom Insight:</span>
                  <span className="text-slate-300">{slide.callout}</span>
                </div>
              </div>
            )}
          </div>

          {/* Topic Visual & AI Diagram Engine (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-900/60 aspect-[16/10] group shadow-lg">
              {/* Visual Loading Overlay */}
              {isGeneratingVisual && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center z-20 animate-fadeIn">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-2" />
                  <span className="text-xs font-bold text-white tracking-wide">Generating AI Visual...</span>
                  <span className="text-[11px] text-slate-400 mt-1">Synthesizing diagram from slide data</span>
                </div>
              )}

              {slide.imageUrl ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.imagePrompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs">Visual Illustration</span>
                </div>
              )}

              {/* Verified Topic & Mode Tag */}
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-[11px] z-10">
                <div className="flex items-center gap-1.5 text-slate-300 truncate max-w-[70%]">
                  <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate font-mono text-[10px]" title={slide.imagePrompt}>
                    {slide.imagePrompt}
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 shrink-0">
                  {slide.aiVisualType === 'ai-diagram' ? 'AI Diagram' : 'HD Research'}
                </span>
              </div>
            </div>

            {/* AI Visual Controls: Switcher & Generator */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs font-mono">
              <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-0.5">
                <button
                  type="button"
                  onClick={() => handleSwitchVisualType('ai-diagram')}
                  title="AI-generated vector scientific diagram illustrating this slide's data"
                  className={`px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-all ${
                    slide.aiVisualType === 'ai-diagram'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3 h-3" />
                  <span>AI Diagram</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchVisualType('sourced')}
                  title="Authentic educational photographic / research visual"
                  className={`px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-all ${
                    slide.aiVisualType === 'sourced' || !slide.aiVisualType
                      ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  <span>Sourced</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleGenerateAiVisual('diagram')}
                  disabled={isGeneratingVisual}
                  title="Regenerate custom AI diagram from slide concepts"
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isGeneratingVisual ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Regenerate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPromptEditor(!showPromptEditor)}
                  title="Customize prompt for AI visual generation"
                  className={`px-2.5 py-1 rounded-xl border text-[11px] flex items-center gap-1 transition-colors ${
                    showPromptEditor
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span className="hidden sm:inline">Prompt</span>
                </button>
              </div>
            </div>

            {/* Expandable Custom AI Visual Prompt Editor */}
            {showPromptEditor && (
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/15 space-y-2 animate-fadeIn text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                  <span className="flex items-center gap-1">
                    <Wand2 className="w-3 h-3 text-cyan-400" />
                    <span>Custom AI Visual Prompt</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Illustrates slide data</span>
                </div>
                <textarea
                  rows={2}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Detailed vector schematic of the event horizon with gravitational light bending..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 font-sans"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleGenerateAiVisual('sourced', customPrompt)}
                    disabled={isGeneratingVisual}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] transition-colors"
                  >
                    Search Sourced Visual
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenerateAiVisual('diagram', customPrompt)}
                    disabled={isGeneratingVisual}
                    className="px-3 py-1 rounded-lg bg-cyan-500 text-black font-bold text-[11px] hover:bg-cyan-400 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-black" />
                    <span>Generate AI Visual</span>
                  </button>
                </div>
              </div>
            )}

            {generationError && (
              <p className="text-[11px] text-rose-400 font-mono">{generationError}</p>
            )}
          </div>
        </div>

        {/* Student Speaker Notes Drawer */}
        {showNotes && (
          <div
            id={`speaker-notes-drawer-${slide.slideNumber}`}
            className="p-4 rounded-2xl border space-y-2 animate-fadeIn"
            style={{
              backgroundColor: `${theme.bgHex}e6`,
              borderColor: `${theme.primaryHex}44`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                <Mic className="w-4 h-4 text-sky-400" />
                <span>STUDENT SPEAKER SCRIPT (Read aloud during this slide)</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Tip: Speak naturally, keep eye contact with class
              </span>
            </div>

            {isEditing ? (
              <textarea
                rows={3}
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            ) : (
              <p className="text-sm text-slate-200 leading-relaxed italic border-l-2 pl-3 py-1" style={{ borderColor: theme.primaryHex }}>
                "{slide.speakerNotes}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
