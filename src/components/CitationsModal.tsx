import React from 'react';
import { GroundingSource, TemplateTheme } from '../types';
import { ExternalLink, Globe, X, ShieldCheck, Search } from 'lucide-react';

interface CitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: GroundingSource[];
  topic: string;
  theme: TemplateTheme;
}

export const CitationsModal: React.FC<CitationsModalProps> = ({
  isOpen,
  onClose,
  sources,
  topic,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative w-full max-w-xl rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden bg-[#08080C]/95"
        style={{
          boxShadow: `0 25px 60px -15px #08080C, 0 0 30px -5px ${theme.primaryHex}33`,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/20"
            >
              <Globe className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Google Search Research & Citations</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Live web sources gathered for "{topic}"
              </p>
            </div>
          </div>
          <button
            id="close-citations-modal-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative explanation */}
        <div
          className="p-3.5 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-1 bg-[#101018]"
        >
          <div className="font-mono text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Academic Factual Accuracy & Simplification:</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            These sources were consulted via Google Search grounding to ensure scientific, historical, and factual accuracy. The AI translated technical jargon into accessible, engaging classroom language for your slides.
          </p>
        </div>

        {/* Sources List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {sources.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm font-mono">
              No external links recorded. Topic generated from foundational curriculum principles.
            </div>
          ) : (
            sources.map((src, idx) => (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/40 transition-all group"
              >
                <div className="space-y-0.5 max-w-[85%]">
                  <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {src.title}
                  </div>
                  <div className="text-xs font-mono text-slate-400 truncate">
                    {src.url}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 shrink-0" />
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-mono uppercase tracking-wider font-bold text-black bg-white hover:bg-cyan-400 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
