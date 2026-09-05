import React, { useState, useEffect } from 'react';
import { PresentationData, TemplateTheme } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Mic,
  Clock,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

interface PresenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  presentation: PresentationData;
  theme: TemplateTheme;
  initialSlideIndex?: number;
}

export const PresenterModal: React.FC<PresenterModalProps> = ({
  isOpen,
  onClose,
  presentation,
  theme,
  initialSlideIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [showNotes, setShowNotes] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    setCurrentIndex(initialSlideIndex);
  }, [initialSlideIndex]);

  // Presentation Timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(presentation.slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, presentation.slides.length, onClose]);

  if (!isOpen) return null;

  const currentSlide = presentation.slides[currentIndex];
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="presenter-fullscreen-overlay"
      className="fixed inset-0 z-50 flex flex-col bg-[#08080C] text-[#E0E0FF] overflow-hidden select-none animate-fadeIn"
    >
      {/* Top Floating Control Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-[#08080C]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white/5 border border-white/15 text-cyan-300"
          >
            {presentation.topic}
          </span>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
            Slide {currentIndex + 1} / {presentation.slides.length}
          </span>
        </div>

        {/* Timer & Teleprompter Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-colors ${
              showNotes
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Speaker Notes {showNotes ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Presentation Stage */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 sm:p-10 gap-6">
        {/* Active Slide Canvas */}
        <div
          className="flex-1 rounded-3xl border border-white/15 p-8 sm:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden bg-[#101018]/95"
          style={{
            boxShadow: `0 20px 50px -15px #08080C, 0 0 30px -10px ${theme.primaryHex}25`,
          }}
        >
          {/* Subtle branding */}
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono tracking-widest">
            <span>{theme.badge}</span>
            <span>GravitySlides Presentation</span>
          </div>

          {/* Slide Content */}
          <div className="space-y-6 my-auto">
            <div className="space-y-2">
              <h1
                className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight"
                style={{ fontFamily: theme.fontHeading }}
              >
                {currentSlide.title}
              </h1>
              {currentSlide.subtitle && (
                <p
                  className="text-lg sm:text-2xl font-medium text-cyan-300/90 font-mono"
                >
                  {currentSlide.subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
              <div className="md:col-span-7 space-y-4">
                <ul className="space-y-4">
                  {currentSlide.bullets.map((bullet, idx) => {
                    const parts = bullet.split(/(\*\*.*?\*\*)/g);
                    return (
                      <li key={idx} className="flex items-start gap-3">
                        <div
                          className="mt-2 w-2 h-2 rounded-full shrink-0 bg-cyan-400"
                        />
                        <p className="text-base sm:text-xl text-slate-100 leading-relaxed">
                          {parts.map((part, pIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong
                                  key={pIdx}
                                  className="font-bold mr-1 text-cyan-300"
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

                {currentSlide.callout && (
                  <div
                    className="flex items-center gap-2 p-3.5 rounded-2xl border border-white/10 text-sm mt-4 bg-[#08080C]"
                  >
                    <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-slate-200">{currentSlide.callout}</span>
                  </div>
                )}
              </div>

              {currentSlide.imageUrl && (
                <div className="md:col-span-5 rounded-2xl overflow-hidden border border-white/20 shadow-2xl aspect-[16/10] bg-[#08080C]">
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.imagePrompt}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Slide Footer */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10 font-mono">
            <span>Use Left / Right Arrows or Spacebar to navigate</span>
            <span className="text-sm font-bold text-cyan-300">
              {currentIndex + 1} / {presentation.slides.length}
            </span>
          </div>
        </div>

        {/* Teleprompter Speaker Notes Sidebar (if enabled) */}
        {showNotes && (
          <div
            className="w-full lg:w-96 rounded-3xl border border-white/15 p-6 flex flex-col justify-between bg-[#101018]/90 backdrop-blur-xl shadow-xl space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                <Mic className="w-4 h-4" />
                <span>Student Presenter Teleprompter</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-base text-slate-100 leading-relaxed font-sans italic">
                  "{currentSlide.speakerNotes}"
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10 text-xs font-mono text-slate-400">
              <div className="font-semibold text-white uppercase tracking-wider">Next Up:</div>
              <p className="truncate text-slate-300">
                {currentIndex < presentation.slides.length - 1
                  ? `${currentIndex + 2}. ${presentation.slides[currentIndex + 1].title}`
                  : 'End of Presentation'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Navigation Toolbar */}
      <div className="flex items-center justify-center gap-4 py-4 border-t border-white/10 bg-[#08080C]/90 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono uppercase tracking-wider font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1.5 px-3">
          {presentation.slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.min(presentation.slides.length - 1, prev + 1))}
          disabled={currentIndex === presentation.slides.length - 1}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold text-black bg-white hover:bg-cyan-400 shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
